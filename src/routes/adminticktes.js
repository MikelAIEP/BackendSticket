import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { SECRET_JWT } from "../config.js";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

router.post ('/adminticktes/crear', async (req, res) => {
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
    const {titulo, descripcion, estadoid, prioridadid, id_usuario_creacion  } = req.body;
    
    const ticket = await prisma.ticket.create({
        data: {
            titulo,
            descripcion,
            estadoid,
            prioridadid,
            id_usuario_creacion
        }
    });
    res.json("Ticket creado con exito");
} catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error al crear el ticket' });
}
});
/**
 * @swagger
 * /admintickets/crear:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: El título del ticket
 *               descripcion:
 *                 type: string
 *                 description: La descripción del ticket
 *               fecha_solicitud:
 *                 type: string
 *                 format: date-time
 *                 description: La fecha de solicitud del ticket
 *               estadoid:
 *                 type: integer
 *                 description: El ID del estado del ticket
 *               prioridadid:
 *                 type: integer
 *                 description: El ID de la prioridad del ticket
 *               categoriaid:
 *                 type: integer
 *                 description: El ID de la categoría del ticket
 *               id_usuario_creacion:
 *                 type: integer
 *                 description: El ID del usuario que crea el ticket
 *               id_usuario_asignacion:
 *                 type: integer
 *                 description: El ID del usuario asignado al ticket
 *               id_cliente:
 *                 type: integer
 *                 description: El ID del cliente asociado al ticket
 *     responses:
 *       200:
 *         description: Ticket creado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al crear el ticket
 */

router.post('/adminticktes/modificar', async (req, res) => {
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
        const {id_ticket, estadoid, fecha_cierre, prioridadid, categoriaid, id_usuario_asignacion, id_cliente, } = req.body;

        // Ensure fecha_cierre is a valid ISO-8601 DateTime string
        let fechaCierre = fecha_cierre ? new Date(fecha_cierre).toISOString() : null;

        const ticket = await prisma.ticket.update({
            where: {
                id_ticket : id_ticket
            },
            data: {
                estadoid,
                fecha_cierre: fechaCierre,
                prioridadid,
                categoriaid,
                id_usuario_asignacion,
                id_cliente,

            }
        });
        res.json("Ticket modificado con exito");
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error al modificar el ticket'});
    }
});
/**
 * @swagger
 * /admintickets/modificar:
 *   post:
 *     summary: Modificar un ticket existente
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_ticket:
 *                 type: integer
 *                 description: El ID del ticket a modificar
 *               titulo:
 *                 type: string
 *                 description: El título del ticket
 *               descripcion:
 *                 type: string
 *                 description: La descripción del ticket
 *               fecha_solicitud:
 *                 type: string
 *                 format: date-time
 *                 description: La fecha de solicitud del ticket
 *               estadoid:
 *                 type: integer
 *                 description: El ID del estado del ticket
 *               prioridadid:
 *                 type: integer
 *                 description: El ID de la prioridad del ticket
 *               categoriaid:
 *                 type: integer
 *                 description: El ID de la categoría del ticket
 *               id_usuario_creacion:
 *                 type: integer
 *                 description: El ID del usuario que crea el ticket
 *               id_usuario_asignacion:
 *                 type: integer
 *                 description: El ID del usuario asignado al ticket
 *               id_cliente:
 *                 type: integer
 *                 description: El ID del cliente asociado al ticket
 *     responses:
 *       200:
 *         description: Ticket modificado exitosamente
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error al modificar el ticket
 */
export default router;
