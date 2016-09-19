//on load, will display all lists and a create list interface
//clicking on a list will display all tasks on that list, ordered by priority with an add task interface and an option to return to the all-lists display

console.log('script sourced');

//filled on doc load
var tasks = [];

//filled on doc load
var lists = [];

var docReady = function(){

 return $(document).ready(function(){
  console.log('jq');
  $('#topDiv').html('To Do List Maker');
  getTasks().done(function(){
    $('#createDiv').html(
      '<input type="text" placeholder="List Name" id="listIn"> <p id="createList">Create New List</p>'
    );
    getAllLists().done(displayLists);

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

    $('body').on('click', '#createList', function(){
      console.log('in createList');
      var objectToSend = {
        title: $('#listIn').val()
      };
      $.ajax({
        url: '/addList',
        type: 'POST',
        data: objectToSend,
        success: function(data){
          console.log('createList success, data:', data);
          getAllLists().done(displayLists);
        }//end success
      });//end ajax call
    });//end addList onclick

    $('body').on('click', '.listTitle', function(){
      //exampleObject = {
      // complete:false
      // description:"test description"
      // priority:5
      // title:"test title"
      // list_id:1
      // task_id:6
      // };
      console.log('in listTitle click');
      var objectToSend = {
        id: $(this).data('id')
      };
      $.ajax({
        url: '/getList',
        type: 'POST',
        data: objectToSend,
        success: function(data){
          console.log(data);
          $('#topDiv').html('<h2 id="listScreenTitle">' + data[0].title + '</h2> <button id="backHome">Home</button>');
          //build list display
          var listHTML = '';
          for (var i = 0; i < data.length; i++) {
            var itemHTML = '';
            if (data[i].complete) {
              itemHTML += '<p class="task complete" data-list_id="' + data[i].list_id + '" data-task_id="' + data[i].task_id + '"><input type="checkbox" class="completeTask" checked=true>'
            }
            else {
              itemHTML += '<p class="task" data-list_id="' + data[i].list_id + '" data-task_id="' + data[i].task_id + '"><input type="checkbox" class="completeTask">'
            }
            itemHTML += data[i].description + ' ';
            switch (data[i].priority) {
              case 1:
                itemHTML += '-- NOW!'
                break;
              case 2:
                itemHTML += '-- Urgent!'
                break;
              case 3:
                itemHTML += '-- Soon'
                break;
              case 4:
                itemHTML += '-- Eventually'
                break;
              case 5:
                itemHTML += '-- Someday'
                break;
              default:
                console.log('in switch default, debug');
            }//end switch
            itemHTML += ' <ins class="deleteTask">Erase</ins></p>';
            listHTML += itemHTML;
          }//end for
          $('#listDiv').html(listHTML);

          $('#createDiv').html(
            '<input id="descripIn" placeholder="Task description"><br><select id="priorityIn"><option>Select Priority</option><option value=1>Now!</option><option value=2>Urgent!</option><option value=3>Soon</option><option value=4>Eventually</option><option value=5>Someday</option></select><br><p id="addTaskToList">Add To List</p>'
          );//end createDiv.html
        }//end success
      });//end ajax call
    });//end listTitle onclick

    $('body').on('click', '#addTaskToList', function(){
      console.log('in addTaskToList');
      //check for task, if not in db, add to db, store id

      //add task to list, complete default to false
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

    // $('body').on('click', '.task', function(){
    //   console.log('task id:', $(this).data('task_id'), 'list id:', $(this).data('list_id'));
    // });

    $('body').on('click', '#backHome', function(){
      docReady();
    })

    $('body').on('change', '.completeTask', function(){
      console.log('in completeTask');
      $(this).parent().toggleClass('complete');
      var objectToSend = {
        task_id: $(this).parent().data('task_id'),
        list_id: $(this).parent().data('list_id')
      };
      console.log('objectToSend');
      $.ajax({
        url: '/completeTask',
        type: 'PUT',
        data: objectToSend,
        success: function(data){
          console.log(data);
        }//end success
      });//end ajax call
    });//end completeTask onclick

    $('body').on('click', '.deleteTask', function(){
      $(this).html('Are you sure?');
      $(this).removeClass('deleteTask');
      $(this).addClass('confirmDeleteTask');
    });

    $('body').on('click', '.confirmDeleteTask', function(){
      console.log('in deleteTaskFromList');
      var objectToSend = {
        task_id: $(this).parent().data('task_id'),
        list_id: $(this).parent().data('list_id')
      };
      $(this).parent().remove();
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

    $('body').on('click', '.delList', function(){
      objectToSend = {
        list_id: $(this).parent().data('id')
      };
      console.log(objectToSend);
      $.ajax({
        url: 'deleteList',
        type: 'DELETE',
        data: objectToSend,
        success: function(data){
          console.log('deleteList success');
        }//end success
      });//end ajax call
    });//end deleteList

    $('#editTask').on('click', function(){
      var objectToSend = {
        id: 6,                          /*-------------TEST VALUE--------------------------*/
        description: 'new description', /*-------------TEST VALUE--------------------------*/
        priority: 4                     /*-------------TEST VALUE--------------------------*/
      };
      $.ajax({
        url: '/editTask',
        type: 'PUT',
        data: objectToSend,
        success: function(data){
          console.log('editTask success');
        }//end success
      });//end ajax call
  });//end editTask
  });//end getTasks
})};//end doc ready

docReady();

//puts all tasks from db into tasks array
var getTasks = function(){
  console.log('in getTasks');
  return $.ajax({
    url: '/getTasks',
    type: 'GET',
    success: function(data){
      console.log('in getTasks');
      tasks = data;
    }//end success
  });//end ajax call
};//end getTasks

//puts all lists from db into lists array
var getAllLists = function(){
  console.log('in getAllLists');
  return $.ajax({
    url: '/getAllLists',
    type: 'GET',
    success: function(data){
      console.log('in getAllLists');
      lists = data;
    }//end success
  });//end ajax call
};//end getAllLists

var displayLists = function(){
  var htmlString = '';
  console.log(lists);
  for (var i = 0; i < lists.length; i++) {
    htmlString += '<p class="listTitle" data-id="' + lists[i].id + '">' + lists[i].title + ' <button class="delList" >Delete this list</button></p>';
  }
  $('#listDiv').html(htmlString);
};

//called in deleteTaskFromList if same task is not in any other list
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
