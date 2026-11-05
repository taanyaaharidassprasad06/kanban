CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    title TEXT NOT NULL,
    
    description TEXT,

    status TEXT NOT NULL DEFAULT 'todo'
        CHECK (status IN ('todo', 'in_progress', 'in_review', 'done')),

    priority TEXT NOT NULL DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high')),

    due_date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own tasks
CREATE POLICY "Users can manage their own tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Improve queries that filter by user and status
CREATE INDEX idx_tasks_user_status
ON public.tasks(user_id, status);

-- Grant authenticated users permission to perform CRUD operations
GRANT SELECT, INSERT, UPDATE, DELETE
ON public.tasks
TO authenticated;