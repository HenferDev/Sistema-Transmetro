// =========================
// DASHBOARD
// =========================

function mostrarDashboard(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <div class="cards">

    <div class="card">

        <h3>
            Buses
        </h3>

        <p id="totalBuses">
            0
        </p>

    </div>

    <div class="card">

        <h3>
            Pilotos
        </h3>

        <p id="totalPilotos">
            0
        </p>

    </div>

    <div class="card">

        <h3>
            Estaciones
        </h3>

        <p id="totalEstaciones">
            0
        </p>

    </div>

    <div class="card">

        <h3>
            Líneas
        </h3>

        <p id="totalLineas">
            0
        </p>

    </div>

    <div class="card">

        <h3>
            Guardias
        </h3>

        <p id="totalGuardias">
            0
        </p>

    </div>

    <div class="card">

        <h3>
            Alertas
        </h3>

        <p id="totalAlertas">
            0
        </p>

    </div>

</div>
        <div class="graficas">

            <div class="grafica-card">

                <h2>
                    Operación General
                </h2>

                <canvas id="graficaGeneral"></canvas>

            </div>

            <div class="grafica-card">

                <h2>
                    Estado de Buses
                </h2>

                <canvas id="graficaBuses"></canvas>

            </div>

        </div>
    `;

    cargarDashboard();
}

async function cargarDashboard(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/dashboard"
            );

        const datos =
            await respuesta.json();

        document.getElementById(
            "totalBuses"
        ).textContent =
            datos.buses;

        document.getElementById(
            "totalPilotos"
        ).textContent =
            datos.pilotos;

        document.getElementById(
            "totalEstaciones"
        ).textContent =
            datos.estaciones;

        document.getElementById(
            "totalLineas"
        ).textContent =
            datos.lineas;

         document.getElementById(
            "totalGuardias"
        ).textContent =
            datos.guardias;
            
        document.getElementById(
            "totalAlertas"
        ).textContent =
            datos.alertas;

        crearGraficas(datos);

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando dashboard"
        );
    }
}

// =========================
// GRAFICAS
// =========================

function crearGraficas(datos){

    const ctx1 =
        document.getElementById(
            "graficaGeneral"
        );

    new Chart(ctx1, {

        type:"bar",

        data:{

            labels:[
                "Buses",
                "Pilotos",
                "Estaciones",
                "Líneas",
                "Guardias",
                "Alertas"
            ],

            datasets:[{

                data:[

                    datos.buses,
                    datos.pilotos,
                    datos.estaciones,
                    datos.lineas,
                    datos.guardias,
                    datos.alertas
                ],

                backgroundColor:[

                    "#0b48b8", // Buses
                    "#3b82f6", // Pilotos
                    "#65a30d", // Estaciones
                    "#94a3b8", // Líneas
                    "#2563eb", // Guardias
                    "#f59e0b"  // Alertas

                ],

                borderRadius:10

            }]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{

                        color:"#475569",

                        stepSize:1
                    },

                    grid:{

                        color:"#e2e8f0"
                    }
                },

                x:{

                    ticks:{

                        color:"#475569",

                        font:{
                            size:12
                        }
                    },

                    grid:{

                        color:"#f1f5f9"
                    }
                }
            },

            plugins:{

                legend:{

                    display:false
                }
            }
        }
    });

    const ctx2 =
        document.getElementById(
            "graficaBuses"
        );

    new Chart(ctx2, {

        type:"doughnut",

        data:{

            labels:[

                "Activos",
                "Mantenimiento"

            ],

            datasets:[{

                data:[

                    datos.activos,
                    datos.mantenimiento

                ],

                backgroundColor:[

                    "#65a30d",
                    "#f59e0b"

                ],

                borderWidth:0

            }]
        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"top",

                    labels:{

                        color:"#475569"
                    }
                }
            }
        }
    });
}
// VARIABLES GLOBALES

let idBusEditando = null;
let idPilotoEditando = null;
let idEstacionEditando = null;
let idLineaEditando = null;
let idParqueoEditando = null;
let idMunicipalidadEditando = null;
let idUsuarioEditando = null;
let idGuardiaEditando = null;
let idAccesoEditando = null;
let idAlertaEditando = null;


// =========================
// BUSES
// =========================
function mostrarBuses(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Gestión de Buses</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="placaBus"
                placeholder="Placa"
            >

            <input
                type="number"
                id="capacidadBus"
                placeholder="Capacidad"
            >

            <select id="estadoBus">

                <option value="Activo">
                    Activo
                </option>

                <option value="Mantenimiento">
                    Mantenimiento
                </option>

            </select>

            <select id="lineaBus"></select>

            <select id="parqueoBus"></select>

            <select id="pilotoBus"></select>

            <button onclick="guardarBus()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Placa</th>
                    <th>Capacidad</th>
                    <th>Estado</th>
                    <th>Línea</th>
                    <th>Parqueo</th>
                    <th>Piloto</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaBuses">

            </tbody>

        </table>
    `;

    cargarBuses();
    cargarLineasBus();
    cargarParqueosBus();
    cargarPilotosBus();
}


