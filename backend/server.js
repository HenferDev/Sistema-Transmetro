require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MySQL

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {

    if (err) {

        console.log(
            "Error de conexión:",
            err
        );

        return;
    }

    console.log(
        "Conectado a MySQL 🚀"
    );
});

// Ruta principal

app.get("/", (req, res) => {

    res.send(
        "Servidor Transmetro funcionando 🚍"
    );
});

// Verificar conexión con MySQL

app.get("/test-db", (req, res) => {

    db.query(
        "SELECT 1",
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).send(
                    "Error conectando a MySQL"
                );
            }

            res.send(
                "Conectado a MySQL correctamente"
            );
        }
    );
});

// Login

app.post("/login", (req, res) => {

    const {
        nombre,
        password
    } = req.body;

    const sql = `
        SELECT *
        FROM usuario
        WHERE nombre = ?
        AND password = ?
    `;

    db.query(
        sql,
        [nombre, password],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: "Error login"
                });
            }

            if (results.length > 0) {

                res.json({
                    success: true,
                    usuario: results[0]
                });

            } else {

                res.json({
                    success: false,
                    mensaje:
                    "Credenciales incorrectas"
                });
            }
        }
    );
});


// =====================================================
// GET - OBTENER BUSES
// =====================================================

app.get("/buses", (req, res) => {

    const sql = `
    SELECT

        b.id_bus,
        b.placa,
        b.capacidad_maxima,
        b.estado,

        b.id_linea,
        b.id_parqueo,
        b.id_piloto,

        l.nombre AS linea,
        p.ubicacion AS parqueo,
        pi.nombre AS piloto

    FROM bus b

    LEFT JOIN linea l
        ON b.id_linea = l.id_linea

    LEFT JOIN parqueo p
        ON b.id_parqueo = p.id_parqueo

    LEFT JOIN piloto pi
        ON b.id_piloto = pi.id_piloto
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error: "Error obteniendo buses"
            });
        }

        res.json(results);
    });
});

// =====================================================
// POST - CREAR BUS
// =====================================================

app.post("/buses", (req, res) => {

    const {
        placa,
        capacidad_maxima,
        estado,
        id_linea,
        id_parqueo,
        id_piloto
    } = req.body;

    const sql = `
        INSERT INTO bus (
            placa,
            capacidad_maxima,
            estado,
            id_linea,
            id_parqueo,
            id_piloto
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            placa,
            capacidad_maxima,
            estado,
            id_linea,
            id_parqueo,
            id_piloto
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando bus"
                });
            }

            res.json({
                mensaje:"Bus creado correctamente"
            });
        }
    );
});

// =====================================================
// PUT - ACTUALIZAR BUS
// =====================================================

app.put("/buses/:id", (req, res) => {

    const { id } = req.params;

    const {
        placa,
        capacidad_maxima,
        estado,
        id_linea,
        id_parqueo,
        id_piloto
    } = req.body;

    const sql = `
        UPDATE bus
        SET
            placa = ?,
            capacidad_maxima = ?,
            estado = ?,
            id_linea = ?,
            id_parqueo = ?,
            id_piloto = ?
        WHERE id_bus = ?
    `;

    db.query(
        sql,
        [
            placa,
            capacidad_maxima,
            estado,
            id_linea,
            id_parqueo,
            id_piloto,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando bus"
                });
            }

            res.json({
                mensaje:"Bus actualizado correctamente"
            });
        }
    );
});

// =====================================================
// DELETE - ELIMINAR BUS
// =====================================================

app.delete("/buses/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM bus
        WHERE id_bus = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando bus"
                });
            }

            res.json({
                mensaje:"Bus eliminado correctamente"
            });
        }
    );
});

// =====================================================
// OBTENER PILOTOS
// =====================================================

app.get("/pilotos", (req, res) => {

    const sql = `
        SELECT *
        FROM piloto
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo pilotos"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR PILOTO
// =====================================================

app.post("/pilotos", (req, res) => {

    const {
        nombre,
        telefono,
        direccion,
        historial_educativo
    } = req.body;

    const sql = `
        INSERT INTO piloto (
            nombre,
            telefono,
            direccion,
            historial_educativo
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            telefono,
            direccion,
            historial_educativo
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando piloto"
                });
            }

            res.json({
                mensaje:"Piloto creado correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR PILOTO
// =====================================================

app.put("/pilotos/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        telefono,
        direccion,
        historial_educativo
    } = req.body;

    const sql = `
        UPDATE piloto
        SET
            nombre = ?,
            telefono = ?,
            direccion = ?,
            historial_educativo = ?
        WHERE id_piloto = ?
    `;

    db.query(
        sql,
        [
            nombre,
            telefono,
            direccion,
            historial_educativo,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando piloto"
                });
            }

            res.json({
                mensaje:"Piloto actualizado correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR PILOTO
// =====================================================

app.delete("/pilotos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM piloto
        WHERE id_piloto = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando piloto"
                });
            }

            res.json({
                mensaje:"Piloto eliminado correctamente"
            });
        }
    );
});





