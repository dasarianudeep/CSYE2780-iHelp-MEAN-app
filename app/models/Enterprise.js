(function(){
    'use strict';
    
    var mongoose = require('mongoose');
    
    module.exports = mongoose.Schema({
        
            name : String,
            enterpriseId : Number,
            enterpriseadmin : String
            
        });
    
})();