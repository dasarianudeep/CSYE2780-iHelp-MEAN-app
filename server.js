(function(){
    'use strict';
    
    var express = require('express'),
        app = express(),
        server = require('http').Server(app),
        io = require('socket.io')(server),
        mongoose = require('mongoose'),
        mongourl = require('./db/config').url,
        $ = require('jquery-deferred');
        
        
    mongoose.connect(mongourl);
    
    var User = require('./app/models/User');
    app.use(express.static(__dirname+'/public'));
    
    
    app.get('/', function(req, res){
        
        res.sendFile(__dirname+'/public/views/index.html');
    });
    
    
    
    //RESTful API Endpoints
    app.get('/api/v1/validateuser', function(req, res){
        
        var flag = false;
        
        var deferred = $.Deferred();
       User.find({username : req.query.username , password : req.query.password}, function(err, user){
           console.log(user);
           if(user){
                deferred.resolve({isValid:true, uid:user.uid});     
             }
           else if(err){
               console.log(err);
               deferred.reject({isValid:false});
           }
           
       });
        
       deferred.then(function(val){
           res.json(val);
       }, function(val){
           res.json(val);
       });
       
    });
    
    
    server.listen(3000, function(){
        
        console.log('Server listening to port 3000');
    });
    
})();