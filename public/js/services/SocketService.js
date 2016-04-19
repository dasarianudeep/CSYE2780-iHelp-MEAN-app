(function(angular){
    'use strict';
    
    angular.module("iHelpApp")
           .service("SocketService", ['$http','ApplicationContextService',SocketService]);
           
           
    function SocketService($http, ApplicationContextService){
        
     
        var socket = io(),
            user = ApplicationContextService.globals.user,
            uid = ApplicationContextService.globals.uid;
        
        console.log(uid);
        socket.emit('join', {user : user, uid : uid });
        
        
        
        socket.on('displayAtAdmin', function(data){
            
                console.log(data);
                var html = '<li class="list-group-item"><p class="lead"><span class="glyphicon glyphicon-user"></span>'+data.sender.toUpperCase()+'&nbsp;&nbsp;&nbsp;<span class="text-center">'+data.message+'</span></p></li>';
                $("#adminchats").append(html);
        });
        
        socket.on('displayAtCustomer', function(data){
            
                console.log(data);
                var html = '<li class="list-group-item"><p class="lead"><span class="glyphicon glyphicon-user"></span>'+data.sender.toUpperCase()+'&nbsp;&nbsp;&nbsp;<span class="text-center">'+data.message+'</span></p></li>';
                $("#customerchats").append(html);
                
        });
        
        
         var socketService = {
            
            chatadmin : { id : 0, name : ''},
            chatcustomer : { id : 0, name : ''},
            messages : [],
            getUserEnterprises : getUserEnterprises,
            getEnterprise : getEnterprise,
            getAvailableUsers : getAvailableUsers,
            sendMessageToAdmin : sendMessageToAdmin,
            sendMessageToCustomer : sendMessageToCustomer,
            getMessages : getMessages
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
            
            socket.emit('sendAdmin', msg);
            socketService.messages.push(msg);
           $http({
                
                method : 'POST',
                url : '/api/v1/messages',
                data : msg
            }).then(function(response){
                
                console.log(response.data);
            }, function(error){
                
                console.log(error);
                
            });
        }
        
        function sendMessageToCustomer(chatmessage){
            
            var msg = {
                
                receiver : socketService.chatcustomer.name,
                receiverid : socketService.chatcustomer.id,
                sender : ApplicationContextService.globals.user,
                senderid : ApplicationContextService.globals.uid,
                message : chatmessage
                
            };
            
            socket.emit('sendCustomer', msg);
            socketService.messages.push(msg);
            
            $http({
                
                method : 'POST',
                url : '/api/v1/messages',
                data : msg
            }).then(function(response){
                
                console.log(response);
                
            }, function(error){
                
                console.log(error);
                
            });
        }
        
        function getMessages(uid, enterpriseid){
            
            var httpPromise = $http({
                
                method : 'GET',
                url : '/api/v1/messages/receiver/'+enterpriseid+'/sender/'+uid,
                               
            }).then(function(response){
                
                socketService.messages = response.data;
                return response.data;
                
            }, function(error){
                
                console.log(error);
                
            });
            
        }
        
    }
    
})(angular);