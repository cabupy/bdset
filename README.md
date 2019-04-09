# Como procesar los archivos de RUCs de la SET 

1. Descargamos los archivos `.zip`
1. Se descomprimen y se procesan los `.txt`
1. Se transpilan a archivos `.sql` con comandos inserts
1. Se corre un `bash script` para cargar a la BD PostgreSQL, tabla contribuyente.

### Crear carpetas

En la raiz de nuestro proyecto bdset, creamos las siguientes carpetas:

```bash
$ mkdir config
$ mkdir files
$ cd files
$ mkdir sql
$ mkdir txt
$ mkdir zip
$ cd ..
$ mkdir logs
```

### Contenido del index.js en ./config

El archivo `index.js` dentro de la carpeta config contiene los siguientes parametros (keys)

```javascript
module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 37200,
  pathDB: 'postgresql://postgres:postgres@localhost:5432/set',
  corsOptions: {
    methods: ['HEAD', 'OPTIONS', 'GET', 'POST'],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
  },
  headerObj: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Host': 'www.set.gov.py',
    'Origin': 'www.set.gov.py',
  },
  urlSET: 'http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/'
}
```

### Autor

- Carlos Vallejos, `Vamyal S.A.`

### Licencia MIT