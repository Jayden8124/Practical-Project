"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const ToDoList = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isManaging, setIsManaging] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  // Load userEmail from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
    }
  }, []);

  // Load tasks when component mounts and userEmail is set
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`http://localhost:5000/tasks?email=${userEmail}`)
        .then((response) => {
          const updatedTasks = response.data.map((task) => {
            return {
              ...task,
              completed: task.completed ? 1 : 0,
            };
          });
          setTasks(updatedTasks);
        })
        .catch((error) => {
          console.error("Error fetching tasks: ", error);
        });
    }
  }, [userEmail]);

  const handleCheckboxChange = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = updatedTasks[index].completed ? 0 : 1;
    updatedTasks[index].completedDate = updatedTasks[index].completed
      ? new Date().toISOString().split("T")[0]
      : null;
  
    axios
      .put("http://localhost:5000/tasks", {
        task_id: updatedTasks[index].task_id,
        nameTask: updatedTasks[index].nameTask,
        completed: updatedTasks[index].completed,
        completedDate: updatedTasks[index].completedDate,
        lastResetDate: updatedTasks[index].completed ? new Date().toISOString().split("T")[0] : null,
      })
      .then(() => {
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
      });
  };

  const handleManageList = () => {
    setIsManaging(!isManaging);
  };

  const handleOpenAddTaskPopup = () => {
    setShowAddTaskPopup(true);
  };

  const handleCloseAddTaskPopup = () => {
    setShowAddTaskPopup(false);
    setNewTaskName("");
    setEditTaskIndex(null);
  };

  const handleAddTask = () => {
    if (newTaskName) {
      if (editTaskIndex !== null) {
        // Editing existing task
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex].nameTask = newTaskName;

        // Update the task in the database
        axios
          .put("http://localhost:5000/tasks", {
            task_id: updatedTasks[editTaskIndex].task_id,
            nameTask: newTaskName,
            completed: updatedTasks[editTaskIndex].completed,
            completedDate: updatedTasks[editTaskIndex].completedDate,
          })
          .then(() => {
            setTasks(updatedTasks);
            handleCloseAddTaskPopup();
          })
          .catch((error) => {
            console.error("Error updating task: ", error);
          });
      } else {
        // Adding new task
        axios
          .post("http://localhost:5000/tasks", {
            email: userEmail,
            nameTask: newTaskName,
          })
          .then((response) => {
            setTasks([
              ...tasks,
              {
                task_id: response.data.insertId,
                nameTask: newTaskName,
                completed: 0,
                completedDate: null,
              },
            ]);
            handleCloseAddTaskPopup();
          })
          .catch((error) => {
            console.error("Error adding task: ", error);
          });
      }
    }
  };

  const handleEditTask = (index) => {
    setNewTaskName(tasks[index].nameTask);
    setEditTaskIndex(index);
    setShowAddTaskPopup(true);
  };

  const handleDeleteTask = (index) => {
    const taskToDelete = tasks[index];

    axios
      .delete(`http://localhost:5000/tasks/${taskToDelete.task_id}`)
      .then((response) => {
        console.log(response.data);
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">To-Do List</h1>
        <div className="border-b border-gray-300 mb-6"></div>
        <div className="flex flex-col items-start">
          {tasks.length === 0 ? (
            <p className="italic text-gray-400 mb-6">
              No tasks yet. Add one to get started!
            </p>
          ) : (
            <ul className="space-y-6 mb-6 w-full">
              {tasks.map((task, index) => (
                <li
                  key={task.task_id}
                  className="flex items-center justify-between w-full text-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-4"
                      checked={task.completed === 1}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <span
                      className={`${
                        task.completed === 1 ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.nameTask}
                    </span>
                  </div>
                  {isManaging && (
                    <div className="ml-auto flex space-x-2">
                      <button
                        onClick={() => handleEditTask(index)}
                        className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(index)}
                        className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
          <ul className="space-y-6 mb-6 w-full">
            {tasks
              .filter((task) => task.completed === 1)
              .map((task, index) => (
                <li
                  key={task.task_id}
                  className="flex items-center w-full text-lg"
                >
                  <span className="line-through text-gray-500">
                    {task.nameTask}
                  </span>
                </li>
              ))}
          </ul>

          {isManaging && (
            <div className="flex justify-center w-full mb-4">
              <button
                onClick={handleOpenAddTaskPopup}
                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
              >
                Add Task
              </button>
            </div>
          )}
          <button
            onClick={handleManageList}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 self-end"
          >
            {isManaging ? "Done" : "Manage List"}
          </button>
        </div>
      </div>

      {showAddTaskPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative">
            <button
              onClick={handleCloseAddTaskPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editTaskIndex !== null ? "Edit Task" : "Add New Task"}
            </h2>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              placeholder="Enter task name"
            />
            <button
              onClick={handleAddTask}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editTaskIndex !== null ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoList;
