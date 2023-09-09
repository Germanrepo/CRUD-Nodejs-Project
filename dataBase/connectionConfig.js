require('dotenv').config()

module.exports = {
    database: {
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORTDB
    }
}