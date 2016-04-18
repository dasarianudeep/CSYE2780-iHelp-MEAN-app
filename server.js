(function() {
    'use strict';

    var express = require('express'),
        app = express(),
        httpServer = require('http').Server(app),
        io = require('socket.io')(httpServer),
        mongoose = require('mongoose'),
        mongourl = require('./db/config').url,
        $ = require('jquery-deferred');


    mongoose.connect(mongourl);

    var User = require('./app/models/User'),
        Message = require('./app/models/Message'),
        Enterprise = require('./app/models/Enterprise').model;

    app.use(express.static(__dirname + '/public'));


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
                    enterprise: user.enterprise
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
        console.log(username);
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

    io.on('connection', function(socket) {

        var web_clients = [];

        socket.on('join', function(data) {

            // console.log(typeof socket.id);
            // console.log(io.sockets.connected[socket.id].emit('abc'));
            var client = {};
            client[data.uid] = socket.id;
            web_clients.push(client);
            //console.log(web_clients);

        });
    });

    httpServer.listen(3000, function() {

        console.log('Server listening to port 3000');
    });

})();