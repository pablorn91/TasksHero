import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
// const express = require('express'); <<< sintaxis anterior

const app = express();

dotenv.config();

conectarDB();

console.log(process.env.HOLA)

app.listen(4000, () => {
    console.log('Servidor Corriendo en el Puerto');
})
