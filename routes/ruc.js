const router = require('express').Router()
const db = require('../db')

router.get('/:numero', async (req, res) => {

  let sqlCommand = `SELECT * FROM public.contribuyente WHERE ruc = ${req.params.numero}`

  try {
    const result = await db.query(sqlCommand)
    console.log(result.length)
    if (!result.length) {
      return res.status(404).json({message: `No se encontro el RUC: ${req.params.numero}, o no es contribuyente.`})
    }
    res.status(200).json(result[0]) 
  } catch (error) {
    console.log(`Error: ${err}`)
    res.status(500).json({ message: `Ocurrio un error inesperado al consultar el RUC: ${req.params.numero}` })
  }

})

router.post('/', async (req, res) => {

  if (!req.body.nombre){
    return res.status(404).json({message: `No se encontro el parametro nombre`}) 
  }

  const sqlCommand = `SELECT * FROM public.contribuyente WHERE nombre LIKE '${req.body.nombre.toUpperCase()}%' limit 20`

  try {
    const result = await db.query(sqlCommand)
    if (!result) {
      return res.status(404).json({message: `No se encontro el RUC con nombre: ${req.body.nombre}, o no es contribuyente.`})
    }
    res.status(200).json(result)
  } catch (error) {
    console.log(`Error: ${err}`)
    res.status(500).json({ message: `Ocurrio un error inesperado al consultar el RUC con nombre: ${req.body.nombre}` })
  }

})

module.exports = router