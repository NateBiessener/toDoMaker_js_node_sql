console.log('script sourced');

$(document).ready(function(){
  console.log('jq');
})

var objectToSend = {};

$.ajax({
  url: '/addLine',
  type: 'POST',
  data: objectToSend,
  success: function(data){
    console.log('in addLine ajax success');
  }
});

$.ajax({
  url: '/editLine',
  type: 'POST',
  data: objectToSend,
  success: function(data){
    console.log('in editLine ajax success');
  }
});

$.ajax({
  url: '/deleteLine',
  type: 'POST',
  data: objectToSend,
  success: function(data){
    console.log('in deleteLine ajax success');
  }
});
