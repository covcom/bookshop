
//const bcrypt = require('bcryptjs')
const fs = require('jsonfile')
const auth = require('../modules/authorisation')

//var async = require('jasmine-await')
//var it = async.it;
//var await = async.await

describe('Authorisation Model', () => {

	describe('hashPassword', () => {

		it('should correctly encrypt a password', done => {
			const data = fs.readFileSync('spec/data/request.json')
			console.log(data.authorization.basic)
			const result = auth.hashPassword(data.authorisation.basic)
			return result.then( data => {
				expect(data.username).toBe('testuser')
				done()
			})
		})

	})

	describe('checkPassword', () => {
		// TODO
	})

})
