(function(){
    'use strict';
    
    var EnterpriseSchema = require('./Enterprise');
    var mongoose = require('mongoose'),
        UserSchema = mongoose.Schema({
            firstname:String,
            lastname : String,
            username : String,
            password : String,
            uid : Number,
            enterprise : String,
            isAvail : Boolean,
        });
        
    module.exports = mongoose.model('User', UserSchema);
    
})();