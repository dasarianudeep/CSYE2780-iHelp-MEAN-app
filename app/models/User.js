(function(){
    'use strict';
    
    var EnterpriseSchema = require('./Enterprise').EnterpriseSchema;
    var mongoose = require('mongoose'),
        UserSchema = mongoose.Schema({
            firstname:String,
            lastname : String,
            username : String,
            password : String,
            uid : Number,
            enterprise : String,
            isAvail : Boolean,
            chatenterprises : [EnterpriseSchema]
        });
        
    module.exports = mongoose.model('User', UserSchema);
    
})();