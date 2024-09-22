import express from 'express'
import registerRoutes from './routes/register.routes.js'
import loginRoutes from './routes/login.routes.js'
import listarTickets from './routes/listarTickets.js'
import busquedaTicket from './routes/busquedaticket.js'
import adminUsuarios from './routes/adminusuarios.js'
import adminticktes from './routes/adminticktes.js'
import comentarios from './routes/comentarios.js'
import adminclientes from './routes/adminclientes.js'
import swaggerApp from './swagger.js';

const app = express()
app.use(express.json())
app.use(swaggerApp);

app.use('/api', registerRoutes, loginRoutes, listarTickets, busquedaTicket, adminUsuarios, adminticktes, comentarios, adminclientes)

app.listen(3000)
console.log('Server corriendo en http://localhost:3000')  