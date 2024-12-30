
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

// Hàm xử lý tìm kiếm
function initializeSearchHandler() {
    document.getElementById('search-bar').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();

        // Gửi yêu cầu tới backend
        fetch(`/project/search?query=${query}`)
            .then((response) => response.json())
            .then((data) => {
                const tableBody = document.getElementById('project-tbody');
                tableBody.innerHTML = ''; // Xóa nội dung cũ

                // Render dữ liệu mới dựa trên kết quả tìm kiếm
                data.forEach((project) => {
                    const advisors = project.projectadvisors || [];
                    const students = project.projectstudents || [];
                    const emptyStudentCells = Array(4 - students.length)
                        .fill('<td><input type="text" class="form-control form-control-xs cell-input" value="" /></td>')
                        .join('');

                    const row = `
            <tr>
              <td><input type="checkbox" class="row-select" data-id="${project.id}" /></td>
              <td>${project.id || ''}</td>
              <td>
                <input type="text" class="form-control form-control-xs cell-input" value="${project.title || ''}" />
              </td>
              <td>
                <input type="text" class="form-control form-control-xs cell-input" value="${project.description || ''}" />
              </td>
              <td>
                <input type="date" class="form-control form-control-xs cell-input" value="${project.start_date || ''}" />
              </td>
              <td>
                <input type="date" class="form-control form-control-xs cell-input" value="${project.end_date || ''}" />
              </td>
              <td>
                <select class="form-select form-select-xs cell-input">
                  <option value="not_started" ${project.status === 'not_started' ? 'selected' : ''
                        }>Chưa bắt đầu</option>
                  <option value="in_progress" ${project.status === 'in_progress' ? 'selected' : ''
                        }>Đang thực hiện</option>
                  <option value="completed" ${project.status === 'completed' ? 'selected' : ''
                        }>Hoàn thành</option>
                </select>
              </td>
              <td>
                <input type="text" class="form-control form-control-xs cell-input" 
                  value="${advisors.length > 0 && advisors[0].advisor
                            ? `${advisors[0].advisor.advisorID || ''} - ${advisors[0].advisor.lastname || ''} ${advisors[0].advisor.firstname || ''}`
                            : ''
                        }" />
              </td>
              ${students
                            .map(
                                (student) =>
                                    `<td>
                      <input type="text" class="form-control form-control-xs cell-input" 
                        value="${student.student
                                        ? `${student.student.studentID || ''} - ${student.student.lastname || ''} ${student.student.firstname || ''}`
                                        : ''
                                    }" />
                    </td>`
                            )
                            .join('')}
              ${emptyStudentCells}
            </tr>
          `;

                    tableBody.innerHTML += row;
                });

                // Gọi lại hàm gắn sự kiện checkbox sau khi render mới
                initializeCheckboxHandlers();
                // Gọi lại hàm checkRole
                checkRole();
            })
            .catch((err) => console.error('Lỗi khi tìm kiếm:', err));
    });
}