async function guardarBus(){

    const placa =
        document.getElementById(
            "placaBus"
        ).value;

    const capacidad =
        document.getElementById(
            "capacidadBus"
        ).value;

    const estado =
        document.getElementById(
            "estadoBus"
        ).value;

    const id_linea =
        document.getElementById(
            "lineaBus"
        ).value;

    const id_parqueo =
        document.getElementById(
            "parqueoBus"
        ).value;

    const id_piloto =
        document.getElementById(
            "pilotoBus"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/buses";

    let metodo =
        "POST";

    if(idBusEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/buses/${idBusEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        placa,
                        capacidad_maxima: capacidad,
                        estado,

                        id_linea,
                        id_parqueo,
                        id_piloto

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        idBusEditando = null;

        document.getElementById(
            "placaBus"
        ).value = "";

        document.getElementById(
            "capacidadBus"
        ).value = "";

        document.getElementById(
            "estadoBus"
        ).value = "Activo";

        cargarBuses();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando bus"
        );
    }
}


async function cargarBuses(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/buses"
            );

        const buses =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaBuses"
            );

        tabla.innerHTML = "";

        buses.forEach(bus => {

            tabla.innerHTML += `

                <tr>

                    <td>${bus.id_bus}</td>

                    <td>${bus.placa}</td>

                    <td>${bus.capacidad_maxima}</td>

                    <td>${bus.estado}</td>

                    <td>${bus.linea || "Sin asignar"}</td>

                    <td>${bus.parqueo || "Sin asignar"}</td>

                    <td>${bus.piloto || "Sin asignar"}</td>

                    <td>

                        <button
                            onclick="editarBus(
                                ${bus.id_bus},
                                '${bus.placa}',
                                '${bus.capacidad_maxima}',
                                '${bus.estado}',
                                '${bus.id_linea}',
                                '${bus.id_parqueo}',
                                '${bus.id_piloto}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarBus(${bus.id_bus})"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando buses"
        );
    }
}


function editarBus(
    id,
    placa,
    capacidad,
    estado,
    id_linea,
    id_parqueo,
    id_piloto
){

    idBusEditando = id;

    document.getElementById(
        "placaBus"
    ).value = placa;

    document.getElementById(
        "capacidadBus"
    ).value = capacidad;

    document.getElementById(
        "estadoBus"
    ).value = estado;

    document.getElementById(
        "lineaBus"
    ).value = id_linea;

    document.getElementById(
        "parqueoBus"
    ).value = id_parqueo;

    document.getElementById(
        "pilotoBus"
    ).value = id_piloto;
}


async function eliminarBus(id){

    const confirmar =
        confirm(
            "¿Desea eliminar este bus?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/buses/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarBuses();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando bus"
        );
    }
}


async function cargarLineasBus(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/lineas"
            );

        const lineas =
            await respuesta.json();

        const select =
            document.getElementById(
                "lineaBus"
            );

        select.innerHTML = "";

        lineas.forEach(linea => {

            select.innerHTML += `

                <option
                    value="${linea.id_linea}"
                >
                    Línea ${linea.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}


async function cargarParqueosBus(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/parqueos"
            );

        const parqueos =
            await respuesta.json();

        const select =
            document.getElementById(
                "parqueoBus"
            );

        select.innerHTML = "";

        parqueos.forEach(parqueo => {

            select.innerHTML += `

                <option
                    value="${parqueo.id_parqueo}"
                >
                    ${parqueo.ubicacion}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}


async function cargarPilotosBus(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/pilotos"
            );

        const pilotos =
            await respuesta.json();

        const select =
            document.getElementById(
                "pilotoBus"
            );

        select.innerHTML = "";

        pilotos.forEach(piloto => {

            select.innerHTML += `

                <option
                    value="${piloto.id_piloto}"
                >
                    ${piloto.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}



// =========================
// PILOTOS
// =========================

function mostrarPilotos(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Gestión de Pilotos</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="nombrePiloto"
                placeholder="Nombre"
            >

            <input
                type="text"
                id="telefonoPiloto"
                placeholder="Teléfono"
            >

            <input
                type="text"
                id="direccionPiloto"
                placeholder="Dirección"
            >

            <input
                type="text"
                id="historialPiloto"
                placeholder="Historial Educativo"
            >

            <button onclick="guardarPiloto()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Historial</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaPilotos">

            </tbody>

        </table>
    `;

    cargarPilotos();
}


async function guardarPiloto(){

    const nombre =
        document.getElementById(
            "nombrePiloto"
        ).value;

    const telefono =
        document.getElementById(
            "telefonoPiloto"
        ).value;

    const direccion =
        document.getElementById(
            "direccionPiloto"
        ).value;

    const historial =
        document.getElementById(
            "historialPiloto"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/pilotos";

    let metodo =
        "POST";

    if(idPilotoEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/pilotos/${idPilotoEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nombre,
                        telefono,
                        direccion,
                        historial_educativo:
                        historial

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        idPilotoEditando = null;

        document.getElementById(
            "nombrePiloto"
        ).value = "";

        document.getElementById(
            "telefonoPiloto"
        ).value = "";

        document.getElementById(
            "direccionPiloto"
        ).value = "";

        document.getElementById(
            "historialPiloto"
        ).value = "";

        cargarPilotos();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando piloto"
        );
    }
}

async function cargarPilotos(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/pilotos"
            );

        const pilotos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaPilotos"
            );

        tabla.innerHTML = "";

        pilotos.forEach(piloto => {

            tabla.innerHTML += `

                <tr>

                    <td>${piloto.id_piloto}</td>

                    <td>${piloto.nombre}</td>

                    <td>${piloto.telefono}</td>

                    <td>${piloto.direccion}</td>

                    <td>${piloto.historial_educativo}</td>

                    <td>

                        <button
                            onclick="editarPiloto(
                                ${piloto.id_piloto},
                                '${piloto.nombre}',
                                '${piloto.telefono}',
                                '${piloto.direccion}',
                                '${piloto.historial_educativo}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarPiloto(
                                ${piloto.id_piloto}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando pilotos"
        );
    }
}

function editarPiloto(
    id,
    nombre,
    telefono,
    direccion,
    historial
){

    idPilotoEditando = id;

    document.getElementById(
        "nombrePiloto"
    ).value = nombre;

    document.getElementById(
        "telefonoPiloto"
    ).value = telefono;

    document.getElementById(
        "direccionPiloto"
    ).value = direccion;

    document.getElementById(
        "historialPiloto"
    ).value = historial;
}

async function eliminarPiloto(id){

    const confirmar =
        confirm(
            "¿Desea eliminar este piloto?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/pilotos/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarPilotos();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando piloto"
        );
    }
}

// =========================
// ESTACIONES
// =========================
function mostrarEstaciones(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Gestión de Estaciones</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="nombreEstacion"
                placeholder="Nombre estación"
            >

            <input
                type="text"
                id="ubicacionEstacion"
                placeholder="Ubicación"
            >

            <input
                type="number"
                id="capacidadEstacion"
                placeholder="Capacidad"
            >

            <select id="municipalidadEstacion">
            </select>

            <select id="lineaEstacion">
            </select>
 

            <button onclick="guardarEstacion()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Ubicación</th>
                    <th>Capacidad</th>
                    <th>Municipalidad</th>
                    <th>Línea</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaEstaciones">

            </tbody>

        </table>
    `;

    cargarEstaciones();
    cargarMunicipalidadesEstacion();
    cargarLineasEstacion();
}

async function guardarEstacion(){

    const nombre =
        document.getElementById(
            "nombreEstacion"
        ).value;

    const ubicacion =
        document.getElementById(
            "ubicacionEstacion"
        ).value;

    const capacidad =
        document.getElementById(
            "capacidadEstacion"
        ).value;

    const id_municipalidad =
        document.getElementById(
            "municipalidadEstacion"
        ).value;

    const id_linea =
         document.getElementById(
            "lineaEstacion"
         ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/estaciones";

    let metodo =
        "POST";

    if(idEstacionEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/estaciones/${idEstacionEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nombre,
                        ubicacion,
                        capacidad,
                        id_municipalidad,
                        id_linea

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        idEstacionEditando = null;

        document.getElementById(
            "nombreEstacion"
        ).value = "";

        document.getElementById(
            "ubicacionEstacion"
        ).value = "";

        document.getElementById(
            "capacidadEstacion"
        ).value = "";

        document.getElementById(
            "lineaEstacion"
        ).selectedIndex = 0;

        cargarEstaciones();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando estación"
        );
    }
}


async function cargarEstaciones(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/estaciones"
            );

        const estaciones =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaEstaciones"
            );

        tabla.innerHTML = "";

        estaciones.forEach(estacion => {

            tabla.innerHTML += `

                <tr>

                    <td>${estacion.id_estacion}</td>

                    <td>${estacion.nombre}</td>

                    <td>${estacion.ubicacion}</td>

                    <td>${estacion.capacidad}</td>

                    <td> ${estacion.municipalidad || "Sin asignar"}
                    
                    </td>
                    
                    <td>

    ${
        estacion.linea
        ?

        `<div style="
            display:flex;
            align-items:center;
            gap:10px;
        ">

            <div style="
                width:14px;
                height:14px;
                border-radius:50%;
                background:${estacion.color};
                box-shadow:0 0 4px rgba(0,0,0,0.15);
            ">
            </div>

            Línea ${estacion.linea}

        </div>`

        :

        "Sin asignar"
    }

</td>

                    <td>

                        <button
                            onclick="editarEstacion(
                                ${estacion.id_estacion},
                                '${estacion.nombre}',
                                '${estacion.ubicacion}',
                                '${estacion.capacidad}',
                                '${estacion.id_municipalidad}',
                                '${estacion.id_linea}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarEstacion(
                                ${estacion.id_estacion}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando estaciones"
        );
    }
}

