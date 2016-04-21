(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('AdminController', ['$q', '$scope', '$rootScope', 'ApplicationContextService', 'SocketService', AdminController]);


    function AdminController($q, $scope, $rootScope, ApplicationContextService, SocketService) {


        var socket = io(),
            user = ApplicationContextService.globals.user,
            uid = ApplicationContextService.globals.uid;
        var vm = this;

        vm.user = user;
        socket.emit('join', {
            user: user,
            uid: uid
        });

        socket.on('displayAtAdmin', function(data) {

            if (data.senderid === vm.chatcustomer.id) {

                $scope.$apply(function() {

                    vm.adminmessages.push(data);
                });

            } else {

                $scope.$apply(function() {

                    vm['note' + data.senderid]++;

                });

            }



        });




        vm.chatcustomer = {
            id: 0,
            name: ''
        };
        var deferred = $q.defer();


        var promise = SocketService.getAvailableUsers().then(function(response) {

            vm.availableusers = response;
            vm.row0 = true;

            for (var k in vm.availableusers) {

                vm['note' + vm.availableusers[k].uid] = 0;
            }

            deferred.resolve(response);
            return deferred.promise;
        }, function(error) {

            console.log(error);
            deferred.reject(error);

        });

        promise.then(function(response) {

            var uid = response[0].uid,
                enterpriseid = ApplicationContextService.globals.uid;
            SocketService.chatcustomer.id = uid;
            SocketService.chatcustomer.name = response[0].name;
            vm.chatcustomer.id = uid;
            vm.chatcustomer.name = response[0].name;

            SocketService.getMessages(uid, enterpriseid).then(function(response) {

                vm.adminmessages = response;


            }, function(error) {

                console.log(error);

            });


        }, function(error) {

            console.log(error);

        });


        vm.activateCustomer = function(uid, username, index) {


            for (var k in vm.availableusers) {

                vm['row' + k] = false;
            }
            vm['row' + index] = true;
            vm['note' + uid] = 0;
            vm.adminmessages = [];

            SocketService.chatcustomer.id = uid;
            SocketService.chatcustomer.name = username;

            vm.chatcustomer.id = uid;
            vm.chatcustomer.name = username;

            var enterpriseid = ApplicationContextService.globals.uid;

            SocketService.getMessages(uid, enterpriseid).then(function(response) {

                vm.adminmessages = response;

            }, function(error) {

                console.log(error);

            });

        };

        vm.sendMessageToCustomer = function(chatmessage) {

            SocketService.sendMessageToCustomer(chatmessage);



            var user = ApplicationContextService.globals.user;

            var msg = {

                receiver: vm.chatcustomer.name,
                receiverid: vm.chatcustomer.id,
                sender: ApplicationContextService.globals.user,
                senderid: ApplicationContextService.globals.uid,
                message: chatmessage

            };

            vm.adminmessages.push(msg);

            socket.emit('sendCustomer', msg);


        };
    }

})(angular);