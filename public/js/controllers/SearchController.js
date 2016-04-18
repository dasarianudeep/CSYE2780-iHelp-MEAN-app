(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .controller('SearchController', ['$q','ApplicationContextService','SocketService',SearchController]);
           
    function SearchController($q, ApplicationContextService, SocketService){
        
        
        var vm = this;
        
        vm.currentchatadmin = '';
      
        var deferred = $q.defer();
        
        SocketService.getUserEnterprises().then(function(response){
            
            vm.userenterprises = response;
            deferred.resolve(response);
        }, function(error){
            
            console.log(error);
            deferred.reject(error);
        });
        
        deferred.then(function(response){
            
            var uid = ApplicationContextService.globals.uid,
                enterpriseid= response[0].enterpriseId;
                
         SocketService.getMessages(uid, enterpriseid).then(function(response){
             
             vm.customermessages = response;
             
         }, function(error){
             
             console.log(error);
             
         });
        });
        
        vm.activateChatAdmin = function(enterpriseId, enterprisename){
            
            SocketService.chatadmin.name = enterprisename;
            SocketService.chatadmin.id = enterpriseId;    
            
        };
        
        vm.sendMessageToAdmin = function(chatmessage){
            
            SocketService.sendMessageToAdmin(chatmessage);
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