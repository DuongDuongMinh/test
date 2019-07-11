var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/'; 

MongoClient.connect(url, {useNewUrlParser : true}, function(err, db){
      
    var dbo = db.db('mydb');
    var obj = {name :'adb', price : '123'}
    dbo.collection('customers').insertOne(obj, function(err, response){
        console.log('hello');

    });
});


var server = app.listen(8081, function(req, res){
    var host = server.address().address;
    var port = server.address().port;

    console.log('web server: ' + host + port);
})