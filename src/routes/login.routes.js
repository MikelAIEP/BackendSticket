import Router from 'express';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_JWT } from '../config.js'; 
const router = Router();
const prisma = new PrismaClient();

//const bcrypt = new bcrypt();
const saltRounds = 10;

router.post('/login', async (req, res) => {
    try {
    const { nombre_usuario, password } = req.body;
    const user = await prisma.usuario.findUnique({
        where: {
            nombre_usuario: nombre_usuario
        }
    });
    if (!user) {
        return res.status(400).json({ error: 'Usuario o Password Incorrectos' });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Usuario o Password Incorrectos' });
    }
    
    const token = jwt.sign({
        id: nombre_usuario.id,
        nombre_usuario: user.nombre_usuario,
        expiresIn: '1h'
    },
    SECRET_JWT);
    res.cookie('token', token, {
        httpOnly: true    // HttpOnly: no accesible desde JS
    });
    res.json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: El nombre de usuario
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Credenciales inválidas
 */

export default router;