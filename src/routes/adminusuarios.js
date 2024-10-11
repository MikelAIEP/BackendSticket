import { PrismaClient } from "@prisma/client";
import { query, Router } from "express";
import { SECRET_JWT } from "../config.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validateuser from '../services/validateuser.js';

const router = Router();
const prisma = new PrismaClient();
//const bcrypt = new bcrypt();
const saltRounds = 10;

router.get('/adminusuarios/listar', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, SECRET_JWT);
        //console.log(payload.nombre_usuario);
        if (Date.now() >= payload.exp * 100) { // Asegurarse de que exp esté en milisegundos
            return res.status(401).json({ error: 'Token expirado' });
        }
    } catch (error) {
        //console.log(error);
        return res.status(401).json({ error: 'Token invalido' });
    }
    
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
});
/**
 * @swagger
 * /adminusuarios/listar:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   email:
 *                     type: string
 *                   nombre_usuario:
 *                     type: string
 *                   rol:
 *                     type: string
 *                   estado:
 *                     type: string
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al listar los usuarios
 */
router.post('/adminusuarios/crear', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, SECRET_JWT);
        //console.log(payload.nombre_usuario);
        if (Date.now() >= payload.exp * 100) { // Asegurarse de que exp esté en milisegundos
            return res.status(401).json({ error: 'Token expirado' });
        }
    } catch (error) {
        //console.log(error);
        return res.status(401).json({ error: 'Token invalido' });
    }

    const {nombre, apellido, email, nombre_usuario, password, rol, estado } = req.body;
    const existe = await validateuser(nombre_usuario);
    if (existe === 'true') {
        return res.status(400).json({ error: 'El usuario ya existe' });
    } else {
        try {
            const passwordHash = bcrypt.hashSync(password, saltRounds);
            const user = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                email,
                nombre_usuario,
                password: passwordHash,
                rol,
                estado
            }
            });
            res.json("Usuario creado con exito");
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
        }
    
});
/**
 * @swagger
 * /adminusuarios/crear:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: El nombre del usuario
 *               apellido:
 *                 type: string
 *                 description: El apellido del usuario
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *               nombre_usuario:
 *                 type: string
 *                 description: El nombre de usuario
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *               rol:
 *                 type: string
 *                 description: El rol del usuario
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al crear el usuario
 */









export default router;