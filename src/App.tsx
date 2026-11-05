import { useEffect, useState } from "react";
import { initializeGuest } from "./services/authService";
import type { User } from "@supabase/supabase-js";
import type { Task } from "./types/task";
import { getTasks } from "./services/taskService";

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		async function setUpAuth() {
			try {
				const guest = await initializeGuest();
				setUser(guest);

				const userTasks = await getTasks();
				setTasks(userTasks);
			} catch (error) {
				setError("Failed to initialize guest session or fetch tasks.");
				console.error(error);
			} finally {
				setLoading(false);
			}
		}

		setUpAuth();
	}, []);
	
	return (
		<div>
			{loading && <p>Initializing guest session. Please wait one moment.</p>}
			{error && <p>{error}</p>}
			<div>
				<h1>Kanban Board</h1>
				<p>Guest ID: {user?.id}</p>
				<div>
					<h2>My Tasks</h2>
					{tasks.length === 0 ? (
						<p>No tasks yet.</p>
					) : (
						tasks.map((task) => (
							<div key={task.id}>
								<h3>{task.title}</h3>
								<p>{task.description}</p>
								<p>Status: {task.status}</p>
								<p>Priority: {task.priority}</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default App;