// =====================================================
// OBTENER ESTACIONES
// =====================================================

app.get("/estaciones", (req, res) => {

    const sql = `
    SELECT
        e.id_estacion,
        e.nombre,
        e.ubicacion,
        e.capacidad,
        e.id_municipalidad,
        e.id_linea,

        m.nombre AS municipalidad,
        l.nombre AS linea,
        l.color

    FROM estacion e

    LEFT JOIN municipalidad m
        ON e.id_municipalidad = m.id_municipalidad

    LEFT JOIN linea l
        ON e.id_linea = l.id_linea

    ORDER BY e.id_estacion
`;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo estaciones"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR ESTACION
// =====================================================
app.post("/estaciones", (req, res) => {

    const {
        nombre,
        ubicacion,
        capacidad,
        id_municipalidad,
        id_linea
    } = req.body;

    const sql = `
        INSERT INTO estacion (
            nombre,
            ubicacion,
            capacidad,
            id_municipalidad,
            id_linea
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            ubicacion,
            capacidad,
            id_municipalidad,
            id_linea
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando estación"
                });
            }

            res.json({
                mensaje:"Estación creada correctamente"
            });
        }
    );
});
// =====================================================
// ACTUALIZAR ESTACION
// =====================================================

app.put("/estaciones/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        ubicacion,
        capacidad,
        id_municipalidad,
        id_linea
    } = req.body;

    const sql = `
        UPDATE estacion
        SET
            nombre = ?,
            ubicacion = ?,
            capacidad = ?,
            id_municipalidad = ?,
            id_linea = ?
        WHERE id_estacion = ?
    `;

    db.query(
        sql,
        [
            nombre,
            ubicacion,
            capacidad,
            id_municipalidad,
            id_linea,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando estación"
                });
            }

            res.json({
                mensaje:"Estación actualizada correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR ESTACION
// =====================================================

app.delete("/estaciones/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM estacion
        WHERE id_estacion = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando estación"
                });
            }

            res.json({
                mensaje:"Estación eliminada correctamente"
            });
        }
    );
});


// =====================================================
// OBTENER LINEAS
// =====================================================

app.get("/lineas", (req, res) => {

    const sql = `
        SELECT
            l.id_linea,
            l.nombre,
            l.distancia_total,
            l.color,
            l.id_municipalidad,
            m.nombre AS municipalidad
        FROM linea l
        LEFT JOIN municipalidad m
            ON l.id_municipalidad = m.id_municipalidad
        ORDER BY l.id_linea
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo líneas"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR LINEA
// =====================================================

app.post("/lineas", (req, res) => {

    const {
        nombre,
        distancia,
        color,
        id_municipalidad
    } = req.body;

    const sql = `
        INSERT INTO linea (
            nombre,
            distancia_total,
            color,
            id_municipalidad
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            distancia,
            color,
            id_municipalidad
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando línea"
                });
            }

            res.json({
                mensaje:"Línea creada correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR LINEA
// =====================================================
app.put("/lineas/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        distancia,
        color,
        id_municipalidad
    } = req.body;

    const sql = `
        UPDATE linea
        SET
            nombre = ?,
            distancia_total = ?,
            color = ?,
            id_municipalidad = ?
        WHERE id_linea = ?
    `;

    db.query(
        sql,
        [
            nombre,
            distancia,
            color,
            id_municipalidad,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando línea"
                });
            }

            res.json({
                mensaje:"Línea actualizada correctamente"
            });
        }
    );
});


// =====================================================
// ELIMINAR LINEA
// =====================================================

app.delete("/lineas/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM linea
        WHERE id_linea = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando línea"
                });
            }

            res.json({
                mensaje:"Línea eliminada correctamente"
            });
        }
    );
});

// =====================================================
// OBTENER PARQUEOS
// =====================================================

app.get("/parqueos", (req, res) => {

    const sql = `
        SELECT *
        FROM parqueo
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo parqueos"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR PARQUEO
// =====================================================

app.post("/parqueos", (req, res) => {

    const {
        ubicacion,
        disponibilidad
    } = req.body;

    const sql = `
        INSERT INTO parqueo (
            ubicacion,
            disponibilidad
        )
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            ubicacion,
            disponibilidad
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando parqueo"
                });
            }

            res.json({
                mensaje:"Parqueo creado correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR PARQUEO
// =====================================================

app.put("/parqueos/:id", (req, res) => {

    const { id } = req.params;

    const {
        ubicacion,
        disponibilidad
    } = req.body;

    const sql = `
        UPDATE parqueo
        SET
            ubicacion = ?,
            disponibilidad = ?
        WHERE id_parqueo = ?
    `;

    db.query(
        sql,
        [
            ubicacion,
            disponibilidad,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando parqueo"
                });
            }

            res.json({
                mensaje:"Parqueo actualizado correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR PARQUEO
// =====================================================

app.delete("/parqueos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM parqueo
        WHERE id_parqueo = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando parqueo"
                });
            }

            res.json({
                mensaje:"Parqueo eliminado correctamente"
            });
        }
    );
});

// =====================================================
// OBTENER ACCESOS
// =====================================================

app.get("/accesos", (req, res) => {

        const sql = `
        SELECT

            a.id_acceso,
            a.descripcion,
            a.id_estacion,

            e.nombre AS estacion

        FROM acceso a

        LEFT JOIN estacion e
            ON a.id_estacion = e.id_estacion
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo accesos"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR ACCESO
// =====================================================

app.post("/accesos", (req, res) => {

    const {
        descripcion,
        id_estacion
    } = req.body;

    const sql = `
        INSERT INTO acceso (
            descripcion,
            id_estacion
        )
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            descripcion,
            id_estacion
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando acceso"
                });
            }

            res.json({
                mensaje:"Acceso creado correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR ACCESO
// =====================================================

app.put("/accesos/:id", (req, res) => {

    const { id } = req.params;

    const {
        descripcion,
        id_estacion
    } = req.body;

    const sql = `
        UPDATE acceso
        SET
            descripcion = ?,
            id_estacion = ?
        WHERE id_acceso = ?
    `;

    db.query(
        sql,
        [
            descripcion,
            id_estacion,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando acceso"
                });
            }

            res.json({
                mensaje:"Acceso actualizado correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR ACCESO
// =====================================================

app.delete("/accesos/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM acceso
        WHERE id_acceso = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando acceso"
                });
            }

            res.json({
                mensaje:"Acceso eliminado correctamente"
            });
        }
    );
});

// =====================================================
// OBTENER GUARDIAS
// =====================================================

app.get("/guardias", (req, res) => {

    const sql = `
    SELECT

        g.id_guardia,
        g.nombre,
        g.telefono,
        g.id_acceso,

        a.descripcion AS acceso

    FROM guardia g

    LEFT JOIN acceso a
        ON g.id_acceso = a.id_acceso
        
        `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo guardias"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR GUARDIA
// =====================================================

app.post("/guardias", (req, res) => {

    const {
        nombre,
        telefono,
        id_acceso
    } = req.body;

    const sql = `
        INSERT INTO guardia (
            nombre,
            telefono,
            id_acceso
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            telefono,
            id_acceso
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando guardia"
                });
            }

            res.json({
                mensaje:"Guardia creado correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR GUARDIA
// =====================================================

app.put("/guardias/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        telefono,
        id_acceso
    } = req.body;

    const sql = `
        UPDATE guardia
        SET
            nombre = ?,
            telefono = ?,
            id_acceso = ?
        WHERE id_guardia = ?
    `;

    db.query(
        sql,
        [
            nombre,
            telefono,
            id_acceso,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando guardia"
                });
            }

            res.json({
                mensaje:"Guardia actualizado correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR GUARDIA
// =====================================================

app.delete("/guardias/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM guardia
        WHERE id_guardia = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando guardia"
                });
            }

            res.json({
                mensaje:"Guardia eliminado correctamente"
            });
        }
    );
});

// =====================================================
// OBTENER USUARIOS
// =====================================================

app.get("/usuarios", (req, res) => {

    const sql = `
        SELECT *
        FROM usuario
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo usuarios"
            });
        }

        res.json(results);
    });
});

// =====================================================
// CREAR USUARIO
// =====================================================

app.post("/usuarios", (req, res) => {

    const {
        nombre,
        correo,
        password,
        rol
    } = req.body;

    const sql = `
        INSERT INTO usuario (
            nombre,
            correo,
            password,
            rol
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            correo,
            password,
            rol
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando usuario"
                });
            }

            res.json({
                mensaje:"Usuario creado correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR USUARIO
// =====================================================

app.put("/usuarios/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        correo,
        password,
        rol
    } = req.body;

    const sql = `
        UPDATE usuario
        SET
            nombre = ?,
            correo = ?,
            password = ?,
            rol = ?
        WHERE id_usuario = ?
    `;

    db.query(
        sql,
        [
            nombre,
            correo,
            password,
            rol,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando usuario"
                });
            }

            res.json({
                mensaje:"Usuario actualizado correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR USUARIO
// =====================================================

app.delete("/usuarios/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM usuario
        WHERE id_usuario = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando usuario"
                });
            }

            res.json({
                mensaje:"Usuario eliminado correctamente"
            });
        }
    );
});

// =========================
// ALERTAS
// =========================

app.get("/alertas", (req, res) => {

    const sql = `
    SELECT

        a.id_alerta,
        a.tipo,
        a.descripcion,
        a.fecha,

        b.placa AS bus,
        e.nombre AS estacion

    FROM alerta a

    LEFT JOIN bus b
        ON a.id_bus = b.id_bus

    LEFT JOIN estacion e
        ON a.id_estacion = e.id_estacion

    ORDER BY a.id_alerta DESC
`;

    db.query(
        sql,
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error obteniendo alertas"
                });
            }

            res.json(result);
        }
    );
});