function editarEstacion(
    id,
    nombre,
    ubicacion,
    capacidad,
    id_municipalidad,
    id_linea
){

    idEstacionEditando = id;

    document.getElementById(
        "nombreEstacion"
    ).value = nombre;

    document.getElementById(
        "ubicacionEstacion"
    ).value = ubicacion;

    document.getElementById(
        "capacidadEstacion"
    ).value = capacidad;

    document.getElementById(
        "municipalidadEstacion"
    ).value = id_municipalidad;

    document.getElementById(
        "lineaEstacion"
    ).value = id_linea;
}

async function eliminarEstacion(id){

    const confirmar =
        confirm(
            "¿Desea eliminar esta estación?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/estaciones/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarEstaciones();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando estación"
        );
    }
}



// =========================
// LINEAS
// =========================

function mostrarLineas(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Gestión de Líneas</h1>

        <br>

        <div class="formulario">

            <select id="nombreLinea">

                <option value="">
                    Seleccione una línea
                </option>

                <option value="1">Línea 1</option>
                <option value="2">Línea 2</option>
                <option value="3">Línea 3</option>
                <option value="4">Línea 4</option>
                <option value="5">Línea 5</option>
                <option value="6">Línea 6</option>
                <option value="7">Línea 7</option>
                <option value="8">Línea 8</option>
                <option value="9">Línea 9</option>
                <option value="10">Línea 10</option>
                <option value="11">Línea 11</option>
                <option value="12">Línea 12</option>
                <option value="13">Línea 13</option>
                <option value="14">Línea 14</option>
                <option value="15">Línea 15</option>

            </select>

            <input
                type="number"
                id="distanciaLinea"
                placeholder="Distancia (km)"
            >

            <select id="municipalidadLinea">

            </select>

            <button onclick="guardarLinea()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Distancia</th>
                    <th>Municipalidad</th>
                    <th>Color</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaLineas">

            </tbody>

        </table>
    `;

    cargarLineas();
    cargarMunicipalidadesLinea();
}


async function guardarLinea(){

    const nombre =
        document.getElementById(
            "nombreLinea"
        ).value;

    const distancia =
        document.getElementById(
            "distanciaLinea"
        ).value;

    const id_municipalidad =
        document.getElementById(
            "municipalidadLinea"
        ).value;

    let color = "";

    switch(nombre){

        case "1":
            color = "#22c55e";
            break;

        case "2":
            color = "#3b82f6";
            break;

        case "3":
            color = "#ef4444";
            break;

        case "4":
            color = "#eab308";
            break;

        case "5":
            color = "#a855f7";
            break;

        case "6":
            color = "#f97316";
            break;

        case "7":
            color = "#06b6d4";
            break;

        case "8":
            color = "#ec4899";
            break;

        case "9":
            color = "#84cc16";
            break;

        case "10":
            color = "#6366f1";
            break;

        case "11":
            color = "#14b8a6";
            break;

        case "12":
            color = "#f43f5e";
            break;

        case "13":
            color = "#8b5cf6";
            break;

        case "14":
            color = "#10b981";
            break;

        case "15":
            color = "#f59e0b";
            break;
    }

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/lineas";

    let metodo =
        "POST";

    if(idLineaEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/lineas/${idLineaEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nombre,
                        distancia,
                        color,
                        id_municipalidad

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        idLineaEditando = null;

        document.getElementById(
            "distanciaLinea"
        ).value = "";

        document.getElementById(
            "nombreLinea"
        ).value = "";

        cargarLineas();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando línea"
        );
    }
}


async function cargarLineas(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/lineas"
            );

        const lineas =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaLineas"
            );

        tabla.innerHTML = "";

        lineas.forEach(linea => {

            tabla.innerHTML += `

                <tr>

                    <td>${linea.id_linea}</td>

                    <td>${linea.nombre}</td>

                    <td>${linea.distancia_total} km</td>

                    <td>
                        ${linea.municipalidad || "Sin asignar"}
                    </td>

                    <td>

                        <div
                            style="
                                width:30px;
                                height:30px;
                                border-radius:50%;
                                background:${linea.color};
                                margin:auto;
                            ">
                        </div>

                    </td>

                    <td>

                        <button
                            onclick="editarLinea(
                                ${linea.id_linea},
                                '${linea.nombre}',
                                '${linea.distancia_total}',
                                '${linea.color}',
                                '${linea.id_municipalidad}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarLinea(
                                ${linea.id_linea}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando líneas"
        );
    }
}

