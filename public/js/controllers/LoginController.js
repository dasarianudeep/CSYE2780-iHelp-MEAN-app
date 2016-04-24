(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .controller('LoginController', ['$location', 'UserService', LoginController]);

    function LoginController($location, UserService) {

        var vm = this;

        vm.validateUser = function(user) {

            UserService.validateUser(user.name, user.password).then(function(response) {

                if (response.isValid) {
                    
                    if(response.enterprise === 'customer'){
                        
                        $location.path('/customersearch');
                    }
                    else{
                        
                        $location.path('/admin');
                    }
                    
                } else {

                    alert('Invalid Credentials');
                }

            }, function(error) {

                console.log(err);
            });
        };


    }

})(angular);