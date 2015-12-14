
"use strict"

var fs = require('fs')
var rewire = require('rewire')

var auth = rewire("../modules/auth")

describe('Auth Model', () => {
	
	beforeEach( () => {
		auth.clearAccounts()
	})
	
	describe('create accounts', () => {
	
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
	
		it('create a user with a different username/password', () => {
			try {
				let user = auth.createAccount('testuser2', 'password')
				expect(user).toEqual({status: 'success', username: 'testuser2'})
			} catch(err) {
				fail('error should not be thrown')
			} finally {
				expect(auth.count).toBe(1)
			}
		})
	
		it('should prevent duplicate usernames  from being inserted', () => {
			try {
				auth.createAccount('testuser', 'p455w0rd')
				expect(auth.createAccount('testuser', 'p455w0rd')).toThrow()
				fail('this line should not be run')
			} catch(err) {
				expect(err.message).toBe('account testuser already exists')
			} finally {
				expect(auth.count).toBe(1)
			}
		})
	
		it('should throw an error if missing username', () => {
			try {
				auth.createAccount('testuser', 'p455w0rd')
				expect(auth.createAccount('', 'p455w0rd')).toThrow()
			} catch(err) {
				expect(err.message).toBe('username parameter missing')
			} finally {
				expect(auth.count).toBe(1)
			}
		})
	})
	
	describe('Log In', () => {
		it('should allow registered user to login', () => {
			try {
				auth.createAccount('testuser', 'p455w0rd')
				const res = auth.logIn('testuser', 'p455w0rd')
				expect(res).toBeDefined()
				expect(res.username).toBe('testuser')
			} catch(err) {
				fail('error should not be thrown')
			}
		})
	
		it('should prevent unregistered user from logging in', () => {
			try {
				auth.createAccount('testuser', 'p455w0rd')
				auth.logIn('testuser2', 'p455w0rd')
				fail('error should have been thrown')
			} catch(err) {
				expect(err.message).toBe('account testuser2 does not exist')
			}
		})
	
		it('should prevent invalid password being accepted', () => {
			try {
				auth.createAccount('testuser', 'p455w0rd')
				auth.logIn('testuser', 'password')
				fail('error should have been thrown')
			} catch(err) {
				expect(err.message).toBe('invalid password')
			}
		})	
	})

})
