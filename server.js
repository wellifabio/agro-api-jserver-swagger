const jsonServer = require("json-server")
const path = require("path")
const fs = require("fs")
const express = require("express")
const multer = require("multer")
const auth = require("json-server-auth")
const cors = require("cors")

const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

const swaggerUi = require('swagger-ui-express');// Documentação Swagger
const swaggerDoc = require('./swagger.json'); // Arquivo de documentação Swagger
server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const ip = "localhost";
const port = 3000;

//Upload de imagens
let imagem = ""
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"))
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"))
    },
    filename: (req, file, cb) => {
        imagem = Date.now() + (path.extname(file.originalname) || ".jpg")
        cb(null, imagem)
    }
})

let upload = multer({ storage })
server.use(cors())
server.use("/static", express.static(path.join(__dirname, "uploads")))
server.use(upload.any())

server.use((req, res, next) => {
    if (req.method === "POST") {
        req.body = { ...req.body, arquivo: imagem }
    }
    if (imagem !== "") {
        req.body = { ...req.body, arquivo: imagem }
    }
    next();
})

//Rota para receber imagem
server.post("/imgs", (req, res) => {
    res.json({ arquivo: imagem })
    imagem = "";
})

// Você pode definir diferentes níveis de acesso para diferentes endpoints aqui.
const rules = auth.rewriter({
    "/users*": "/660/users",
    "/animais*": "/660/animais",
});

server.use(rules);
server.use(auth);
server.db = router.db
server.use(router)

server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", "JSON Server executando em: " + ip + ":" + port)
    console.log("\x1b[1m%s\x1b[0m", "\nRecursos disponíveis: \n")
    console.log(`\nhttp://${ip}:${port}/swagger`);
    console.log(`http://${ip}:${port}/imgs`);
    console.log(`http://${ip}:${port}/static\n`);
    Object.keys(router.db.__wrapped__).forEach(recurso => console.log(`http://${ip}:${port}/${recurso}`))
})