(function(){
    'use strict';
    
    var mongoose = require('mongoose'),
    
        EnterpriseSchema = mongoose.Schema({
        
            name : String,
            enterpriseId : Number,
            enterpriseadmin : String
            
        });
        
        module.exports={
            
            model : mongoose.model('Enterprise', EnterpriseSchema),
            EnterpriseSchema : EnterpriseSchema
        } 
    
})();