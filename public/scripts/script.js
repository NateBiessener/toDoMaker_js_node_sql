//on load, will display all lists and a create list interface
//clicking on a list will display all tasks on that list, ordered by priority with an add task interface and an option to return to the all-lists display

console.log('script sourced');

//filled on doc load
var tasks = [];

//filled on doc load
var lists = [];

var prioritySelector = '<select class="priorityIn"><option value="">Select Priority</option><option value=1>NOW!</option><option value=2>Urgent!</option><option value=3>Soon</option><option value=4>Eventually</option><option value=5>Someday</option></select>';

var descripIn = '<input class="descripIn" placeholder="Enter new task">';

$(document).ready(function(){
  console.log('jq');
  getTasks().done(function(){
    getAllLists().done(displayLists);
  });//end getTasks.done
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
    showList(objectToSend);
  });//end listTitle onclick

  $('body').on('click', '.taskPriority', function(){
    var priorityChange = $(prioritySelector).addClass('priorityChange');
    $(this).replaceWith(priorityChange);
  });

  $('body').on('change', '.priorityChange', function(){
    var objectToSend = {
      id: $(this).parent().data('task_id'),
      priority: $(this).val()
    };
    var list = $(this).parent().data('list_id');
    editTask(objectToSend).done(function(){ return showList( {id: list} ) });
  });

  $('body').on('click', '.taskDescription', function(){
    var descripChange = $(descripIn);
    $(this).replaceWith(descripIn + '<ins class="descripChange">Submit</ins>');
  });//end taskDescription onclick

  $('body').on('click', '.descripChange', function(){
    var objectToSend = {
      id: $(this).parent().data('task_id'),
      description: $(this).parent().children('.descripIn').val() || "No Description"
    };
    var list = $(this).parent().data('list_id');
    editTask(objectToSend).done(function(){ return showList( {id: list} ) });
  });

  $('body').on('click', '#addTaskToList', function(){
    console.log('in addTaskToList');
    //check for task, if not in db, add to db, store id
    var listID = $(this).parent().parent().children('#topDiv').data('id');
    var taskID = -1;
    var taskExists = false;
    for (var i = 0; i < tasks.length; i++) {
      if(tasks[i].description === $(this).parent().children('.descripIn').val()){
        taskExists = true;
        taskID = tasks[i].id;
        break;
      }
    }
    if (!taskExists){
      var taskToCreate = {
        description: $(this).parent().children('.descripIn').val(),
        priority: $(this).parent().children('.priorityIn').val()||3
      };
      var newTask = addTask(taskToCreate).done(function(){
        var responseRow = JSON.parse(newTask.responseText);
        addTaskToList({
          task_id: responseRow.id,
          list_id: listID
        }).done(function(){return showList( {id: listID} ) });
      });
    }
    else {
      addTaskToList({
        task_id: taskID,
        list_id: listID
      }).done(function(){ return showList( {id: listID} ) });
    }
  });//end addTaskToList onclick

  $('body').on('click', '#backHome', function(){
    getAllLists().done(displayLists);
  })

  $('body').on('change', '.completeTask', function(){
    console.log('in completeTask');
    $(this).parent().toggleClass('complete');
    var listID = $(this).parent().data('list_id');
    var objectToSend = {
      task_id: $(this).parent().data('task_id'),
      list_id: listID
    };
    console.log('objectToSend');
    completeTask(objectToSend).done(function(){ return showList( {id: listID} ) });
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
    delTask(objectToSend);
  });//end deleteTaskFromList

  $('body').on('click', '.delList', function(){
    $(this).html('Are you sure?');
    $(this).removeClass('delList');
    $(this).addClass('confirmDeleteList');
  });//end deleteList

  $('body').on('click', '.confirmDeleteList', function(){
    objectToSend = {
      list_id: $(this).data('id')
    };
    console.log(objectToSend);
    //!!!------------SOMEHOW CALL delTasks on all tasks in list first
    $.ajax({
      url: '/getList',
      type: 'POST',
      data: {id: objectToSend.list_id},
      success: function(data){
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          var taskToDelete = {
            task_id: data[i].task_id,
            list_id: data[i].list_id
          };
          console.log(taskToDelete);
          delTask(taskToDelete);
        }//end for
      }//end success
    }).done(function(){
      return $.ajax({
        url: 'deleteList',
        type: 'DELETE',
        data: objectToSend,
        success: function(data){
          console.log('deleteList success');
          getAllLists().done(displayLists);
        }//end success
      });//end ajax call
    });//end done
  });//end confirmDeleteList
});//end doc ready

