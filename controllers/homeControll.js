const dbConnection = require('../dataBase/dbConnection')

// ================ Inicializacion ===============
const db = dbConnection()

// ================ Home controller ===============
const homeVista = async (req, res) => {
    try {
        const { id_session } = req.cookies

        const querySelectIdUserSession = 'SELECT _id_user_count FROM sesions WHERE _id_session = ?'
        const querySelectDataProject = 'SELECT * FROM projects WHERE _id_user_count_1 = ?'
        const querySelectUsername = 'SELECT _username FROM users WHERE _id_user = ?'

        const [idUserCount] = await (await db).query(querySelectIdUserSession, [id_session])
        const [proyectos] = await (await db).query(querySelectDataProject, [idUserCount[0]._id_user_count])
        const [usernameCount] = await (await db).query(querySelectUsername, [idUserCount[0]._id_user_count])

        res.render('projects/home', { proyectos, usernameCount })
    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}

module.exports = { homeVista }