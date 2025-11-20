const mysql = require('mysql2/promise');

let pool; // Variável para armazenar o pool de conexões

//Configurações de Conexão
const dbConfig = {
    // Estas configurações DEVEM ser lidas do .env para segurança 
    host:'localhost',
    user:'root',
    password:'MatheusRyan05@',
    database:'taskflow_db', 
    waitForConnections: true,
    connectionLimit: 10, // Define o número máximo de conexões no pool
    queueLimit: 0
};

async function connectDB() {
    try {
        pool = mysql.createPool(dbConfig); 
        console.log('Conectado ao MySQL e Pool criado!');
        
        // Garante a criação da tabela tasks
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                status BOOLEAN NOT NULL DEFAULT 0,
                creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                due_date DATE NOT NULL
            );
        `);
        console.log('Tabela tasks verificada/criada.');
    } catch (error) {
        console.error('Falha ao conectar ou inicializar o BD:', error.message);
        console.error('VERIFIQUE: O servidor MySQL está rodando e o banco taskflow_db existe?');
        process.exit(1); 
    }
}

async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

connectDB();

module.exports = {
    query
};