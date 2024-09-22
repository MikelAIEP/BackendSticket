import Router from 'express';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import validateuser from '../services/validateuser.js';

const router = Router();
const prisma = new PrismaClient();

//const bcrypt = new bcrypt();
const saltRounds = 10;


router.post('/register', async (req, res) => {
    const {nombre, apellido, email, nombre_usuario, password, rol, estado } = req.body;

    const existe = await validateuser(nombre_usuario);
    if (existe === 'true') {
        return res.status(400).json({ error: 'El usuario ya existe' });
    } else {
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
            res.json({nombre, apellido, email, nombre_usuario,passwordHash, rol, estado });
        }
    
    
    
});
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
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
 *               estado:
 *                 type: string
 *                 description: El estado del usuario
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud
 */













export default router;



