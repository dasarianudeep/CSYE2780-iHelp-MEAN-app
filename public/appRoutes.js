(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .config(['$routeProvider', AppConfig]);
    
    function AppConfig($routeProvider){
        
        $routeProvider.when('/',{
            
            controller : 'LoginController',
            controllerAs : 'loginCtrl',
            templateUrl : './partials/home.html'
            
        }).when('/search',{
            
        }).otherwise({redirectTo : '/'});
       
        
    }
})(angular);