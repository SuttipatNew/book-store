$(document).ready(function() {
  var menu = ['home', 'book'];
  $('a.mdl-navigation__link').click(function() {
    var classes = $(this).attr('class');
    var selected_menu = -1;
    for(var i = 0; i < menu.length; i++) {
      if(classes.indexOf(menu[i]) != -1) {
        selected_menu = i;
        break;
      }
    }
    if(selected_menu != -1) {
      $('div.page').removeClass('show');
      $('div.page.'+menu[selected_menu]).addClass("show");
      $('.mdl-layout__drawer').attr('aria-hidden', 'true');
      load_data(menu[selected_menu]);
    }
  });
});
