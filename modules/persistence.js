
const schema = require('../schema/schema')

exports.saveBook = (username, bookDetails) => new Promise( (resolve, reject) => {
	if (!'title' in bookDetails || !'authors' in bookDetails || !'subtitle' in bookDetails) {
		reject(new Error('invalid book object'))
	}
	bookDetails.account = username
	console.log(JSON.stringify(bookDetails, null, 2))
	const book = new schema.Book(bookDetails)
	book.save( (err, book) => {
		if (err) {
			reject(new Error('an error saving book'))
		}
		resolve(book)
	})
})

exports.addAccount = details => new Promise( (resolve, reject) => {
	if (!'username' in details && !'password' in details && !'name' in details) {
		reject(new Error('invalid user object'))
	}
	const user = new schema.User(details)
	user.save( err => {
		if (err) {
			reject(new Error('error creating account'))
		}
		delete details.password
		resolve(details)
	})
})

exports.accountExists = account => new Promise( (resolve, reject) => {
	schema.User.find({username: account.username}, (err, docs) => {
		if (err) reject(new Error(err))
		if (docs.length) reject(new Error(`username ${account.username} already exists`))
		resolve()
	})
})

exports.getAccount = credentials => new Promise( (resolve, reject) => {
	console.log(`username: ${credentials.username}`)
	schema.User.findOne({username: credentials.username}, (err, account) => {
		if (err) reject(new Error('database error'))
		if (account === null) {
			console.log('account undefined')
			reject(new Error(`invalid username '${credentials.username}'`))
		}
		console.log(account)
		resolve(account)
	})
})

exports.bookExists = (username, book) => new Promise( (resolve, reject) => {
	schema.Book.find({account: username, bookID: book}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (docs.length) reject(new Error('book already in cart'))
		resolve()
	})
})

exports.getBooksInCart = user => new Promise( (resolve, reject) => {
	schema.Book.find({account: user}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (!docs.length) reject(new Error('shopping cart empty'))
		const books = docs.map( element => ({isbn: element.isbn, title: element.title, subtitle: element.subtitle}))
		resolve({books: books})
	})
})

exports.clearAccounts = () => new Promise( (resolve, reject) => {
	schema.User.remove({}, err => {
		if (err) reject(new Error('database error'))
		resolve()
	})
})