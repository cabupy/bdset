# Como procesar los archivos de RUCs de la SET 

1. Descargamos los archivos `.zip`
1. Se descomprimen y se procesan los `.txt`
1. Se transpilan a archivos `.sql` con comandos inserts
1. Se corre un `bash script` para cargar a la BD PostgreSQL, tabla contribuyente.

### Crear carpetas

```bash
$ mkdir files
$ cd files
$ mkdir sql
$ mkdir txt
$ mkdir zip
$ cd ..
$ mkdir logs
```

### Autor

- Carlos Vallejos, `Vamyal S.A.`

### Licencia MIT