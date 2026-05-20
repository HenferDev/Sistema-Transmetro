const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root",
    password: "hendia561", // 
    database: "transmetro_db"
});

// Probar conexión
db.connect((err) => {
    if (err) {
        console.log("Error de conexión:", err);
        return;
    }
    console.log("Conectado a MySQL 🚀");
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor Transmetro funcionando 🚍");
});

app.listen(3306, () => {
    console.log("Servidor corriendo en puerto 3000");
});