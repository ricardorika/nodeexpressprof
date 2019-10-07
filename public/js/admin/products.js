function listProducts () {
  $.get('/admin/list-products', function (r) {
    $('#list-products').html(r).find('.btn-remove').click(function () {
      $.ajax({
        url: '/admin/product/' + $(this).attr('id'),
        type: 'delete',
        success: function (r) {
          if (r == 'ok') {
            toastr["success"]("Produto excluido!");
            listProducts();
          } else {
            toastr["error"]("Produtos ", "Erro na exclusao");
          }
        }
      });
    });
  });
}
$(document).ready(function () {

  listProducts();

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
        toastr["error"]("Produtos ", item.toUpperCase() + " nao pode estar vazio");
        isValid = false;
        break;
      }
    }

    if (isValid) {
      $.post('/admin/products', data, function (res) {
        if(res === 'ok') {
          toastr["success"]("Cadastro realizado com sucesso!");
          $('form').trigger('reset');
          listProducts();
        } else {
          toastr["error"]("Erro: " + res);
        }
     })
    }
  });
})
