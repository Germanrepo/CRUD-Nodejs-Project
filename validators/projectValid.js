const { body } = require('express-validator')

const validatorProject = [
    body('title', '¡Ingrese un titulo!')
        .exists()
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 255 })
        .escape(),
    body('description', '¡Ingrese una descripcion!')
        .exists()
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1 })
        .escape(),
    body('link', '¡Ingrese un link valido (debe contener https)!')
        .exists()
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1 })
        .isURL({
            protocols: ['https'],
            require_protocol: true,
        })
]

module.exports = { validatorProject }