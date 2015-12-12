
var fs = require('fs')
var rewire = require('rewire')

var books = rewire("../modules/books")

function setData(file) {
	books.__set__('apiCall', (search, callback) => {
		const data = fs.readFileSync('spec/data/'+file, "utf8")
		callback(null, JSON.parse(data))
	})
}

describe("Search for a book", () => {
	
	it('search for a recognised topic', done => {
		setData('javascript.json')
		const req = {params:{q:'javascript'}, headers: {['x-forwarded-proto']: 'https'}}
		books.search(req, data => {
			expect(data.code).toEqual(200)
			expect(data.contentType).toEqual('application/json')
			const books = data.response
			expect(books).toBeDefined()
			expect(books.length).toBe(3)
			done()
		})
	})
	
	it('search for an unknown topic', done => {
		setData('unknown.json')
		const req = {params:{q:'dgfuhalgux'}, headers: {['x-forwarded-proto']: 'https'}}
		books.search(req, data => {
			expect(data.code).toEqual(404)
			expect(data.contentType).toEqual('application/json')
			expect(data.response).toEqual('No Books Found')
			done()
		})
	})
	
	it('search with a missing query', done => {
		setData('missing.json')
		const req = {params:{}, headers: {['x-forwarded-proto']: 'https'}}
		books.search(req.params.q, data => {
			expect(data.code).toEqual(400)
			expect(data.contentType).toEqual('application/json')
			expect(data.response).toEqual('Missing Query Parameter')
			done()
		})
	})
	
})