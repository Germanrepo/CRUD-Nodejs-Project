const express = require('express')
const { createVista, create, editVista, edit, clear } = require('../controllers/projectsControll')
const { validatorProject } = require('../validators/projectValid')

// ================ Inicializacion ===============
const project = express.Router()

// ================ Crear proyecto ===============
project.get('/crear', createVista)

project.post('/crear', validatorProject, create)

// ================ Editar proyecto ===============
project.get('/editar/:id_proy', editVista)

project.post('/editar/:id_proy', validatorProject, edit)

// ================ Eliminar proyecto ===============
project.get('/borrar/:id_proy', clear)

module.exports = project
