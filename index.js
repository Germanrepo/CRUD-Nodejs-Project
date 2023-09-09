const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const { SesionValidate } = require('./middlewares/sesion')


// ====================== Inicializacion ========================
const app = express()


// ====================== Configuraciones ========================
dotenv.config()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/assets'))


// ====================== Variables ========================
const PORT = process.env.PORT || 3000


// ====================== Middlewares ========================
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


// ====================== Rutas ========================
app.use(require('./routes/home'))
app.use(require('./routes/account'))
app.use(SesionValidate, require('./routes/projects'))


// ====================== Server escuhando ========================
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})