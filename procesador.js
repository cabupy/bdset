/*
  Descripcion:

  1. Bajamos los archivos .zip de RUCs de la SET
  2. Descomprimimos los .zip a .txt
  3. Convertimos los .txt a SQL .sql
  4. Cargarmos la BD PostgreSQL con bash script [psql] los .sql
  5. Fin

  Autor: Carlos Vallejos
  Empresa: Vamyal S.A.
  Fecha: 20.10.18
  Modificado: 08.04.19 : Mejoras en el codigo.

*/

const path = require('path')
const fs = require('fs')
const EventEmitter = require('events')
const request = require('request')
const decompress = require('decompress')
const readline = require('readline')
// para ejecutar programas en linea de comandos.
const { exec } = require('child_process')

const config = require('./config')

//const archivos = ['ruc0.zip', 'ruc1.zip', 'ruc2.zip', 'ruc3.zip', 'ruc4.zip', 'ruc5.zip', 'ruc6.zip', 'ruc7.zip', 'ruc8.zip', 'ruc9.zip']
//const archivos = ['ruc1.zip']
// Generamos los 10 nombres de archivos ruc[0..9].zip 
const archivos = [...Array(10).keys()].map(value => `ruc${value}.zip`)

//const headers = config.headerObj

class Emisor extends EventEmitter { }

const emisor = new Emisor()

let procesados = 0

emisor.on('ProcessFile', (inputFile, sqlFile) => {

  let contentFile = ``

  // Si ya existe el archivo sql previamente, lo borramos
  if (fs.existsSync(`files/sql/${sqlFile}`)) {
    fs.unlink(`files/sql/${sqlFile}`, (err) => {
      if (err) {
        return console.log(`Error al borrar el archivo files/sql/${sqlFile}. Mensaje: ${err.message}`)
      }
      console.log(`El archivo files/sql/${sqlFile} ha sido borrado.`)
    })
  }

  const outstream = new (require('stream'))(),
    instream = fs.createReadStream(`files/txt/${inputFile}`),
    rl = readline.createInterface(instream, outstream)

  let count = 1

  rl.on('line', function (line) {

    const campos = line.split('|')

    const contribuyente = {
      ruc: +campos[0].match(/\d+/g).map(Number),
      nombre: campos[1].replace(/\'/g, "\'\'"),
      dv: +campos[2],
      anterior: campos[3].replace(/\'/g, "\'\'")
    }
 
    contentFile += `INSERT INTO public.contribuyente VALUES ( ${contribuyente.ruc}, '${contribuyente.nombre}', ${contribuyente.dv}, '${contribuyente.anterior}' );\n`
    
    count++

  })

  rl.on('close', function (line) {
    
    //console.log(contentFile)

    try {
      fs.appendFileSync(`files/sql/${sqlFile}`, contentFile, 'utf8')
      contentFile = ``
    } catch (error) {
      console.log(error.message)
    }
    
    procesados++
    
    console.log(`${procesados}) Lectura del archivo ${inputFile} concluida. Lineas: ${count}`)
    
    if (procesados==10){
      console.log(`Ejecutamos el archivo bash script.`)
      exec(`/bin/sh ${path.join(__dirname, 'psql-exec.sh')}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }
        console.log(`Salida: ${stdout}`)
        if (stderr) {
          console.log(`stderr: ${stderr}`)
        }
        
      })
    }
  })

})

emisor.on('DownloadFile', (success, pathFile) => {
  if (success) {
    console.log(`Guardamos el archivo en ${pathFile}`)

    const txtFile = pathFile.split('/')[2].split('.')[0] + '.txt'
    const sqlFile = pathFile.split('/')[2].split('.')[0] + '.sql'

    if (fs.existsSync(pathFile)) {
      decompress(pathFile, 'files/txt')
        .then(files => {
          //processFile(txtFile, sqlFile)
          console.log(`El archivo ${pathFile} ha sido descomprimido.`)
          emisor.emit('ProcessFile', txtFile, sqlFile)       
        })
        .catch(err => {
          console.log(`${pathFile}: ERROR DECOMPRESS, ${err}.`)
        })
    } else {
      console.log(`${pathFile}: no se encontro el archivo.`)
    }
  } else {
    console.log('ERROR:' + pathFile)
  }
})

const downloadFileEE = (archivo) => {

  const url = `${config.urlSET}${archivo}`
  const pathFile = `files/zip/${archivo}`
  const w = fs.createWriteStream(pathFile)
  const r = request.get({ url, headers : config.headerObj })

  r.on('response', function (res) {

    console.log(`Recibimos ${res.headers['content-disposition']} de tipo ${res.headers['content-type']}`)

    res.pipe(w);

    w.on('finish', function () {
      emisor.emit('DownloadFile', true, pathFile)
    })

    w.on('error', function (error) {
      emisor.emit('DownloadFile', false, `${pathFile}: ERROR WRITE STREAM, ${error}.`)
    })

  })

  r.on('error', function (error) {
    emisor.emit('DownloadFile', false, `${pathFile}: ERROR REQUEST GET, ${error}.`)
  })

}

archivos.map(archivo => downloadFileEE(archivo))
