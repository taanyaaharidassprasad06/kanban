import { supabase } from "../lib/supabase";
import type { Task } from "../types/task";

// define fields that can be provided when creating a task
// title is required and the rest is optional
type CreateTaskInput = Pick<Task, "title"> & Partial<Pick<Task, "description" | "status" | "priority" | "due_date">>;

// define the fields that can be updated on an existing task
// all fields are optional
type UpdateTaskInput = Partial<Pick<Task, "title" | "description" | "status" | "priority" | "due_date">>;

// fetch all tasks belonged to the current authenticated user
export async function getTasks(): Promise<Task []> {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    // return data as an array of task objects
    return data as Task[];
}

// create a new task
export async function createTask(task: CreateTaskInput, userId: string): Promise<Task> {
    const { data, error } = await supabase
        .from("tasks") // access tasks table
        .insert({...task, user_id: userId}) // include task properties and owner of task
        .select() // return newly created row
        .single(); // return one object

    if (error) {
        throw error;
    }

    return data as Task;
}

// update existing task
export async function updateTask(taskId: string, updates: UpdateTaskInput): Promise<Task> {
    const { data, error } = await supabase
        .from("tasks")
        .update(updates) // specify properties and values to update
        .eq("id", taskId) // only update row with matching task id
        .select()
        .single()

    if (error) {
        throw error;
    }

    return data as Task;
}

// delete an existing task
export async function deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
        .from("tasks")
        .delete() // delete matching row
        .eq("id", taskId);

    if (error) {
        throw error;
    }
}