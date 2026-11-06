import { useEffect, useState } from "react";
import Column from "./Column";
import TaskModal from "./TaskModal";
import TaskDetails from "./TaskDetails";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import type { Task, TaskStatus, TaskPriority } from "../types/task";

const cols: { id: TaskStatus; label: string }[] = [
    { id: "todo", label: "To Do" },
    { id: "in_progress", label: "In Progress" },
    { id: "in_review", label: "In Review" },
    { id: "done", label: "Done" },
];

interface BoardProps {
    userId: string;
}

function Board({ userId }: BoardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [dragId, setDragId] = useState<string | null>(null); // stores which task is currently being dragged
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // fetch user tasks when the board first loads
    useEffect(() => {
        async function fetchTasks() {
            try {
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        }

        fetchTasks();
    }, []);

    // update task status when it is dropped into another column
    async function handleDrop(newStatus: TaskStatus) {
        if(!dragId) {
            return;
        }

        try {
            // update task status in Supbase
            const updatedTask = await updateTask(dragId, { status: newStatus });
            
            // update task status in state
            setTasks(tasks.map((task) => task.id === dragId ? updatedTask : task));
        } catch (error) {
            console.error("Failed to update task:", error);
        }

        setDragId(null);
    }

    // create new task and save it to Supabase
    async function addTask(newTask: {
        title: string;
        description: string;
        priority: TaskPriority;
        due_date: string | null;
    }) {
        try {
            const createdTask = await createTask({
                ...newTask,
                status: "todo"
            }, userId);

            setTasks([...tasks, createdTask]);
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    }

    // update existing task's information
    async function handleUpdate(
        taskId: string,
        updates: Partial<Pick<Task, "title" | "description" | "priority" | "due_date">>
    ) {
        try {
            const updatedTask = await updateTask(taskId, updates);

            // replace old task with the updated task in state
            setTasks(tasks.map((task) => task.id === taskId ? updatedTask : task));

            setSelectedTask(updatedTask);
        } catch (error) {
            console.error("Failed to update task:", error);
            throw error;
        }
    }

    // delete task from Supabase and remove it from board
    async function handleDelete(taskId: string) {
        try {
            await deleteTask(taskId);

            // remove the deleted task from state
            setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

            setSelectedTask(null);
        } catch (error) {
            console.error("Failed to delete task:", error);
            throw error;
        }
    }

    return (
        <div>
            <div>
                <div className="kanban-board">
                    <h1>Kanban Board</h1>
                    <button className="add-task-btn" onClick={() => setModalOpen(!modalOpen)}>+ New Task</button>
                </div>
                {modalOpen && <TaskModal onAdd={addTask} onClose={() => setModalOpen(false)}/>}
                <div className="kanban">
                    {cols.map((col) => (
                        <Column key={col.id} id={col.id} title={col.label} tasks={tasks.filter((task) => task.status === col.id)} onDrop={handleDrop} onDragStart={setDragId} onSelectTask={setSelectedTask}/>
                    ))}
                </div>
            </div>
            <div>
                {selectedTask && (
                    <TaskDetails
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                )}
            </div>
            
        </div>
    );
}

export default Board;