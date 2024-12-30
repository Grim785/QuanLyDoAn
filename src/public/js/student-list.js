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

        fetch(`/admin/search?query=${query}`)
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
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.classID}" /></td>
                      <td><input type="text" class="form-control form-control-xs cell-input" value="${student.username}" /></td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });
                initializeCheckboxHandlers();
            })
            .catch((err) => console.error('Error during search:', err));
    });
}




// Gọi các hàm khởi tạo
initializeCheckboxHandlers();
initializeSearchHandler();
// initializeAddHandler();
// initializeDeleteHandler();
// initializeEditHandler();