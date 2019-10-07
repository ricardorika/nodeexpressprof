$(document).ready(function () {
  $('form').submit(function (event) {
    event.preventDefault();
    var name = $('#name').val();
    var message = $('#message').val();
    $.post('/send', {name: name, message: message}, function (res) {
      console.info(res);
    })
  })
})
