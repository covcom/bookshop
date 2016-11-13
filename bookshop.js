
'use strict'

const auth = require('./modules/authorisation')
const google = require('./modules/google')
const persistence = require('./modules/persistence')

// ------------------ ROUTE FUNCTIONS ------------------ 

exports.search = (request, callback) => {
	extractParam(request, 'q').then( query => {
		console.log(query)
		return google.searchByString(query)
	}).then( data => {
		console.log('tidying up array')
		return this.cleanArray(request, data)
	}).then( data => {
		callback(null, data)
	}).catch( err => {
		console.log('ERROR')
		console.log(err)
		callback(err)
	})
}

exports.addToCart = (request, callback) => {
	extractBodyKey(request, 'id').then( id => {
		return google.getByID(id)
	}).then( book => {
		return persistence.saveBook(book)
	}).catch( err => {
		callback(err)
	})
}

exports.addUser = (request, callback) => {
	let data
	auth.getHeaderCredentials(request).then( credentials => {
		console.log(`username: ${credentials.username}  password: ${credentials.password}`)
		return auth.hashPassword(credentials)
	}).then( credentials => {
		console.log(`username: ${credentials.username}  password: ${credentials.password}`)
		data = credentials
		return persistence.accountExists(credentials)
	}).then( () => {
		return extractBodyKey(request, 'name')
	}).then( name => {
		data.name = name
		console.log(data)
		return persistence.addAccount(data)
	}).then( data => {
		console.log('account now saved')
		console.log(data)
		callback(null, data)
	}).catch( err => {
		callback(err)
	})
}

// ------------------ UTILITY FUNCTIONS ------------------

const extractParam = (request, param) => new Promise( (resolve, reject) => {
	console.log(request.param)
	if (request.params === undefined || request.params[param] === undefined) reject(new Error(`${param} parameter missing`))
	resolve(request.params[param])
})

const extractBodyKey = (request, key) => new Promise( (resolve, reject) => {
	if (request.body === undefined || request.body[key] === undefined) reject(new Error(`missing key ${key} in request body`))
	resolve(request.body[key])
})

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