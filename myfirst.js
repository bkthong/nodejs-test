var http = require('http');
var dt  = require('./myfirstmodule.js') ;
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('The server\'s date and time is ' + dt.myDateTime()) ;
    res.end('Hello World!');
}).listen(8080);
