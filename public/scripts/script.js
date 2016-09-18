console.log('script sourced');

$(document).ready(function(){
  console.log('jq');
  $('#addTask').on('click', function(){
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
    $.ajax({
      url: '/getTasks',
      type: 'GET',
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });// end getTasks onclick

  $('#getAllLists').on('click', function(){
    $.ajax({
      url: '/getAllLists',
      type: 'GET',
      success: function(data){
        console.log(data);
      }//end success
    });//end ajax call
  });// end getAllLists onclick
});//end doc ready





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
