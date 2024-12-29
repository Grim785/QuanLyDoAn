document.addEventListener('DOMContentLoaded', () => {
    // Lưu trữ các phần tử DOM thường dùng
    const input = document.getElementById('tim-sinh-vien');
    const popup = document.getElementById('popup-ket-qua');
    const cardTabs = document.getElementById('card-tabs');
    const responseMessage = document.getElementById('responseMessage');
    const btnTim = document.getElementById('btn-tim');
    const form = document.getElementById('create-toppic-detais');
    const MAX_STUDENTS = 4;
    let cardCount = 0;

    // Hiển thị hoặc ẩn popup kết quả tìm kiếm
    const togglePopup = (show, content = '') => {
        popup.innerHTML = content;
        popup.style.display = show ? 'block' : 'none';
    };

    // Thêm một thẻ sinh viên vào danh sách
    const addCardTab = ({ id, name, studentId }) => {
        if (cardCount >= MAX_STUDENTS) {
            alert('Đã đạt giới hạn 4 sinh viên. Không thể thêm sinh viên.');
            return;
        }

        // Kiểm tra nếu sinh viên đã được thêm
        if (document.getElementById(`card-${id}`)) {
            alert('Sinh viên này đã được thêm.');
            return;
        }

        // Tạo thẻ sinh viên mới
        const card = document.createElement('div');
        card.className = 'card-tab';
        card.id = `card-${id}`;
        card.innerHTML = `
            <p>Sinh viên: ${studentId} - ${name}</p>
            <input type="hidden" name="students[]" value="${id}">
            <button class="remove-btn">&times;</button>
        `;

        // Thêm sự kiện xóa thẻ
        card.querySelector('.remove-btn').addEventListener('click', () => {
            card.remove();
            cardCount--;
        });

        cardTabs.appendChild(card);
        cardCount++;
    };

    // Tìm kiếm sinh viên
    const searchStudents = async () => {
        const query = input.value.trim();
        if (!query) {
            togglePopup(false);
            return;
        }

        try {
            const response = await fetch(`/student/search?query=${query}`);
            const data = await response.json();

            if (data.length > 0) {
                const results = data.map(({ id, studentID, lastname, firstname }) => `
                    <div class="result-item" data-id="${id}" data-studentid="${studentID}" data-name="${lastname} ${firstname}">
                        ${studentID} - ${lastname} ${firstname}
                    </div>
                `).join('');
                togglePopup(true, `<span class="close-popup">&times;</span>${results}`);
            } else {
                togglePopup(true, `<span class="close-popup">&times;</span><div>Không tìm thấy kết quả!</div>`);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            togglePopup(true, `<span class="close-popup">&times;</span><div>Lỗi khi tìm kiếm!</div>`);
        }
    };

    // Xử lý gửi form
    const submitForm = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new URLSearchParams(formData),
            });

            const result = await response.json();
            responseMessage.textContent = result.message;
            responseMessage.style.color = response.ok ? 'green' : 'red';
        } catch (error) {
            console.error('Lỗi:', error);
            responseMessage.textContent = 'Lỗi hệ thống. Vui lòng thử lại!';
            responseMessage.style.color = 'red';
        }
    };

    // Sự kiện khi chọn sinh viên từ popup
    popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('result-item')) {
            const { id, name, studentid } = e.target.dataset;
            if (confirm(`Chọn sinh viên ${name} (MSSV: ${studentid})?`)) {
                addCardTab({ id, name, studentId: studentid });
            }
            togglePopup(false);
        }

        if (e.target.classList.contains('close-popup')) {
            togglePopup(false);
        }
    });

    // Ẩn popup khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== input) {
            togglePopup(false);
        }
    });

    // Sự kiện cho nút tìm kiếm và gửi form
    btnTim.addEventListener('click', searchStudents);
    form.addEventListener('submit', submitForm);
});
