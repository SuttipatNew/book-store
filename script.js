$(document).ready(function() {
  console.log('start');
  var menu = ['home', 'book'];
  var req_page = ['book'];
  var present_page = "";
  var old_page_html = "";
  var present_table_col_count = -1;
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
      if(present_page !== "") {
        present_page.html(old_page_html);
      }
      present_page = $('div.page.' + menu[selected_menu]);
      old_page_html = $(present_page.html());
      $('div.page.' + menu[selected_menu]).addClass("show");
      if(req_page.indexOf(menu[selected_menu]) != -1) {
        $.get("connect-data.php?command=1&table=" + menu[selected_menu], function(data) {
          // console.log(JSON.parse(data));
          var table_json = JSON.parse(data);
          var head = table_json.head;
          present_table_col_count = table_json.column;
          for(var i = 0; i < present_table_col_count; i++) {
            var col = '<th>' + head[i] + '</th>';
            // console.log(col);
            $('div.' + menu[selected_menu] + ' thead > tr').append(col);
          }
          var body = table_json.body;
          for(var i = 0; i < body.length; i++) {
            var row = "<tr>\n";
            for(var j = 0; j < present_table_col_count; j++) {
              row += "<td>" + body[i][j] + "</td>\n";
            }
            row += "</tr>\n"
            $('div.' + menu[selected_menu] + ' tbody').append(row);
          }
        });
      } else {
        present_table_col_count = -1;
      }
    }
  });

  $('.add-button').click(function() {
    var row = "<tr>\n";
    for(var i = 0; i < present_table_col_count; i++) {
      row += "<td><input type=\"text\"></td>\n";
    }
    row += "</tr>\n";
    present_page.find('tbody').append(row);
    present_page.find('div.form-edit-button').addClass('show');
  });

  $('.cancel-button').click(function() {
    present_page.find('tbody > tr').last().remove();
    present_page.find('div.form-edit-button').removeClass('show');
  });
});
