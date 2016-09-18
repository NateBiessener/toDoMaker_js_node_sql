var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var pg = require('pg');
var path = require('path');

var connectionString = 'postgres://localhost:5432/todo';

app.listen('3042', function(){
  console.log('listening on 3042');
});

app.get('/', function(req, res){
  console.log('base url hit');
  res.sendFile(path.resolve('public/index.html'));
})

app.use(express.static('public'));
