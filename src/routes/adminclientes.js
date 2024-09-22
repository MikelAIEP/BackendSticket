import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { SECRET_JWT } from "../config.js";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

router.post('/clientes/crear', async (req, res) => {
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
        const {nombre, apellido, email} = req.body;
        const cliente = await prisma.clientes.create({
            data: {
                nombre,
                apellido,
                email
            }
        });
        res.json("Cliente creado con exito");
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error al crear el cliente', error });
    }
});
/**
 * @swagger
 * /clientes/crear:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error en la solicitud
 */

router.get('/clientes/listar', async (req, res) => {
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
        const clientes = await prisma.clientes.findMany();
        res.json(clientes);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error al listar los clientes', error });
    }
});
/**
 * @swagger
 * /clientes/listar:
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
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
 *                   email:
 *                     type: string
 *                   telefono:
 *                     type: string
 */

router.post('/clientes/actualizar/', async (req, res) => {
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
        const {id, nombre, apellido, email} = req.body;
        const cliente = await prisma.clientes.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nombre,
                apellido,
                email
            }
        });
        res.json("Cliente actualizado con exito");
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error al actualizar el cliente', error });
    }
});
/**
 * @swagger
 * /clientes/actualizar:
 *   post:
 *     summary: Actualizar un cliente existente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */

router.delete('/clientes/eliminar/', async (req, res) => {
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
        const {id} = req.body;
        const cliente = await prisma.clientes.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json("Cliente eliminado con exito");
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error al eliminar el cliente', error });
    }
});
/**
 * @swagger
 * /clientes/eliminar:
 *   delete:
 *     summary: Eliminar un cliente existente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
export default router;