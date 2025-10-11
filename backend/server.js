require('dotenv').config();
const app = require('./src/app');
const { testConnection, initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await testConnection();
        await initDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📍 http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
};

startServer();