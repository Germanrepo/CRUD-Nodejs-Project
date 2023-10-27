require('dotenv').config()

module.exports = {
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        ssl: {"rejectUnauthorized":true}
    }
}
