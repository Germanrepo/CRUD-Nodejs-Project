const dbConnection = require("../dataBase/dbConnection")

const db = dbConnection()

const SesionValidate = async (req, res, next) => {
    try {
        if (req.cookies.id_session) {
            const { id_session } = req.cookies

            const querySelectIdSession = 'SELECT _id_session FROM sesions'
            const [idSession] = await (await db).query(querySelectIdSession)

            const sessionExist = idSession.find(e => e._id_session === id_session)
            if (sessionExist) return next()
        }

        res.redirect('/registrarse')
    } catch (e) {
        console.log(e)
    }
}

module.exports = { SesionValidate }