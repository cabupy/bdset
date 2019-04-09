# BDSET

> El presente proyecto automatiza la descarga de los archivos ruc[0..9].zip de la SET,
> los procesa y los inserta en una base de datos `PostgreSQL`, el mismo se encuentra 
> disponible bajo licencia MIT

### Listado de archivos

1. [ruc0.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc0.zip)
1. [ruc1.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc1.zip)
1. [ruc2.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc2.zip)
1. [ruc3.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc3.zip)
1. [ruc4.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc4.zip)
1. [ruc5.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc5.zip)
1. [ruc6.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc6.zip)
1. [ruc7.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc7.zip)
1. [ruc8.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc8.zip)
1. [ruc9.zip](http://www.set.gov.py/rest/contents/download/collaboration/sites/PARAGUAY-SET/documents/informes-periodicos/ruc/ruc9.zip)


### Cuales son los pasos para procesar los archivos de RUCs de la SET 

1. Descargamos los archivos `.zip`
1. Se descomprimen y se procesan los `.txt`
1. Se transpilan a archivos `.sql` con comandos inserts
1. Se corre un `bash script` para cargar a la BD PostgreSQL, tabla contribuyente.

### Como se instala ?

```sh
$ git clone https://github.com/cabupy/bdset.git
$ cd bdset
$ npm install
```

### Se deben crear las siguientes carpetas

En la raiz de nuestro proyecto bdset, creamos las siguientes carpetas:

```sh
$ mkdir config
$ mkdir files
$ cd files
$ mkdir sql
$ mkdir txt
$ mkdir zip
$ cd ..
$ mkdir logs
```

### Crear la base de datos `contadores`

```sql
-- Database: contadores

-- DROP DATABASE contadores;

CREATE DATABASE contadores
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

### Crear la tabla `contribuyente`

```sql
-- Table: public.contribuyente

-- DROP TABLE public.contribuyente;

CREATE TABLE public.contribuyente
(
    ruc integer NOT NULL,
    nombre character varying NOT NULL,
    dv smallint NOT NULL,
    anterior character varying NOT NULL,
    CONSTRAINT contribuyente_pkey PRIMARY KEY (ruc)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
```

### Contenido del archivo `index.js` dentro de la carpeta `./config`

El archivo `index.js` dentro de la carpeta config contiene los siguientes parametros (keys)

```javascript
module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 37200,
  pathDB: 'postgresql://postgres:postgres@localhost:5432/contadores',
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

### Como se corre el proceso

```sh
$ node procesador.js
```

### Como levantamos el `HTTP Server`

```sh
$ node server.js
```

### Autor

- Carlos Vallejos, `Vamyal S.A.`

### Licencia MIT: [Licencia](https://github.com/cabupy/bdset/blob/master/LICENSE)