(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .controller('LoginController', ['$location','UserService',LoginController]);
           
   function LoginController($location, UserService){
       
       var vm  = this;
       
       vm.validateUser = function(user){
           
           console.log(user);
           
           UserService.validateUser(user.name, user.password).then(function(response){
               
               if(response.isValid){
                   
                   $location.path('/search');
               }
               else{
                   
                   alert('Invalid Credentials');
               }
               
           }, function(error){
               
               console.log(err);
           });
       };
       
       
   }
    
})(angular);