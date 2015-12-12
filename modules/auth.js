
"use strict"

var storage = require('node-persist')
storage.initSync()

// node-persist example in 2015 topic 7 shopping.

exports.createAccount = (username, password) => {
	return {status: 'success', username: 'testuser'}
}

exports.logIn = (username, password) => {
	return true
}

exports.clearAccounts = () => {
	return true
}

exports.countAccounts = () => {
	return 1
}

exports.count = 1
