import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
// const express = require('express'); <<< sintaxis anterior

const app = express();
app.use(express.json()) //habilitar que puesa procesar json correctamente

dotenv.config();

conectarDB();

app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)

const PORT = process.env.PORT || 4000; //revia si existe variable de entorono sino asigna 4000

app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el Puerto: ${PORT}`);
})
