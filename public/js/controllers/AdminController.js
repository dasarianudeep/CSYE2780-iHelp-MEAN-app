(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('AdminController', ['$q', '$scope', '$rootScope','$location','ApplicationContextService', 'SocketService', AdminController]);


    function AdminController($q, $scope, $rootScope,$location,ApplicationContextService, SocketService) {


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
            
            console.log(data.senderid);
            console.log(vm.chatcustomer.id);
            if (data.senderid === vm.chatcustomer.id) {

                $scope.$apply(function() {

                     if(vm.adminmessages){ 
                    vm.adminmessages.push(data);
                      }
                      else{
                          vm.adminmessages = [data];
                      }
                });

            } else {

                $scope.$apply(function() {
                            console.log('111');
                    console.log(vm['note'+data.senderid]);
                    vm['note'+data.senderid]++;

                });

            }



        });
        
        
        socket.on('removeCustomers', function(data){
            
           
         
           
           $scope.$apply(function(){
               
                  
                var i = vm.availableusers.findIndex(function(user){
                    console.log(user.username);
                    console.log(data.user.username);
                    return user.username === data.user.username;
                }) ;
                
                console.log(i);
                console.log(vm.availableusers);
                vm.availableusers.splice(i, 1);
                console.log(vm.availableusers);
               
           });
           
           
        });
        
        socket.on('updateCustomers', function(data){
            
            console.log(data);
            
           
            if(data){
                
                $scope.$apply(function(){
                    
                    if(vm.availableusers.length === 0){
                        
                    SocketService.chatcustomer.id = data.uid;
                    SocketService.chatcustomer.name = data.username;
                    vm.chatcustomer.id = data.uid;
                    vm.chatcustomer.name = data.username;
                    
                    }
                    vm['note'+data.uid] = 0;
                    vm.availableusers.push(data);
                   
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

           
                var enterpriseid = ApplicationContextService.globals.uid;
                
                if(response.length > 0) {
                    
                 var uid = response[0].uid;
            SocketService.chatcustomer.id = uid;
            SocketService.chatcustomer.name = response[0].name;
            vm.chatcustomer.id = uid;
            vm.chatcustomer.name = response[0].name;

            SocketService.getMessages(uid, enterpriseid).then(function(response) {

                vm.adminmessages = response;


            }, function(error) {

                console.log(error);

            });
            
        }


        }, function(error) {

            console.log(error);

        });

        vm.removeUser = function(event, uid, index){
            
            event.stopPropagation();
            
            vm.availableusers.splice(index, 1);
            
        };
        
        vm.signOut = function(event){
            
            event.preventDefault();
            socket.emit('unjoin',{id : uid});
            $location.path("/");
            
        };
        
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

            if(vm.adminmessages){ 
                    vm.adminmessages.push(msg);
                      }
                      else{
                          vm.adminmessages = [msg];
                      }

            socket.emit('sendCustomer', msg);
            vm.chatmessage = '';


        };
    }

})(angular);