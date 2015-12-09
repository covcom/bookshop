
const restify = require('restify')
const server = restify.createServer()

server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/', function(req, res) {
	res.setHeader('content-type', 'application/json')
  res.send('Hello World')
  res.end()
})

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})
