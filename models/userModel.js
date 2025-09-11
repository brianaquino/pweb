const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'db_clinica',
  port: 3306
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

// Exportamos la función findUser
const userModel = {
  findUser: (username, password, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        callback([]);
        return;
      }
      callback(results);
    });
  }
};

module.exports = userModel;
