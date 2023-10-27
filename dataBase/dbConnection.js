const mySQL = require('mysql2/promise')
const { database } = require('./connectionConfig')

module.exports = async () => {
    try {
        return await mySQL.createConnection(database)
    } catch (e) {
        console.log(e)
    }
}

