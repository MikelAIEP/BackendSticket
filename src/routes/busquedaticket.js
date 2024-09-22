import { PrismaClient } from "@prisma/client";
import { query, Router } from "express";
import { SECRET_JWT } from "../config.js";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();


router.get('/buscarticket', async (req, res) => {   
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
    
    // Aquí se busca el ticket
    const searchValue = req.body.searchValue; 
    //console.log(searchValue);

    // Si no se envía un valor de búsqueda o tiene menos de 4 caracteres, se retorna un error
    try {
        if (!searchValue) {
            return res.status(400).json({ message: 'Debes ingresar algun valor de búsqueda' });
        }
        if (!isNaN(searchValue)) {
            let parsesearchValue = parseInt(searchValue);
            const tickets = await prisma.ticket.findUnique({
                where: {
                    id_ticket: parsesearchValue
                }
            });
            if (!tickets) {
                return res.status(404).json({ message: 'No se encontraron tickets' });
            }
            res.json(tickets);
        } else {
            const tickets = await prisma.ticket.findMany({
                where: {
                    OR: [
                        {
                            titulo: {
                                contains: searchValue
                            }
                        },
                        {
                            descripcion: {
                                contains: searchValue
                            }
                        }
                    ]
                }
            });
            if (tickets.length === 0) {
                return res.status(404).json({ message: 'No se encontraron tickets' });
            }
            res.json(tickets);
        }

        // Enviar los resultados como respuesta
        
    } catch (error) {
        //console.error('Error al buscar tickets:', error);
        res.status(500).json({ message: 'Error al buscar tickets.' });
    }
});
/**
 * @swagger
 * /buscarticket:
 *   get:
 *     summary: Buscar tickets por valor de búsqueda
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: El valor de búsqueda para encontrar tickets (puede ser números o texto)
 *     responses:
 *       200:
 *         description: Lista de tickets encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_ticket:
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
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: No se encontraron tickets
 *       500:
 *         description: Error al buscar tickets
 */

export default router;