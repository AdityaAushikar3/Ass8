// Frontend JavaScript to connect with Express / MongoDB API
const API_URL = '/api/students';

let allStudents = [];

// DOM References
const studentForm = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const saveBtn = document.getElementById('saveBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editStudentId = document.getElementById('editStudentId');

const rollNoInput = document.getElementById('rollNo');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const marksInput = document.getElementById('marks');

const studentTableBody = document.getElementById('studentTableBody');
const tableMessage = document.getElementById('tableMessage');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');

const statTotal = document.getElementById('statTotal');
const statAverage = document.getElementById('statAverage');
const statTopper = document.getElementById('statTopper');

// 1. Fetch and Display All Students from MongoDB
async function loadStudents() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      allStudents = result.data;
      renderTable(allStudents);
      updateStats(allStudents);
    } else {
      showError('Failed to load students.');
    }
  } catch (err) {
    console.error('Error fetching students:', err);
    tableMessage.style.display = 'block';
    tableMessage.innerText = 'Unable to connect to server. Ensure Node.js server is running.';
  }
}

// 2. Render Table Rows
function renderTable(students) {
  studentTableBody.innerHTML = '';

  if (students.length === 0) {
    tableMessage.style.display = 'block';
    tableMessage.innerText = 'No student records found.';
    return;
  }

  tableMessage.style.display = 'none';

  students.forEach((s) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${escapeHtml(s.rollNo)}</strong></td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.department)}</td>
      <td><strong>${s.marks}</strong>/100</td>
      <td>
        <div class="action-btns">
          <button type="button" class="btn-edit" onclick="startEdit('${s._id}')">Edit</button>
          <button type="button" class="btn-del" onclick="deleteStudent('${s._id}', '${escapeHtml(s.name)}')">Delete</button>
        </div>
      </td>
    `;
    studentTableBody.appendChild(row);
  });
}

// 3. Update Summary Statistics
function updateStats(students) {
  statTotal.innerText = students.length;

  if (students.length === 0) {
    statAverage.innerText = '0%';
    statTopper.innerText = 'None';
    return;
  }

  const sumMarks = students.reduce((acc, curr) => acc + Number(curr.marks), 0);
  const avg = (sumMarks / students.length).toFixed(1);
  statAverage.innerText = `${avg}%`;

  // Find Topper
  const topper = students.reduce((max, curr) => (Number(curr.marks) > Number(max.marks) ? curr : max), students[0]);
  statTopper.innerText = `${topper.name} (${topper.marks}%)`;
}

// 4. Handle Form Submit (Create or Update)
studentForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = editStudentId.value;
  const isEditing = Boolean(id);

  const payload = {
    rollNo: rollNoInput.value.trim(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    department: departmentInput.value,
    marks: Number(marksInput.value)
  };

  try {
    let res;
    if (isEditing) {
      // PUT /api/students/:id
      res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // POST /api/students
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (data.success) {
      alert(data.message || (isEditing ? 'Student updated!' : 'Student created!'));
      resetForm();
      loadStudents();
    } else {
      alert(`Error: ${data.message || 'Operation failed'}`);
    }
  } catch (err) {
    console.error('Request failed:', err);
    alert('Failed to send request to server.');
  }
});

// 5. Start Editing a Student Record
window.startEdit = function (id) {
  const student = allStudents.find((s) => s._id === id);
  if (!student) return;

  editStudentId.value = student._id;
  rollNoInput.value = student.rollNo;
  rollNoInput.disabled = true; // Keep rollNo unique
  nameInput.value = student.name;
  emailInput.value = student.email;
  departmentInput.value = student.department;
  marksInput.value = student.marks;

  formTitle.innerText = `Edit Student (${student.name})`;
  saveBtn.innerText = 'Update Student';
  cancelEditBtn.style.display = 'inline-block';

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 6. Cancel Edit Mode
cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
  studentForm.reset();
  editStudentId.value = '';
  rollNoInput.disabled = false;
  formTitle.innerText = 'Add New Student';
  saveBtn.innerText = 'Save Student';
  cancelEditBtn.style.display = 'none';
}

// 7. Delete a Student
window.deleteStudent = async function (id, name) {
  if (!confirm(`Are you sure you want to delete the record for "${name}" from MongoDB?`)) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();

    if (data.success) {
      alert(data.message || 'Record deleted successfully');
      loadStudents();
    } else {
      alert(`Error deleting record: ${data.message}`);
    }
  } catch (err) {
    console.error('Delete request failed:', err);
    alert('Failed to delete student.');
  }
};

// 8. Search Filter
searchInput.addEventListener('input', function (e) {
  const q = e.target.value.toLowerCase().trim();
  const filtered = allStudents.filter(
    (s) => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
  );
  renderTable(filtered);
});

// 9. Manual Refresh Button
refreshBtn.addEventListener('click', loadStudents);

// Helper for escaping HTML
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Initial Load
loadStudents();
