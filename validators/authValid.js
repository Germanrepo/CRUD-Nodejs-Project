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
            try {
                const querySelectUsername = 'SELECT * FROM users WHERE _username = ?'
                const [nameRepeat] = await (await db).query(querySelectUsername, [value])
                if (nameRepeat[0]) throw new Error('origen user')
            } catch (e) {
                console.log(e)
                if (e == 'Error: origen user') throw new Error('¡Nombre de usuario ya en uso!')
                throw new Error('Ha ocurrido un error')
            }
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
            try {
                const querySelectUsername = 'SELECT * FROM users WHERE _username = ?'
                const [user] = await (await db).query(querySelectUsername, [value])

                if (!user[0]) throw new Error('origen user')
            } catch (e) {
                console.log(e)
                if (e == 'Error: origen user') throw new Error('¡Nombre de usuario incorrecto!')
                throw new Error('Ha ocurrido un error')
            }
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
            try {
                const { username } = req.body

                const querySelectUsername = 'SELECT * FROM users WHERE _username = ?'
                const [user] = await (await db).query(querySelectUsername, [username])

                const passwordCompaired = await bcrypt.compare(value, user[0]._password)

                if (!passwordCompaired) throw new Error('origen user')
            } catch (e) {
                console.log(e)
                if (e == 'Error: origen user') throw new Error('¡Contraseña incorrecta!')
                throw new Error('Ha ocurrido un error')
            }

        })
]

module.exports = { validatorRegister, validatorSession }
