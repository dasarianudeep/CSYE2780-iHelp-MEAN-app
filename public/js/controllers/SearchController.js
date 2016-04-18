(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .controller('SearchController', ['SocketService',SearchController]);
           
    function SearchController(SocketService){
        
        
        var vm = this;
        
        // vm.userenterprises = function(username){
            
            
        // }
        
        SocketService.getUserEnterprises().then(function(response){
            
            vm.userenterprises = response;
        }, function(error){
            
            console.log(error);
        });
    }
    
})(angular);