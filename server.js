const jsonServer    = require("json-server")
const server        = jsonServer.create()
const router        = jsonServer.router("db.json")

// Documentação Swagger
const swaggerUi     = require('swagger-ui-express');
const swaggerDoc    = require('./swagger.json'); // Arquivo de documentação Swagger
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const port = 3000;

server.db = router.db
server.use(router)

server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", "JSON Server executando na porta: " + port)
    console.log("\x1b[1m%s\x1b[0m", "\nRecursos disponíveis: \n")
    console.log("http://localhost:3000/swagger \n")
    Object.keys(router.db.__wrapped__).forEach( recurso => console.log(`http://localhost:${port}/${recurso}`) )
})