Database trên đại diện cho một hệ thống quản lý dự án, bao gồm các bảng chứa dữ liệu về người dùng, sinh viên, cố vấn, chuyên ngành, lớp học, và dự án. Sau đây là mô tả quan hệ giữa các bảng:

---

### **1. `users`**
- Chứa thông tin về tất cả người dùng, bao gồm:
  - `role` xác định vai trò của người dùng (sinh viên, cố vấn, hoặc quản trị viên).
  - `gmail`, `phone` là các giá trị duy nhất để liên lạc.
  - MẬT KHẨU CÓ SẴN TRONG BẢNG USERS LÀ 123123.
- **Quan hệ**:
  - Một `users` có thể liên kết với nhiều `students` hoặc `advisors`.

---

### **2. `students`**
- Chứa thông tin về sinh viên:
  - Mỗi sinh viên thuộc một lớp (`classID`) và một chuyên ngành (`majorsID`).
- **Quan hệ**:
  - `majorsID` liên kết với `majors` qua khoá ngoại.
  - `classID` liên kết với `class` qua khoá ngoại.
  - `usersID` liên kết với `users` qua khoá ngoại (mỗi sinh viên là một người dùng).

---

### **3. `advisors`**
- Chứa thông tin về các cố vấn (giáo viên hoặc giảng viên):
  - Cố vấn thuộc một chuyên ngành (`majorsID`) và là một người dùng (`userID`).
- **Quan hệ**:
  - `majorsID` liên kết với `majors` qua khoá ngoại.
  - `userID` liên kết với `users` qua khoá ngoại.

---

### **4. `class`**
- Chứa thông tin về các lớp học:
  - Mỗi lớp thuộc một chuyên ngành (`majorsID`).
- **Quan hệ**:
  - `majorsID` liên kết với `majors` qua khoá ngoại.
  - Lớp học có thể chứa nhiều sinh viên (`students`).

---

### **5. `majors`**
- Chứa thông tin về các chuyên ngành.
- **Quan hệ**:
  - Là trung tâm kết nối với:
    - `students` (nhiều sinh viên thuộc một chuyên ngành).
    - `advisors` (nhiều cố vấn thuộc một chuyên ngành).
    - `class` (nhiều lớp thuộc một chuyên ngành).
    - `projects` (dự án có liên kết với chuyên ngành).

---

### **6. `projects`**
- Chứa thông tin về các dự án:
  - Dự án được cố vấn bởi một `advisors` và thuộc một `majors`.
  - Trạng thái dự án có thể thay đổi qua thời gian.
- **Quan hệ**:
  - `advisorID` liên kết với `advisors` qua khoá ngoại.
  - `majorID` liên kết với `majors` qua khoá ngoại.
  - Dự án có thể liên quan đến nhiều sinh viên (`projectstudents`) hoặc nhiều tệp (`projectfiles`).

---

### **7. `projectstudents`**
- Liên kết nhiều-nhiều giữa `projects` và `students`.
- **Quan hệ**:
  - `project_id` liên kết với `projects`.
  - `student_id` liên kết với `students`.

---

### **8. `projectfiles`**
- Liên kết nhiều-nhiều giữa `projects` và `files`.
- **Quan hệ**:
  - `project_id` liên kết với `projects`.
  - `file_id` liên kết với `files`.

---

### **9. `files`**
- Chứa thông tin về các tệp (tài liệu, báo cáo, v.v.):
  - Bao gồm tên tệp, đường dẫn, và người tải lên (`uploaded_by`).
- **Quan hệ**:
  - `uploaded_by` liên kết với `users`.

---

### **10. `projectfeedback`**
- Chứa thông tin phản hồi của người dùng cho từng dự án.
- **Quan hệ**:
  - `project_id` liên kết với `projects`.
  - `user_id` liên kết với `users`.

---

### **11. `suggestedprojects`**
- Chứa danh sách các dự án được đề xuất, không liên kết trực tiếp với các bảng khác trong cấu trúc hiện tại.

---

### **Tóm tắt quan hệ chính**
- **Một-nhiều**:
  - `majors` → `students`, `advisors`, `class`, `projects`.
  - `users` → `students`, `advisors`.
  - `class` → `students`.
  - `projects` → `projectfeedback`, `projectstudents`, `projectfiles`.
- **Nhiều-nhiều**:
  - `projects` ↔ `students` (qua `projectstudents`).
  - `projects` ↔ `files` (qua `projectfiles`).

---

### **Ý nghĩa**
Hệ thống này cho phép quản lý:
- Người dùng (sinh viên, cố vấn, quản trị viên).
- Dữ liệu liên quan đến chuyên ngành, lớp học, dự án.
- Phản hồi, tài liệu và các liên kết giữa dự án và thành viên.