
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

exports.addToCartOld = (request, callback) => {
	auth.getHeaderCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return auth.hashPassword(credentials)
	}).then( credentials => {
		return persistence.getCredentials(credentials)
	}).then( account => {
		const hash = account[0].password
		return auth.checkPassword(this.password, hash)
	}).then( () => {
		return extract.bodyKey(request, 'id')
	}).then( id => {
		this.id = id
		return google.getByID(id)
	}).then( (book) => {
		this.book = book
		return persistence.bookExists(this.username, this.id)
	}).then( book => {
		this.book.account = this.username
		return persistence.saveBook(this.book)
	}).then( book => {
		delete book.account
		callback(null, book)
	}).catch( err => {
		callback(err)
	})
}

exports.showCart = (request, callback) => {
	auth.getHeaderCredentials(request).then( credentials => {
		this.username = credentials.username
		this.password = credentials.password
		return auth.hashPassword(credentials)
	}).then( credentials => {
		return persistence.getCredentials(credentials)
	}).then( account => {
		const hash = account[0].password
		return auth.checkPassword(this.password, hash)
	}).then( () => {
		return persistence.getBooksInCart(this.username)
	}).then( books => {
		return this.removeMongoFields(request, books)
	}).then( books => {
		callback(null, books)
	}).catch( err => {
		callback(err)
	})
}

// ------------------ UTILITY FUNCTIONS ------------------

exports.cleanArray = (request, data) => new Promise((resolve) => {
	const host = request.host || 'http://localhost'
	const clean = data.items.map(element => {
		return {
			title: element.volumeInfo.title,
			link: `${host}/books/${element.id}`
		}
	})

	resolve({books: clean})
})

exports.removeMongoFields = (request, data) => new Promise( (resolve, reject) => {
	const host = request.host || 'http://localhost'
	const clean = data.map(element => {
		return {
			title: element.title,
			link: `${host}/books/${element.bookID}`
		}
	})

	resolve({books: clean})
})