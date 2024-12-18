const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
require("dotenv").config();
const app = express();
const port = 3000;

// Import và sử dụng middleware từ file riêng
require("./config/middleware")(app);

// Cấu hình Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Cho phép truy cập vào các thuộc tính prototype
      allowProtoMethodsByDefault: true, // Cho phép truy cập vào các phương thức prototype
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources", "views"));

// Cấu hình phục vụ file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Sử dụng các route
const route = require("./app/routes"); //khởi tạo route
route(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
