const dbConnection = require('../dataBase/dbConnection')
const { validationResult } = require('express-validator')

// ================ Inicializacion ===============
db = dbConnection()

// ================ Crear proyecto ===============
const createVista = async (req, res) => {
    try {
        const { id_session } = req.cookies

        const querySelectIdUserSession = 'SELECT _id_user_count FROM sesions WHERE _id_session = ?'
        const querySelectUsername = 'SELECT _username FROM users WHERE _id_user = ?'

        const [idUserCount] = await (await db).query(querySelectIdUserSession, [id_session])
        const [usernameCount] = await (await db).query(querySelectUsername, [idUserCount[0]._id_user_count])

        res.render('projects/create', { usernameCount })

    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}
const create = async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const error = result.array()
            const values = req.body
            const { id_session } = req.cookies

            const querySelectId = 'SELECT _id_user_count FROM sesions WHERE _id_session = ?'
            const querySelectUsername = 'SELECT _username FROM users WHERE _id_user = ?'

            const [idUserCount] = await (await db).query(querySelectId, [id_session])
            const [usernameCount] = await (await db).query(querySelectUsername, [idUserCount[0]._id_user_count])

            return res.render('projects/create', { error, values, usernameCount })
        }

        const { title, description, link } = req.body
        const { id_session } = req.cookies

        const querySelectIdUserSession = 'SELECT _id_user_count FROM sesions WHERE _id_session = ?'
        const queryInsertDataProject = 'INSERT INTO projects (_title, _description, _link, _id_user_count_1) VALUES (?, ?, ?, ?)'

        const [idUserCount] = await (await db).query(querySelectIdUserSession, [id_session])

        const paramsInsertProject = [title, description, link, idUserCount[0]._id_user_count]
        await (await db).query(queryInsertDataProject, paramsInsertProject)

        res.redirect('/')

    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error al crear')
    }
}

// ================ Editar proyecto ===============
const editVista = async (req, res) => {
    try {
        const { id_proy } = req.params
        const { id_session } = req.cookies

        const querySelectIdUserSession = 'SELECT _id_user_count FROM sesions WHERE _id_session = ?'
        const querySelectUsername = 'SELECT _username FROM users WHERE _id_user = ?'
        const querySelectDataProject = 'SELECT _id_project, _title, _description, _link FROM projects WHERE _id_project = ?'

        const [idUserCount] = await (await db).query(querySelectIdUserSession, [id_session])
        const [usernameCount] = await (await db).query(querySelectUsername, [idUserCount[0]._id_user_count])
        const [dataProject] = await (await db).query(querySelectDataProject, [id_proy])


        res.render('projects/edit', { dataProject, usernameCount })
    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}
const edit = async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const error = result.array()
            const values = req.body
            const { id_session } = req.cookies
            const { id_proy } = req.params

            const querySelectId = 'SELECT _id_user_count FROM sesions WHERE _id_session = ?'
            const querySelectUsername = 'SELECT _username FROM users WHERE _id_user = ?'

            const [idUserCount] = await (await db).query(querySelectId, [id_session])
            const [usernameCount] = await (await db).query(querySelectUsername, [idUserCount[0]._id_user_count])

            return res.render('projects/edit', { error, values, usernameCount, id_proy })
        }

        const { id_proy } = req.params
        const { title, description, link } = req.body

        const paramsUpdateproject = [title, description, link, id_proy]
        const queryUpdateProject = 'UPDATE projects SET _title = ?, _description = ?, _link = ? WHERE _id_project = ?'

        await (await db).query(queryUpdateProject, paramsUpdateproject)

        res.redirect('/')
    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}

// ================ Eliminar proyecto ===============
const clear = async (req, res) => {
    try {
        const { id_proy } = req.params

        const queryDeleteProject = 'DELETE FROM projects WHERE _id_project = ?'

        await (await db).query(queryDeleteProject, [id_proy])

        res.redirect('/')
    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}

module.exports = {
    createVista,
    create,
    editVista,
    edit,
    clear
}