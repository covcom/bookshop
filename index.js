
const restify = require('restify')
const server = restify.createServer()

server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(restify.authorizationParser())

const bookshop = require('./bookshop.js')
const status = {
	ok: 200,
	added: 201,
	badRequest: 400
}
const defaultPort = 8080

server.get('/', (req, res, next) => {
	res.redirect('/books', next)
})

/**
 * @api {get} /books Request a list of available books
 * @apiName bookSearch
 * @apiGroup Books
 * @apiParam {String} q Query string
 * 
 * @apiExample {curl} Example usage:
 *   curl -i http://localhost/books?q=javascript
 *
 * @apiSuccess {object} returns an array of books matching the queryParser
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "items": [
 *     {
 *       "id": "_uTRAwAAQBAJ",
 *       "volumeInfo": {
 *         "title": "JavaScript and JQuery"
 *       }
 *     },
 *     {
 *       "id": "9U5I_tskq9MC",
 *       "volumeInfo": {
 *         "title": "Eloquent JavaScript"
 *       }
 *     }
 *   ]
 * }
 * @apiError missingQueryString query parameter 'q' missing
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "missing query string 'q'"
 * }
 */
server.get('/books', (req, res) => {
	bookshop.search(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.ok, data)
		}
		res.end()
	})
})

/**
 * @api {post} /accounts Add a book to the cart
 * @apiName cartAdd
 * @apiGroup Cart
 *
 * @apiHeader {String} Content-Type='application/json' Request body must be supplied as 'application/json'.
 * @apiHeader {String} Authorization Basic auth required in headers.
 * @apiHeaderExample {json} Header-Example:
 * {
 *   "Content-Type": "application/json"
 *   "Authorization": "Basic bmV3VXNlcjEyMzp0ZW1w"
 * }
 * @apiHeader (HTTPBody) {String} isbn valid ISBN10 number
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST -u newuser:password -d '{"isbn":"0596517742"}' -i http://localhost/cart
 *
 * @apiSuccess {object} returns an object containing the book summary
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 created
 * {
 *   "book": {
 *     "title": "JavaScript",
 *     "subtitle": "The Good Parts",
 *     "authors": "Douglas Crockford",
 *     "bookID": "F9ybAgAAQBAJ",
 *     "isbn": "0596517742",
 *     "account": "testuser"
 *   }
 * }
 *
 * @apiError missingAuthHeader the Authorization header is missing
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "authorization header missing"
 * }
 *
 * @apiError missingBodyKey the isbn key is missing in the request body
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "missing key 'isbn' in request body"
 * }
 *
 * @apiError invalidISBN the ISBN number is invalid
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "missing book data"
 * }
 */
server.post('/cart', (req, res) => {
	bookshop.addToCart(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.added, {book: data})
		}
		res.end()
	})
})

/**
 * @api {get} /cart Get books in cart
 * @apiName cartList
 * @apiGroup Cart
 *
 * @apiExample {curl} Example usage:
 *   curl -u newuser:password -i http://localhost/cart
 *
 * @apiSuccess {object} returns an array of books in the cart
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "books": [
 *     {
 *       "isbn": "0596805527",
 *       "title": "JavaScript",
 *       "subtitle": "The Definitive Guide"
 *     },
 *     {
 *       "isbn": "0596517742",
 *       "title": "JavaScript",
 *       "subtitle": "The Good Parts"
 *     }
 *   ]
 * }
 *
 * @apiError 400/BadRequest the Authorization header is missing
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "authorization header missing"
 * }
 */
server.get('/cart', (req, res) => {
	bookshop.showCart(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.ok, data)
		}
		res.end()
	})
})

/**
 * @api {post} /accounts Add a new user account
 * @apiName accountAdd
 * @apiGroup Accounts
 *
 * @apiHeader {String} Content-Type='application/json' Request body must be supplied as 'application/json'.
 * @apiHeader {String} Authorization Basic auth required in headers.
 * @apiHeaderExample {json} Header-Example:
 * {
 *   "Content-Type": "application/json"
 *   "Authorization": "Basic bmV3VXNlcjEyMzp0ZW1w"
 * }
 * @apiHeader (HTTPBody) {String} name Full name of the new user
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST -u newuser:password -d '{"name":"John Doe"}' -i http://localhost/accounts
 *
 * @apiSuccess {object} returns an object containing the name and username
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 created
 * {
 *   "user": {
 *     "username": "newuser",
 *     "name": "John Doe"
 *   }
 * }
 *
 * @apiError missingAuthHeader the Authorization header is missing
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "authorization header missing"
 * }
 *
 * @apiError missingBodyKey the name key is missing in the request body
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "missing key 'name' in request body"
 * }
 *
 * @apiError accountExists the specified username already exists
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *  "error": "username 'testuser' already exists"
 * }
 */
server.post('/accounts', (req, res) => {
	bookshop.addUser(req, (err, data) => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('accepts', 'GET, POST')
		if (err) {
			res.send(status.badRequest, {error: err.message})
		} else {
			res.send(status.added, {user: data})
		}
		res.end()
	})
})

const port = process.env.PORT || defaultPort

server.listen(port, err => {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
