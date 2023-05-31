const mongoose = require("mongoose");

const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./Routes/UserRoute");
const bodyParser = require("body-parser");
const globalErrorHandler = require("./Controllers/globalErrorHandler");
const gymCourseRouter = require("./Routes/gymCourseRouter");
const cartRouter = require("./Routes/cartRouter");
const cors = require("cors");
dotenv.config();
// Kết nối tới cơ sở dữ liệu MongoDB
const mongooseServer = process.env.DATABASE_SERVER.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(mongooseServer, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Kết nối MongoDB thành công");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

// Tạo ứng dụng Express
const app = express();

// Middleware để xử lý JSON
app.use(express.json());
app.use(bodyParser.json());
app.use("/public", express.static("public"));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
//   res.setHeader("HTTP/1.1 200 OK");
//   next();
// });
app.use(
  cors({
    origin: "*",
    methods: ["POST", "PATCH", "DELETE", "GET"],
  })
);
// Định nghĩa các route và xử lý yêu cầu
app.use("/users", userRouter);
app.use("/courses", gymCourseRouter);
app.use("/cart", cartRouter);
// Khởi chạy server
app.use(globalErrorHandler);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server đang lắng nghe trên cổng ${port}`);
});
