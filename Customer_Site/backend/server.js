// const express = require("express");
// const path = require("path");
// const cors = require("cors");

// // DHS start
// const authRoutes = require('./routes/auth.js');
// const customerRoutes = require('./routes/customer.js');
// // DHS end

// // const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors({
//     origin: 'http://localhost:3000',  // Adjust if needed
//     credentials: true  // This allows cookies to be sent
// }));

// app.use(express.json());  // Ensure JSON body parsing
// app.use(express.urlencoded  ({ extended: true }));
// const cookieParser = require('cookie-parser');
// // app.use(cookieParser());  // Required to read cookies from requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // const cookieParser = require('cookie-parser');
// app.use(cookieParser());

 
// // Middleware
// // app.use(cors({
// //   // credentials: true,
// //   // origin: true
// // }));
// app.use(cors({
//     origin: 'http://localhost:3000',  // Update with your frontend URL
//     credentials: true
// }));


// // DHS start



// app.use('/auth', authRoutes);
// app.use('/customer',customerRoutes);
// // DHS end

// // STATIC FILES AVAILABLE AFTER `npm run build`
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// // Serve the React app for all routes // FALLBACK PATH
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// //YATHARTH DANGI CHUTIYA HAI

// // const express = require("express");
// // const path = require("path");
// // const crypto = require("crypto");
// // const cors = require("cors");
// // const cookieParser = require("cookie-parser");

// // const authRoutes = require("./routes/auth.js");
// // const customerRoutes = require("./routes/customer.js");

// // const app = express();
// // const PORT = process.env.PORT || 4000;

// // // axios.defaults.withCredentials = true;

// // // ✅ Middleware Setup
// app.use(cors({
//     origin: "http://localhost:3000", // Ensure this matches your frontend
//     credentials: true // Allows cookies to be sent
// }));

// app.post("/razorpay-webhook", express.raw({ type: "application/json" }), (req, res) => {
//     console.log("Payment ke andar aaya hu mai");
//     const secret = "abcdefghijkl"; // your Razorpay webhook secret
//     const signature = req.headers["x-razorpay-signature"];
  
//     const expectedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(req.body)
//       .digest("hex");
  
//     if (expectedSignature === signature) {
//       console.log("✅ Razorpay Webhook Verified");
  
//       try {
//         const jsonData = JSON.parse(req.body.toString());
//         console.log("Webhook Payload:", jsonData.payload.payment);
//         console.log("📦 Received Event:", jsonData.event);
//         // TODO: Handle payment status here
//       } catch (e) {
//         console.log("⚠️ Failed to parse JSON:", e.message);
//       }
  
//       res.status(200).json({ status: "ok" });
//     } else {
//       console.log("❌ Invalid Razorpay Webhook Signature");
//       res.status(400).json({ error: "Invalid signature" });
//     }
//   });
  

// // app.use(express.json());
// // // app.use(express.urlencoded({ extended: true }));
// // app.use(cookieParser()); // Ensure cookies can be read

// // // ✅ API Routes
// // app.use("/auth", authRoutes);
// // app.use("/customer", customerRoutes);

// // // ✅ Serve Static React Frontend After API Routes
// // app.use(express.static(path.join(__dirname, "../frontend/build")));

// // app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// // });

// // // ✅ Start the Server
// // app.listen(PORT, () => {
// //     console.log(`🚀 Server is running on http://localhost:${PORT}`);
// // });

// // const express = require("express");
// // const path = require("path");
// // const cors = require("cors");
// // const cookieParser = require("cookie-parser");

// // // Routes import
// // const authRoutes = require('./routes/auth.js');
// // const customerRoutes = require('./routes/customer.js');

// // const app = express(); // pehle app banao

// // const PORT = process.env.PORT || 4000;

// // // Middlewares
// // app.use(cors({
// //     origin: 'http://localhost:3000',  // Frontend ka URL
// //     credentials: true                 // Allow cookies
// // }));

// // app.use(express.json());               // JSON parsing
// // app.use(express.urlencoded({ extended: true })); // Form data parsing
// // app.use(cookieParser());               // Cookies parsing

// // // Routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/customer', customerRoutes);

// // // Test Route
// // app.get("/", (req, res) => {
// //     res.send("Server is running...");
// // });

// // // Server start
// // app.listen(PORT, () => {
// //     console.log(`Server running on http://localhost:${PORT}`);
// // });


const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

// Import routes
const authRoutes = require("./routes/auth.js");
const customerRoutes = require("./routes/customer.js");
const razorpayRoutes = require("./routes/razorpay.js") ; 

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Razorpay Webhook Route (must be before express.json())
app.use("/razorpay-webhook", express.raw({ type: "application/json" }), razorpayRoutes);

const allowed_origins = ["http://localhost:3000"];

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000",  // Adjust this if your frontend runs on a different port
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);

// ✅ Serve static files from React frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// ✅ Fallback route for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