var delTask = function(objectToSend){
  return $.ajax({
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
};

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
  $('#topDiv').html('<h2 class="title">To-Do List Maker 9000</h2><p class="title">Select a list</p>');
  $('#createDiv').html(
    '<input type="text" placeholder="List Name" id="listIn"> <p class="button" id="createList">Create New List</p>'
  );
  var htmlString = '';
  console.log(lists);
  for (var i = 0; i < lists.length; i++) {
    htmlString += '<p class="listTitle" data-id="' + lists[i].id + '">' + lists[i].title + ' </p><p class="button delList" data-id="' + lists[i].id + '">Delete this list</p><br>';
  }
  $('#listDiv').html(htmlString);
};

var showList = function(objectToSend){
  var title = '';
  var id = objectToSend.id;
  for (var i = 0; i < lists.length; i++) {
    if(objectToSend.id == lists[i].id){
      title = lists[i].title;
    }
  }
  return $.ajax({
    url: '/getList',
    type: 'POST',
    data: objectToSend,
    success: function(data){
      console.log(data);
      if (data[0]){
        $('#topDiv').data('id', id).html('<h2 class="title">' + title + '</h2> <button id="backHome">Home</button>');
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
          itemHTML += '<ins class="taskDescription">' + data[i].description + '</ins> ';
          switch (data[i].priority) {
            case 1:
              itemHTML += '<ins class="taskPriority">-- NOW!</ins>'
              break;
            case 2:
              itemHTML += '<ins class="taskPriority">-- Urgent!</ins>'
              break;
            case 3:
              itemHTML += '<ins class="taskPriority">-- Soon</ins>'
              break;
            case 4:
              itemHTML += '<ins class="taskPriority">-- Eventually</ins>'
              break;
            case 5:
              itemHTML += '<ins class="taskPriority">-- Someday</ins>'
              break;
            default:
              console.log('in switch default, debug');
          }//end switch
          itemHTML += ' <ins class="button deleteTask">Erase</ins></p>';
          listHTML += itemHTML;
        }//end for
        $('#listDiv').html(listHTML);
      }//end if data[0]
      else {
        $('#topDiv').data('id', id).html('<h2 id="listScreenTitle">' + title + '</h2> <button id="backHome">Home</button>');
        $('#listDiv').empty();
      }
      $('#createDiv').html(descripIn + prioritySelector + '<p class="button" id="addTaskToList">Add To List</p>');
    }//end success
  });//end ajax call
};

var addTask = function(objectToSend){
  return $.ajax({
    url: '/addTask',
    type: 'POST',
    data: objectToSend,
    success: function(data){
      console.log(data);
      return data;
    }//end success
  });//end ajax call
};

var editTask = function(objectToSend){
  return $.ajax({
    url: '/editTask',
    type: 'PUT',
    data: objectToSend,
    success: function(data){
      console.log('editTask success', data);
    }//end success
  });//end ajax call
};

var addTaskToList = function(objectToSend){
  console.log(objectToSend);
  return $.ajax({
    url: '/addTaskToList',
    type: 'POST',
    data: objectToSend,
    success: function(data){
      console.log('relationship added:',data);
    }//end success
  });//end ajax call
};

var completeTask = function(objectToSend){
  return $.ajax({
    url: '/completeTask',
    type: 'PUT',
    data: objectToSend,
    success: function(data){
      console.log('completeTask success:', data);
    }//end success
  });//end ajax call
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