app.post("/alertas", (req, res) => {

    const {
        tipo,
        descripcion,
        id_bus,
        id_estacion
    } = req.body;

    const sql = `
    INSERT INTO alerta (
        tipo,
        descripcion,
        fecha,
        id_bus,
        id_estacion
    )
    VALUES (?, ?, NOW(), ?, ?)
    
    `;

    db.query(
        sql,
        [
            tipo,
            descripcion,
            id_bus || null,
            id_estacion || null

        ],

        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando alerta"
                });
            }

            res.json({
                mensaje:"Alerta creada correctamente"
            });
        }
    );
});

// =====================================================
// ACTUALIZAR ALERTA
// =====================================================

app.put("/alertas/:id", (req, res) => {

    const { id } = req.params;

    const {
        tipo,
        descripcion,
        id_bus,
        id_estacion
    } = req.body;

    const sql = `
        UPDATE alerta
        SET
            tipo = ?,
            descripcion = ?,
            id_bus = ?,
            id_estacion = ?
        WHERE id_alerta = ?
    `;

    db.query(
        sql,
        [
            tipo,
            descripcion,
            id_bus || null,
            id_estacion || null,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando alerta"
                });
            }

            res.json({
                mensaje:"Alerta actualizada correctamente"
            });
        }
    );
});

