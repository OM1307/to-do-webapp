import React, { useState, useEffect } from "react";
import "./App.css";
import confetti from "canvas-confetti";

const CircularProgressBar = ({ progress }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="circular-progress">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#3b82f6"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.35s" }}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#111827"
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const handleToggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  useEffect(() => {
    if (totalTasks > 0 && completedTasks === totalTasks) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [completedTasks, totalTasks]);

  return (
    <div className="app">
      <div className="card">
        {totalTasks > 0 ? (
          <div className="progress-section">
            <CircularProgressBar progress={progressPercentage} />
            <div className="task-summary">
              <h2>Today's Tasks</h2>
              <p>
                {completedTasks}/{totalTasks} Completed
              </p>
            </div>
          </div>
        ) : (
          <div className="welcome">
            <h1>Welcome!</h1>
            <p>Add a task below to get started.</p>
          </div>
        )}
      </div>

      <div className="card">
        <h1 className="todo-title">To-Do List</h1>
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task..."
          />
          <button type="submit" disabled={!newTask.trim()}>
            Add
          </button>
        </form>

        {tasks.length > 0 && (
          <div className="filters">
            <div>
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
              <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Active</button>
              <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
            </div>
            <button className="clear" onClick={handleClearCompleted}>Clear Completed</button>
          </div>
        )}

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one above!</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                />
                <span className={task.completed ? "completed" : ""}>{task.text}</span>
                <button className="delete" onClick={() => handleDeleteTask(task.id)}>
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
