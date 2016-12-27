
/**
 * Authorisation Module.
 * @module authorisation
 */

/**
 * @typedef {Object} credentials
 * @property {string} username - The username
 * @property {string} password - The password
 */

const bcrypt = require('bcryptjs')
const rounds = 10

/**
 * Hashes the supplied password.
 * @param   {credentials} credentials - The plaintext password.
 * @return {credentials} The credentials with the password hashed.
 */
exports.hashPassword = credentials => new Promise( (resolve, reject) => {
	bcrypt.genSalt(rounds, (err, salt) => {
		if (err) reject(new Error('crypto salt error'))
		console.log(`password: '${credentials.password}'`)
		bcrypt.hash(credentials.password, salt, (err, hash) => {
			if (err) reject(new Error('crypto hash error'))
			credentials.password = hash
			resolve(credentials)
		})
	})
})

/**
 * Compares a supplied password with a hashed one.
 * @param   {string} provided - The plaintext password.
 * @param   {string} stored - The hashed password.
 * @return {promise} The passwords match
 * @throws  {error} the passwords don't match.
 */
exports.checkPassword = (provided, stored) => new Promise( (resolve, reject) => {
	if (!bcrypt.compareSync(provided, stored)) reject(new Error('invalid password'))
	resolve()
})
