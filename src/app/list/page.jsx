"use client";

import React, { useState } from "react";
import Navbar from "../Components/Navbar";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [isManaging, setIsManaging] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [editTaskIndex, setEditTaskIndex] = useState(null);

  const handleCheckboxChange = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
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
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex].name = newTaskName;
        setTasks(updatedTasks);
      } else {
        setTasks([...tasks, { name: newTaskName, completed: false }]);
      }
      handleCloseAddTaskPopup();
    }
  };

  const handleEditTask = (index) => {
    setNewTaskName(tasks[index].name);
    setEditTaskIndex(index);
    setShowAddTaskPopup(true);
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">To-Do List</h1>
        <div className="border-b border-gray-300 mb-6"></div>
        <div className="flex flex-col items-start">
          {tasks.length === 0 ? (
            <p className="italic text-gray-400 mb-6">No tasks yet. Add one to get started!</p>
          ) : (
            <ul className="space-y-6 mb-6 w-full">
              {tasks.map((task, index) => (
                <li key={index} className="flex items-center justify-between w-full text-lg">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-4"
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <span
                      className={`${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.name}
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
        {tasks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
            {tasks.filter((task) => task.completed).length === 0 ? (
              <p className="italic text-gray-400">No completed tasks yet.</p>
            ) : (
              <ul className="space-y-2">
                {tasks
                  .filter((task) => task.completed)
                  .map((task, index) => (
                    <li key={index} className="text-gray-600 text-lg">
                      {task.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}
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
