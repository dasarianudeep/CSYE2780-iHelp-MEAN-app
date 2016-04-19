(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('AdminController', ['$q', 'ApplicationContextService', 'SocketService', AdminController]);


    function AdminController($q, ApplicationContextService, SocketService) {

        var vm = this;

        var deferred = $q.defer();

        var promise = SocketService.getAvailableUsers().then(function(response) {

            vm.availableusers = response;
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
            
            SocketService.getMessages(uid, enterpriseid).then(function(response) {

                vm.adminmessages = response;
                console.log(vm.adminmessages[0].date);

            }, function(error) {

                console.log(error);

            });


        }, function(error) {

            console.log(error);

        });

        vm.activateCustomer = function(uid, username) {


            SocketService.chatcustomer.id = uid;
            SocketService.chatcustomer.name = username;

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
            
            $("#customerchats").append('<li class="list-group-item"><p><span class="glyphicon glyphicon-user"></span>&nbsp;'+user+'&nbsp;&nbsp;&nbsp;<span class="text-center">'+chatmessage+'</span></p></li>');
            
        };
    }

})(angular);