const dbConnection = require('../dataBase/dbConnection')
const path = require('path')

const db = dbConnection()

const homeValidate = async (req, res, next) => {
    try {
        if (!req.cookies.id_session) return res.sendFile(path.resolve('./static/index.html'))
        if (req.cookies.id_session) {
            const { id_session } = req.cookies

            const querySelectIdSession = 'SELECT _id_session FROM sesions'
            const [idSession] = await (await db).query(querySelectIdSession)

            const sessionExist = idSession.find(e => e._id_session === id_session)
            if (!sessionExist) return res.sendFile(path.resolve('./static/index.html'))
        }
        next()
    } catch (e) {
        console.log(e)
    }
}

module.exports = { homeValidate }