// =====================================================
// ELIMINAR ALERTA
// =====================================================

app.delete("/alertas/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM alerta
        WHERE id_alerta = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando alerta"
                });
            }

            res.json({
                mensaje:"Alerta eliminada correctamente"
            });
        }
    );
});



// =========================
// MUNICIPALIDADES
// =========================

app.get("/municipalidades", (req, res) => {

    const sql = `
        SELECT *
        FROM municipalidad
        ORDER BY id_municipalidad
    `;

    db.query(
        sql,
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error obteniendo municipalidades"
                });
            }

            res.json(result);
        }
    );
});

app.post("/municipalidades", (req, res) => {

    const {
        nombre,
        direccion
    } = req.body;

    const sql = `
        INSERT INTO municipalidad (
            nombre,
            direccion
        )
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [
            nombre,
            direccion
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando municipalidad"
                });
            }

            res.json({
                mensaje:"Municipalidad creada correctamente"
            });
        }
    );
});

// =========================
// ACTUALIZAR MUNICIPALIDAD
// =========================

app.put("/municipalidades/:id", (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        direccion
    } = req.body;

    const sql = `
        UPDATE municipalidad
        SET
            nombre = ?,
            direccion = ?
        WHERE id_municipalidad = ?
    `;

    db.query(
        sql,
        [
            nombre,
            direccion,
            id
        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error actualizando municipalidad"
                });
            }

            res.json({
                mensaje:"Municipalidad actualizada correctamente"
            });
        }
    );
});

// =========================
// ELIMINAR MUNICIPALIDAD
// =========================

app.delete("/municipalidades/:id", (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM municipalidad
        WHERE id_municipalidad = ?
    `;

    db.query(
        sql,
        [id],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error eliminando municipalidad"
                });
            }

            res.json({
                mensaje:"Municipalidad eliminada correctamente"
            });
        }
    );
});


// =========================
// RUTAS
// =========================

