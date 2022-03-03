import express from 'express';
const router = express.Router();
import { registrar, autenticar } from '../controllers/usuarioController.js';

//Autenticación, registro y confirmación de usuarios
router.post('/', registrar); //Crea un nuevo usuario
router.post('/login', autenticar); //autenticar usuario
 
export default router;