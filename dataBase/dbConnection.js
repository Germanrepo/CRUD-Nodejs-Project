const mySQL = require('mysql2/promise')
const { database } = require('./connectionConfig')

module.exports = () => {
    return mySQL.createConnection(database)
}

