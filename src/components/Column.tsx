import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../types/task";

interface ColumnProps {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    onDrop: (newStatus: TaskStatus) => void;
    onDragStart: (taskId: string) => void;
    onSelectTask: (task: Task) => void;
}

function Column({ id, title, tasks, onDrop, onDragStart, onSelectTask }: ColumnProps) {
    return (
        <div
            className="columns"
            onDragOver={(e) => e.preventDefault()} // by default dropping is not allowed so preventDefault() enables dropping
            onDrop={() => onDrop(id)} // calls onDrop() passed from parent so this is what updates the status of the task when task is dragged and dropped into a new column
        >
            <div className={`col-info ${id}`}>
                <h3 className="col-name">{title}</h3>
                <p className="task-amt">{tasks.length}</p>
            </div>
            <div className="task-list">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onDragStart={onDragStart} onSelectTask={onSelectTask}/>
                ))}
            </div>
        </div>
    );
}

export default Column;