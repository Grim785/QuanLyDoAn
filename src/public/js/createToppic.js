document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử cần sử dụng
    const input = document.getElementById('tim-sinh-vien'); // Ô nhập tìm sinh viên
    const popup = document.getElementById('popup-ket-qua'); // Popup hiển thị kết quả tìm kiếm
    const cardTabs = document.getElementById('card-tabs'); // Khu vực chứa danh sách sinh viên đã chọn
    const responseMessage = document.getElementById('responseMessage'); // Phản hồi khi gửi form
    let cardCount = 0; // Đếm số lượng sinh viên được thêm
    const MAX_STUDENTS = 4; // Số sinh viên tối đa

    // Tìm kiếm sinh viên dựa trên giá trị nhập
    function searchStudents() {
        const query = input.value.trim(); // Lấy giá trị tìm kiếm
        if (!query) {
            popup.style.display = 'none'; // Ẩn popup nếu không có nội dung
            return;
        }

        // Gửi yêu cầu tìm kiếm đến server
        fetch(`/admin/search?query=${query}`)
            .then(response => response.json())
            .then(data => {
                // Hiển thị kết quả tìm kiếm
                if (data.length > 0) {
                    popup.innerHTML = `
                        <span class="close-popup">&times;</span>
                        ${data.map(student => `
                            <div class="result-item" data-studentid="${student.studentID}" data-id="${student.id}" data-name="${student.lastname} ${student.firstname}">
                                ${student.studentID} - ${student.lastname} ${student.firstname}
                            </div>
                        `).join('')}
                    `;
                } else {
                    popup.innerHTML = `
                        <span class="close-popup">&times;</span>
                        <div class="result-item">Không tìm thấy kết quả. Vui lòng kiểm tra lại giá trị tìm kiếm!</div>
                    `;
                }
                popup.style.display = 'block';
            })
            .catch(error => {
                console.error('Lỗi:', error);
                popup.innerHTML = `
                    <span class="close-popup">&times;</span>
                    <div class="result-item">Lỗi khi tìm kiếm!</div>
                `;
                popup.style.display = 'block';
            });
    }

    // Thêm sinh viên vào danh sách
    function addCardTab(student) {
        if (cardCount >= MAX_STUDENTS) {
            alert('Đã đạt giới hạn 4 sinh viên. Không thể thêm sinh viên.');
            return;
        }

        // Kiểm tra nếu sinh viên đã tồn tại
        if (document.getElementById(`card-${student.id}`)) {
            alert('Sinh viên này đã được thêm. Vui lòng chọn lại!');
            return;
        }

        // Tạo thẻ sinh viên
        const card = document.createElement('div');
        card.className = 'card-tab';
        card.id = `card-${student.id}`;
        card.innerHTML = `
            <p>Sinh viên: ${student.studentId} - ${student.name}</p>
            <input type="hidden" name="students[]" value="${student.id}">
            <button class="remove-btn">&times;</button>
        `;

        // Thêm sự kiện xóa thẻ
        card.querySelector('.remove-btn').addEventListener('click', () => {
            card.remove();
            cardCount--;
        });

        cardTabs.appendChild(card);
        cardCount++;
    }

    // Xử lý gửi form
    async function submitForm(event) {
        event.preventDefault(); // Ngăn form reload trang
        const form = event.target;
        const formData = new FormData(form); // Lấy dữ liệu form
        // console.log([...formData.entries()]); // Kiểm tra dữ liệu
        // Chuyển FormData thành URLSearchParams
        const params = new URLSearchParams();
        formData.forEach((value, key) => {
            params.append(key, value);
        });
        console.log(params);
        try {
            const response = await fetch('/admin/create-toppic', {
                method: 'POST',
                body: params,
            });

            const result = await response.json();
            responseMessage.textContent = result.message;
            responseMessage.style.color = response.ok ? 'green' : 'red';
        } catch (error) {
            console.error('Lỗi:', error);
            responseMessage.textContent = 'Lỗi hệ thống. Vui lòng thử lại!';
            responseMessage.style.color = 'red';
        }
    }

    // Xử lý khi người dùng chọn sinh viên từ popup
    popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('result-item')) {
            const student = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                studentId: e.target.dataset.studentid,
            };
            if (confirm(`Bạn có muốn chọn sinh viên ${student.name} (MSSV: ${student.studentId})?`)) {
                addCardTab(student);
            }
            popup.style.display = 'none';
        }

        if (e.target.classList.contains('close-popup')) {
            popup.style.display = 'none';
        }
    });

    // Ẩn popup khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== input) {
            popup.style.display = 'none';
        }
    });

    // Hiển thị ngày khi chọn trạng thái
    const dateDisplayContainer = document.getElementById('current-date');
    const dateDisplay = document.getElementById('date-display');
    document.getElementById('flexRadioDefault2').addEventListener('change', () => {
        const currentDate = new Date().toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        dateDisplay.textContent = currentDate;
        dateDisplayContainer.style.display = 'block';
    });

    document.getElementById('flexRadioDefault1').addEventListener('change', () => {
        dateDisplayContainer.style.display = 'none';
    });

    // Gắn sự kiện cho các nút và form
    document.getElementById('btn-tim').addEventListener('click', searchStudents);
    document.getElementById('create-toppic-detais').addEventListener('submit', submitForm);
});
