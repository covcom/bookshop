
const fs = require('jsonfile')
const auth = require('../modules/google')

describe('Google Model', () => {

	describe('searchByString', () => {

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

	describe('ISBNExists', () => {
		// TODO
	})

	describe('getByISBN', () => {
		// TODO
	})

	describe('getByID', () => {
		// TODO
	})

})
