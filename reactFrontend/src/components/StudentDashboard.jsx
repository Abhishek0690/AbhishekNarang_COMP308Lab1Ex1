import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../config/api";

function StudentDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/courses/${user._id}`);
      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to fetch courses");
      }
      setCourses(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleAddCourse = async () => {
    try {
      const response = await api.post("/add-course", {
        courseName: newCourse,
        courseCode: courseCode,
        id: user._id,
      });
      if (response.status === 201) {
        fetchCourses();
        setNewCourse("");
        setCourseCode("");
        alert("Course Added successfully");
      } else {
        setError(response.data.message || "Failed to add course");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  const handleEditCourse = async (courseName) => {
    const newCourseName = prompt("Enter new course name:");
    const newCourseCode = prompt("Enter new course code:");

    if (newCourseName && newCourseCode) {
      try {
        console.log(
          `Editing course: ${courseName} to new name: ${newCourseName} and new code: ${newCourseCode}`
        );
        const response = await api.patch(`/courses/${courseName}`, {
          newCourseName,
          newCourseCode,
        });
        if (response.status !== 200) {
          throw new Error(response.data.message || "Failed to update course");
        }
        fetchCourses();
      } catch (error) {
        console.error("Error editing course: ", error);
        setError(error.message);
      }
    } else {
      alert("Course name and code cannot be empty");
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

  return (
    <div className="student-dashboard">
      <nav>
        <ul>
          <li>Welcome, {user?.firstName}</li>
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      <div className="container">
        <h2>Student Dashboard</h2>
        {error && <div className="error">{error}</div>}

        <div className="dashboard-section">
          <h3>Add Course</h3>
          <div className="add-course-form">
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
            />
            <input
              type="text"
              placeholder="Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <button onClick={handleAddCourse}>Add</button>
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Your Courses</h3>
          {courses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.courseName}</td>
                    <td>
                      <button
                        onClick={() => handleDropCourse(course.courseName)}
                      >
                        Drop
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditCourse(course.courseName)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No courses enrolled.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
