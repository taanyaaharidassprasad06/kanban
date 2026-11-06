import type { Task } from "../types/task";

interface TaskCardProps {
    task: Task;
    onDragStart: (taskId: string) => void;
    onSelectTask: (task: Task) => void;
}

function TaskCard({ task, onDragStart, onSelectTask }: TaskCardProps) {
    return (
        <div
            className="task-card"
            draggable
            onDragStart={() => onDragStart(task.id)}
            onClick={() => onSelectTask(task)}
        >
            <p>{task.title}</p>
            <div className="task-info">
                <p className="task-date">{task.due_date}</p>
                <p className={`task-priority ${task.priority}`}>
                    {task.priority}
                </p>
            </div>
        </div>
    );
}

export default TaskCard;