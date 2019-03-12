/*
  Autor: Carlos Vallejos
  Decripcion: API RUC - SET PY
*/

const http = require('http')
const bodyParser = require('body-parser');
//const morgan = require('morgan');
const volleyball = require('volleyball')
const cors = require('cors');
const app = require('express')()
const routes = require('./routes')

const ip = process.env.IP || 'localhost'
const port = process.env.PORT || 18200

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
  methods: ['HEAD', 'OPTIONS', 'GET', 'POST'],
  credentials: true,
  maxAge: 3600,
  preflightContinue: false,
}))
// Algunas cuestiones para estar detras de NGINX
app.set('trust proxy', true)
app.set('strict routing', true)
app.set('case sensitive routing', true)
// Agragamos el header powered-by Vamyal S.A. en un middleware
app.set('x-powered-by', false)
app.use( (req, res, next) => {
  res.header('X-Powered-By', 'Vamyal S.A. <vamyal.com>');
  res.header('X-Hello-Human', 'Somos Vamyal, Escribinos a <contacto@vamyal.com>');
  next();
})
// Configurar la ruta de archivos estáticos
// app.use(morgan('combined', {
//   skip: function (req, res) {
//     return req.method != 'GET' && req.method != 'POST';
//   }
// }))

app.use(volleyball)

app.use('/v1', routes)

// El resto de metodos y rutas
app.use('*', function (req, res, next) {
  res.status(200).json({
    success: true,
    message: 'Vamyal S.A. 2018 ! -  API para CONSULTAR RUCS - SET PY'
  });
  next();
});

// Arrancamos el Server Express
console.time('Arrancamos el server en');
var server = http.createServer(app).listen(port, ip, function () {
  console.log('API RUC - API en http://%s:%s', server.address().address, server.address().port)
  console.timeEnd('Arrancamos el server en')
})

// Si hay una promesa sin un catch 
process.on('unhandledRejection', (reason, p) => {
  console.log(`Unhandled Rejection at: ${p} reason: ${reason}`)
  process.exit(1)
})

// Si ocurre alguna exception que no este debidamente tratada.
process.on('uncaughtException', (err) => {
  console.error(`Caught exception: ${err}\n`)
  process.exit(1)
})
