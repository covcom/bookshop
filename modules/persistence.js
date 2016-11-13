
'use strict'

const schema = require('../schema/schema')
//const Book = require('../schema/bookSchema')
//const User = require('../schema/userSchema')

exports.saveBook = bookDetails => new Promise( (resolve, reject) => {
	if (!'title' in bookDetails && !'authors' in bookDetails && !'description' in bookDetails) {
		reject(new Error('invalid book object'))
	}
	console.log('saving the book')
	const book = new schema.Book(bookDetails)

	book.save( (err, book) => {
		console.log('attempt made')
		if (err) {
			reject(new Error('an error saving book'))
		}
		console.log('book added')
		resolve(book)
	})
})

exports.addAccount = details => new Promise( (resolve, reject) => {
	if (!'username' in details && !'password' in details && !'name' in details) {
		reject(new Error('invalid user object'))
	}
	console.log('creating the account')
	console.log(details)
	const user = new schema.User(details)

	user.save( (err, user) => {
		console.log('saving the data')
		if (err) {
			reject(new Error('error creating account'))
		}
		console.log('account created')
		delete details.password
		console.log(details)
		resolve(details)
	})
})

exports.accountExists = account => new Promise( (resolve, reject) => {
	console.log(account.username)
	schema.User.find({username: account.username}, (err, docs) => {
		console.log(`found ${docs.length} matching accounts`)
		if (docs.length) reject(new Error(`username already exists`))
		resolve()
	})
})