function editarLinea(
    id,
    nombre,
    distancia,
    color,
    id_municipalidad
){

    idLineaEditando = id;

    document.getElementById(
        "nombreLinea"
    ).value = nombre;

    document.getElementById(
        "distanciaLinea"
    ).value = distancia;

    document.getElementById(
        "municipalidadLinea"
    ).value = id_municipalidad;
}


async function eliminarLinea(id){

    const confirmar =
        confirm(
            "¿Desea eliminar esta línea?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/lineas/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarLineas();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando línea"
        );
    }
}



// =========================
// PARQUEOS
// =========================
function mostrarParqueos(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Parqueos</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="ubicacionParqueo"
                placeholder="Ubicación"
            >

            <select id="disponibilidadParqueo">

                <option value="Disponible">
                    Disponible
                </option>

                <option value="Ocupado">
                    Ocupado
                </option>

            </select>

            <button onclick="guardarParqueo()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Ubicación</th>
                    <th>Disponibilidad</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaParqueos">

            </tbody>

        </table>
    `;

    cargarParqueos();
}

async function guardarParqueo(){

    const ubicacion =
        document.getElementById(
            "ubicacionParqueo"
        ).value;

    const disponibilidad =
        document.getElementById(
            "disponibilidadParqueo"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/parqueos";

    let metodo =
        "POST";

    if(idParqueoEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/parqueos/${idParqueoEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        ubicacion,
                        disponibilidad

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        idParqueoEditando = null;

        document.getElementById(
            "ubicacionParqueo"
        ).value = "";

        document.getElementById(
            "disponibilidadParqueo"
        ).value = "Disponible";

        cargarParqueos();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando parqueo"
        );
    }
}

async function cargarParqueos(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/parqueos"
            );

        const parqueos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaParqueos"
            );

        tabla.innerHTML = "";

        parqueos.forEach(parqueo => {

            tabla.innerHTML += `

                <tr>

                    <td>${parqueo.id_parqueo}</td>

                    <td>${parqueo.ubicacion}</td>

                    <td>${parqueo.disponibilidad}</td>

                    <td>

                        <button
                            onclick="editarParqueo(
                                ${parqueo.id_parqueo},
                                '${parqueo.ubicacion}',
                                '${parqueo.disponibilidad}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarParqueo(
                                ${parqueo.id_parqueo}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando parqueos"
        );
    }
}

function editarParqueo(
    id,
    ubicacion,
    disponibilidad
){

    idParqueoEditando = id;

    document.getElementById(
        "ubicacionParqueo"
    ).value = ubicacion;

    document.getElementById(
        "disponibilidadParqueo"
    ).value = disponibilidad;
}

async function eliminarParqueo(id){

    const confirmar =
        confirm(
            "¿Desea eliminar este parqueo?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/parqueos/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarParqueos();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando parqueo"
        );
    }
}

// =========================
// ACCESOS
// =========================

function mostrarAccesos(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Accesos</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="descripcionAcceso"
                placeholder="Descripción"
            >

            <select id="estacionAcceso">
            </select>

            <button onclick="guardarAcceso()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Estación</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaAccesos">

            </tbody>

        </table>
    `;

    cargarAccesos();
    cargarEstacionesAcceso();
}
async function guardarAcceso(){

    const descripcion =
        document.getElementById(
            "descripcionAcceso"
        ).value;

    const id_estacion =
        document.getElementById(
            "estacionAcceso"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/accesos";

    let metodo =
        "POST";

    if(idAccesoEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/accesos/${idAccesoEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        descripcion,
                        id_estacion

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        idAccesoEditando = null;

        document.getElementById(
            "descripcionAcceso"
        ).value = "";

        cargarAccesos();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando acceso"
        );
    }
}
async function cargarAccesos(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/accesos"
            );

        const accesos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaAccesos"
            );

        tabla.innerHTML = "";

        accesos.forEach(acceso => {

            tabla.innerHTML += `

                <tr>

                    <td>${acceso.id_acceso}</td>

                    <td>${acceso.descripcion}</td>

                    <td>
                        ${acceso.estacion || "Sin asignar"}
                    </td>

                    <td>

                        <button
                            onclick="editarAcceso(
                                ${acceso.id_acceso},
                                '${acceso.descripcion}',
                                '${acceso.id_estacion}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarAcceso(
                                ${acceso.id_acceso}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando accesos"
        );
    }
}

