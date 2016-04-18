(function(){
    'use strict';
    
    var mongoose = require('mongoose'),
        MessageSchema = mongoose.Schema({
            receiver : String,
            receiverid : Number,
            sender : String,
            senderid : Number,
            message : String,
            date : {type : Date, default : Date.now}
        });
        
    module.exports = mongoose.model('Message', MessageSchema);
    
})();