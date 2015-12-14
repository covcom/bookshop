
"use strict"

var bcrypt = require('bcrypt')
var storage = require('node-persist')
storage.initSync()

// node-persist example in 2015 topic 7 shopping.

exports.createAccount = (username, password) => {
	if (username.length === 0) {
		throw new Error('username parameter missing')
	}
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)
	if (storage.getItemSync(username) !== undefined) {
		throw new Error('account '+username+' already exists')
	}
	storage.setItem(username, {username: username, hash: hash})
	return {status: 'success', username: username}
}

exports.logIn = (username, password) => {
	if (storage.getItemSync(username) === undefined) {
		throw new Error('account '+username+' does not exist')
	}
	const account = storage.getItemSync(username)
	if (!bcrypt.compareSync(password, account.hash)) {
		throw new Error('invalid password')
	}
	return {username: username}
}

exports.clearAccounts = () => {
	storage.clearSync()
	return true
}

exports.countAccounts = () => {
	return storage.values().length
}

exports.count = 1
