
const books = require('./bookController')

exports.search = (request, callback) => {
	if (request == undefined || request.params == undefined || request.params.q == undefined) {
		callback({code: 400, contentType: 'application/json', response: 'Missing Query Parameter'})
		return
	}
	books.search(request.params.q, (err, data) => {
		if (err) {
			callback({code: 404, contentType: 'application/json', response: 'no books found'})
			return
		}
		callback(null, data)
	})
}