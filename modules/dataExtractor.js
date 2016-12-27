
exports.queryString = (request, param) => new Promise( (resolve, reject) => {
	if(request === undefined || request.params === undefined || request.params[param] === undefined) {
		reject(`missing query string "${param}"`)
	}
	resolve(request.params[param])
})
