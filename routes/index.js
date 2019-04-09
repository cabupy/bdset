const router = require('express').Router()
const Ruc = require('./ruc')

router.use('/ruc', Ruc)

module.exports = router