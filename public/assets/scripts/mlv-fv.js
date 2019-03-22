/*=======================================================

                MLV form validations

  =======================================================*/
  
$(document).ready(function() {
  $('#signupForm').form({
    on: 'blur',
    fields: {
      firstName: {
        identifier: 'user[firstName]',
        rules: [
          {
            type   : 'empty',
            prompt : '<strong>Nombre</strong> - Aún no nos has dicho cómo te llamas.'
          },
          {
            type   : 'minLength[2]',
            prompt : '<strong>Nombre</strong> - Deberían ser mínimo <strong>{ruleValue}</strong> caracteres.'
          }
        ]
      },
      lastName: {
        identifier: 'user[lastName]',
        optional  : true,
        rules: [
          {
            type   : 'minLength[2]',
            prompt : '<strong>Apellido</strong> - Deberían ser mínimo <strong>{ruleValue}</strong> caracteres.'
          }
        ]
      },
      idType: {
        identifier: 'user[idType]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Cédula</strong> - La cédula es obligatoria.'
          }
        ]
      },
      id: {
        identifier: 'user[id]',
        depends   : 'user[idType]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Cédula</strong> - La cédula es obligatoria.'
           },
           {
            type    : 'integer',
            prompt  : '<strong>Cédula</strong> - ¡Oops! Solo puedes colocar números en ese campo.'
          },
          {
            type    : 'minLength[6]',
            prompt  : '<strong>Cédula</strong> - ¡Vamos! ¿De verdad eres tan viejo? El mínimo son <strong>{ruleValue}</strong> digitos.'
          },
          {
            type    : 'maxLength[8]',
            prompt  : '<strong>Cédula</strong> - Demasiados números. El máximo son <strong>{ruleValue}</strong> digitos.'
          }
        ]
      },
      email: {
        identifier: 'user[email]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Email</strong> - El correo es obligatorio.'
          },
          {
            type    : 'regExp',
            value   : /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            prompt  : '<strong>Email</strong> - Por favor coloca un email válido.'
          }
        ]
      },
      birthday: {
        identifier: 'user[birthday]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Fecha de nacimiento</strong> - ¿Cuándo es tu cumpleaños?'
          }
        ]
      },
      phone: {
        identifier: 'user[phone]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Teléfono</strong> - El teléfono es obligatorio.'
          },
          {
            type    : 'integer',
            prompt  : '<strong>Teléfono</strong> - Debes ingresar solo números (+ se sustituye por 00).'
          }
        ]
      },
      country: {
        identifier: 'user[country]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>País</strong> - Selecciona el país donde vives.'
          }
        ]
      },
      state: {
        identifier: 'user[state]',
        depends: 'user[country]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Estado</strong> - Selecciona el estado donde vives.'
          }
        ]
      }
    },
    onFailure: function(e, fields) {
      $('#signupForm>button').removeClass("loading");
      return false;
    }
  });

  $('#masterUserForm').form({
    on: 'blur',
    fields: {
      username: {
        identifier: 'master[username]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Nombre de usuario</strong> - Debes colocar un username.'
          }
        ]
      },
      email: {
        identifier: 'master[email]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Email</strong> - El correo principal es obligatorio.'
          },
          {
            type    : 'regExp',
            value   : /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            prompt  : '<strong>Email</strong> - Por favor coloca un email válido.'
          }
        ]
      },
      email2: {
        identifier: 'master[email2]',
        optional: true,
        rules: [
          {
            type    : 'regExp',
            value   : /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            prompt  : '<strong>Email secundario</strong> - Por favor coloca un email válido.'
          },
          {
            type    : 'different[email]',
            prompt  : '<strong>Email secundario</strong> - No puede ser el mismo que el email principal.'
          }
        ]
      },
      password: {
        identifier: 'master[password]',
        rules: [
          {
            type    : 'empty',
            prompt  : '<strong>Contraseña</strong> - Olvidas lo más importante.'
          },
          {
            type    : 'minLength[12]',
            prompt  : '<strong>Contraseña</strong> - Debe ser de mínimo 12 caracteres.'
          }
        ]
      },
      vPassword: {
        identifier: 'vPassword',
        rules: [
          {
            type    : 'match[password]',
            prompt  : '<strong>Contraseña</strong> - La contraseña no coincide con la confirmación.'
          }
        ]
      }
    },
    onFailure: function(e, fields) {
      $('#masterUserForm').parent().removeClass("loading");
      return false;
    }
  });

  $('#usernameChangeForm').form({
    on: 'blur',
    fields: {
      username: {
        identifier: 'username',
        rules: [
          {
            type    : 'empty',
            prompt  : 'Debes colocar un nuevo username.'
          },
          {
            type    : 'minLength[3]',
            prompt  : 'Debe ser de mínimo de 3 caracteres.'
          }
        ]
      }
    },
    onSuccess: function(e, f) {
      e.preventDefault();
      goNext(e);
      $('#defUn').val(f.username);
      return false;
    },
    onFailure: function(e) {
      $('#usernameChangeForm button').addClass("disabled");
      return false;
    }
  });

  $('#passwordChangeForm').form({
    on: 'blur',
    fields: {
      password: {
        identifier: 'password',
        rules: [
          {
            type    : 'empty',
            prompt  : 'La contraseña no puede estar vacía.'
          },
          {
            type    : 'minLength[8]',
            prompt  : 'La contraseña debe ser de mínimo 8 caracteres.'
          }
        ]
      },
      confirm: {
        identifier: 'confirm',
        depends: 'password',
        rules: [
          {
            type    : 'match[password]',
            prompt  : 'Las contraseñas no coinciden.'
          }
        ]
      }
    },
    onFailure: function(e, fields) {
      $('#passwordChangeForm button').removeClass("loading");
      return false;
    }
  });

  let counter=0;
  function goNext(event) {
    if(counter++>=1) {
      counter=0;
      return false;
    }
    $('#username-container').transition({
      animation: 'fly right',
      onComplete: function() {
        $('#password-container').transition('fly left');
      }
    });
  };
});