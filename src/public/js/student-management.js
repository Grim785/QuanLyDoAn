// Hàm xử lý "select all" và chọn từng dòng
function initializeCheckboxHandlers() {
    const selectAllCheckbox = document.getElementById('select-all');
    const rowCheckboxes = document.querySelectorAll('.row-select');

    // Xử lý khi nhấn "select all"
    selectAllCheckbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;

        // Đặt trạng thái cho tất cả checkbox dòng
        rowCheckboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
        });
    });

    // Xử lý khi nhấn vào từng checkbox dòng
    rowCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            // Nếu có checkbox chưa được chọn, bỏ chọn "select all"
            if (![...rowCheckboxes].every((checkbox) => checkbox.checked)) {
                selectAllCheckbox.checked = false;
            }
            // Nếu tất cả checkbox dòng được chọn, chọn "select all"
            else if ([...rowCheckboxes].every((checkbox) => checkbox.checked)) {
                selectAllCheckbox.checked = true;
            }
        });

        // Cho phép nhấn vào ô chứa checkbox để chọn/deselect
        checkbox.closest('tr').addEventListener('click', (event) => {
            if (event.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });
}
function initializeStudentIDToUsernameLink() {
    // Lấy các ô input liên quan
    const studentIDInput = document.getElementById('new-studentID');
    const usernameInput = document.getElementById('new-username');

    // Khi người dùng nhập mã sinh viên, tự động cập nhật username
    studentIDInput.addEventListener('input', () => {
        const studentID = studentIDInput.value.trim();
        if (studentID) {
            // Giả định tài khoản liên kết được tạo bằng cách thêm tiền tố hoặc giữ nguyên mã sinh viên
            usernameInput.value = `${studentID}`; // Ví dụ: user_22001976
        } else {
            usernameInput.value = ''; // Xóa tài khoản nếu mã sinh viên trống
        }
    });
}