function editarAcceso(
    id,
    descripcion,
    id_estacion
){

    idAccesoEditando = id;

    document.getElementById(
        "descripcionAcceso"
    ).value = descripcion;

    document.getElementById(
        "estacionAcceso"
    ).value = id_estacion;
}

async function eliminarAcceso(id){

    const confirmar =
        confirm(
            "¿Desea eliminar este acceso?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/accesos/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        cargarAccesos();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando acceso"
        );
    }
}



async function cargarEstacionesAcceso(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/estaciones"
            );

        const estaciones =
            await respuesta.json();

        const select =
            document.getElementById(
                "estacionAcceso"
            );

        select.innerHTML = "";

        estaciones.forEach(estacion => {

            select.innerHTML += `

                <option
                    value="${estacion.id_estacion}"
                >
                    ${estacion.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}


// =========================
// GUARDIAS
// =========================
function mostrarGuardias(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Guardias</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="nombreGuardia"
                placeholder="Nombre"
            >

            <input
                type="text"
                id="telefonoGuardia"
                placeholder="Teléfono"
            >

            <select id="accesoGuardia">
            </select>

            <button onclick="guardarGuardia()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Acceso</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaGuardias">

            </tbody>

        </table>
    `;

    cargarGuardias();
    cargarAccesosGuardia();
}


async function guardarGuardia(){

    const nombre =
        document.getElementById(
            "nombreGuardia"
        ).value;

    const telefono =
        document.getElementById(
            "telefonoGuardia"
        ).value;

    const id_acceso =
        document.getElementById(
            "accesoGuardia"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/guardias";

    let metodo =
        "POST";

    if(idGuardiaEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/guardias/${idGuardiaEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nombre,
                        telefono,
                        id_acceso

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        idGuardiaEditando = null;

        document.getElementById(
            "nombreGuardia"
        ).value = "";

        document.getElementById(
            "telefonoGuardia"
        ).value = "";

        cargarGuardias();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando guardia"
        );
    }
}


async function cargarGuardias(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/guardias"
            );

        const guardias =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaGuardias"
            );

        tabla.innerHTML = "";

        guardias.forEach(guardia => {

            tabla.innerHTML += `

                <tr>

                    <td>${guardia.id_guardia}</td>

                    <td>${guardia.nombre}</td>

                    <td>${guardia.telefono}</td>

                    <td>
                        ${guardia.acceso || "Sin asignar"}
                    </td>

                    <td>

                        <button
                            onclick="editarGuardia(
                                ${guardia.id_guardia},
                                '${guardia.nombre}',
                                '${guardia.telefono}',
                                '${guardia.id_acceso}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarGuardia(
                                ${guardia.id_guardia}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando guardias"
        );
    }
}

async function cargarAccesosGuardia(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/accesos"
            );

        const accesos =
            await respuesta.json();

        const select =
            document.getElementById(
                "accesoGuardia"
            );

        select.innerHTML = "";

        accesos.forEach(acceso => {

            select.innerHTML += `

                <option
                    value="${acceso.id_acceso}"
                >
                    ${acceso.descripcion}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}

function editarGuardia(
    id,
    nombre,
    telefono,
    id_acceso
){

    idGuardiaEditando = id;

    document.getElementById(
        "nombreGuardia"
    ).value = nombre;

    document.getElementById(
        "telefonoGuardia"
    ).value = telefono;

    document.getElementById(
        "accesoGuardia"
    ).value = id_acceso;
}

async function eliminarGuardia(id){

    const confirmar =
        confirm(
            "¿Desea eliminar este guardia?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/guardias/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        cargarGuardias();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando guardia"
        );
    }
}


// =========================
// ALERTAS
// =========================

function mostrarAlertas(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Alertas</h1>

        <br>

        <div class="formulario">

            <select 
            id="tipoAlerta"
            onchange="cambiarTipoAlerta()"
             >


                <option value="Bus">
                    Bus
                </option>

                <option value="Estación">
                    Estación
                </option>

                <option value="Seguridad">
                    Seguridad
                </option>

            </select>
            <select id="busAlerta">
            </select>

            <select id="estacionAlerta">
            </select>
            

            <input
                type="text"
                id="descripcionAlerta"
                placeholder="Descripción"
            >

            <button onclick="guardarAlerta()"
            >
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Bus</th>
                    <th>Estación</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaAlertas">

            </tbody>

        </table>
    `;

    cargarAlertas();
    cargarBusesAlerta();
    cargarEstacionesAlerta();
    cambiarTipoAlerta();

}

async function guardarAlerta(){

    const tipo =
        document.getElementById(
            "tipoAlerta"
        ).value;

    const descripcion =
        document.getElementById(
            "descripcionAlerta"
        ).value;

    const id_bus =
        document.getElementById(
            "busAlerta"
        ).value;

    const id_estacion =
        document.getElementById(
            "estacionAlerta"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/alertas";

    let metodo =
        "POST";

    if(idAlertaEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/alertas/${idAlertaEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        tipo,
                        descripcion,
                        id_bus,
                        id_estacion

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        idAlertaEditando = null;

        document.getElementById(
            "descripcionAlerta"
        ).value = "";

        cargarAlertas();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando alerta"
        );
    }
}

async function cargarAlertas(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/alertas"
            );

        const alertas =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaAlertas"
            );

        tabla.innerHTML = "";

        alertas.forEach(alerta => {

            tabla.innerHTML += `

                <tr>

                    <td>${alerta.id_alerta}</td>

                    <td>${alerta.tipo}</td>

                    <td>${alerta.descripcion}</td>

                    <td>${alerta.fecha}</td>

                    <td>${alerta.bus || "-"}</td>

                    <td>${alerta.estacion || "-"}</td>

                    <td>

                        <button
                            onclick="editarAlerta(
                                ${alerta.id_alerta},
                                '${alerta.tipo}',
                                '${alerta.descripcion}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarAlerta(
                                ${alerta.id_alerta}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando alertas"
        );
    }
}

