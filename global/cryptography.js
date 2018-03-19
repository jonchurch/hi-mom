
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = process.env.PASSWORD;


module.exports = {
  encrypt: function (text){
    var cipher = crypto.createCipheriv(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },
  decrypt: function (text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }
}

 
