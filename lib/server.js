'use strict';
const http = require("http")

const Router = require("./router");

var server = function(){
    this.Router = new Router();
    this.server = new http.createServer();
    this.server.on('request', this.Router.Router());
}

server.prototype.route = function(args){
    this.Router.route(args);
}

server.prototype.middleware = function(args){
    this.Router.middleware(args);
}

server.prototype.listen = function(port,cb){
    cb = cb || function() { console.log('server started on port: '+port)};
    this.server.listen(port, cb);
}


exports = module.exports = server;