function editarAlerta(
    id,
    tipo,
    descripcion
){

    idAlertaEditando = id;

    document.getElementById(
        "tipoAlerta"
    ).value = tipo;

    document.getElementById(
        "descripcionAlerta"
    ).value = descripcion;

    cambiarTipoAlerta();
}

async function eliminarAlerta(id){

    const confirmar =
        confirm(
            "¿Desea eliminar esta alerta?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/alertas/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        cargarAlertas();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando alerta"
        );
    }
}

async function cargarBusesAlerta(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/buses"
            );

        const buses =
            await respuesta.json();

        const select =
            document.getElementById(
                "busAlerta"
            );

        select.innerHTML = "";

        buses.forEach(bus => {

            select.innerHTML += `

                <option
                    value="${bus.id_bus}"
                >
                    ${bus.placa}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}

async function cargarEstacionesAlerta(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/estaciones"
            );

        const estaciones =
            await respuesta.json();

        const select =
            document.getElementById(
                "estacionAlerta"
            );

        select.innerHTML = "";

        estaciones.forEach(estacion => {

            select.innerHTML += `

                <option
                    value="${estacion.id_estacion}"
                >
                    ${estacion.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}
function cambiarTipoAlerta(){

    const tipo =
        document.getElementById(
            "tipoAlerta"
        ).value;

    const bus =
        document.getElementById(
            "busAlerta"
        );

    const estacion =
        document.getElementById(
            "estacionAlerta"
        );

    if(tipo === "Bus"){

        bus.style.display = "";
        estacion.style.display = "none";

    }
    else if(tipo === "Estación"){

        bus.style.display = "none";
        estacion.style.display = "";

    }
    else{

        bus.style.display = "none";
        estacion.style.display = "none";

    }
}




// =========================
// USUARIOS
// =========================
function mostrarUsuarios(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Usuarios</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="nombreUsuario"
                placeholder="Nombre"
            >

            <input
                type="email"
                id="correoUsuario"
                placeholder="Correo"
            >

            <input
                type="password"
                id="passwordUsuario"
                placeholder="Contraseña"
            >

            <select id="rolUsuario">

                <option value="Administrador">
                    Administrador
                </option>

                <option value="Operador">
                    Operador
                </option>

            </select>

            <button onclick="guardarUsuario()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaUsuarios">

            </tbody>

        </table>
    `;

    cargarUsuarios();
}

async function guardarUsuario(){

    const nombre =
        document.getElementById(
            "nombreUsuario"
        ).value;

    const correo =
        document.getElementById(
            "correoUsuario"
        ).value;

    const password =
        document.getElementById(
            "passwordUsuario"
        ).value;

    const rol =
        document.getElementById(
            "rolUsuario"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/usuarios";

    let metodo =
        "POST";

    if(idUsuarioEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/usuarios/${idUsuarioEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nombre,
                        correo,
                        password,
                        rol

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        idUsuarioEditando = null;

        document.getElementById(
            "nombreUsuario"
        ).value = "";

        document.getElementById(
            "correoUsuario"
        ).value = "";

        document.getElementById(
            "passwordUsuario"
        ).value = "";

        document.getElementById(
            "rolUsuario"
        ).value = "Operador";

        cargarUsuarios();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando usuario"
        );
    }
}
async function cargarUsuarios(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/usuarios"
            );

        const usuarios =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaUsuarios"
            );

        tabla.innerHTML = "";

        usuarios.forEach(usuario => {

            tabla.innerHTML += `

                <tr>

                    <td>${usuario.id_usuario}</td>

                    <td>${usuario.nombre}</td>

                    <td>${usuario.correo}</td>

                    <td>${usuario.rol}</td>

                    <td>

                        <button
                            onclick="editarUsuario(
                                ${usuario.id_usuario},
                                '${usuario.nombre}',
                                '${usuario.correo}',
                                '${usuario.password}',
                                '${usuario.rol}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarUsuario(
                                ${usuario.id_usuario}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando usuarios"
        );
    }
}

function editarUsuario(
    id,
    nombre,
    correo,
    password,
    rol
){

    idUsuarioEditando = id;

    document.getElementById(
        "nombreUsuario"
    ).value = nombre;

    document.getElementById(
        "correoUsuario"
    ).value = correo;

    document.getElementById(
        "passwordUsuario"
    ).value = password;

    document.getElementById(
        "rolUsuario"
    ).value = rol;
}

async function eliminarUsuario(id){

    const confirmar =
        confirm(
            "¿Desea eliminar este usuario?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/usuarios/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        cargarUsuarios();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando usuario"
        );
    }
}


// =========================
// MUNICIPALIDADES
// =========================

