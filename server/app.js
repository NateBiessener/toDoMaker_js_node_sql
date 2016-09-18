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
});

//start get routes
//returns all rows from tasks table
app.get('/getTasks', urlencodedParser, function(req,res){
  console.log('in getTasks');
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      console.log(err);
    }
    else {
      var resultArray = [];
      var results = client.query('SELECT * FROM task');
      results.on('row', function(row){
        resultArray.push(row);
      });
      results.on('end', function(){
        done();
        console.log('in getTasks end, results:', resultArray);
        return res.json(resultArray);
      });//end end
    }//end else
  });//end connect
});//end getTasks

//returns all rows from lists table
app.get('/getAllLists', urlencodedParser, function(req,res){
  console.log('in getAllLists');
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      console.log(err);
    }
    else {
      var resultArray = [];
      var results = client.query('SELECT * FROM list');
      results.on('row', function(row){
        resultArray.push(row);
      });
      results.on('end', function(){
        done();
        console.log('in getAllLists end, results:', resultArray);
        return res.json(resultArray);
      });//end end
    }//end else
  });//end connect
});//end getAllLists

//returns all tasks for provided list table
//expects an object with a list id, returns joined list ordered by priority, then alpha
app.post('/getList', urlencodedParser, function(req,res){
  //------------could maybe be refactored in the future to be a get route. nothing is being changed, just needs the body to receive the list it will be returning
  console.log('in getList');
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      console.log(err);
    }
    else {
      var resultArray = [];
      var result = client.query('SELECT * FROM task JOIN task_list ON task.id = task_list.task_id JOIN list ON task_list.list_id = list.id WHERE list.id = $1;', [req.body.id]);
      result.on('row', function(row){
        resultArray.push(row);
      });
      result.on('end', function(){
        done();
        console.log('in getList end, result:', resultArray);
        return res.json(resultArray);
      });//end end
    }//end else
  });//end connect
});//end getList
//end get routes

//start task routes
//expects description, priority; returns newly created row
app.post('/addTask', urlencodedParser, function(req, res){
  console.log('in addTask');
  //add line to database
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else {
      var response = {};
      var responseQuery = client.query('INSERT INTO task (description, priority) VALUES ($1, $2) RETURNING *', [req.body.description, req.body.priority]);
      responseQuery.on('row', function(row){
        response = row;
      });//end on row
      responseQuery.on('end', function(){
        done();
        console.log('in addTask end, response:', response);
        //return added line
        return res.json(response);
      });//end end
    }//end else
  });//end pg.connect
});//end /addLine

//expects description and/or priority, updates either/both, returns nothing (script can use /getList on success to update current list on DOM)
// app.put('/editTask', urlencodedParser, function(req, res){
//   console.log('editTask url hit');
//   //change provided propertie/s of line in database
//   var queryString = 'UPDATE task SET ' + /*THINGS = THINGS*/ 'WHERE id = $1', [/*$1 TO BE ADDED*/];
//   pg.connect(connectionString, function(err, client, done){
//     if (err){
//       console.log(err);
//     }
//     else {
//       client.query(queryString);
//       var responseArray = [];
//       var responseQuery = client.query('SELECT FROM task WHERE id = $1', [/*$1 TO BE ADDED*/]);
//       responseQuery.on('row', function(row){
//         responseArray.push(row);
//       });//end on row
//       responseQuery.on('end', function(){
//         done();
//         //return changed line
//         return res.json(responseArray);
//       });//end end
//     }//end else
//   });//end pg.connect
// });//end /editLine

// app.post('/deleteTask', urlencodedParser, function(req, res){
//   console.log('deleteTask url hit');
//   //remove line from database
//   var queryString = 'DELETE FROM task WHERE id = $1', [/*$1 TO BE ADDED*/];
//   pg.connect(connectionString, function(err, client, done){
//     if (err){
//       console.log(err);
//     }
//     else {
//       client.query(queryString);
//       done();
//       //return success
//       res.send();
//     }//end else
//   });//end pg.connect
// });// end /deleteLine
//end task routes

//start list routes
//expects title; returns newly created list
app.post('/addList', urlencodedParser, function(req, res){
  console.log('in addList');
  //add line to database
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else {
      var response = {};
      var responseQuery = client.query('INSERT INTO list (title) VALUES ($1) RETURNING *', [req.body.title]);
      responseQuery.on('row', function(row){
        response = row;
      });//end on row
      responseQuery.on('end', function(){
        done();
        console.log('in /addList end, response:', response);
        //return added line
        return res.json(response);
      });//end end
    }//end else
  });//end pg.connect
});//end /addLine

// app.post('/deleteList', urlencodedParser, function(req, res){
//   console.log('deleteList url hit');
//   //remove line from database
//   var queryString = 'DELETE FROM list WHERE id = $1', [/*$1 TO BE ADDED*/];
//   pg.connect(connectionString, function(err, client, done){
//     if (err){
//       console.log(err);
//     }
//     else {
//       client.query(queryString);
//       done();
//       //return success
//       res.send();
//     }//end else
//   });//end pg.connect
// });// end /deleteLine
//end list routes

//start task_list routes
//expects object with list id and task id, returns list and all tasks from list
// app.post('/addTaskToList', urlencodedParser, function(req, res){
//   console.log('addTaskToList url hit');
//   //add line to database
//   var queryString = 'INSERT INTO task_list (task_id, list_id) VALUES ($1, $2)', [/*$1 $2 TO BE ADDED*/];
//   pg.connect(connectionString, function(err, client, done){
//     if (err){
//       console.log(err);
//     }
//     else {
//       client.query(queryString);
//       var responseArray = [];
//       var responseQuery = client.query('SELECT FROM list WHERE id = $1'/*ADD JOIN THING*/, [/*$1 TO BE ADDED*/]);
//       responseQuery.on('row', function(row){
//         responseArray.push(row);
//       });//end on row
//       responseQuery.on('end', function(){
//         done();
//         //return added line
//         return res.json(responseArray);
//       });//end end
//     }//end else
//   });//end pg.connect
// });//end /addLine

//expects object with list id and task id, flips 'complete' value, returns joined row
app.put('/completeTask', urlencodedParser, function(req,res){
  //ADD LOGIC
});//end /completeTask

app.delete('/deleteTaskFromList', urlencodedParser, function(req, res){
  //ADD LOGIC
});//end /deleteTaskFromList
//end task_list routes

app.use(express.static('public'));
