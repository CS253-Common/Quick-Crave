const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// DHS start
const authRoutes = require('./routes/auth.js');
const canteenRoutes = require('./routes/canteen.js');
const customerRoutes = require('./routes/customer.js');
// DHS end

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // ✅ Your frontend origin
  credentials: true                // ✅ Required for cookies
}));
// DHS start
app.use(express.json());
app.use(cookieParser());

app.use('/canteen', canteenRoutes);
app.use('/customer', customerRoutes);
app.use('/auth', authRoutes);
// DHS end

// STATIC FILES AVAILABLE AFTER `npm run build`
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Serve the React app for all routes // FALLBACK PATH
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
