'use strict';

// export Router constructor
var Router = function() {
    this.routes = {
        'GET': {},
        'POST': {},
        'PUT': {},
        'PATCH': {},
        'DELETE': {}
    };
    this.middlewares = {};
};

Router.prototype.route = function(OBJ) {
    var HandlerChain = [];
    if(OBJ.PreHandler) HandlerChain.push(OBJ.PreHandler)
    if(OBJ.Middleware){
        for(var i = 0, len = OBJ.Middleware.length; i<len; i++){
            var MiddleName = OBJ.Middleware[i];
            var Middle = this.middlewares[MiddleName];
            if(Middle){
                HandlerChain.push(Middle)
            }else{
                console.log('no middleware found with the name: '+MiddleName)
            }
        }
    }
    HandlerChain.push(OBJ.Handler);

    OBJ.HandlerChain = HandlerChain;

    this.routes[OBJ.method][OBJ.url] = OBJ;
};

Router.prototype.middleware = function(OBJ) {
    this.middlewares[OBJ.name] = OBJ.handler;
};

Router.prototype.Router = function() {
    return function(req, res) {
        try {
            var route = this.routes[req.method][req.url];
            if(!route){
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.write('page not found');
                res.end();
                return
            }

            var handlers = route.HandlerChain;
            
            function runHandler(){
                var handler = handlers.shift();
                if(handler) handler(req,res,runHandler)
            }

            runHandler()
            
        } catch(err) {
            throw req.method + ' is not a valid REST verb'
        }
    }.bind(this);
};

module.exports = Router;