-- Create optimizations table
CREATE TABLE IF NOT EXISTS optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_prompt TEXT NOT NULL,
    optimized_prompt TEXT NOT NULL,
    improvement_score INT,
    improvements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) if needed, for now public access for simpler local dev
ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON optimizations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON optimizations FOR INSERT WITH CHECK (true);
