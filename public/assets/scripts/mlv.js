$(document).ready(function() {
  var   date = new Date(),
        actualYear = date.getFullYear(),
        limitAge = actualYear - 14,
        maxDate = new Date(date.setFullYear(limitAge)),
        t2 = false,
        t1 = false;

  $('#header-menu').click(function() {
    $('.ui.sidebar').sidebar('toggle');
  });

  $('select.dropdown, .search.dropdown').dropdown();

  $('#addCountry').change(function() {
    let country = $(this).val();
    if(country==="Venezuela") {
      $('#addState').prop('disabled', false);
      $('#addState').parent().removeClass('disabled');
    } else {
      $('#addState').prop('disabled', true);
      $('#addState').parent().addClass('disabled');
    }
  });

  $('#refer').change(function() {
    var refer = $(this).val();
    if(refer==="r") {
      if(t2===false) {
        $('#referrer').prop('disabled', false);
        $('#referrer-field').transition('fly left');
        t1=true;
      } else {
        $('#sm').prop('disabled', true);
        $('#sm-field').transition({
          animation: 'fly right',
          onComplete: function() {
            $('#referrer').prop('disabled', false);
            $('#referrer-field').transition('fly left');
            t1=true;
            t2=false;
          }
        });
      }
    } else if(refer==="tw" || refer==="fb" || refer==="ig") {
      if(t1===false && t2===false) {
        $('#sm').prop('disabled', false);
        $('#sm-field').transition('fly left');
        t2=true;
      } else if(t1===true && t2===false) {
        $('#referrer').prop('disabled', true);
        $('#referrer-field').transition({
          animation: 'fly right',
          onComplete: function() {
            $('#sm').prop('disabled', false);
            $('#sm-field').transition('fly left');
            t1=false;
            t2=true;
          }
        });
      } else if(t1===false && t2===true) {
        $('#sm-field').transition('jiggle');
      }
    } else {
      if(t1===true) {
        $('#referrer').prop('disabled', true);
        $('#referrer-field').transition('fly right');
        t1=false;
      } else if(t2===true) {
        $('#sm').prop('disabled', true);
        $('#sm-field').transition('fly right');
        t2=false;
      }
    }
  });

  $('#idType').change(function() {
    let value = $(this).val();
    if(value!="") {
      $('#idNumber').prop('readonly', false).focus();
      $('#idNumber').parent().removeClass('disabled').transition('jiggle');
    } else {
      $('#idNumber').prop('readonly', true);
      $('#idNumber').parent().addClass('disabled');
    }
  });

  $('#datePicker').calendar({
    type: 'date',
    text: {
        days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today: 'Hoy',
        now: 'Ahora',
        am: 'AM',
        pm: 'PM'
      },
      formatter: {
          date: function (date, settings) {
              if (!date) return '';
              var day = date.getDate() + '';
              if (day.length < 2) {
                  day = '0' + day;
              }
              var month = (date.getMonth() + 1) + '';
              if (month.length < 2) {
                  month = '0' + month;
              }
              var year = date.getFullYear();
              return day + '/' + month + '/' + year;
          }
      },
      maxDate: maxDate
  });

  addLoading('#signupForm>button');
  addLoading('#loginForm button');
  addLoading('#passwordChangeForm button');
  addLoading('#initDataForm>.center-text>button');

  $('#masterUserForm>button').click(function() {
    $('#masterUserForm').parent().addClass("loading");
  });

  $('#aMessage i').click(function() {
    $('#aMessage').fadeOut(300, function() {
      $(this).remove();
    });
  });

  $('.ui.search').search({
    apiSettings: {url: 'users/query?username={query}'},
    minCharacters : 3,
    onResults: function(response) {
      if(response.results[0].status) {
        $('#usernameChangeForm button').removeClass("disabled");
      } else {
        $('#usernameChangeForm button').addClass("disabled");
      }
    },
    onSelect: function() {
      return false
    },
    showNoResults: false,
    searchOnFocus: false,
    transition: 'slide down',
    searchDelay: 500,
    cache: false
  });

  $('#password-container>button').click(function() {
    $('#password-container').transition({
      animation: 'fly left',
      onComplete: function() {
        $('#username-container').transition('fly right');
      }
    });
  });

  function addLoading(el) {
    $(el).click(function() {
      $(this).addClass("loading");
    });
  };

});