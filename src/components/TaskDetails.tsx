import { useState } from "react";
import type { SubmitEvent } from "react";
import type { Task, TaskPriority } from "../types/task";

interface TaskDetailsProps {
    task: Task;
    onClose: () => void;
    onUpdate: (
        taskId: string,
        updates: Partial<Pick<Task, "title" | "description" | "priority" | "due_date">>
    ) => Promise<void>;
    onDelete: (taskId: string) => Promise<void>;
}

function TaskDetails({ task, onClose, onUpdate, onDelete }: TaskDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [priority, setPriority] = useState<TaskPriority>(task.priority);
    const [dueDate, setDueDate] = useState(task.due_date ?? "");

    // handle submitting the edited form
    async function handleSave(e: SubmitEvent<HTMLFormElement>) {
        // prevent browser from refreshing page
        e.preventDefault();

        // send updated task information to parent component
        await onUpdate(task.id, {
            title: title.trim(),
            description: description.trim() || null,
            priority,
            due_date: dueDate || null
        });

        setIsEditing(false);
    }

    async function handleDelete() {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await onDelete(task.id);
        }
    }

    return (
        <div className="details-overlay" onClick={onClose}>
            <div className="details-panel" onClick={(e) => e.stopPropagation()}>
                <div className="details-header">
                    <h2>Task Details</h2>
                    <button onClick={onClose}>X</button>
                </div>
                {isEditing ? (
                    <form onSubmit={handleSave}>
                        <div className="task-field">
                            <label className="task-label">Title</label>
                            <input
                                className="task-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
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
                            <input
                                className="task-input"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                        <div className="task-field">
                            <label className="task-label">Priority</label>
                            <select
                                className="task-input"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </form>
                ) : (
                    <div className="details-content">
                        <h3>{task.title}</h3>
                        <div className="details-field">
                            <h4>Description</h4>
                            <p>{task.description || "No description provided."}</p>
                        </div>
                        <div className="details-field">
                            <h4>Priority</h4>
                            <p>{task.priority}</p>
                        </div>
                        <div className="details-field">
                            <h4>Due Date</h4>
                            <p>{task.due_date || "No due date"}</p>
                        </div>
                        <div className="details-field">
                            <h4>Created</h4>
                            <p>{new Date(task.created_at).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)}>Edit Task</button>
                        <button onClick={handleDelete}>Delete Task</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskDetails;
