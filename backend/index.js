import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
// const express = require('express'); <<< sintaxis anterior

const app = express();

dotenv.config();

conectarDB();

const PORT = process.env.PORT || 4000; //revia si existe variable de entorono sino asigna 4000

app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el Puerto: ${PORT}`);
})
