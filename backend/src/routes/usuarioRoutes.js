const express = require('express');
const UsuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.get('/usuarios', UsuarioController.getAll);
router.get('/usuarios/:id', UsuarioController.getById);
router.post('/usuarios', UsuarioController.create);
router.put('/usuarios/:id', UsuarioController.update);
router.delete('/usuarios/:id', UsuarioController.delete);

module.exports = router;