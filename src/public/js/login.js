$(document).ready(function () {
    $('.login').on('submit', function (e) {
      e.preventDefault();
      $.ajax({
        url: '/chklogin',
        type: 'post',
        data: $(this).serialize(),
        success: function (data) {
          // console.log(data);
          if (data.message === "User login successfully") {
            // Chuyển hướng theo vai trò người dùng
            switch (data.role) {
              case 'student':
                window.location.href = '/student/dashboard'; // Đường dẫn đến trang dashboard sinh viên
                break;
              case 'advisor':
                window.location.href = '/advisor/approve-topic-list'; // Đường dẫn cho advisor
                break;
              case 'admin':
                window.location.href = '/project/project-list'; // Đường dẫn cho admin
                break;
              default:
                $('#error-message').text('Vai trò người dùng không hợp lệ.'); // Thông báo lỗi vai trò không hợp lệ
                break;
            }
          } else {
            $('#error-message').text(data.message); // Hiển thị thông báo lỗi
          }
        },
        error: function (xhr) {
          const errorMessage = xhr.responseJSON?.message || "Kết nối thất bại"; // Lấy thông báo từ server nếu có
          $('#error-message').text(errorMessage); // Hiển thị thông báo lỗi
        }
      });
    });
  });