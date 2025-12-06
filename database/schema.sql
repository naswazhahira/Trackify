-- Init schema for Trackify in current database (POSTGRES_DB)
-- Assumes DB and user are created by container env vars.

-- Buat struktur tabel (entitas)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin VARCHAR(100) NOT NULL,
    profile_picture_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Silakan tambahkan tabel (entitas) serta relasi yang dibuat mengikuti format sebelumnya.

/* Jika ingin tambahkan isi untuk cek langsung (opsional), dapat masukkan langsung value. Misal:

INSERT INTO users (fullname, username, password_hash, pin, profile_picture_url, created_at, updated_at)
VALUES ('Kartono Budiman', 'KartonoBd', '$2b$10$b7y.PnXZxIsuQfA6qtsBUORe5tYx7CseDi9Nw97vmMl2KH3vvKdee', '$2b$10$iWv41pmWKw/eQyHJEnKrV.vnnEDhX9Tiq.yhPFy.BcPckYQl9izl6', null, '2025-11-29 21:25:05.13699', '2025-11-29 21:25:05.13699')
ON CONFLICT DO NOTHING; 

*/

 CREATE TABLE  IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    daily_target_time TIME NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    goal_id INT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_study_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_study_sessions_goal FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

CREATE TABLE  IF NOT EXISTS daily_summaries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    summary_date DATE NOT NULL,
    total_study_time_seconds INT DEFAULT 0,
    goals_completed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_daily_summaries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_date UNIQUE (user_id, summary_date)
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    category VARCHAR(50) DEFAULT 'kuliah',
    status VARCHAR(20) DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key constraint
    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Tabel folders
CREATE TABLE IF NOT EXISTS repository_folders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    folder_name VARCHAR(255) NOT NULL,
    color VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel files
CREATE TABLE IF NOT EXISTS repository_files (
    id SERIAL PRIMARY KEY,
    folder_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (folder_id) REFERENCES repository_folders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_folders_user ON repository_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_files_folder ON repository_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_files_user ON repository_files(user_id);

-- Trigger untuk update otomatis updated_at di folders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_folders_updated_at
    BEFORE UPDATE ON repository_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