function mostrarMunicipalidades(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Municipalidades</h1>

        <br>

        <div class="formulario">

            <input
                type="text"
                id="nombreMunicipalidad"
                placeholder="Nombre"
            >

            <input
                type="text"
                id="direccionMunicipalidad"
                placeholder="Dirección"
            >

            <button onclick="guardarMunicipalidad()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaMunicipalidades">

            </tbody>

        </table>
    `;

    cargarMunicipalidades();
}

async function guardarMunicipalidad(){

    const nombre =
        document.getElementById(
            "nombreMunicipalidad"
        ).value;

    const direccion =
        document.getElementById(
            "direccionMunicipalidad"
        ).value;

    let url =
        "https://sistema-transmetro-9g8y.onrender.com/municipalidades";

    let metodo =
        "POST";

    if(idMunicipalidadEditando !== null){

        url =
            `https://sistema-transmetro-9g8y.onrender.com/municipalidades/${idMunicipalidadEditando}`;

        metodo =
            "PUT";
    }

    try{

        const respuesta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        nombre,
                        direccion

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        idMunicipalidadEditando = null;

        document.getElementById(
            "nombreMunicipalidad"
        ).value = "";

        document.getElementById(
            "direccionMunicipalidad"
        ).value = "";

        cargarMunicipalidades();

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando municipalidad"
        );
    }
}



async function cargarMunicipalidades(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/municipalidades"
            );

        const municipalidades =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaMunicipalidades"
            );

        tabla.innerHTML = "";

        municipalidades.forEach(municipalidad => {

            tabla.innerHTML += `

                <tr>

                    <td>${municipalidad.id_municipalidad}</td>

                    <td>${municipalidad.nombre}</td>

                    <td>${municipalidad.direccion}</td>

                    <td>

                        <button
                            onclick="editarMunicipalidad(
                                ${municipalidad.id_municipalidad},
                                '${municipalidad.nombre}',
                                '${municipalidad.direccion}'
                            )"
                        >
                            Editar
                        </button>

                        <button
                            onclick="eliminarMunicipalidad(
                                ${municipalidad.id_municipalidad}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando municipalidades"
        );
    }
}

function editarMunicipalidad(
    id,
    nombre,
    direccion
){

    idMunicipalidadEditando = id;

    document.getElementById(
        "nombreMunicipalidad"
    ).value = nombre;

    document.getElementById(
        "direccionMunicipalidad"
    ).value = direccion;
}

async function eliminarMunicipalidad(id){

    const confirmar =
        confirm(
            "¿Desea eliminar esta municipalidad?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/municipalidades/${id}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje || datos.error
        );

        cargarMunicipalidades();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando municipalidad"
        );
    }
}

async function cargarMunicipalidadesLinea(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/municipalidades"
            );

        const municipalidades =
            await respuesta.json();

        const select =
            document.getElementById(
                "municipalidadLinea"
            );

        select.innerHTML = "";

        municipalidades.forEach(municipalidad => {

            select.innerHTML += `

                <option
                    value="${municipalidad.id_municipalidad}"
                >
                    ${municipalidad.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando municipalidades"
        );
    }
}



async function cargarMunicipalidadesEstacion(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/municipalidades"
            );

        const municipalidades =
            await respuesta.json();

        const select =
            document.getElementById(
                "municipalidadEstacion"
            );

        select.innerHTML = "";

        municipalidades.forEach(municipalidad => {

            select.innerHTML += `

                <option
                    value="${municipalidad.id_municipalidad}"
                >
                    ${municipalidad.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando municipalidades"
        );
    }
}

async function cargarLineasEstacion(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/lineas"
            );

        const lineas =
            await respuesta.json();

        const select =
            document.getElementById(
                "lineaEstacion"
            );

        select.innerHTML =
            `<option value="">
                Seleccione una línea
            </option>`;

        lineas.forEach(linea => {

            select.innerHTML += `

                <option
                    value="${linea.id_linea}"
                >
                    Línea ${linea.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}
// =========================
// RUTAS
// =========================

function mostrarRutas(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Gestión de Rutas</h1>

        <br>

        <div class="formulario">

            <select id="lineaRuta">

            </select>

            <select id="estacionRuta">

            </select>

            <input
                type="number"
                id="ordenRuta"
                placeholder="Orden"
            >

            <input
                type="number"
                step="0.01"
                id="distanciaRuta"
                placeholder="Distancia siguiente (km)"
            >

            <button onclick="guardarRuta()">
                Guardar
            </button>

        </div>

        <table>

            <thead>

                <tr>

                    <th>Línea</th>
                    <th>Estación</th>
                    <th>Orden</th>
                    <th>Distancia</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody id="tablaRutas">

            </tbody>

        </table>
    `;

    cargarLineasRuta();
    cargarEstacionesRuta();
    cargarRutas();
}

async function cargarRutas(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/rutas"
            );

        const rutas =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaRutas"
            );

        tabla.innerHTML = "";

        rutas.forEach(ruta => {

            tabla.innerHTML += `

                <tr>

                    <td>${ruta.linea}</td>

                    <td>${ruta.estacion}</td>

                    <td>${ruta.orden_estacion}</td>

                    <td>${ruta.distancia_siguiente} km</td>

                    <td>

                        <button
                            onclick="eliminarRuta(
                                ${ruta.id_linea},
                                ${ruta.id_estacion}
                            )"
                        >
                            Eliminar
                        </button>

                    </td>

                </tr>

            `;
        });

    }
    catch(error){

        console.log(error);

        alert(
            "Error cargando rutas"
        );
    }
}


async function cargarLineasRuta(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/lineas"
            );

        const lineas =
            await respuesta.json();

        const select =
            document.getElementById(
                "lineaRuta"
            );

        select.innerHTML = "";

        lineas.forEach(linea => {

            select.innerHTML += `

                <option
                    value="${linea.id_linea}"
                >
                   Línea ${linea.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}

async function cargarEstacionesRuta(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/estaciones"
            );

        const estaciones =
            await respuesta.json();

        const select =
            document.getElementById(
                "estacionRuta"
            );

        select.innerHTML = "";

        estaciones.forEach(estacion => {

            select.innerHTML += `

                <option
                    value="${estacion.id_estacion}"
                >
                    ${estacion.nombre}
                </option>

            `;
        });

    }
    catch(error){

        console.log(error);
    }
}

