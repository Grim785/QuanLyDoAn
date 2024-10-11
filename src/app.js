const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const mysql = require("mysql2"); //Khởi tạo thư viện mysql2
require("dotenv").config();
const app = express();
const port = 3000;

const route = require("./routes"); //khởi tạo đến /route

const db = require("./config/db/db");

// Middleware để phân tích dữ liệu POST từ form
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Xử lý dữ liệu JSON

// Cấu hình Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,  // Cho phép truy cập vào các thuộc tính prototype
      allowProtoMethodsByDefault: true,     // Cho phép truy cập vào các phương thức prototype
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Cấu hình phục vụ file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng các route
route(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
