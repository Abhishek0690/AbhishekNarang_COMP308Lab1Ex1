import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../config/api";

function AdminDashboard({ user, onLogout }) {
  // Ensure that the token is being sent with each request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newStudent, setNewStudent] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    program: "",
    role: "student",
  });
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentsInCourse, setStudentsInCourse] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/all-students");
      if (response.status !== 200) {
        throw new Error("Failed to fetch students");
      }
      setStudents(response.data);
    } catch (error) {
      toast.error(error.message || "Error fetching students");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/all-admin-courses");
      if (response.status !== 200) {
        throw new Error("Failed to fetch courses");
      }
      setCourses(response.data);
    } catch (error) {
      toast.error(error.message || "Error fetching courses");
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
      fetchCourses();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    try {
      const response = await api.post("/add-students", newStudent);
      if (response.status === 200) {
        await fetchStudents();
        setNewStudent({
          studentNumber: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          program: "",
          role: "student",
        });
        closeModal();
        toast("Student added successfully!");
      } else {
        throw new Error(response.data.message || "Failed to add student");
      }
    } catch (error) {
      toast.error(error.message || "Network error. Please try again.");
    }
  };
  const handleDropCourse = async (courseName) => {
    try {
      const response = await api.delete(`/courses-admin/${courseName}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to drop course");
      }
      fetchCourses();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCourseSelect = async (e) => {
    const courseName = e.target.value;
    setSelectedCourse(courseName);

    try {
      const response = await api.get(`/courses/${courseName}/students/`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch students for this course");
      }
      setStudentsInCourse(response.data);
    } catch (error) {
      toast(error.message || "Error fetching students for the course");
      setStudentsInCourse([]);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li>Welcome, Admin {user?.firstName}</li>
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <div className="container">
        <h2>Admin Dashboard</h2>

        <div className="dashboard-section">
          <h3>Add Student</h3>
          <button onClick={openModal}>Add New Student</button>
        </div>

        <div className="dashboard-section">
          <h3>All Students</h3>
          <table>
            <thead>
              <tr>
                <th>Student Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Program</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.userNumber}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.program}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-section">
          <h3>All Courses</h3>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Course Code</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseName}</td>
                  <td>{course.courseCode}</td>
                  <td>
                    <button onClick={() => handleDropCourse(course.courseName)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-section">
          <h3>Students in a Specific Course</h3>
          <label htmlFor="courseSelect">Select Course:</label>
          <select
            id="courseSelect"
            value={selectedCourse}
            onChange={handleCourseSelect}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        {studentsInCourse.length > 0 && (
          <div className="dashboard-section">
            <h3>Students in {selectedCourse}</h3>
            <table>
              <thead>
                <tr>
                  <th>Student Number</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Program</th>
                </tr>
              </thead>
              <tbody>
                {studentsInCourse.map((student) => (
                  <tr key={student._id}>
                    <td>{student.userNumber}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.email}</td>
                    <td>{student.program}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h3>Add New Student</h3>
            <label>Student Number:</label>
            <input
              type="text"
              name="studentNumber"
              value={newStudent.studentNumber}
              onChange={handleInputChange}
            />
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={newStudent.firstName}
              onChange={handleInputChange}
            />
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={newStudent.lastName}
              onChange={handleInputChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={newStudent.email}
              onChange={handleInputChange}
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={newStudent.password}
              onChange={handleInputChange}
            />
            <label>Program:</label>
            <input
              type="text"
              name="program"
              value={newStudent.program}
              onChange={handleInputChange}
            />
            <button onClick={handleAddStudent}>Add Student</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
