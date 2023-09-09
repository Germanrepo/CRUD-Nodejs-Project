const { body } = require('express-validator');
const bcrypt = require('bcryptjs')
const dbConnection = require('../dataBase/dbConnection');

const db = dbConnection()

const validatorRegister = [
    body('username', '¡Ingrese un nombre de usuario valido de entre 3 y 20 caracteres!')
        .exists()
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .isLength({ min: 3, max: 20 })
        .custom(async (value) => {
            const [nameRepeat] = await (await db).query('SELECT * FROM users WHERE _username = ?', [value])
            if (nameRepeat[0]) throw new Error('¡Nombre de usuario ya en uso!')
        }),
    body('password', '¡La constraseña debe tener minimo 8 caractares que incluyan simbolos, numeros, mayusculas y minusculas!')
        .exists()
        .trim()
        .notEmpty()
        .escape()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .isLength({ max: 255 })
]

const validatorSession = [
    body('username', '¡Nombre de usuario incorrecto!')
        .exists()
        .trim()
        .notEmpty()
        .escape()
        .isString()
        .isLength({ min: 3, max: 20 })
        .custom(async (value) => {
            const [user] = await (await db).query('SELECT * FROM users WHERE _username = ?', [value])

            if (!user[0]) throw new Error('¡Nombre de usuario incorrecto!')
        }),
    body('password', '¡Contraseña incorrecta!')
        .exists()
        .trim()
        .notEmpty()
        .escape()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .isLength({ max: 255 })
        .custom(async (value, { req }) => {
            const { username } = req.body

            const [user] = await (await db).query('SELECT * FROM users WHERE _username = ?', [username])

            const passwordCompaired = await bcrypt.compare(value, user[0]._password)

            if(!passwordCompaired) throw new Error('¡Contraseña incorrecta!')
        })
]

module.exports = { validatorRegister, validatorSession }
