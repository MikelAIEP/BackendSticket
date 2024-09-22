import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function validateuser(nombre_usuario) {
    const validateuser = await prisma.usuario.findUnique({
        where: {
            nombre_usuario: nombre_usuario
        }
    });

    if (validateuser) {
        return 'true';
    } else {
        return 'false';
    }
    
}

export default validateuser;
