-- Hapus terlebih dahulu database lama agar tidak bentrok
DROP DATABASE IF EXISTS trackify_db;
DROP USER IF EXISTS trackify_user;

-- Buat user dan database
CREATE USER trackify_user WITH PASSWORD 'password123';
CREATE DATABASE trackify_db OWNER trackify_user;

-- Berikan hak akses
GRANT ALL PRIVILEGES ON DATABASE trackify_db TO trackify_user;

-- Pindahkan koneksi ke database trackify_db

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


