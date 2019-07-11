var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const querystring = require('querystring');

app.use(bodyParser.urlencoded({extended : true}));

//TODO after save data follow req, and call it from req.
function connectionMdb(){
    var dbo = null;

    MongoClient.connect(url, {useNewUrlParser : true}, function(err, db){
        if(err){
            console.error(err);
        }else{
            dbo = db.connect('mydb');
        }
    });
    return dbo;
}

app.post("/signup", function(req, res){
    var username = req.query.username;
    var password = req.query.password;

    if(username && password){
        var dbo = connectionMdb();

        if(!haveUserName(username, dbo)){
            
            var user = {'username': username, 'password' : password};
            //TODO need or not 
            if(dbo !== null){
                dbo.collection('users').insertOne(user, function(err, response){
                    if(err){
                        console.error(err);
                        res.send('can not login');
                    }
                    const paramQuery = querystring.stringify({
                        'username': username,
                        'password': password
                    });

                    res.redirect('/userInfo?', paramQuery);
                });
            }
        }else{
            res.send("userName is signed! Please choose other name.")
        }
    }
})

function haveUserName(username, dbo){

    var result = dbo.collection('users').findOne({'username': username});
    if(result){
        return true;
    }

    return false;
}

app.get('/login', function(req, res){
    var username = req.query.username;
    var password = req.query.password;

    if(username && password){
        //TODO data need get from req;
        var dbo = connectionMdb();
        var query = {'username': username, 'password': password};
        var user = dbo.collection('users').findOne({query});
        if(user){
            const paramQuery = querystring.stringify({
                'username': username,
                'password': password
            });

            res.redirect('/userInfo?', paramQuery);
        }else{
            res.send('username and password are invalid.')
        }
    }
})

app.get('/userInfo', function(req, res){
    var username = req.query.username;
    req.send('hello ' + username);
})

var server = app.listen(8081, function(req, res){
    var host = server.address().address;
    var port = server.address().port;
    console.log('web server: ' + host + port);
})




