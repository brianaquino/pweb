const { pool } = require('../config/database');

class UsuarioModel {
    static async getAll() {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios ORDER BY id DESC'
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async create(usuarioData) {
        const { documento, nombre, apellidos, telefono, correo } = usuarioData;
        const [result] = await pool.query(
            'INSERT INTO usuarios (documento, nombre, apellidos, telefono, correo) VALUES (?, ?, ?, ?, ?)',
            [documento, nombre, apellidos, telefono, correo]
        );
        return result.insertId;
    }

    static async update(id, usuarioData) {
        const { documento, nombre, apellidos, telefono, correo } = usuarioData;
        const [result] = await pool.query(
            'UPDATE usuarios SET documento = ?, nombre = ?, apellidos = ?, telefono = ?, correo = ? WHERE id = ?',
            [documento, nombre, apellidos, telefono, correo, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    }

    static async existsByDocumento(documento, excludeId = null) {
        let query = 'SELECT id FROM usuarios WHERE documento = ?';
        let params = [documento];
        
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        
        const [rows] = await pool.query(query, params);
        return rows.length > 0;
    }
}

module.exports = UsuarioModel;