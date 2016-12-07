
'use strict'

// import the mongoose package
const mongoose = require('mongoose')

const username = process.env.MONGO_USER || 'testuser'
const password = process.env.MONGO_PASS || 'password'
const host = process.env.MONGO_HOST || 'ds147497.mlab.com'
const port = process.env.MONGO_PORT || 47497
const database = process.env.MONGO_DB || 'bookshop'

mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

// create a schema
const userSchema = new Schema({
	name: String,
	username: String,
	password: String
})

// create a model using the schema
exports.User = mongoose.model('User', userSchema)

// create a schema
const bookSchema = new Schema({
  account: String,
	title: String,
	authors: String,
	description: String,
  bookID: String
})

// create a model using the schema
exports.Book = mongoose.model('Book', bookSchema)

