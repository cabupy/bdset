
module.exports = {
  host: 'localhost',
  port: 37200,
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