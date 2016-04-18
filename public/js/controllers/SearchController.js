(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .controller('SearchController', ['SocketService',SearchController]);
           
    function SearchController(SocketService){
        
        
        var vm = this;
        
        vm.currentchatadmin = '';
        // vm.userenterprises = function(username){
            
            
        // }
        
        SocketService.getUserEnterprises().then(function(response){
            
            vm.userenterprises = response;
        }, function(error){
            
            console.log(error);
        });
        
        vm.activateChatAdmin = function(enterpriseId, enterprisename){
            
            SocketService.chatadminname = enterprisename;
            SocketService.chatadminid = enterpriseId;    
            
        };
        
        vm.sendMessage = function(chatmessage){
            
            
        };
        
         vm.addEnterprise = function(enterprisename){
        
             SocketService.getEnterprise(enterprisename).then(function(response){
                 
                 console.log(response);
                 
                 if(response._id){
                     
                     delete response._id;
                 }
                 
                 vm.userenterprises.push(response);
                 
                 vm.enterprisename = '';
                 
             }, function(error){
                 
                 console.log(error);
                 
             });
               
        };
    
    }
    
   
    
})(angular);