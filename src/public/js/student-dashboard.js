const progressbar = document.querySelector('.progressbar');
let progress = 90

function enableProgressbar() {
    progressbar.setAttribute("role", "progressbar");
    progressbar.setAttribute("aria-valuenow", progress);
    progressbar.setAttribute("aria-live", "polite");
    progressbar.style.setProperty("--progress", progress + "%")
}
enableProgressbar() 


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-ok').forEach(button => {
        button.addEventListener('click', async (event) => {
            const projectId = event.target.getAttribute('data-id');

            if (!confirm('Bạn có chắc chắn muốn xóa đề tài này?')) return;

            try {
                const response = await fetch(`/student/delete-topic/${projectId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    // Xóa thẻ khỏi giao diện
                    event.target.closest('.card').remove();
                    window.location.href = '/student/RegisterTopic';
                } else {
                    alert(result.message || 'Không thể xóa đề tài.');
                }
            } catch (error) {
                console.error('Lỗi khi xóa đề tài:', error);
                alert('Đã xảy ra lỗi, vui lòng thử lại sau.');
            }
        });
    });
});
