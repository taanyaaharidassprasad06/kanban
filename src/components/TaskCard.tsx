import type { Task } from "../types/task";

interface TaskCardProps {
    task: Task;
    onDragStart: (taskId: string) => void;
    onSelectTask: (task: Task) => void;
}

function TaskCard({ task, onDragStart, onSelectTask }: TaskCardProps) {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
        <div
            className={`task-card ${
            task.due_date &&
            task.due_date < todayString &&
            task.status !== "done"
                ? "overdue"
                : ""
        }`}
            draggable
            onDragStart={() => onDragStart(task.id)}
            onClick={() => onSelectTask(task)}
        >
            <p>{task.title}</p>
            <div className="task-info">
                <p className={`task-priority ${task.priority}`}>
                    {task.priority.toUpperCase()}
                </p>
            {task.due_date && (
                <p className="task-date">
                    {new Date(task.due_date + "T00:00:00").toLocaleDateString()}
                </p>
            )}
            </div>
        </div>
    );
}

export default TaskCard;