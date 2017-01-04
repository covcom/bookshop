
/**
 * Data Extractor Module.
 * @module dataExtractor
 */

/**
 * Extracts the username and password from the request object.
 * @async
 * @param   {object} request - The request object.
 * @param   {string} param - The query parameter to find.
 * @return {string} The value of the query parameter.
 * @throws  {error} query string missing.
 */
exports.queryString = (request, param) => new Promise( (resolve, reject) => {
	if(request === undefined || request.params === undefined || request.params[param] === undefined) {
		reject(new Error(`missing query string '${param}'`))
	}
	resolve(request.params[param])
})

/**
 * Extracts the username and password from the request object.
 * @async
 * @param   {string} request - The request object.
 * @return {credentials} The username and password
 * @throws  {error} authorization header missing.
 * @throws {error} missing username / password
 */
exports.credentials = request => new Promise( (resolve, reject) => {
	if (request === undefined || request.authorization === undefined || request.authorization.basic === undefined) {
		reject(new Error('authorization header missing'))
	}
	const auth = request.authorization.basic
	if (auth.username === undefined || auth.password === undefined) {
		reject(new Error('missing username / password'))
	}
	resolve({username: auth.username, password: auth.password})
})

/**
 * Extracts a key from the request body.
 * @async
 * @param   {string} request - The request object.
 * @param   {string} key - The body key to find.
 * @return {string} The value of the request body key.
 * @throws  {error} body key missing.
 */
exports.bodyKey = (request, key) => new Promise( (resolve, reject) => {
	if (request === undefined || request.body === undefined || request.body[key] === undefined) {
		reject(new Error(`missing key '${key}' in request body`))
	}
	resolve(request.body[key])
})

/**
 * Takes the complete book data and cleans it up.
 * @async
 * @param  {object} data - The full json data on the book.
 * @return {object} The cleaned up book data.
 * @throws {error} missing body data.
 */
exports.bookSummary = data => new Promise( (resolve, reject) => {
	if (data === undefined || data.items === undefined || data.items[0].volumeInfo === undefined) {
		reject(new Error('missing book data'))
	}
	const book = data.items[0].volumeInfo
	book.bookID = data.items[0].id
	book.isbn = book.industryIdentifiers[0].type === 'ISBN_10' ? book.industryIdentifiers[0].identifier : book.industryIdentifiers[1].identifier
	book.authors = book.authors.join(', ')
	delete book.industryIdentifiers
	resolve(book)
})
