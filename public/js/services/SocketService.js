(function(angular){
    'use strict';
    
    angular.module("iHelpApp")
           .service("SocketService", ['$http','ApplicationContextService',SocketService]);
           
           
    function SocketService($http, ApplicationContextService){
        
       
        console.log('inside service');
        var socket = io(),
            user = ApplicationContextService.globals.user,
            uid = ApplicationContextService.globals.uid;
        
        console.log(uid);
        socket.emit('join', {user : user, uid : uid });
        
        socket.on('abc', function(){
            console.log('inn');
        });
        
         var socketService = {
            
            getUserEnterprises : getUserEnterprises,
            getEnterprise : getEnterprise
        };
        
        return socketService;
        
        //Function Implementations
        
        function getUserEnterprises(){
            
            var httpPromise = $http({
                
                method : 'GET',
                url : '/api/v1/getuserenterprises',
                params : {
                    
                    username : ApplicationContextService.globals.user
                    
                }
            }).then(function(response){
                
                return response.data;
                
            }, function(error){
                
                console.log(error);
                
            });
            
            return httpPromise;
        }
        
        
        function getEnterprise(enterprisename){
            
            var httpPromise = $http({
                
                method : 'GET',
                url : '/api/v1/enterprises/'+enterprisename
            }).then(function(response){
                
                return response.data;
            }, function(error){
                
                console.log(error);
            });
            
            return httpPromise;
            
        }
        
    }
    
})(angular);