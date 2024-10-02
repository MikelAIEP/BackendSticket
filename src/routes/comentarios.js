import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { SECRET_JWT } from "../config.js";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

router.post('/comentarios/crear', async (req, res) => {
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
    try {
        const {tipo, detalle, id_ticket, id_usuario, fecha_comentario} = req.body;
                
        const comentario = await prisma.comentario.create({
            data: {
                tipo,
                detalle,
                id_ticket,
                id_usuario
            }
        });
        res.json("Comentario creado con exito");
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error al crear el comentario', error });
    }
});
/**
 * @swagger
 * /comentarios/crear:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: El tipo de comentario
 *               detalle:
 *                 type: string
 *                 description: El detalle del comentario
 *               id_ticket:
 *                 type: integer
 *                 description: El ID del ticket asociado
 *               id_usuario:
 *                 type: integer
 *                 description: El ID del usuario que crea el comentario
 *               
 *     responses:
 *       200:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token inválido o expirado
 */
export default router;