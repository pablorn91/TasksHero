import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
// const express = require('express'); <<< sintaxis anterior

const app = express();
app.use(express.json()) //habilitar que puesa procesar json correctamente

dotenv.config();

conectarDB();

//configurar CORS para acceder al backend
const whiteList = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback) {
        if (whiteList.includes(origin)) {
            //puede consultar la appi
            callback(null, true)
        } else {
            callback(new Error('Error de Cors'))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.PORT || 4000; //revia si existe variable de entorono sino asigna 4000

app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el Puerto: ${PORT}`);
})
