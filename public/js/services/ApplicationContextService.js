(function(angular) {
    'use strict';

    angular.module('iHelpApp')
        .service('ApplicationContextService', ApplicationContextService);


    function ApplicationContextService() {

        var appContext = {
            globals: globals
        };

        return appContext;

        function globals() {

            return {
                    
                 
            };
        }
    }

})(angular);