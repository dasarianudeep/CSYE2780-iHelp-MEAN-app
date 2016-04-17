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
            
            controller : 'SearchController',
            controllerAs : 'searchCtrl',
            templateUrl : './partials/search.html'
            
        }).otherwise({redirectTo : '/'});
       
        
    }
})(angular);