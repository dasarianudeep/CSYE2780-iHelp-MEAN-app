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
        
        socket.on('displayAtAdmin', function(data){
            
                console.log(data);
        });
        
        socket.on('displayAtCustomer', function(data){
            
            
        });
        
        
         var socketService = {
            
            chatadmin : { id : 0, name : ''},
            chatcustomer : { id : 0, name : ''},
            getUserEnterprises : getUserEnterprises,
            getEnterprise : getEnterprise,
            getAvailableUsers : getAvailableUsers,
            sendMessageToAdmin : sendMessageToAdmin,
            sendMessageToCustomer : sendMessageToCustomer
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
                url : '/api/v1/enterprises/'+enterprisename+'/username/'+ApplicationContextService.globals.user
            }).then(function(response){
                
                return response.data;
            }, function(error){
                
                console.log(error);
            });
            
            return httpPromise;
            
        }
        
        function getAvailableUsers(){
            
            var httpPromise = $http({
                
                method : 'GET',
                url : '/api/v1/availablecustomers'
            }).then(function(response){
                
                return response.data;
                
            }, function(error){
                
                console.log(error);
            });
            
            return httpPromise;
        }
        
        function sendMessageToAdmin(chatmessage){
            
            // console.log(SocketService.chatadminname);
            // console.log(SocketService.chatadminid);
            
            var msg = {
                
                receiver : socketService.chatadmin.name,
                receiverid : socketService.chatadmin.id,
                sender : ApplicationContextService.globals.user,
                senderid : ApplicationContextService.globals.uid,
                message : chatmessage
            };
            
            socket.emit('sendAdmin', { data : msg });
        }
        
        function sendMessageToCustomer(chatmessage){
            
            var msg = {
                
                receiver : socketService.chatcustomer.name,
                receiverid : socketService.chatcustomer.id,
                sender : ApplicationContextService.globals.user,
                senderid : ApplicationContextService.globals.user,
                message : chatmessage
                
            };
            
            socket.emit('sendCustomer', {data : msg});
        }
        
    }
    
})(angular);