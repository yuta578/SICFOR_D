const mysql=require("mysql2")
const express=require("express")
const path=require("path")
const app=express()
const cors=require("cors")
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

app.use(cors())

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../../frontend/grupo_d')))

// Crear conexión usando variables de entorno
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

// Probar la conexión
conexion.connect((error) => {
    if (error) {
        console.error('Error conectando a la base de datos:', error)
        throw error
    }
    console.log('Conexión exitosa a MySQL')
})

app.get('/cursos', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/grupo_d/curso.html'))
})
app.get('/api/cursos', (req, res) => {
    const sql = 'SELECT * FROM cursos'
    conexion.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener cursos:', error)
            return res.status(500).json({ error: 'Error al obtener cursos' })
        }
        res.json(results)
    })
})
app.get('/api/estudiantes', (req, res) => {
    const sql = 'SELECT i.*, e.nombres, c.titulo, c.id FROM inscripciones i JOIN cursos c ON i.id_curso = c.id jOIN estudiantes e ON i.id_estudiante = e.id'
    conexion.query(sql, (error, results) => {
        if (error) {
            console.error('Error al obtener estudiantes:', error)
            return res.status(500).json({ error: 'Error al obtener estudiantes' })
        }
        res.json(results)
    })
})

// Iniciar servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})

module.exports = { conexion, app }
