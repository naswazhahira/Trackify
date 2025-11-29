const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',       
    port: 5432,            
    user: 'trackify_user',  
    password: 'password123', 
    database: 'trackify_db'  
});

async function test() {
    try {
        // Tes koneksi
        const client = await pool.connect();
        console.log('Koneksi berhasil!');

        // Tes query sederhana
        const res1 = await client.query('SELECT 1;');
        console.log('Query SELECT 1 result:', res1.rows);

        // Insert data tes
        await client.query(`
            INSERT INTO users(fullname, username, password_hash, pin)
            VALUES('Test User', 'testuser', 'passwordhash', '1234')
            ON CONFLICT (username) DO NOTHING;
        `);
        console.log('Data tes berhasil ditambahkan (jika belum ditambahkan sebelumnya).');

        // Ambil data
        const res2 = await client.query('SELECT * FROM users;');
        console.log('Data di tabel users:', res2.rows);

        client.release();
        pool.end();
    } catch (err) {
        console.error('Koneksi atau query gagal:', err);
    }
}

test();