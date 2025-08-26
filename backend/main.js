import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import "./config/db.js";
import { updateExpiredSubscriptions } from "./middlewares/subscriptionUpdater.js";

import testRoutes from "./routes/test.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import tableRoutes from "./routes/table.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import searchRoutes from "./routes/search.routes.js";
import docsRoutes from "./routes/docs.routes.js";
import healthRoutes from "./routes/health.routes.js";
import preferencesRoutes from "./routes/preferences.routes.js";

const app = express();
const port = process.env.PORT || 7267;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(updateExpiredSubscriptions);

app.use("/uploads", express.static("uploads"));

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/recommendations", recommendationRoutes);
app.use("/api/v1/tables", tableRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/docs", docsRoutes);
app.use("/api/v1/preferences", preferencesRoutes);
app.use("/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
