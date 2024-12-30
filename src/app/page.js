"use client";
import { useState, useEffect } from "react";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [showInputBox, setShowInputBox] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
          console.error("Failed to fetch tasks:", response.status);
          return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("Invalid JSON data:", data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return;
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask }),
    });

    if (response.ok) {
      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data]);
      setNewTask("");
    } else {
      console.error("Error creating task:", response.status);
    }
  };

  const deleteTask = async (id) => {
    const response = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      setTasks(tasks.filter((task) => task._id !== id));
    } else {
      console.error("Error deleting task:", response.status);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((task) => task._id === id);
    const updatedTask = { ...task, completed: !task.completed };
    const response = await fetch(`/api/tasks?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (response.ok) {
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, completed: updatedTask.completed } : task
        )
      );
    } else {
      console.error("Error updating task:", response.status);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.task.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container w-full mx-auto px-4 sm:px-8 py-12">
    <h1 className="text-3xl sm:text-4xl font-bold mb-6">Things to do:</h1>
  
    {/* Search and New Task Section */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 gap-y-4 sm:gap-y-0 sm:gap-x-16 w-full">
      {/* Search Bar */}
      <div className="flex">
        <div className="flex items-center bg-black text-white rounded-xl overflow-hidden">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 h-12 w-full sm:w-72 text-black bg-yellow-300 outline-none placeholder-black"
            placeholder="Search tasks..."
          />
          <div className="flex items-center justify-center px-3 bg-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4a7 7 0 015.292 11.708l4.517 4.517a1 1 0 01-1.414 1.414l-4.517-4.517A7 7 0 1111 4z"
              />
            </svg>
          </div>
        </div>
      </div>
  
      {/* New Task Button/Input */}
      <div className="flex">
        {showInputBox ? (
          <>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-black bg-yellow-300 p-2 rounded-md w-full sm:w-72"
              placeholder="Enter new task..."
            />
            <button
              onClick={addTask}
              className="ml-2 bg-customGreen text-black px-8 sm:px-14 py-2 rounded-xl"
            >
              Add Task
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowInputBox(true)}
            className="bg-customGreen text-black px-12 sm:px-24 py-2 rounded-xl"
          >
            New Task
          </button>
        )}
      </div>
    </div>
  
    {/* Horizontal Line */}
    <hr className="my-6 border-black" />
  
    {/* Task List */}
    <ul className="space-y-4">
      {filteredTasks.map((task) => (
        <li
          key={task._id}
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-customPurple p-2 border border-black rounded-md ${
            task.completed ? "bg-green-100 line-through" : ""
          }`}
        >
          <span className="mb-2 sm:mb-0">{task.task}</span>
          <div className="flex gap-x-2">
            <button
              onClick={() => toggleTaskCompletion(task._id)}
              className="p-2 bg-green-500 text-white rounded-md flex items-center justify-center"
              aria-label="Task Completed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4m-4 4a8 8 0 110-16 8 8 0 010 16z"
                />
              </svg>
            </button>
  
            <button
              onClick={() => deleteTask(task._id)}
              className="p-2 bg-red-500 text-white rounded-md flex items-center justify-center"
              aria-label="Delete Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16m-3-3a1 1 0 00-1-1H8a1 1 0 00-1 1m3 0h4"
                />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
  
  );
};

export default Home;
