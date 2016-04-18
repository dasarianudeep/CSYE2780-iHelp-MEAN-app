(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .controller('AdminController', ['SocketService',AdminController]);
    
    
    function AdminController(SocketService){
        
        var vm = this;
        
        SocketService.getAvailableUsers().then(function(response){
            
            vm.availableusers = response;
            
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