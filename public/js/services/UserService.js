(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .service('UserService', ['$http', 'ApplicationContextService', UserService]);

    function UserService($http, ApplicationContextService) {

        var userService = {
            validateUser: validateUser
        };

        return userService;

        //Function Implementations

        function validateUser(username, password) {

            var httpPromise = $http({
                method: 'GET',
                url: '/api/v1/validateuser',
                params: {
                    username: username,
                    password: password
                }
            }).then(function(response) {

                ApplicationContextService.globals.user = username;
                ApplicationContextService.globals.uid = response.data.uid;
                return response.data;

            }, function(error) {

                console.log(error);

            });

            return httpPromise;
        }

    }

})(angular);