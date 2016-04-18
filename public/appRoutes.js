(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .config(['$routeProvider', AppConfig]);
    
    function AppConfig($routeProvider){
        
        $routeProvider.when('/',{
            
            controller : 'LoginController',
            controllerAs : 'loginCtrl',
            templateUrl : './partials/home.html'
            
        }).when('/customersearch',{
            
            controller : 'SearchController',
            controllerAs : 'searchCtrl',
            templateUrl : './partials/customersearch.html'
            
        }).when('/admin',{
            
            controller : 'AdminController',
            controllerAs : 'adminCtrl',
            templateUrl : './partials/adminhome.html'
            
        }).otherwise({redirectTo : '/'});
       
        
    }
})(angular);