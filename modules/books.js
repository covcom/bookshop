
"use strict"

const request = require('request')

exports.search = (request, callback) => {
	apiCall(request.params.q, (err, data) => {
		if (err) {
			callback({code: 404, contentType: 'application/json', response: err})
		}
		if (data.items == undefined) {
			callback({code: 404, contentType: 'application/json', response: 'No Books Found'})
			return
		}
		callback({code: 200, contentType: 'application/json', response: data})
	})
}

var apiCall = (search, callback) => {
	let url = 'https://www.googleapis.com/books/v1/volumes?maxResults=40&fields=items(id,volumeInfo(title))&q='+search
	request.get(url, (err, res, body) => {
		if (err) {
			callback('failed to make API call')
		}
		const data = JSON.parse(body)
		callback(null, data)
	})
}