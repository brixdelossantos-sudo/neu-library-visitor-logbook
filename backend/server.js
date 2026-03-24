const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(require("express-session")({
  secret: process.env.JWT_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const User = require("./models/User");
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          // Create user for Google OAuth (no password required)
          user = await User.create({
            name: profile.displayName,
            email,
            password: "google-oauth", // Placeholder password for Google users
            username: profile.displayName,
            roles: email === "jcesperanza@neu.edu.ph"
              ? ["user", "admin"]
              : ["user"]
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const User = require("./models/User");
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/logs", require("./routes/logs"));
app.use("/admin", require("./routes/admin"));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "NEU Library Visitor Log System API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
