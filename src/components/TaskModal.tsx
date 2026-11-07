import { useState } from "react";
import type { SubmitEvent } from "react";
import type { TaskPriority } from "../types/task";

interface TaskModalProps {
    onAdd: (newTask: {
        title: string;
        description: string;
        priority: TaskPriority;
        due_date: string | null;
    }) => void;
    onClose: () => void;
}

function TaskModal({ onAdd, onClose }: TaskModalProps) {
    const [title, setTitle] = useState<string>("");
    const [priority, setPriority] = useState<TaskPriority>("normal");
    const [description, setDescription] = useState<string>("");
    const [due, setDue] = useState<string>("");

    // handle submitting the new task form
    function handleSave(e: SubmitEvent<HTMLFormElement>) {
        // prevent browser from refreshing page
        e.preventDefault();

        console.log("Selected due date:", due);
        
        const taskTitle = title.trim();
        
        // create task if title is not empty
        if(taskTitle) {
            onAdd({
                title: taskTitle,
                description: description.trim(),
                priority,
                due_date: due || null
            });
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}> {/* stopPropagtion prevents modal closing when inside modal is clicked */}
                <h2>New Task</h2>
                <form onSubmit={handleSave}>
                    <fieldset>
                        <div className="task-field">
                            <label className="task-label">Title</label>
                            <input className="task-input" type="text" required value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </div>
                        <div className="task-field">
                            <label className="task-label">Description</label>
                            <textarea
                                className="task-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="task-field">
                            <label className="task-label">Due Date</label>
                            <input className="task-input" type="date" value={due} onChange={(e) => setDue(e.target.value)}/>
                        </div>
                        <div className="task-field">
                            <label className="task-label">Priority</label>
                            <div className="priority-btn-container">
                                <button className={`priority-btn ${priority === "low" ? "priority-selected" : ""}`} type="button" onClick={() => setPriority("low")}>Low</button>
                                <button className={`priority-btn ${priority === "normal" ? "priority-selected" : ""}`} type="button" onClick={() => setPriority("normal")}>Normal</button>
                                <button className={`priority-btn ${priority === "high" ? "priority-selected" : ""}`} type="button" onClick={() => setPriority("high")}>High</button>
                            </div>
                        </div>
                    </fieldset>
                    <div className="modal-btn-container">
                        <button className="modal-btn" type="button" onClick={onClose}>Cancel</button>
                        <button className="modal-btn create-task-btn" type="submit">Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;