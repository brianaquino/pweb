const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;  

//Middleware
app.use(cors());
app.use(express.json());

//Conexion mysql
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'form'
}); 

db.connect((err) => {
    if (err) {
        console.error('Error de conexion a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

//Crear tabla si no existe
const crearTabla= `
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    documento VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100) NOT NULL
)`;


//===============RUTAS (CRUD)=============
//GET - Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios ORDER BY id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json ({ 
                mensaje: 'Error al obtener usuarios',
                error: err.message
            });
        }
        res.json(results);
    });
});

//GET-OBTENER USUARIO POR ID
app.get('/api/usuarios/:id', (req, res) => {
    const sql = 'SELECT * FROM usuarios WHERE id = ?';

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json ({
                mensaje: 'Error al obtener usuario',
                error: err.message
            });
        }   
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    });
});

//POST - Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
    const{ documento, nombre, apellidos, telefono, correo} = req.body;

    //Validacion basica
    if (!documento || !nombre || !apellidos || !telefono || !correo) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });

    }

    const sql = 'INSERT INTO usuarios (documento, nombre, apellidos, telefono, correo) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [documento, nombre, apellidos, telefono, correo], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ mensaje: 'El documento ya existe' });
            }
            return res.status(500).json ({
                mensaje: 'Error al crear usuario',
                error: err.message
            });
        }

        res.status(201).json({
            id: results.insertId,
            documento,
            nombre,
            apellidos,
            telefono,
            correo
        });
    }
    );
});

//DELETE - Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const sql = 'DELETE FROM usuarios WHERE id = ?';    
    db.query(sql, [req.params.id], (err, results) => {   
        if (err) {
            return res.status(500).json ({
                mensaje: 'Error al eliminar usuario',
                error: err.message
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado' });
    });
});

//PUT - Actualizar un usuario
app.put('/api/usuarios/:id', (req, res) => {
    const { documento, nombre, apellidos, telefono, correo} = req.body;

    //Validacion basica
    if (!documento || !nombre || !apellidos || !telefono || !correo) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const sql = 'UPDATE usuarios SET documento = ?, nombre = ?, apellidos = ?, telefono = ?, correo = ?, WHERE id = ?';

    db.query(sql, [documento, nombre, apellidos, telefono, correo, req.params.id], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ mensaje: 'El documento ya existe' });
            }
            return res.status(500).json ({
                mensaje: 'Error al actualizar usuario',
                error: err.message
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({
            id: req.params.id,
            documento,
            nombre,
            apellidos,
            telefono,
            correo,
        });
    });
}   );
//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    //Crear tabla al iniciar el servidor
    db.query(crearTabla, (err) => {
        if (err) {
            console.error('Error al crear la tabla usuarios:', err);
        }
        else {
            console.log('Tabla usuarios creada o ya existe');
        }               
    });
});




