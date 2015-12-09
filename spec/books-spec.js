
var fs = require('fs')
var rewire = require('rewire')

var books = rewire("../modules/books")

describe("Search for a book", () => {
	
	var req
	
	beforeEach(function() {
    //
  })
	
	afterEach(function() {
    //
  })
	
	it('search for a recognised topic', done => {
		req = {params:{q:'javascript'}}
		expect(req.params.q).toEqual('javascript')
		books.search(req.params.q, data => {
			expect(data.code).toEqual(200)
			expect(data.contentType).toEqual('application/json')
			expect(data.response).toEqual('Hello World')
			done()
		})
	})
	
	xit('search for an unknown topic', done => {
		req = {params:{q:'dgfuhalgux'}}
		expect(req.params.q).toBeUndefined()
		books.search(req.params.q, data => {
			expect(data.code).toEqual(404)
			expect(data.contentType).toEqual('application/json')
			expect(data.response).toEqual('No Books Found')
			done()
		})
	})
	
	xit('search with a missing query', done => {
		req = {params:{}}
		expect(req.params.q).toBeUndefined()
		books.search(req.params.q, data => {
			expect(data.code).toEqual(404)
			expect(data.contentType).toEqual('application/json')
			expect(data.response).toEqual('Missing Query Parameter')
			done()
		})
	})
	
})