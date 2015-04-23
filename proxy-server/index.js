let http = require('http')
let request = require('request')
let fs = require('fs')
let argv = require('yargs')
    .default('host', '127.0.0.1')
    .argv
let scheme = 'http://'    
let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = argv.url || scheme  + argv.host + ':' + port
let outputStream = argv.logFile ? fs.createWriteStream(argv.logFile) : process.stdout

http.createServer((req, res) => {
for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
}   
 outputStream.write('\n\n\n' + JSON.stringify(req.headers))
 req.pipe(outputStream)
 req.pipe(res)
}).listen(8000)

http.createServer((req, res) => {
	let url = destinationUrl
	if (req.headers['x-destination-url']) {
		url = req.headers['x-destination-url']
	}
	let options = {
		headers: req.headers,
		url: url + req.url
	}

	outputStream.write(JSON.stringify(req.headers))
	req.pipe(outputStream)

	let destinationResponse = req.pipe(request(options))
	destinationResponse.pipe(res)

}).listen(8001)
