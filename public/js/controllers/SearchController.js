(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('SearchController', ['$q', 'ApplicationContextService', 'SocketService', SearchController]);

    function SearchController($q, ApplicationContextService, SocketService) {


        var vm = this;

        vm.currentchatadmin = '';

        var deferred = $q.defer();
        console.log(deferred);



        var promise = SocketService.getUserEnterprises().then(function(response) {

            vm.userenterprises = response;
            deferred.resolve(response);
            return deferred.promise;
        }, function(error) {

            console.log(error);
            deferred.reject(error);
        });



        promise.then(function(response) {

            var uid = ApplicationContextService.globals.uid,
                enterpriseid = response[0].enterpriseId;
            SocketService.chatadmin.name = response[0].name;
            SocketService.chatadmin.id = enterpriseid;
            
            SocketService.getMessages(uid, enterpriseid).then(function(response) {

                vm.customermessages = response;

            }, function(error) {

                console.log(error);

            });
        }, function(error) {

            console.log(error);
        });

        vm.activateChatAdmin = function(enterpriseId, enterprisename) {

            SocketService.chatadmin.name = enterprisename;
            SocketService.chatadmin.id = enterpriseId;

            var uid = ApplicationContextService.globals.uid;

            SocketService.getMessages(uid, enterpriseId).then(function(response) {

                vm.customermessages = response;

            }, function(error) {

                console.log(error);

            });

        };

        vm.sendMessageToAdmin = function(chatmessage) {

            SocketService.sendMessageToAdmin(chatmessage);
            var user = ApplicationContextService.globals.user;
            
            $("#customerchats").append('<li class="list-group-item"><p><span class="glyphicon glyphicon-user"></span>&nbsp;'+user+'&nbsp;&nbsp;&nbsp;<span class="text-center">'+chatmessage+'</span></p></li>');
            
        };

        vm.addEnterprise = function(enterprisename) {

            SocketService.getEnterprise(enterprisename).then(function(response) {

                //console.log(response);

                if (response._id) {

                    delete response._id;
                }

                vm.userenterprises.push(response);

                vm.enterprisename = '';

            }, function(error) {

                console.log(error);

            });

        };


    }


})(angular);