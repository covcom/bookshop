
var fs = require('fs')
var rewire = require('rewire')

var books = rewire("../modules/books")

function setData(file) {
	books.__set__('apiCall', (search, callback) => {
		const data = fs.readFileSync('spec/data/'+file, "utf8")
		callback(null, JSON.parse(data))
	})
}

describe('Book Model', () => {
	
	describe('search for books', () => {
		
		it('search for a recognised topic', done => {
			setData('javascript.json')
			books.search('javascript', 'http://example.com', (err, data) => {
				expect(err).toBeNull()
				expect(data).toBeDefined()
				expect(data.length).toBe(3)
				expect(data[0].title).toBe('Eloquent JavaScript, 2nd Ed.')
				expect(data[0].link).toContain('http://example.com/books/')
				done()
			})
		})
	
		it('search for an unknown topic', done => {
			setData('unknown.json')
			books.search('dgfuhalgux', 'http://example.com', (err, data) => {
				expect(err).toBeDefined()
				expect(err.message).toEqual('No Books Found')
				done()
			})
		})
		
		it('search with a missing query', done => {
			setData('missing.json')
			books.search('', 'http://example.com', (err, data) => {
				expect(err).toBeDefined()
				expect(err.message).toEqual('Missing Query Parameter')
				done()
			})
		})

		it('search with a null query', done => {
			setData('missing.json')
			books.search(null, 'http://example.com', (err, data) => {
				expect(err).toBeDefined()
				expect(err.message).toEqual('Missing Query Parameter')
				done()
			})
		})
	
		it('search with missing domain parameter', done => {
			setData('javascript.json')
			books.search('javascript', '', (err, data) => {
				expect(err).toBeDefined()
				expect(err.message).toEqual('Missing Host Parameter')
				done()
			})
		})
		
		it('search with null domain parameter', done => {
			setData('javascript.json')
			books.search('javascript', '', (err, data) => {
				expect(err).toBeDefined()
				expect(err.message).toEqual('Missing Host Parameter')
				done()
			})
		})
		
	})

})