"use strict"

const restify = require('restify')
const server = restify.createServer()

server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

const books = require('./modules/books.js')

server.get('/', (req, res, next) => {
	res.redirect('/books', next)
})

// collection used for searching for books. Requires a 'q' parameter
server.get('/books', (req, res) => {
  books.search(req, data => {
    res.setHeader('content-type', data.contentType)
    res.send(data.code, data.response)
    res.end()
  })
})

const port = process.env.PORT || 8080;
server.listen(port, err => {
  if (err) {
      console.error(err)
  } else {
    console.log('App is ready at : ' + port)
  }
})
