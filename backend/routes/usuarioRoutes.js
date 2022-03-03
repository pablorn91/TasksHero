import express from 'express';
const router = express.Router();
import { registrar } from '../controllers/usuarioController.js';

//Autenticación, registro y confirmación de usuarios
router.post('/', registrar); //Crea un nuevo usuario
 
export default router;