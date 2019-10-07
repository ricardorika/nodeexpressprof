$(document).ready(function () {
  $('form').submit(function (event) {
    event.preventDefault();

    var form = $('form').serializeArray();
    var data = {};

    form.forEach(function (item) {
      data[item.name] = item.value;
    });


    delete data.cpassword;
    var isValid = true;
    for(var item in data) {
      if (data[item].length <= 0) {
        toastr["error"]("Cadastre-se", item.toUpperCase() + " nao pode estar vazio");
        isValid = false;
        break;
      }
    }

    if ($('#cpassword').val() !== $('#password').val()) {
      toastr["error"]("Cadastre-se", "A confirmacao de senha esta invalida");
      isValid = false;
    }

    if (isValid) {
      $.post('/client', data, function (res) {
        if(res === 'ok') {
          toastr["success"]("Cadastro realizado com sucesso!");
          $('form').trigger('reset');
        } else {
          toastr["error"]("Erro: " + res);
        }
     })
    }
  });

  $('#zipcode').keypress(function (evt) {
     evt = (evt) ? evt : window.event;
     var charCode = (evt.which) ? evt.which : evt.keyCode;
     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
         return false;
     }
     return true;
  });

  $('#zipcode').keyup(function () {
    var value = $(this).val();
    if (value.length === 8) {
      $.get('//viacep.com.br/ws/' + value + '/json/', function (data) {
        $('#city').val(data.localidade);
        $('#state').val(data.uf);
        $('#address').val(data.logradouro + " " + data.complemento);
        $('#neighborhood').val(data.bairro);
      })
    }
  })
})