// Hàm xử lý tìm kiếm
function initializeSearchHandler() {
    document.getElementById('search-bar').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();

        fetch(`/admin/students/search?query=${query}`)
            .then((response) => response.json())
            .then((data) => {
                const tableBody = document.getElementById('student-tbody');
                tableBody.innerHTML = '';
                data.forEach((student) => {
                    const row = `
                    <tr>
                      <td><input type="checkbox" class="row-select" data-id="${student.id}" /></td>
                      <td>${student.id}</td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.studentID}" /></td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.lastname}" /></td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.firstname}" /></td>
                      <td><input type="date" class="form-control form-control-xs cell-input" value="${student.date_of_birth}" /></td>
                      <td>
                        <select class="form-select form-select-xs cell-input">
                          <option value="Nam" ${student.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                          <option value="Nữ" ${student.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                        </select>
                      </td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.address}" /></td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.class.classID}" /></td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.user.username}" readonly/></td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });
                initializeCheckboxHandlers();
            })
            .catch((err) => console.error('Error during search:', err));
    });
}

function initializeAddStudentHandler() {
    // Mở modal khi nhấn nút "Thêm mới"
    document.getElementById('add-button').addEventListener('click', () => {
        document.getElementById('add-modal').style.display = 'block';
        document.getElementById('modal-overlay').style.display = 'block';
    });

    // Đóng modal khi nhấn nút "Đóng" hoặc "Hủy"
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-button').addEventListener('click', closeModal);

    function closeModal() {
        document.getElementById('add-modal').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';
        document.getElementById('add-form').reset(); // Xóa dữ liệu trong form
    }

    // Lưu dữ liệu khi nhấn nút "Lưu"
    document.getElementById('save-button').addEventListener('click', () => {
        // Lấy dữ liệu từ modal
        const studentID = document.getElementById('new-studentID').value.trim();
        const lastname = document.getElementById('new-lastname').value.trim();
        const firstname = document.getElementById('new-firstname').value.trim();
        const date_of_birth = document.getElementById('new-date-of-birth').value;
        const gender = document.getElementById('new-gender').value;
        const address = document.getElementById('new-address').value.trim();
        const classID = document.getElementById('new-classID').value.trim();
        const username = document.getElementById('new-username').value.trim();

        // Kiểm tra dữ liệu
        if (!studentID || !lastname || !firstname || !date_of_birth || !gender || !address || !classID || !username) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Gửi dữ liệu tới backend
        fetch('/admin/students/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentID,
                lastname,
                firstname,
                date_of_birth,
                gender,
                address,
                classID,
                username
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(`Lỗi: ${data.error}`);
                } else {
                    alert(data.message || 'Thêm sinh viên thành công!');
                    // Reload lại trang
                    location.reload();
                }
            })
            .catch((err) => {
                console.error('Lỗi khi thêm mới sinh viên:', err);
                alert('Đã xảy ra lỗi khi thêm mới sinh viên.');
            });
    });
}
// Xử lý xóa sinh viên
function initializeDeleteSelectedHandler() {
    document.getElementById('delete-button').addEventListener('click', () => {
        // Lấy danh sách các checkbox được chọn
        const selectedCheckboxes = Array.from(document.querySelectorAll('.row-select:checked'));

        if (selectedCheckboxes.length === 0) {
            alert('Vui lòng chọn ít nhất một sinh viên để xóa!');
            return;
        }

        // Lấy danh sách ID từ các checkbox được chọn
        const selectedIds = selectedCheckboxes.map((checkbox) => checkbox.dataset.id);

        // Hiển thị xác nhận xóa
        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} sinh viên này không?`)) {
            // Gửi yêu cầu xóa đến backend
            fetch('/admin/students/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedIds }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        alert(`Lỗi: ${data.error}`);
                    } else {
                        alert(data.message || 'Xóa sinh viên thành công!');
                        // Xóa các hàng tương ứng khỏi bảng sau khi xóa
                        selectedIds.forEach((id) => {
                            const row = document.querySelector(`.row-select[data-id="${id}"]`).closest('tr');
                            if (row) row.remove();
                        });
                    }
                })
                .catch((err) => {
                    console.error('Lỗi khi xóa sinh viên:', err);
                    alert('Đã xảy ra lỗi khi xóa sinh viên.');
                });
        }
    });
}
// Xử lý nút lưu toàn bộ các dòng được chọn
document.getElementById('edit-button').addEventListener('click', async () => {
    // Lấy danh sách các checkbox được chọn
    const selectedCheckboxes = Array.from(document.querySelectorAll('.row-select:checked'));

    if (selectedCheckboxes.length === 0) {
        alert('Vui lòng chọn ít nhất một sinh viên để cập nhật!');
        return;
    }

    // Thu thập dữ liệu từ các dòng được chọn
    const updatedStudents = selectedCheckboxes.map((checkbox) => {
        const row = checkbox.closest('tr');
        const id = checkbox.dataset.id; // ID sinh viên
        const studentID = row.querySelector('[name="studentID"]').value.trim();
        const lastname = row.querySelector('[name="lastname"]').value.trim();
        const firstname = row.querySelector('[name="firstname"]').value.trim();
        const date_of_birth = row.querySelector('[name="date_of_birth"]').value || null;
        const gender = row.querySelector('[name="gender"]').value;
        const address = row.querySelector('[name="address"]').value.trim();
        const classID = row.querySelector('[name="classID"]').value.trim();
        const username = row.querySelector('[name="username"]').value.trim();

        return { id, studentID, lastname, firstname, date_of_birth, gender, address, classID, username };
    });

    console.log('Dữ liệu cập nhật:', updatedStudents);

    // Gửi yêu cầu AJAX
    try {
        const response = await fetch('/admin/students/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ students: updatedStudents }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Cập nhật sinh viên thành công!');
            // Làm mới trang sau khi cập nhật
            location.reload();
        } else {
            alert('Lỗi: ' + result.error);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật sinh viên:', error);
        alert('Đã xảy ra lỗi khi cập nhật!');
    }
});

// Gọi các hàm khởi tạo
initializeCheckboxHandlers();
initializeStudentIDToUsernameLink();
initializeSearchHandler();
initializeAddStudentHandler();
initializeDeleteSelectedHandler();