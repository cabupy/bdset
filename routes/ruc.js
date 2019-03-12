const router = require('express').Router()
const db = require('../db')

router.get('/:numero', (req, res) => {

  let sqlCommand = `SELECT * FROM public.contribuyente WHERE ruc = ${req.params.numero}`

  db
    .query(sqlCommand)
    .then(result => {
      if (!result) {
        res.status(404).json({message: `No se encontro el RUC: ${req.params.numero}, o no es contribuyente.`})
        return
      }
      res.status(200).json(result[0])
    })
    .catch(err => {
      console.log(`Error: ${err}`)
      res.status(500).json({ message: `Ocurrio un error inesperado al consultar el RUC: ${req.params.numero}` })
    })

})

router.post('/', (req, res) => {

  if (!req.body.nombre){
    res.status(404).json({message: `No se encontro el parametro nombre`})
    return
  }

  const sqlCommand = `SELECT * FROM public.contribuyente WHERE nombre LIKE '${req.body.nombre.toUpperCase()}%' limit 20`

  db
    .query(sqlCommand)
    .then(result => {
      if (!result) {
        res.status(404).json({message: `No se encontro el RUC con nombre: ${req.body.nombre}, o no es contribuyente.`})
        return
      }
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(`Error: ${err}`)
      res.status(500).json({ message: `Ocurrio un error inesperado al consultar el RUC con nombre: ${req.body.nombre}` })
    })

})

module.exports = router