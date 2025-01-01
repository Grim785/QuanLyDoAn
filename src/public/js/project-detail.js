document.addEventListener('DOMContentLoaded', function () {
    // Xử lý form tải lên file
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const progressContainer = document.querySelector('.progress');
            const uploadMessage = document.getElementById('uploadMessage');
            const formData = new FormData(uploadForm);

            // Hiển thị thanh tiến trình
            progressContainer.classList.remove('d-none');
            uploadMessage.innerHTML = ''; // Xóa thông báo cũ

            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                progressContainer.classList.add('d-none'); // Ẩn thanh tiến trình
                if (xhr.status === 200) {
                    uploadMessage.innerHTML = `<div class="alert alert-success">Tải file thành công!</div>`;
                } else {
                    uploadMessage.innerHTML = `<div class="alert alert-danger">Tải file thất bại: ${xhr.responseText}</div>`;
                }
            };

            xhr.onerror = function () {
                progressContainer.classList.add('d-none'); // Ẩn thanh tiến trình
                uploadMessage.innerHTML = `<div class="alert alert-danger">Lỗi mạng, vui lòng thử lại.</div>`;
            };

            xhr.open('POST', '/upload/project', true);
            xhr.send(formData);
        });
    }

    // Thêm tiến trình mới
    const addIcon = document.querySelector('.add_icon');
    const addProcessContainer = document.querySelector('.add_progress_container');
    const addProgressBtn = document.querySelector('.add_progress_btn');
    const cancelBtn = document.querySelector('.cancel_btn');
    const titleProgressInput = document.querySelector('[name="TitleProgress"]');

    if (addIcon && addProcessContainer && addProgressBtn && cancelBtn) {
        addIcon.addEventListener('click', function () {
            addProcessContainer.classList.remove('d-none');
            addIcon.classList.add('d-none');
        });

        cancelBtn.addEventListener('click', function () {
            addProcessContainer.classList.add('d-none');
            addIcon.classList.remove('d-none');
        });

        addProgressBtn.addEventListener('click', function () {
            const title = titleProgressInput.value.trim();
            const projectIdInput = document.getElementById('projectId'); // Lấy thẻ input
            const projectid = projectIdInput ? projectIdInput.value : null; // Lấy giá trị id
            if (!title) {
                alert('Vui lòng nhập tên!');
                return;
            }

            fetch(`/project/addProgress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, projectid }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        alert("Thêm tiến độ mới thành công!");
                        location.reload();
                    } else {
                        alert(`Lỗi:${data.message}`);
                    }
                })
                .catch((error) => console.error('Error:', error));
        });
    }

    // Xóa tiến trình
    const removeProgressBtns = document.querySelectorAll('.remove_progress_btn');
    removeProgressBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const progressid = btn.value;
            if (confirm('Bạn có chắc muốn xóa tiến trình này?')) {
                fetch(`/project/deleteProgress/${progressid}`, { method: 'DELETE' })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.success) {
                            alert('Xóa tiến trình thành công!');
                            location.reload();
                        } else {
                            alert(`Lỗi: ${data.message}`);
                        }
                    }).catch((error) => console.error('Lỗi:', error));
            }
        });
    });

    // Cập nhật tiến trình
    const inputs = document.querySelectorAll('.title_progress');
    const contents = document.querySelectorAll('.content_progress');

    function fetchUpdate(Id, newtitle, newcontent) {
        fetch(`/project/updateProgress/${Id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: Id,
                title: newtitle,
                content: newcontent,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    console.log("Cập nhật thành công!");
                } else {
                    console.error("Cập nhật thất bại:", data.message);
                }
            })
            .catch((error) => {
                console.error("Lỗi khi gửi dữ liệu:", error);
            });
    }

    contents.forEach(content => {
        content.addEventListener("blur", function (event) {
            const Id = event.target.getAttribute("data-id");
            const newtitle = event.target.getAttribute("data-title");
            const newcontent = event.target.value;
            fetchUpdate(Id, newtitle, newcontent);
        });
    });

    inputs.forEach(input => {
        input.addEventListener("blur", function (event) {
            const Id = event.target.getAttribute("data-id");
            const newtitle = event.target.value;
            const newcontent = event.target.getAttribute("data-content");
            fetchUpdate(Id, newtitle, newcontent);
        });
    });
});