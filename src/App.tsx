import { useState, useEffect } from "react";
import "./App.css";

type Task = {
  title: string;
  description?: string;
  dueDate?: string;
  done: boolean;
};

//utilisation de l'IA pour le local storage
function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    const newTask: Task = {
      title,
      description: description.trim() !== "" ? description : undefined,
      dueDate: dueDate !== "" ? dueDate : undefined,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  const toggleTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTasks(updatedTasks);
  };

  const confirmDelete = (index: number) => {
    setTaskToDelete(index);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    if (taskToDelete !== null) {
      const updatedTasks = [...tasks];
      updatedTasks.splice(taskToDelete, 1);
      setTasks(updatedTasks);
    }
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  const doneCount = tasks.filter((task) => task.done).length;
  const todoCount = tasks.filter((task) => !task.done).length;

  return (
    <div>
      <h1>Bonjour Sébastien 👋</h1>
      <p>Bienvenue dans votre to-do liste</p>
      <div className="counters">
  <p>À faire : {todoCount}</p>
  <p>Faites : {doneCount}</p>
</div>


      <div style={{ border: "1px solid black", padding: "1rem" }}>
        <form onSubmit={addTask}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nouvelle tâche"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {title && <button type="submit">Ajouter</button>}
        </form>

        <ul>
          {tasks.map((task, idx) => (
            <li key={idx}>
              <strong className={task.done ? "done-text" : ""}>
                {task.title}
              </strong>
              {task.description && (
                <span className={task.done ? "done-text" : ""}>
                  {" "}
                  - {task.description}
                </span>
              )}
              {task.dueDate && (
                <span className={task.done ? "done-text" : ""}>
                  {" "}
                  (avant le {task.dueDate})
                </span>
              )}

              <button onClick={() => toggleTask(idx)}>
                {task.done ? "Marquer à faire" : "Marquer faite"}
              </button>
              <button onClick={() => confirmDelete(idx)}>Supprimer</button>
              <span style={{ marginLeft: "10px", fontStyle: "italic" }}>
                {task.done ? "✔️ faite" : "⏳ à faire"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pop-up de confirmation (utilisation de l'IA) */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <p style={{ color: "black" }}>
              Tu veux vraiment supprimer cette tâche ?
            </p>
            <button onClick={handleDelete} style={{ marginRight: "10px" }}>
              Oui
            </button>
            <button onClick={() => setShowConfirm(false)}>Non</button>
          </div>
        </div>
      )}

      <footer>Made with ❤️ by Seb</footer>
    </div>
  );
}

export default App;
