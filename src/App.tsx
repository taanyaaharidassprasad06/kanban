import { useEffect, useState } from "react";
import { initializeGuest } from "./services/authService";
import type { User } from "@supabase/supabase-js";
import Board from "./components/Board";
import './App.css';

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [theme, setTheme] = useState<string>("blue");

	// initialize guest session when app first loads
	useEffect(() => {
		// retrieve guest user
		async function setUpAuth() {
			try {
				const guest = await initializeGuest();
				setUser(guest);
			} catch (error) {
				setError("Failed to initialize guest session.");
				console.error(error);
			} finally {
				setLoading(false);
			}
		}

		setUpAuth();
	}, []);

	if (loading) {
		return <p>Initializing guest session. Please wait one moment.</p>;
	}

	if (error || !user) {
		return <p>{error ?? "Unable to initialize guest session."}</p>;
	}
	
	return (
		<div className="app" data-theme={theme}>
			<Board userId={user.id} onThemeChange={setTheme}/>
		</div>
	);
}

export default App;