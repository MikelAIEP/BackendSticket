import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { SECRET_JWT } from "../config.js";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

router.get('/listarTickets', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, SECRET_JWT);
        console.log(payload.nombre_usuario);
        if (Date.now() >= payload.exp) {
            return res.status(401).json({ error: 'Token expirado' });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Token invalido' });
    }

    try {
        const tickets = await prisma.ticket.findMany({
            include: {
            Comentario: {
                select: {
                detalle: true
                }
            }
            }
        });
        res.json(tickets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al listar los tickets' });
    }
});
/**
 * @swagger
 * /listarTickets:
 *   get:
 *     summary: Listar todos los tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   fecha_solicitud:
 *                     type: string
 *                     format: date-time
 *                   fecha_cierre:
 *                     type: string
 *                     format: date-time
 *                   estadoid:
 *                     type: integer
 *                   prioridadid:
 *                     type: integer
 *                   categoriaid:
 *                     type: integer
 *                   id_usuario_creacion:
 *                     type: integer
 *                   id_usuario_asignacion:
 *                     type: integer
 *                   id_cliente:
 *                     type: integer
 *                   Comentario:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         detalle:
 *                           type: string
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al listar los tickets
 */





















export default router;