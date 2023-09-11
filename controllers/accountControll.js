const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const dbconnect = require('../dataBase/dbConnection')
const { validationResult } = require('express-validator')

const db = dbconnect()

// ============= Registrarse ============
const registerVista = (req, res) => {
    res.render('auth/singUp')
}
const register = async (req, res) => {
    try {
        //
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const error = result.array()
            const values = req.body

            return res.render('auth/singUp', { error, values })
        }

        //
        const { username, password } = req.body

        //
        const hashPassword = await bcrypt.hash(password, 10)
        const idSession = uuidv4()

        // querys
        const queryInsertUser = 'INSERT INTO users (_username, _password) VALUES (?, ?)'
        const querySelectId = 'SELECT _id_user FROM users WHERE _username = ? AND _password = ?'
        const queryInsertSession = 'INSERT INTO sesions (_id_session, _id_user_count) VALUES (?, ?)'

        // 
        const dataCount = [username, hashPassword]
        await (await db).query(queryInsertUser, dataCount)
        const [idUserCount] = await (await db).query(querySelectId, dataCount)

        const dataSession = [idSession, idUserCount[0]._id_user]
        await (await db).query(queryInsertSession, dataSession)

        //
        if (req.cookies.id_session) {
            const { id_session } = req.cookies
            const queryDeleteSession = 'DELETE FROM sesions WHERE _id_session = ?'

            await (await db).query(queryDeleteSession, [id_session])
            res.clearCookie('id_session')
        }

        //
        res.cookie('id_session', `${idSession}`, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            secure: true,
        })
        res.redirect('/')
    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}

// ============= Iniciar sesion ============
const sessionVista = (req, res) => {
    res.render('auth/login')
}
const session = async (req, res) => {
    try {
        //
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const error = result.array()

            return res.render('auth/login', { error })
        }

        //
        const { username, password } = req.body

        //
        const querySelectUser = 'SELECT * FROM users WHERE _username = ?'

        //
        const [user] = await (await db).query(querySelectUser, [username])

        //
        if (!user[0]) return res.sendStatus(404)

        //
        const passwordCompaired = await bcrypt.compare(password, user[0]._password)

        if (passwordCompaired) {
            if (req.cookies.id_session) {
                const { id_session } = req.cookies
                const queryDeleteSession = 'DELETE FROM sesions WHERE _id_session = ?'

                await (await db).query(queryDeleteSession, [id_session])
                res.clearCookie('id_session')
            }

            //
            const idSession = uuidv4()

            //
            const insertSession = [idSession, user[0]._id_user]
            const queryInsertSession = 'INSERT INTO sesions (_id_session, _id_user_count) VALUES (?, ?)'
            await (await db).query(queryInsertSession, insertSession)

            //
            res.cookie('id_session', `${idSession}`, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30,
                secure: true,
            })
            return res.redirect('/')
        }

        //
        res.redirect('/sesion')
    } catch (e) {
        console.error(e)
        res.send('Ha ocurrido un error')
    }
}

// ============= Cerrar sesion ============
const endSession = async (req, res) => {
    const { id_session } = req.cookies

    const queryDeleteSession = 'DELETE FROM sesions WHERE _id_session = ?'
    await (await db).query(queryDeleteSession, [id_session])
    res.clearCookie('id_session')

    res.redirect('/')
}

module.exports = { registerVista, register, sessionVista, session, endSession }