async function guardarRuta(){

    const id_linea =
        document.getElementById(
            "lineaRuta"
        ).value;

    const id_estacion =
        document.getElementById(
            "estacionRuta"
        ).value;

    const orden_estacion =
        document.getElementById(
            "ordenRuta"
        ).value;

    const distancia_siguiente =
        document.getElementById(
            "distanciaRuta"
        ).value;

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/rutas",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        id_linea:id_linea,
                        id_estacion:id_estacion,
                        orden_estacion:orden_estacion,
                        distancia_siguiente:distancia_siguiente

                    })
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
            
        );
        document.getElementById(
            "ordenRuta"
        ).value = "";

        document.getElementById(
            "distanciaRuta"
        ).value = "";

        cargarRutas();
        

    }
    catch(error){

        console.log(error);

        alert(
            "Error guardando ruta"
        );
    }
}

async function eliminarRuta(
    idLinea,
    idEstacion
){

    const confirmar =
        confirm(
            "¿Desea eliminar esta ruta?"
        );

    if(!confirmar){
        return;
    }

    try{

        const respuesta =
            await fetch(
                `https://sistema-transmetro-9g8y.onrender.com/rutas/${idLinea}/${idEstacion}`,
                {
                    method:"DELETE"
                }
            );

        const datos =
            await respuesta.json();

        alert(
            datos.mensaje
        );

        cargarRutas();

    }
    catch(error){

        console.log(error);

        alert(
            "Error eliminando ruta"
        );
    }
}




// =========================
// INICIO
// =========================

const usuario =
    localStorage.getItem(
        "usuarioLogueado"
    );

if(!usuario){

    window.location.href =
        "login.html";
}
mostrarDashboard();
cargarUsuarioLogueado();

// =========================
// USUARIO LOGUEADO
// =========================

function cargarUsuarioLogueado(){

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuarioLogueado"
            )
        );

    if(!usuario){
        return;
    }

    document.getElementById(
        "nombreUsuarioTopbar"
    ).textContent =
        usuario.nombre;

    document.getElementById(
        "rolUsuarioTopbar"
    ).textContent =
        usuario.rol;

    document.getElementById(
        "avatar"
    ).textContent =
        usuario.nombre.charAt(0).toUpperCase();
}
// =========================
// CERRAR SESIÓN
// =========================

function cerrarSesion(){

    localStorage.removeItem(
        "usuarioLogueado"
    );

    window.location.href =
        "login.html";
}

// =========================
// BUSCADOR
// =========================

function buscarContenido(){

    const texto =
        document.getElementById(
            "buscador"
        ).value.toLowerCase();

    const filas =
        document.querySelectorAll(
            "table tbody tr"
        );

    filas.forEach(fila => {

        const contenido =
            fila.textContent.toLowerCase();

        if(
            contenido.includes(texto)
        ){

            fila.style.display = "";

        }else{

            fila.style.display = "none";
        }
    });
}

function mostrarMapa(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Mapa del Sistema Transmetro</h1>

        <br>

        <iframe
            src="https://www.google.com/maps/d/embed?mid=1OHKGTQ0nKQ1PNmE30sQIxY_gMR_JTdQ&ehbc=2E312F"
            width="100%"
            height="900"
            style="
                border:none;
                border-radius:10px;
                background:white;
            "
        >
        </iframe>

    `;
}

function mostrarReportes(){

    document.getElementById(
        "contenido"
    ).innerHTML = `

        <h1>Reportes del Sistema</h1>

        <br>

        <h2>
            Estaciones por Línea
        </h2>

        <table>

            <thead>

                <tr>

                    <th>Línea</th>
                    <th>Estación</th>
                    <th>Ubicación</th>

                </tr>

            </thead>

            <tbody id="tablaReporteEstaciones">

            </tbody>

        </table>

        <br><br>

        <h2>
            Buses por Línea
        </h2>

        <table>

            <thead>

                <tr>

                    <th>Línea</th>
                    <th>Placa</th>
                    <th>Estado</th>

                </tr>

            </thead>

            <tbody id="tablaReporteBuses">

            </tbody>

        </table>

        <br><br>

        <h2>
            Pilotos Asignados
        </h2>

        <table>

            <thead>

                <tr>

                    <th>Piloto</th>
                    <th>Bus</th>
                    <th>Línea</th>

                </tr>

            </thead>

            <tbody id="tablaReportePilotos">

            </tbody>

        </table>

    `;

    cargarReporteEstaciones();
    cargarReporteBuses();
    cargarReportePilotos();
}

async function cargarReporteEstaciones(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/reporte-estaciones"
            );

        const datos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaReporteEstaciones"
            );

        tabla.innerHTML = "";

        datos.forEach(item => {

            tabla.innerHTML += `
                <tr>
                    <td>${item.linea}</td>
                    <td>${item.estacion}</td>
                    <td>${item.ubicacion}</td>
                </tr>
            `;
        });

    }
    catch(error){

        console.log(error);
    }
}

async function cargarReporteBuses(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/reporte-buses"
            );

        const datos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaReporteBuses"
            );

        tabla.innerHTML = "";

        datos.forEach(item => {

            tabla.innerHTML += `
                <tr>
                    <td>${item.linea}</td>
                    <td>${item.placa}</td>
                    <td>${item.estado}</td>
                </tr>
            `;
        });

    }
    catch(error){

        console.log(error);
    }
}

async function cargarReportePilotos(){

    try{

        const respuesta =
            await fetch(
                "https://sistema-transmetro-9g8y.onrender.com/reporte-pilotos"
            );

        const datos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaReportePilotos"
            );

        tabla.innerHTML = "";

        datos.forEach(item => {

            tabla.innerHTML += `
                <tr>
                    <td>${item.piloto}</td>
                    <td>${item.placa}</td>
                    <td>${item.linea}</td>
                </tr>
            `;
        });

    }
    catch(error){

        console.log(error);
    }
}
