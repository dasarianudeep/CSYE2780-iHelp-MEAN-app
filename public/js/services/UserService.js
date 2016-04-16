(function(angular){
    'use strict';
    
    angular.module('iHelpApp')
           .service('UserService',['$http', UserService]);
           
   function UserService($http){
       
       var userService = {
           validateUser : validateUser
       };
       
       return userService;
       
       //Function Implementations
       
       function validateUser(username, password){
           
           var httpPromise = $http({
               method : 'GET',
               url : '/api/v1/validateuser',
               params : { username : username , password : password }
           }).then(function(response){
              
              return response.data;
               
           }, function(error){
               
               console.log(error);
               
           });
           
        return httpPromise;
       }
       
   }
    
})(angular);