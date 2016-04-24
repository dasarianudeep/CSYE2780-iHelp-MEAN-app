(function(angular) {
    'use strict';

    angular.module("iHelpApp")
        .service("SocketService", ['$http', 'ApplicationContextService', SocketService]);


    function SocketService($http, ApplicationContextService) {



        var socketService = {

            chatadmin: {
                id: 0,
                name: ''
            },
            chatcustomer: {
                id: 0,
                name: ''
            },
            message: {
                admin: '',
                customer: ''
            },
            getUserEnterprises: getUserEnterprises,
            getEnterprise: getEnterprise,
            getAvailableUsers: getAvailableUsers,
            sendMessageToAdmin: sendMessageToAdmin,
            sendMessageToCustomer: sendMessageToCustomer,
            getMessages: getMessages,
            updateAvail : updateAvail
            //removeEnterprise : removeEnterprise
        };

        return socketService;

        //Function Implementations

        function getUserEnterprises() {

            var httpPromise = $http({

                method: 'GET',
                url: '/api/v1/getuserenterprises',
                params: {

                    username: ApplicationContextService.globals.user

                }
            }).then(function(response) {

                return response.data;

            }, function(error) {

                console.log(error);

            });

            return httpPromise;
        }


        function getEnterprise(enterprisename) {

            var httpPromise = $http({

                method: 'GET',
                url: '/api/v1/enterprises/' + enterprisename + '/username/' + ApplicationContextService.globals.user
            }).then(function(response) {

                return response.data;
            }, function(error) {

                console.log(error);
            });

            return httpPromise;

        }

        function getAvailableUsers() {

            var httpPromise = $http({

                method: 'GET',
                url: '/api/v1/availablecustomers'
            }).then(function(response) {

                return response.data;

            }, function(error) {

                console.log(error);
            });

            return httpPromise;
        }

        function sendMessageToAdmin(chatmessage) {



            var msg = {

                receiver: socketService.chatadmin.name,
                receiverid: socketService.chatadmin.id,
                sender: ApplicationContextService.globals.user,
                senderid: ApplicationContextService.globals.uid,
                message: chatmessage
            };


            $http({

                method: 'POST',
                url: '/api/v1/messages',
                data: msg
            }).then(function(response) {

                console.log(response.data);
            }, function(error) {

                console.log(error);

            });
        }

        function sendMessageToCustomer(chatmessage) {

            var msg = {

                receiver: socketService.chatcustomer.name,
                receiverid: socketService.chatcustomer.id,
                sender: ApplicationContextService.globals.user,
                senderid: ApplicationContextService.globals.uid,
                message: chatmessage

            };



            $http({

                method: 'POST',
                url: '/api/v1/messages',
                data: msg
            }).then(function(response) {

                console.log(response);

            }, function(error) {

                console.log(error);

            });
        }

        function getMessages(uid, enterpriseid) {

            var httpPromise = $http({

                method: 'GET',
                url: '/api/v1/messages/receiver/' + enterpriseid + '/sender/' + uid,

            }).then(function(response) {


                return response.data;

            }, function(error) {

                console.log(error);

            });


            return httpPromise;

        }
        
        function updateAvail(uid){
            
            var httpPromise = $http({
                
                url : '/api/v1/updateavail/'+uid,
                method : 'GET'
                
            }).then(function(response){
                
                return response.data;
                
            }, function(error){
                
                console.log(error);
                
            });
            
            return httpPromise;
            
        }
        
        
        // function removeEnterprise(enterpriseid){
            
            
            
        // }

    }

})(angular);