
const auth = require('./modules/authorisation')
const extract = require('./modules/dataExtractor')
const google = require('./modules/google')
const persistence = require('./modules/persistence')

// ------------------ ROUTE FUNCTIONS ------------------

exports.search = async (request, callback) => {
	try {
		const q = await extract.queryString(request, 'q')
		const result = await google.searchByString(q)
		callback(null, result)
	} catch(err) {
		callback(err)
	}
}

exports.addUser = async (request, callback) => {
	try {
		const credentials = await extract.credentials(request)
		const data = await auth.hashPassword(credentials)
		await persistence.accountExists(credentials)
		data.name = await extract.bodyKey(request, 'name')
		await persistence.addAccount(data)
		delete data.password
		callback(null, data)
	} catch(err) {
		callback(err)
	}
}

exports.addToCart = async (request, callback) => {
	try {
		const credentials = await extract.credentials(request)
		const account = await persistence.getAccount(credentials)
		await auth.checkPassword(credentials.password, account.password)
		const isbn = await extract.bodyKey(request, 'isbn')
		const book = await google.ISBNExists(isbn)
		const summary = await extract.bookSummary(book)
		await persistence.saveBook(credentials.username, summary)
		callback(null, summary)
	} catch(err) {
		callback(err)
	}
}

exports.showCart = async (request, callback) => {
	try {
		const credentials = await extract.credentials(request)
		const account = await persistence.getAccount(credentials)
		await auth.checkPassword(credentials.password, account.password)
		console.log('valid user')
		const books = await persistence.getBooksInCart(credentials.username)
		console.log(books)
		callback(null, books)
	} catch(err) {
		callback(err)
	}
}