app.post("/rutas", (req, res) => {

    const {

        id_linea,
        id_estacion,
        orden_estacion,
        distancia_siguiente

    } = req.body;

    const sql = `
        INSERT INTO linea_estacion (

            id_linea,
            id_estacion,
            orden_estacion,
            distancia_siguiente

        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [

            id_linea,
            id_estacion,
            orden_estacion,
            distancia_siguiente

        ],
        (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error creando ruta"
                });
            }

            res.json({
                mensaje:"Ruta creada correctamente"
            });
        }
    );
});
app.get("/rutas", (req, res) => {

    const sql = `
        SELECT

            le.id_linea,
            le.id_estacion,

            l.nombre AS linea,
            e.nombre AS estacion,

            le.orden_estacion,
            le.distancia_siguiente

        FROM linea_estacion le

        INNER JOIN linea l
            ON le.id_linea = l.id_linea

        INNER JOIN estacion e
            ON le.id_estacion = e.id_estacion

        ORDER BY
            l.id_linea,
            le.orden_estacion
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo rutas"
            });
        }

        res.json(results);
    });
});

// =========================
// ELIMINAR RUTA
// =========================

app.delete(
    "/rutas/:idLinea/:idEstacion",
    (req, res) => {

        const {
            idLinea,
            idEstacion
        } = req.params;

        const sql = `
            DELETE FROM linea_estacion
            WHERE id_linea = ?
            AND id_estacion = ?
        `;

        db.query(
            sql,
            [
                idLinea,
                idEstacion
            ],
            (err, result) => {

                if(err){

                    console.log(err);

                    return res.status(500).json({
                        error:"Error eliminando ruta"
                    });
                }

                res.json({
                    mensaje:"Ruta eliminada correctamente"
                });
            }
        );
    }
);


// =====================================================
// DASHBOARD
// =====================================================

app.get("/dashboard", (req, res) => {

    const datos = {};

    db.query(
        "SELECT COUNT(*) AS total FROM bus",
        (err, buses) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    error:"Error dashboard"
                });
            }

            datos.buses =
                buses[0].total;

            db.query(
                "SELECT COUNT(*) AS total FROM piloto",
                (err, pilotos) => {

                    datos.pilotos =
                        pilotos[0].total;

                    db.query(
                        "SELECT COUNT(*) AS total FROM estacion",
                        (err, estaciones) => {

                            datos.estaciones =
                                estaciones[0].total;

                            db.query(
                                "SELECT COUNT(*) AS total FROM linea",
                                (err, lineas) => {

                                    datos.lineas =
                                        lineas[0].total;

                                    db.query(
                                        "SELECT COUNT(*) AS total FROM guardia",
                                        (err, guardias) => {

                                            datos.guardias =
                                                guardias[0].total;

                                            db.query(
                                                "SELECT COUNT(*) AS total FROM alerta",
                                                (err, alertas) => {

                                                    datos.alertas =
                                                        alertas[0].total;

                                                    db.query(
                                                        `
                                                        SELECT COUNT(*) AS total
                                                        FROM bus
                                                        WHERE estado = 'Activo'
                                                        `,
                                                        (err, activos) => {

                                                            datos.activos =
                                                                activos[0].total;

                                                            db.query(
                                                                `
                                                                SELECT COUNT(*) AS total
                                                                FROM bus
                                                                WHERE estado = 'Mantenimiento'
                                                                `,
                                                                (err, mantenimiento) => {

                                                                    datos.mantenimiento =
                                                                        mantenimiento[0].total;

                                                                    res.json(
                                                                        datos
                                                                    );
                                                                }
                                                            );
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});


// REPORTES 

app.get("/reporte-pilotos", (req, res) => {

    const sql = `
        SELECT

            pi.nombre AS piloto,
            b.placa,
            l.nombre AS linea

        FROM bus b

        LEFT JOIN piloto pi
            ON b.id_piloto = pi.id_piloto

        LEFT JOIN linea l
            ON b.id_linea = l.id_linea

        ORDER BY pi.nombre
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo reporte de pilotos"
            });
        }

        res.json(results);
    });
});

app.get("/reporte-buses", (req, res) => {

    const sql = `
        SELECT

            l.nombre AS linea,
            b.placa,
            b.estado

        FROM bus b

        LEFT JOIN linea l
            ON b.id_linea = l.id_linea

        ORDER BY l.nombre
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo reporte de buses"
            });
        }

        res.json(results);
    });
});

app.get("/reporte-estaciones", (req, res) => {

    const sql = `
        SELECT

            l.nombre AS linea,
            e.nombre AS estacion,
            e.ubicacion

        FROM estacion e

        LEFT JOIN linea l
            ON e.id_linea = l.id_linea

        ORDER BY l.nombre, e.nombre
    `;

    db.query(sql, (err, results) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                error:"Error obteniendo reporte de estaciones"
            });
        }

        res.json(results);
    });
});


// =====================================================
// PUERTO EXPRESS
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});