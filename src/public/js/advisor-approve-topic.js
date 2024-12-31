    document.addEventListener('DOMContentLoaded', () => {
        const selectAllCheckbox = document.getElementById('select-all');
        const projectCheckboxes = () => document.querySelectorAll('.project-checkbox'); 
        const approveSelectedButton = document.getElementById('approve-selected');
        const rejectSelectedButton = document.getElementById('reject-selected');
        const selectedCountDisplay = document.getElementById('selected-count');

        // Cập nhật số lượng đề tài được chọn
        const updateSelectedCount = () => {
            const selectedCount = document.querySelectorAll('.project-checkbox:checked').length;
            selectedCountDisplay.textContent = `${selectedCount} đề tài được chọn`;
        };

        // Chọn tất cả checkbox
        selectAllCheckbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            projectCheckboxes().forEach((checkbox) => {
                checkbox.checked = isChecked;
            });
            updateSelectedCount();
        });

        // Cập nhật số lượng khi chọn từng checkbox
        document.addEventListener('change', (event) => {
            if (event.target.classList.contains('project-checkbox')) {
                updateSelectedCount();
            }
        });

        // Duyệt các đề tài được chọn
        approveSelectedButton.addEventListener('click', async () => {
            const selectedIds = Array.from(document.querySelectorAll('.project-checkbox:checked')).map(
                (checkbox) => checkbox.getAttribute('data-id')
            );

            if (selectedIds.length > 0) {
                const confirmed = confirm('Bạn có chắc chắn muốn duyệt các đề tài đã chọn?');
                if (!confirmed) return;

                try {
                    const response = await fetch('/advisor/approve-topics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ projectIds: selectedIds }),
                    });

                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message || 'Đã duyệt thành công các đề tài.');
                        // Xóa các dòng đã duyệt
                        selectedIds.forEach((id) => {
                            const row = document.querySelector(`.project-checkbox[data-id="${id}"]`).closest('tr');
                            if (row) row.remove();
                        });
                        updateSelectedCount(); // Cập nhật lại số lượng
                    } else {
                        alert(result.message || 'Không thể duyệt các đề tài.');
                    }
                } catch (error) {
                    console.error('Lỗi khi duyệt đề tài:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
                }
            } else {
                alert('Vui lòng chọn ít nhất một đề tài để duyệt!');
            }
        });

        // Hủy các đề tài được chọn
        rejectSelectedButton.addEventListener('click', async () => {
            const selectedIds = Array.from(document.querySelectorAll('.project-checkbox:checked')).map(
                (checkbox) => checkbox.getAttribute('data-id')
            );

            if (selectedIds.length > 0) {
                const note = prompt('Vui lòng nhập lý do hủy các đề tài:');
                if (!note) {
                    alert('Bạn phải nhập lý do để hủy các đề tài!');
                    return;
                }

                try {
                    const response = await fetch('/advisor/reject-topics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ projectIds: selectedIds, note }),
                    });

                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message || 'Đã hủy thành công các đề tài.');
                        // Xóa các dòng đã hủy
                        selectedIds.forEach((id) => {
                            const row = document.querySelector(`.project-checkbox[data-id="${id}"]`).closest('tr');
                            if (row) row.remove();
                        });
                        updateSelectedCount(); // Cập nhật lại số lượng
                    } else {
                        alert(result.message || 'Không thể hủy các đề tài.');
                    }
                } catch (error) {
                    console.error('Lỗi khi hủy các đề tài:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
                }
            } else {
                alert('Vui lòng chọn ít nhất một đề tài để hủy!');
            }
        });

        // Duyệt từng đề tài
        document.querySelectorAll('.approve-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const projectId = event.target.getAttribute('data-id');

                // Hiển thị thông báo xác nhận
                const confirmed = confirm('Bạn có chắc chắn muốn duyệt đề tài này?');
                if (!confirmed) {
                    return; // Hủy hành động nếu người dùng không xác nhận
                }

                try {
                    const response = await fetch(`/advisor/approve-topic/${projectId}`, {
                        method: 'POST',
                    });

                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message);
                        // Cập nhật giao diện sau khi duyệt thành công
                        event.target.closest('tr').remove(); // Xóa dòng đề tài khỏi bảng
                    } else {
                        alert(result.message || 'Không thể duyệt đề tài.');
                    }
                } catch (error) {
                    console.error('Lỗi khi duyệt đề tài:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
                }
            });
        });



        // Hủy từng đề tài
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const projectId = event.target.getAttribute('data-id');

                // Hiển thị hộp thoại nhập lý do hủy
                const note = prompt('Vui lòng nhập lý do hủy đề tài:');
                if (!note) {
                    alert('Bạn phải nhập lý do để hủy đề tài!');
                    return;
                }

                try {
                    const response = await fetch(`/advisor/reject-topic/${projectId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ note }), // Gửi lý do hủy tới backend
                    });

                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message);
                        // Xóa dòng đề tài khỏi giao diện
                        event.target.closest('tr').remove();
                    } else {
                        alert(result.message || 'Không thể hủy đề tài.');
                    }
                } catch (error) {
                    console.error('Lỗi khi hủy đề tài:', error);
                    alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
                }
            });
        });

    });
