(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('AdminController', ['$q','$scope','$rootScope','ApplicationContextService', 'SocketService', AdminController]);


    function AdminController($q,$scope,$rootScope, ApplicationContextService, SocketService) {
        
        
        var socket = io(),
            user = ApplicationContextService.globals.user,
            uid = ApplicationContextService.globals.uid;
        
        console.log(uid);
        socket.emit('join', {user : user, uid : uid });
        
         socket.on('displayAtAdmin', function(data){
            
                console.log(data);
                //var html = '<li class="list-group-item listitemscustomer"><p><span class="glyphicon glyphicon-user"></span>&nbsp;'+data.sender.toUpperCase()+'&nbsp;&nbsp;&nbsp;<span class="text-center">'+data.message+'</span></p></li>';
               // $("#customerchats").append(html);
               
               $scope.$apply(function(){
                   vm.adminmessages.push(data);
               });
               
                
        });

        var vm = this;
        
        
        vm.chatcustomer = { id : 0, name : ''};
        var deferred = $q.defer();

        // $scope.$on('sendToAdmin', function(msg){
           
        //    console.log('inn');
        //    vm.adminmessages.push(msg);
            
        // });
        
        //$scope.socketService = SocketService;
       vm.socketService = SocketService;
        //console.log(vm.socketServiceMessages);
        
       
        
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

        //  $scope.$watch(function(){
            
        //     return vm.socketService.message;
            
        // }, function(oldVal, newVal){
            
        //     console.log(vm.socketService.message);
        //     if(oldVal !== newVal){
        //         console.log('innnnnnnn');
        //        vm.adminmessages.push(data);
                
        //     }
            
        // }, true);
        
        vm.activateCustomer = function(uid, username) {

            
            
            vm.adminmessages = [];
            $(".listitemsadmin").empty();
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
                
                receiver : vm.chatcustomer.name,
                receiverid : vm.chatcustomer.id,
                sender : ApplicationContextService.globals.user,
                senderid : ApplicationContextService.globals.uid,
                message : chatmessage
               
            };
            
            vm.adminmessages.push(msg);
            
            socket.emit('sendCustomer', msg);
            
            // $rootScope.$broadcast('sendToCustomer', msg);
            
          // $("#adminchats").append('<li class="list-group-item listitemsadmin"><p><span class="glyphicon glyphicon-user"></span>&nbsp;'+user.toUpperCase()+'&nbsp;&nbsp;&nbsp;<span class="text-center">'+chatmessage+'</span></p></li>');
            
        };
    }

})(angular);