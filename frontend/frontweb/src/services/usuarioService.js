const API_URL = 'http://localhost:3000/api';

export const usuarioService = {
    async getAll() {
        const response = await fetch(`${API_URL}/usuarios`);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        return response.json();
    },

    async getById(id) {
        const response = await fetch(`${API_URL}/usuarios/${id}`);
        if (!response.ok) throw new Error('Error al obtener usuario');
        return response.json();
    },

    async create(usuario) {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al crear usuario');
        }
        return response.json();
    },

    async update(id, usuario) {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al actualizar usuario');
        }
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar usuario');
        return response.json();
    }
};