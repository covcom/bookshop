
const fs = require('jsonfile')
const extractor = require('../modules/dataExtractor')

describe('Extractor Model', () => {

	describe('queryString', () => {

		it('should find the correct querystring', done => {
			const data = fs.readFileSync('spec/data/request.json')
			//console.log(data)
			const result = extractor.queryString(data, 'q')
			return result.then( data => {
				expect(data).toBe('javascript')
				done()
			}).catch( () => {
				expect(true).toBe(false)
				done()
			})
		})

		it('throws error if missing querystring', done => {
			const data = fs.readFileSync('spec/data/request.json')
			const result = extractor.queryString(data, 'r')
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('missing query string \'r\'')
				done()
			})
		})

	})

	describe('credentials', () => {

		it('extract credentials from complete data', done => {
			const data = fs.readFileSync('spec/data/request.json')
			const result = extractor.credentials(data)
			return result.then( data => {
				expect(data.username).toBe('testuser')
				expect(data.password).toBe('password')
				done()
			}).catch( () => {
				expect(true).toBe(false)
				done()
			})
		})

		it('throws error if missing authorization header', done => {
			const result = extractor.credentials()
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('authorization header missing')
				done()
			})
		})

		it('throws error if missing authorization key', done => {
			const data = fs.readFileSync('spec/data/request.json')
			delete data.authorization
			const result = extractor.credentials(data)
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				//console.log(err.message)
				expect(err.message).toBe('authorization header missing')
				done()
			})
		})

		it('throws error if missing authorization.basic key', done => {
			const data = fs.readFileSync('spec/data/request.json')
			delete data.authorization.basic
			//console.log(data)
			const result = extractor.credentials(data)
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				//console.log(err.message)
				expect(err.message).toBe('authorization header missing')
				done()
			})
		})

		it('throws error if missing username key', done => {
			const data = fs.readFileSync('spec/data/request.json')
			delete data.authorization.basic.username
			//console.log(data)
			const result = extractor.credentials(data)
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				//console.log(err.message)
				expect(err.message).toBe('missing username / password')
				done()
			})
		})

		it('throws error if missing password key', done => {
			const data = fs.readFileSync('spec/data/request.json')
			delete data.authorization.basic.password
			//console.log(data)
			const result = extractor.credentials(data)
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				//console.log(err.message)
				expect(err.message).toBe('missing username / password')
				done()
			})
		})

	})

	describe('bodyKey', () => {

		it('should find the correct body key', done => {
			const data = fs.readFileSync('spec/data/request.json')
			//console.log(data)
			const result = extractor.bodyKey(data, 'isbn')
			return result.then( data => {
				expect(data).toBe('0596805527')
				done()
			}).catch( () => {
				expect(true).toBe(false)
				done()
			})
		})

		it('throws error if missing body key', done => {
			const data = fs.readFileSync('spec/data/request.json')
			const result = extractor.bodyKey(data, 'r')
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('missing key \'r\' in request body')
				done()
			})
		})

	})

	describe('bookSummary', () => {

		it('should extract book summary from valid json', done => {
			const data = fs.readFileSync('spec/data/book.json')
			//console.log(data)
			const result = extractor.bookSummary(data)
			return result.then( book => {
				expect(book.bookID).toBe('4RChxt67lvwC')
				expect(book.isbn).toBe('0596805527')
				expect(book.title).toBe('JavaScript')
				expect(book.subtitle).toBe('The Definitive Guide')
				expect(book.authors).toBe('David Flanagan')
				done()
			}).catch( () => {
				expect(true).toBe(false)
				done()
			})
		})

		it('no subtitle, 2 authors and isbn in key 0', done => {
			const data = fs.readFileSync('spec/data/book2.json')
			//console.log(data)
			const result = extractor.bookSummary(data)
			return result.then( book => {
				expect(book.bookID).toBe('fM2o_u6uosUC')
				expect(book.isbn).toBe('0596003579')
				expect(book.title).toBe('Webmaster in a Nutshell')
				expect(book.subtitle).toBeUndefined()
				expect(book.authors).toBe('Stephen Spainhour, Robert Eckstein')
				done()
			}).catch( () => {
				expect(true).toBe(false)
				done()
			})
		})

		it('throws error if missing body key', done => {
			const data = fs.readFileSync('spec/data/book.json')
			delete data.items
			const result = extractor.bookSummary(data)
			return result.then( () => {
				expect(true).toBe(false)
				done()
			}).catch( err => {
				expect(err.message).toBe('missing book data')
				done()
			})
		})

	})

})
