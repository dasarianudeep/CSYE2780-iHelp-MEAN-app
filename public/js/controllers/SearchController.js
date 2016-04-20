(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('SearchController', ['$q','$scope','$rootScope', 'ApplicationContextService', 'SocketService', SearchController]);

    function SearchController($q,$scope, $rootScope, ApplicationContextService, SocketService) {

        
        var socket = io(),
            user = ApplicationContextService.globals.user,
            uid = ApplicationContextService.globals.uid;
        
        
        socket.emit('join', {user : user, uid : uid });
        
         socket.on('displayAtCustomer', function(data){
            
               $scope.$apply(function(){
                   
                    vm.customermessages.push(data);
               });
              
                
        });

        var vm = this;

        vm.currentchatadmin = '';
        
        var deferred = $q.defer();
       

        vm.chatadmin = { id : 0, name : ''};
        var promise = SocketService.getUserEnterprises().then(function(response) {

            vm.userenterprises = response;
            deferred.resolve(response);
            return deferred.promise;
        }, function(error) {

            console.log(error);
            deferred.reject(error);
        });



        promise.then(function(response) {

            var uid = ApplicationContextService.globals.uid,
                enterpriseid = response[0].enterpriseId;
            SocketService.chatadmin.name = response[0].name;
            SocketService.chatadmin.id = enterpriseid;
            
             vm.chatadmin.name = response[0].name;
            vm.chatadmin.id = enterpriseid;
            
            SocketService.getMessages(uid, enterpriseid).then(function(response) {

                vm.customermessages = response;

            }, function(error) {

                console.log(error);

            });
        }, function(error) {

            console.log(error);
        });

        vm.activateChatAdmin = function(enterpriseId, enterprisename) {
            
            vm.customermessages = [];
           
            SocketService.chatadmin.name = enterprisename;
            SocketService.chatadmin.id = enterpriseId;
            
            vm.chatadmin.name = enterprisename;
            vm.chatadmin.id = enterpriseId;

            var uid = ApplicationContextService.globals.uid;

            SocketService.getMessages(uid, enterpriseId).then(function(response) {

                vm.customermessages = response;

            }, function(error) {

                console.log(error);

            });

        };

        vm.sendMessageToAdmin = function(chatmessage) {

            SocketService.sendMessageToAdmin(chatmessage);
            var user = ApplicationContextService.globals.user;
            
              var msg = {
                
               receiver : vm.chatadmin.name,
                receiverid : vm.chatadmin.id,
                sender : ApplicationContextService.globals.user,
                senderid : ApplicationContextService.globals.uid,
                message : chatmessage
            };
            
            vm.customermessages.push(msg);
             socket.emit('sendAdmin', msg);
            
        };

        vm.addEnterprise = function(enterprisename) {

            SocketService.getEnterprise(enterprisename).then(function(response) {

              

                if (response._id) {

                    delete response._id;
                }

                vm.userenterprises.push(response);

                vm.enterprisename = '';

            }, function(error) {

                console.log(error);

            });

        };


    }


})(angular);