// Hàm xử lý các nút liên quan đến modal
function initializeModalHandlers() {
    document.getElementById('add-button').addEventListener('click', () => {
        document.getElementById('add-modal').style.display = 'block';
        document.getElementById('modal-overlay').style.display = 'block';
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('add-modal').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';
    });

    document.getElementById('cancel-button').addEventListener('click', () => {
        document.getElementById('add-modal').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';
    });

    // Save button logic (placeholder)
    document.getElementById('save-button').addEventListener('click', () => {
        alert('Đã lưu dữ liệu mới!');
        document.getElementById('add-modal').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';
    });
}
// Xử lý thêm mới đề tài
document.getElementById('save-button').addEventListener('click', () => {
    // Lấy dữ liệu từ modal
    const title = document.getElementById('new-title').value.trim();
    const description = document.getElementById('new-description').value.trim();
    const majorID = document.getElementById('new-majorID').value;

    // Kiểm tra dữ liệu
    if (!title) {
        alert('Tên đề tài không được để trống!');
        return;
    }

    // Gửi dữ liệu tới backend
    fetch('/project/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, majorID }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(`Lỗi: ${data.error}`);
            } else {
                alert(data.message || 'Thêm đề tài thành công!');
                // Đóng modal
                document.getElementById('add-modal').style.display = 'none';
                document.getElementById('modal-overlay').style.display = 'none';
                // Reload danh sách dự án
                location.reload();
            }
        })
        .catch((err) => {
            console.error('Lỗi khi thêm mới đề tài:', err);
            alert('Đã xảy ra lỗi khi thêm mới đề tài.');
        });
});
// Xử lý xóa đề tài
function initializeDeleteSelectedHandler() {
    document.getElementById('delete-button').addEventListener('click', () => {
        // Lấy danh sách các checkbox được chọn
        const selectedCheckboxes = Array.from(document.querySelectorAll('.row-select:checked'));

        if (selectedCheckboxes.length === 0) {
            alert('Vui lòng chọn ít nhất một đề tài để xóa!');
            return;
        }

        // Lấy danh sách ID từ các checkbox được chọn
        const selectedIds = selectedCheckboxes.map((checkbox) => checkbox.dataset.id);

        // Hiển thị xác nhận xóa
        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} đề tài này không?`)) {
            // Gửi yêu cầu xóa đến backend
            fetch('/project/delete', {
                method: 'POST', // Hoặc DELETE nếu backend hỗ trợ
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
                        alert(data.message || 'Xóa thành công!');
                        // Cập nhật lại bảng sau khi xóa
                        selectedIds.forEach((id) => {
                            const row = document.querySelector(`.row-select[data-id="${id}"]`).closest('tr');
                            if (row) row.remove();
                        });
                    }
                })
                .catch((err) => console.error('Lỗi khi xóa đề tài:', err));
        }
    });
}
// Xử lý nút lưu toàn bộ các dòng được chọn
document.getElementById('edit-button').addEventListener('click', async () => {
    // Lấy danh sách các checkbox được chọn
    const selectedCheckboxes = Array.from(document.querySelectorAll('.row-select:checked'));

    if (selectedCheckboxes.length === 0) {
        alert('Vui lòng chọn ít nhất một đề tài để cập nhật!');
        return;
    }

    // Thu thập dữ liệu từ các dòng được chọn
    const updatedProjects = selectedCheckboxes.map((checkbox) => {
        const row = checkbox.closest('tr');
        const id = checkbox.dataset.id;
        const title = row.querySelector('[name="title"]').value;
        const description = row.querySelector('[name="description"]').value;
        let start_date = row.querySelector('[name="start_date"]').value || null;
        let end_date = row.querySelector('[name="end_date"]').value || null;
        const status = row.querySelector('[name="status"]').value;
        const advisor = row.querySelector('[name="advisor"]').value;

        // Lấy danh sách sinh viên
        const students = Array.from(row.querySelectorAll('[name^="student_"]')).map(
            (input) => input.value
        );

        return { id, title, description, start_date, end_date, status, advisor, students };
    });

    console.log('Dữ liệu cập nhật:', updatedProjects);

    // Gửi yêu cầu AJAX
    try {
        const response = await fetch('/project/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projects: updatedProjects }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Cập nhật thành công!');
            // Làm mới trang hoặc cập nhật giao diện nếu cần
            location.reload();
        } else {
            alert('Lỗi: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating projects:', error);
        alert('Đã xảy ra lỗi khi cập nhật!');
    }
});

function checkRole() {
    // Lấy role từ thẻ ẩn
    const role = document.getElementById('user-role').dataset.role;
    if (role === "student" || role === "advisor") {
        // Ẩn tất cả checkbox
        document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.style.display = "none";
        });

        // Ẩn các nút Thêm, Xóa, Sửa
        document.getElementById("add-button").style.display = "none";
        document.getElementById("delete-button").style.display = "none";
        document.getElementById("edit-button").style.display = "none";

        // Thêm thuộc tính readonly vào tất cả các ô input và select
        document.querySelectorAll(".cell-input").forEach((input) => {
            input.setAttribute("readonly", true);
            input.setAttribute("disabled", true);
        });

        // Vẫn cho phép tương tác với thanh tìm kiếm
        const searchBar = document.getElementById("search-bar");
        if (searchBar) {
            searchBar.removeAttribute("readonly");
            searchBar.removeAttribute("disabled");
        }
    }
}

// Gọi các hàm khởi tạo

initializeCheckboxHandlers();
initializeSearchHandler();
initializeModalHandlers();
initializeDeleteSelectedHandler();
checkRole();