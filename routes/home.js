const express = require('express')
const { homeValidate } = require('../middlewares/home')
const { homeVista } = require('../controllers/homeControll')

// ================ Inicializacion ===============
const home = express.Router()

// ================ Home ===============
home.get('/', homeValidate, homeVista)

module.exports = home