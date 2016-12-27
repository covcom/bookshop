
'use strict'

/**
 * Authorisation Module.
 * @module authorisation
 */

/**
 * @typedef {Object} credentials
 * @property {string} username - The username
 * @property {string} password - The password
 */

const bcrypt = require('bcrypt')

/**
 * Extracts the username and password from the request object.
 * @async
 * @param   {string} request - The request object.
 * @return {credentials} The username and password
 * @throws  {error} authorization header missing.
 * @throws {error} missing username / password
 */
exports.getHeaderCredentials = request => new Promise( (resolve, reject) => {
	if (request.authorization === undefined || request.authorization.basic === undefined) {
		reject(new Error('authorization header missing'))
	}
	const auth = request.authorization.basic

	if (auth.username === undefined || auth.password === undefined) {
		reject(new Error('missing username / password'))
	}
	resolve({username: auth.username, password: auth.password})
})

/**
 * Hashes the supplied password.
 * @param   {string} credentials - The plaintext password.
 * @return {promise} The passwords match
 * @throws  {error} the passwords don't match.
 */
exports.hashPassword = credentials => new Promise( (resolve, reject) => {
	const salt = bcrypt.genSaltSync(10)

	credentials.password = bcrypt.hashSync(credentials.password, salt)
	resolve(credentials)
})

/**
 * Compares a supplied password with a hashed one.
 * @param   {string} provided - The plaintext password.
 * @param   {string} stored - The hashed password.
 * @return {promise} The passwords match
 * @throws  {error} the passwords don't match.
 */
exports.checkPassword = (provided, stored) => new Promise( (resolve, reject) => {
	if (!bcrypt.compareSync(provided, stored)) {
		reject(new Error('invalid password'))
	}
	resolve()
})
