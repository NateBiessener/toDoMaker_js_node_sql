console.log('script sourced');

$(document).ready(function(){
  console.log('jq');
  $('#addTask').on('click', function(){
    console.log('in addTask');
    var objectToSend = {
      description: 'test description',
      priority: 5
    };
    $.ajax({
      url: '/addTask',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        console.log('addTask success, data:', data);
      }//end success
    });//end ajax call
  });//end addTask onclick

  $('#addList').on('click', function(){
    console.log('in addList');
    var objectToSend = {
      title: 'test title'
    };
    $.ajax({
      url: '/addList',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        console.log('addList success, data:', data);
      }//end success
    });//end ajax call
  });//end addList onclick

  $('#getTasks').on('click', function(){
    console.log('in getTasks');
    $.ajax({
      url: '/getTasks',
      type: 'GET',
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });// end getTasks onclick

  $('#getAllLists').on('click', function(){
    console.log('in getAllLists');
    $.ajax({
      url: '/getAllLists',
      type: 'GET',
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });// end getAllLists onclick

  $('#getList').on('click', function(){
    console.log('in getList');
    var objectToSend = {
      id: 1 /*-------------TEST VALUE--------------------------*/
    };
    $.ajax({
      url: '/getList',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });//end getList

  $('#addTaskToList').on('click', function(){
    console.log('in addTaskToList');
    var objectToSend = {
      task_id: 7, /*-------------TEST VALUE--------------------------*/
      list_id: 1  /*-------------TEST VALUE--------------------------*/
    };
    $.ajax({
      url: '/addTaskToList',
      type: 'POST',
      data: objectToSend,
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });//end addTaskToList

  $('#completeTask').on('click', function(){
    console.log('in completeTask');
    var objectToSend = {
      task_id: 8, /*-------------TEST VALUE--------------------------*/
      list_id: 1  /*-------------TEST VALUE--------------------------*/
    };
    $.ajax({
      url: '/completeTask',
      type: 'PUT',
      data: objectToSend,
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });//end completeTask onclick

  $('#deleteTaskFromList').on('click', function(){
    console.log('in deleteTaskFromList');
    var objectToSend = {
      task_id: 7, /*-------------TEST VALUE--------------------------*/
      list_id: 1  /*-------------TEST VALUE--------------------------*/
    };
    $.ajax({
      url: '/deleteTaskFromList',
      type: 'DELETE',
      data: objectToSend,
      success: function(data){
        console.log(data);
        if (data.count === "0"){
          delTaskFromDB( {task_id: objectToSend.task_id} );
        }
      }//end success
    });//end ajax call
  });//end deleteTaskFromList

  $('#deleteList').on('click', function(){
    objectToSend = {
      list_id: 4 /*-------------TEST VALUE--------------------------*/
    };
    $.ajax({
      url: 'deleteList',
      type: 'DELETE',
      data: objectToSend,
      success: function(data){
        console.log('deleteList success');
      }//end success
    });//end ajax call
  });//end deleteList

});//end doc ready

var delTaskFromDB = function(objectToSend){
  $.ajax({
    url: 'deleteTask',
    type: 'DELETE',
    data: objectToSend,
    success: function(data){
      console.log('deleteTask success');
    }//end success
  });//end ajax call
};



// $.ajax({
//   url: '/editLine',
//   type: 'POST',
//   data: objectToSend,
//   success: function(data){
//     console.log('in editLine ajax success');
//   }
// });
//
// $.ajax({
//   url: '/deleteLine',
//   type: 'POST',
//   data: objectToSend,
//   success: function(data){
//     console.log('in deleteLine ajax success');
//   }
// });
