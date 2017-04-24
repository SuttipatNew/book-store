$(document).ready(function() {
  console.log('start');
  var menu = ['home', 'book'];
  var req_page = ['book'];
  var present_page = "";
  var present_page_str = "";
  var old_page_html = "";
  var present_table_col_count = -1;
  $(document).on("click", 'a.mdl-navigation__link', function() {
    var classes = $(this).attr('class');
    var selected_menu = -1;
    for(var i = 0; i < menu.length; i++) {
      if(classes.indexOf(menu[i]) != -1) {
        selected_menu = i;
        break;
      }
    }
    if(selected_menu != -1) {
      present_page_str = menu[selected_menu];
      $('div.page').removeClass('show');
      if(present_page !== "") {
        present_page.html(old_page_html);
      }
      present_page = $('div.page.' + present_page_str);
      old_page_html = $(present_page.html());
      $('div.page.' + present_page_str).addClass("show");
      if(req_page.indexOf(present_page_str) != -1) {
        $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
          // console.log(JSON.parse(data));
          var table_json = JSON.parse(data);
          var head = table_json.head;
          present_table_col_count = table_json.column;
          for(var i = 0; i < present_table_col_count; i++) {
            var col = '<th>' + head[i] + '</th>';
            // console.log(col);
            $('div.' + present_page_str + ' thead > tr').append(col);
          }
          var body = table_json.body;
          for(var i = 0; i < body.length; i++) {
            var row = "<tr>\n";
            for(var j = 0; j < present_table_col_count; j++) {
              row += "<td>" + body[i][j] + "</td>\n";
            }
            row += "</tr>\n"
            $('div.' + present_page_str + ' tbody').append(row);
          }
        });
      } else {
        present_table_col_count = -1;
      }
    }
  });

  $(document).on("click", '.add-button', function() {
    var row = "<tr>\n";
    for(var i = 0; i < present_table_col_count; i++) {
      row += "<td><input type=\"text\"></td>\n";
    }
    row += "</tr>\n";
    present_page.find('tbody').append(row);
    present_page.find('div.form-edit-button').addClass('show');
  });

  $(document).on("click", '.cancel-button', function() {
    present_page.find('tbody > tr').last().remove();
    present_page.find('div.form-edit-button').removeClass('show');
  });

  $(document).on("click", '.refresh-button', function() {
    present_page.html(old_page_html);
    old_page_html = present_page.html();
    present_page.addClass("show");
    if(req_page.indexOf(present_page_str) != -1) {
      $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
        // console.log(JSON.parse(data));
        var table_json = JSON.parse(data);
        var head = table_json.head;
        present_table_col_count = table_json.column;
        for(var i = 0; i < present_table_col_count; i++) {
          var col = '<th>' + head[i] + '</th>';
          // console.log(col);
          present_page.find('thead > tr').append(col);
        }
        var body = table_json.body;
        for(var i = 0; i < body.length; i++) {
          var row = "<tr>\n";
          for(var j = 0; j < present_table_col_count; j++) {
            row += "<td>" + body[i][j] + "</td>\n";
          }
          row += "</tr>\n"
          present_page.find('tbody').append(row);
        }
      });
    } else {
      present_table_col_count = -1;
    }
  });

  $(document).on("click", '.save-button', function() {
    console.log('click');
    var send_data = [];
    var input_box = present_page.find('input');
    input_box.each(function(index) {
      send_data.push($(this).val());
    });
    var data_str = JSON.stringify(send_data);
    data_str = '(' + data_str.substring(1, data_str.length - 1) + ')';
    var link = "connect-data.php?command=2&table=" + present_page_str + "&data=" + data_str
    console.log(link);
    // $.get(link, function(data) {
    //   console.log(data);
    //   if(data == "true") {
    //     console.log('Success');
    //   } else {
    //     console.log('Failed');
    //   }
    // });
  });
});
