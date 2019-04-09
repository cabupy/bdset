const { Client } = require('pg')
const config = require('../config')
module.exports = {
  query: (sqlCommand) => {
    const client = new Client({
      connectionString: config.pathDB,
    })
    return new Promise((resolve, reject) => {
      client.connect()
        .then(() => {
          client.query(sqlCommand, (err, res) => {
            if (err) return reject(err.message)
            resolve(res.rows)
            client.end()
          })
        })
        .catch(err => reject(`Error al conectarse a la BD: ${err.message}`))
    })
  }
}