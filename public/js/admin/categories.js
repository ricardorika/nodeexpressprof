function listCategories () {
  $.get('/admin/list-categories', function (r) {
    $('#list-categories').html(r).find('.btn-remove').click(function () {
      $.ajax({
        url: '/admin/category/' + $(this).attr('id'),
        type: 'delete',
        success: function (r) {
          if (r == 'ok') {
            toastr["success"]("Produto excluido!");
            listCategories();
          } else {
            toastr["error"]("Produtos ", "Erro na exclusao");
          }
        }
      });
    });
  });
}
$(document).ready(function () {

  listCategories();

  $('form').submit(function (event) {
    event.preventDefault();

    var form = $('form').serializeArray();
    var data = {};

    form.forEach(function (item) {
      data[item.name] = item.value;
    });

    var isValid = true;
    for(var item in data) {
      if (data[item].length <= 0) {
        toastr["error"]("Categorias ", item.toUpperCase() + " nao pode estar vazio");
        isValid = false;
        break;
      }
    }

    if (isValid) {
      $.post('/admin/categories', data, function (res) {
        if(res === 'ok') {
          toastr["success"]("Cadastro realizado com sucesso!");
          $('form').trigger('reset');
          listCategories();
        } else {
          toastr["error"]("Erro: " + res);
        }
     })
    }
  });
});

var slug = function(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};

$('#name').keyup(function () {  
  $('#slug').val(slug($(this).val()));
});