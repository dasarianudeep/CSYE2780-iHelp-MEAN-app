(function(){
    'use strict';
    
    var express = require('express'),
        app = express(),
        server = require('http').Server(app),
        io = require('socket.io')(server);
        
    
    app.use(express.static(__dirname+'/public'));
    
    server.listen(3000, function(){
        
        console.log('Server listening to port 3000');
    });
    
})();