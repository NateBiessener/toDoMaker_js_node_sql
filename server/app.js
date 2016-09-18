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

app.post('/addLine', urlencodedParser, function(req, res){
  console.log('addLine url hit');
  //add line to database
  var queryString = 'INSERT INTO task (description, complete, priority) VALUES ($1, $2, $3)', [/*$1 $2 $3 TO BE ADDED*/];
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else {
      client.query(queryString);
      var responseArray = [];
      var responseQuery = client.query('SELECT FROM task WHERE id = $1', [/*$1 TO BE ADDED*/]);
      responseQuery.on('row', function(row){
        responseArray.push(row);
      });//end on row
      responseQuery.on('end', function(){
        done();
        //return added line
        return res.json(responseArray);
      });//end end
    }//end else
  });//end pg.connect
});//end /addLine

app.post('/editLine', urlencodedParser, function(req, res){
  console.log('editLine url hit');
  //change provided propertie/s of line in database
  var queryString = 'UPDATE task SET ' + /*THINGS = THINGS*/ 'WHERE id = $1', [/*$1 TO BE ADDED*/];
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else {
      client.query(queryString);
      var responseArray = [];
      var responseQuery = client.query('SELECT FROM task WHERE id = $1', [/*$1 TO BE ADDED*/]);
      responseQuery.on('row', function(row){
        responseArray.push(row);
      });//end on row
      responseQuery.on('end', function(){
        done();
        //return changed line
        return res.json(responseArray);
      });//end end
    }//end else
  });//end pg.connect
});//end /editLine

app.post('/deleteLine', urlencodedParser, function(req, res){
  console.log('deleteLine url hit');
  //remove line from database
  var queryString = 'DELETE FROM task WHERE id = $1', [/*$1 TO BE ADDED*/];
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else {
      client.query(queryString);
      done();
      //return success
      res.send();
    }//end else
  });//end pg.connect
});// end /deleteLine

app.use(express.static('public'));
