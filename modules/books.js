
"use strict"

const request = require('request')

exports.search = (query, host, callback) => {
	if (query == undefined || query.length === 0) {
		callback( new Error('Missing Query Parameter'))
		return
	}
	const protocolRegex = /(http(s?))\:\/\//gi
	if (!protocolRegex.test(host)) {
		callback(new Error('Missing Host Parameter'))
		return
	}
	apiCall(query, (err, data) => {
		if (err) {
			callback( new Error(err))
		}
		if (data.items == undefined) {
			callback( new Error('No Books Found'))
			return
		}
		var results = data.items.map( item => {
			return {title: item.volumeInfo.title, link: host+'/books/'+item.id}
		})
		callback(null, results)
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
