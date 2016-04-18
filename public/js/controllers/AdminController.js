(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .controller('AdminController', ['$q','SocketService',AdminController]);
    
    
    function AdminController($q, SocketService){
        
        var vm = this;
        
        var deferred = $q.defer();
        
        SocketService.getAvailableUsers().then(function(response){
            
            vm.availableusers = response;
            deferred.resolve(response);
            
        }, function(error){
            
            console.log(error);
            deferred.reject(error);
            
        });
        
        deferred.then(function(responsne){
            
            
            vm.adminmessages = response;
            
        }, function(error){
            
            console.log(error);
            
        });
        vm.activateCustomer = function(uid, username){
            
                      
            SocketService.chatcustomer.id= uid;
            SocketService.chatcustomer.name = username;
            
        };
        
        vm.sendMessageToCustomer = function(chatmessage){
            
            
        };
    }
    
})(angular);