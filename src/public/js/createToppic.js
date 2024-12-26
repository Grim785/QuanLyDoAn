
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('tim-sinh-vien');
    const popup = document.getElementById('popup-ket-qua');
    const cardTabs = document.getElementById('card-tabs');
    const responseMessage = document.getElementById('responseMessage');
    let cardCount = 0;
    const MAX_STUDENTS = 4;

    // Hàm tìm kiếm sinh viên
    const searchStudents = () => {
        const query = input.value.trim();
        if (!query) {
            popup.style.display = 'none';
            return;
        }

        fetch(`/admin/search?query=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    popup.innerHTML = `
                            <span class="close-popup">&times;</span>
                            ${data.map(student => `
                                <div class="result-item" data-studentid="${student.studentID}" data-id="${student.id}" data-name="${student.lastname} ${student.firstname}">
                                    ${student.studentID} - ${student.lastname} ${student.firstname}
                                </div>`).join('')}
                        `;
                } else {
                    popup.innerHTML = `
                            <span class="close-popup">&times;</span>
                            <div class="result-item">Không tìm thấy kết quả. Vui lòng kiểm tra lại giá trị tìm kiếm!</div>`;
                            // Ngừng sự kiện click trên các kết quả không có
                            const resultItem = popup.querySelector('.result-item');
                            resultItem.style.pointerEvents = 'none';
                }
                popup.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                popup.innerHTML = `<span class="close-popup">&times;</span><div class="result-item">Lỗi khi tìm kiếm!</div>`;
                popup.style.display = 'block';
            });
    };

    // Hàm thêm card-tab
    const addCardTab = (student) => {
        if (cardCount >= MAX_STUDENTS) {
            alert('Đã đạt giới hạn 4 sinh viên. Không thể thêm sinh viên.');
            return;
        }

        if (document.getElementById(`card-${student.id}`)) {
            alert('Sinh viên này đã được thêm. Vui lòng chọn lại!');
            return;
        }

        const card = document.createElement('div');
        card.className = 'card-tab';
        card.id = `card-${student.id}`;
        card.innerHTML = `
                <p>Sinh viên: ${student.studentId} - ${student.name}</p>
                <input type="hidden" name="students[]" value="${student.id}">
                <button class="remove-btn">&times;</button>
            `;

        card.querySelector('.remove-btn').addEventListener('click', () => {
            card.remove();
            cardCount--;
        });

        cardTabs.appendChild(card);
        cardCount++;
    };

    // Gửi form tạo dự án
    const submitForm = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('/admin/createToppic', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            responseMessage.textContent = result.message;
            responseMessage.style.color = response.ok ? 'green' : 'red';
        } catch (error) {
            responseMessage.textContent = 'Lỗi hệ thống. Vui lòng thử lại!';
            responseMessage.style.color = 'red';
        }
    };

    // Xử lý khi người dùng chọn kết quả tìm kiếm
    popup.addEventListener('click', (e) => {
        if (e.target.classList.contains('result-item')) {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const studentId = e.target.dataset.studentid;

            if (confirm(`Bạn có muốn chọn sinh viên ${name} (MSSV: ${studentId})?`)) {
                addCardTab({ id, name, studentId });
            }

            popup.style.display = 'none';
        }

        if (e.target.classList.contains('close-popup')) {
            popup.style.display = 'none';
        }
    });

    // Đóng popup khi click bên ngoài
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== input) {
            popup.style.display = 'none';
        }
    });

    // Lắng nghe sự kiện tìm kiếm
    document.getElementById('btn-tim').addEventListener('click', searchStudents);

    // Lắng nghe sự kiện gửi form
    document.getElementById('create-toppic').addEventListener('submit', submitForm);

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
});