const express = require('express')
const { validatorRegister, validatorSession } = require('../validators/authValid')
const { registerVista, register, sessionVista, session, endSession,  } = require('../controllers/accountControll')

// ====================== Inicializacion ========================
const account = express.Router()

// =================== Registro endpoints =====================
account.get('/registrarse', registerVista)
account.post('/registrarse', validatorRegister, register)

// =================== Sesion endpoints =====================
account.get('/sesion', sessionVista)
account.post('/sesion', validatorSession,session)

// =================== Cerrar Sesion =====================
account.get('/cerrarsesion', endSession)

module.exports = account