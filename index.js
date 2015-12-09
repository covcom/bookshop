"use strict"

const restify = require('restify')
const server = restify.createServer()

server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/', (req, res) => {
	res.setHeader('content-type', 'application/json')
  res.send('Hello World')
  res.end()
})

const port = process.env.PORT || 8080;
server.listen(port, err => {
  if (err) {
      console.error(err)
  } else {
    console.log('App is ready at : ' + port)
  }
})
