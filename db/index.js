const { Client } = require('pg')
module.exports = {
  query: (sqlCommand) => {
    const client = new Client({
      connectionString: 'postgresql://postgres:postgres@localhost:5432/set',
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