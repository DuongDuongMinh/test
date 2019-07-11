 var MongoClient = require('mongodb').MongoClient;
 var url = 'mongodb://localhost:27017/';
 
 var express = require('express');
 var bodyParser =   require('body-parser');
 const querystring = require('querystring');
 var app = express();

 app.use(bodyParser({extended : true}));
//TODO need to save to req and when you need date get from req;
 function connectionMdb(){
     var dbo = null;

     MongoClient.connection(url, {useNewUrlParser : true}, function(err, db){
         if(err){
            console.error(err);
            res.sent('can\'t connect to database');
         }else{
             dbo = db.db('mydb');
         } 
     });
     return dbo
 }

 app.post('/insertProduct', function(req, rest){
     var code = req.query.code;
     var name = req.query.name;
     var price = req.query.price;
     var date = req.query.date;
     //dbo need get form req;
     var dbo = connectionMdb();

     if(!haveCode(code, dbo)){

        if(name && price && date){
            var obj = {
                'code' : code,
                'name' : name,
                'price' : price,
                'date' : date
            };

            dbo.collection('products').insertOne(obj, function(err, response){
                if(err){
                    console.error(err);
                    res.send('can\'t add the product');
                }else{
                    res.redirect('/productList');
                }
            });
        }else{
            res.send('code of the produce had exist.')
        }
     }
    
 })

 function haveCode(code, dbo){
    if(code){
        var result = dbo.collection('products').findOne({'code' : code});
        if(result){
            return true;
        }
    }
    return false;
 }

 app.put('/updateProduct', function(req, res){
       var code = req.query.code;
       var dbo = connectionMdb();

       if(haveCode(code, dbo)){
            var product = {};

            if(req.query.name) product.name = req.query.name;
            if(req.query.price) product.price = req.query.price;
            if(req.query.date) product.date = req.query.date;
            

            dbo.collection('product').updateOne({'code':code}, { $set: product});
            res.redirect('/productList');
       }else{
           res.send('the product\'s code is invalid.')
       }
 })

app.get('/productList', function(req, res){
    var dbo = connectionMdb();
    dbo.collection('products').find({}).toArray(function(err, result){
        if(err){
            console.error(err);
            res.send('can\'t show product list now');
        }else{
            res.send(result);
        }
    });
})

app.delete('/delete', function(req, res){
    var code = req.query.code;
    var dbo = req.query.dbo;

    if(haveCode(code, dbo)){
        dbo.collection('products').deleteOne({'code': code}, function(err, obj){
            if(err){
                console.error(err);
                res.send('error in system. Try again later');
            }else{
                res.redirect('/productList');
            }
        });
        
    }else{
        res.send('code is invalid.');
    }
})

app.get('/findProduct', function(req, res){
    var product = {};

    if(app.query.code) product.code = app.query.code;
    if(app.query.name) product.name = app.query.name;
    if(app.query.price) product.price = app.query.price;
    if(app.query.date) product.date = app.query.date;

    var dbo = connectionMbo();

    dbo.collection('products').find(product).toArray(function(err, result){
        if(err){
            console.error(err);
            rest.send('error system, please try later');
        }else{
             rest.send(result);
        }
    });
})

var server = app.listen(8081, function(req, res){
    var host = server.address().address;
    var port = server.address().port;

    console.log('web server: ' + host + port);

})
