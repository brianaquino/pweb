const UsuarioModel = require('../models/usuarioModel');

class UsuarioController {
    static async getAll(req, res) {
        try {
            const usuarios = await UsuarioModel.getAll();
            res.json(usuarios);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                mensaje: 'Error al obtener usuarios',
                error: err.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const usuario = await UsuarioModel.getById(req.params.id);
            
            if (!usuario) {
                return res.status(404).json({ 
                    mensaje: 'Usuario no encontrado' 
                });
            }
            
            res.json(usuario);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                mensaje: 'Error al obtener usuario',
                error: err.message
            });
        }
    }

    static async create(req, res) {
        try {
            const { documento, nombre, apellidos, telefono, correo } = req.body;

            if (!documento || !nombre || !apellidos || !telefono || !correo) {
                return res.status(400).json({ 
                    mensaje: 'Faltan datos obligatorios' 
                });
            }

            const existe = await UsuarioModel.existsByDocumento(documento);
            if (existe) {
                return res.status(400).json({ 
                    mensaje: 'El documento ya existe' 
                });
            }

            const insertId = await UsuarioModel.create(req.body);
            
            res.status(201).json({
                mensaje: 'Usuario creado exitosamente',
                usuario: {
                    id: insertId,
                    documento,
                    nombre,
                    apellidos,
                    telefono,
                    correo
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                mensaje: 'Error al crear usuario',
                error: err.message
            });
        }
    }

    static async update(req, res) {
        try {
            const { documento, nombre, apellidos, telefono, correo } = req.body;

            if (!documento || !nombre || !apellidos || !telefono || !correo) {
                return res.status(400).json({ 
                    mensaje: 'Faltan datos obligatorios' 
                });
            }

            const existe = await UsuarioModel.existsByDocumento(documento, req.params.id);
            if (existe) {
                return res.status(400).json({ 
                    mensaje: 'El documento ya existe en otro usuario' 
                });
            }

            const affectedRows = await UsuarioModel.update(req.params.id, req.body);
            
            if (affectedRows === 0) {
                return res.status(404).json({ 
                    mensaje: 'Usuario no encontrado' 
                });
            }

            res.json({
                mensaje: 'Usuario actualizado exitosamente',
                usuario: {
                    id: req.params.id,
                    documento,
                    nombre,
                    apellidos,
                    telefono,
                    correo
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                mensaje: 'Error al actualizar usuario',
                error: err.message
            });
        }
    }

    static async delete(req, res) {
        try {
            const affectedRows = await UsuarioModel.delete(req.params.id);
            
            if (affectedRows === 0) {
                return res.status(404).json({ 
                    mensaje: 'Usuario no encontrado' 
                });
            }

            res.json({ 
                mensaje: 'Usuario eliminado exitosamente' 
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                mensaje: 'Error al eliminar usuario',
                error: err.message
            });
        }
    }
}

module.exports = UsuarioController;