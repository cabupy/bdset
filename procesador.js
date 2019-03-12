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

*/

const fs = require('fs')
const EventEmitter = require('events')
const request = require('request')
const decompress = require('decompress')
const readline = require('readline')
// para ejecutar programas en linea de comandos.
const { exec } = require('child_process')

const archivos = ['ruc0.zip', 'ruc1.zip', 'ruc2.zip', 'ruc3.zip', 'ruc4.zip', 'ruc5.zip', 'ruc6.zip', 'ruc7.zip', 'ruc8.zip', 'ruc9.zip']

const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
  'Host': 'www.set.gov.py',
  'Origin': 'www.set.gov.py',
}

class Emisor extends EventEmitter { }

const emisor = new Emisor()

let procesados = 0

emisor.on('ProcessFile', (inputFile, sqlFile) => {

  // Si ya existe el archivo sql previamente, lo borramos
  if (fs.existsSync(`files/sql/${sqlFile}`)) {
    fs.unlink(`files/sql/${sqlFile}`, (err) => {
      if (err) {
        return console.log(`Error al borrar el archivo files/sql/${sqlFile}. Mensaje: ${err.message}`)
      }
      console.log(`files/sql/${sqlFile} ha sido borrado.`)
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

    //const sqlCommand = `\rINSERT INTO public.contribuyente VALUES ( ${contribuyente.ruc}, '${contribuyente.nombre}', ${contribuyente.dv}, '${contribuyente.anterior}', '${inputFile}' );`
    const sqlCommand = `\rINSERT INTO public.contribuyente VALUES ( ${contribuyente.ruc}, '${contribuyente.nombre}', ${contribuyente.dv}, '${contribuyente.anterior}' );`

    fs.appendFile(`files/sql/${sqlFile}`, sqlCommand, (err) => {
      if (err) throw err;
      //console.log(sqlCommand)
    })

    count++

  })

  rl.on('close', function (line) {
    procesados++
    console.log(`${procesados}) Lectura del archivo ${inputFile} concluida. Lineas: ${count}`)
    if (procesados==10){
      console.log(`Ejecutamos el archivo bash script.`)
      exec('/bin/sh ~/2018/node/bdset/psql-exec.sh', (error, stdout, stderr) => {
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
          console.log(`${pathFile} ha sido descomprimido.`)
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

  const url = `http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/${archivo}`

  const pathFile = `files/zip/${archivo}`
  const w = fs.createWriteStream(pathFile)

  const r = request.get({ url, headers })

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
