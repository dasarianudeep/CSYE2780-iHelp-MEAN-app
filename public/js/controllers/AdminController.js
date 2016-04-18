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
            
                      
            SocketService.chatcustomerid = uid;
            SocketService.chatcustomername = username;
            
        };
        
        vm.sendMessage = function(chatmessage){
            
            
        };
    }
    
})(angular);