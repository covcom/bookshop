
"use strict"

var fs = require('fs')
var rewire = require('rewire')

var auth = rewire("../modules/auth")

describe('create accounts', () => {
	
	beforeEach( () => {
		auth.clearAccounts()
	})
	
	it('create a single valid account', () => {
		try {
			let user = auth.createAccount('testuser', 'p455w0rd')
			expect(user).toEqual({status: 'success', username: 'testuser'})
		} catch(err) {
			fail('error should not be thrown')
		} finally {
			expect(auth.count).toBe(1)
		}
	})
})