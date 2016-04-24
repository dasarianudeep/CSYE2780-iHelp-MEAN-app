(function() {
    'use strict';

    var express = require('express'),
        app = express(),
        httpServer = require('http').Server(app),
        io = require('socket.io')(httpServer),
        mongoose = require('mongoose'),
        mongourl = require('./db/config').url,
        $ = require('jquery-deferred'),
        bodyParser = require('body-parser');


    var User = require('./app/models/User'),
        Message = require('./app/models/Message'),
        Enterprise = require('./app/models/Enterprise').model;

    var client = {};


    
    mongoose.connect(mongourl);
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());


    app.get('/', function(req, res) {

        res.sendFile(__dirname + '/public/views/index.html');
    });



    //RESTful API Endpoints
    app.get('/api/v1/validateuser', function(req, res) {

        var flag = false;

        var deferred = $.Deferred();
        User.findOneAndUpdate({
            username: req.query.username,
            password: req.query.password
        }, {
            isAvail: true
        }, function(err, user) {

            if (user) {


                deferred.resolve({
                    isValid: true,
                    uid: user.uid,
                    enterprise: user.enterprise,
                    user : user
                });

            } else {

                deferred.reject({
                    isValid: false
                });
            }

        });

        deferred.then(function(val) {

            res.json(val);

        }, function(val) {

            res.json(val);
        });



    });

    app.get('/api/v1/getuserenterprises', function(req, res) {



        var username = req.query.username;

        User.findOne({
            username: username
        }, function(err, user) {

            if (user) {


                res.json(user.chatenterprises);

            } else {

                res.json(null);
            }
        });
    });

    app.get('/api/v1/enterprises/:enterprisename/username/:username', function(req, res) {

        var enterprisename = req.params.enterprisename,
            username = req.params.username;
       
       
        Enterprise.findOne({
            name: enterprisename
        }, function(err, enterprise) {

            if (enterprise) {

                User.findOne({
                    username: username
                }, function(err, user) {


                    if (user) {

                        user.chatenterprises.push(enterprise);
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else if (err) {

                        console.log(err);

                    }
                });

                res.json(enterprise);


            } else {
                res.json(null);
            }
        });

    });


    app.get('/api/v1/availablecustomers', function(req, res) {

        User.find({
            enterprise: 'customer',
            isAvail: true
        }, function(err, users) {

            if (users) {

                res.json(users);
            } else {

                res.json(null);
            }

        });

    });

    app.post('/api/v1/messages', function(req, res) {


        var msg = req.body;
        Message.create(msg, function(err, message) {
                
                console.log(message);
            if (message) {

                res.json({
                    created: true
                });
            } else {

                res.json({
                    created: false
                });
            }
        });
    });


    app.get('/api/v1/messages/receiver/:receiverid/sender/:senderid', function(req, res) {


        var senderid = req.params.senderid,
            receiverid = req.params.receiverid;


        Message.find({
            '$or': [{
                receiverid: receiverid,
                senderid: senderid
            }, {
                receiverid: senderid,
                senderid: receiverid
            }]
        }, function(err, messages) {

            if (messages) {

                res.json(messages);
            } else {

                res.json(null);
            }
        });
    });



    //Web Socket Event Handling via Socket.io
    io.on('connection', function(socket) {

        

        socket.on('join', function(data) {
            
            console.log(data);
            client[data.uid] = socket.id;
            console.log(client);
            console.log(data.userObj);
            
            socket.broadcast.emit('updateCustomers', data.userObj);

        });

        socket.on('sendAdmin', function(data) {
                    
                    
            var socketid = client[data.receiverid];
            io.sockets.connected[socketid].emit('displayAtAdmin', data);

        });

        socket.on('sendCustomer', function(data) {
                
                
            var socketid = client[data.receiverid];
            io.sockets.connected[socketid].emit('displayAtCustomer', data);

        });
        
        socket.on('unjoin', function(data){
            
          delete client[data.id];
           socket.disconnect();
           
        });
    });

    httpServer.listen(3000, function() {

        console.log('Server listening to port 3000');
    });

})();