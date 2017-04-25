var menu = ['home', 'book', 'sub_agent'];
var req_page = ['book', 'sub_agent']; //name of page that have to get data from db
var present_page = "";
var present_page_str = "";
var old_page_html = "";
var present_table_col_count = -1;
var status = "";
var old_id = "";
$(document).ready(function() {
  // console.log('start');
  $(document).on("click", 'a.mdl-navigation__link', function() {
    $("main .progress-bar").addClass("show");
    var title = $(this).html().substring($(this).html().indexOf("</i>") + "</i>".length, $(this).html().length);
    $('span.mdl-layout-title').text(title);
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
          // console.log(data);
          var table_json = JSON.parse(data);
          var head = table_json.head;
          present_table_col_count = table_json.column;
          for(var i = 0; i < present_table_col_count; i++) {
            var col = '<th>' + head[i].Field + '</th>';
            // console.log(col);
            $('div.' + present_page_str + ' thead > tr').append(col);
          }
          var body = table_json.body;
          if(body !== "") {
            for(var i = 0; i < body.length; i++) {
              var row = "<tr>\n";
              for(var j = 0; j < present_table_col_count; j++) {
                row += "<td>" + body[i][j] + "</td>\n";
              }
              row += "</tr>\n"
              $('div.' + present_page_str + ' tbody').append(row);
            }
          }
          remove_progress_bar()
        });
      } else {
        present_table_col_count = -1;
        remove_progress_bar()
      }
    } else {
      remove_progress_bar()
    }
  });

  $(document).on("click", 'button.add-button', function() {
    if(status !== "add") {
      refresh_page(function() {
        $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
          status = "add";
          var table_json = JSON.parse(data);
          var head = table_json.head;
          var row = "<tr>\n";
          for(var i = 0; i < present_table_col_count; i++) {
            var type = "text";
            if(head[i].Type === "date") {
              type = "date"
            }
            row += "<td><input type=\"" + type + "\"></td>\n";
          }
          row += "</tr>\n";
          present_page.find('tbody').append(row);
          present_page.find('div.form.add-button').addClass('show');
        });
      });

    }
  });

  $(document).on("click", 'button.delete-button-select', function() {
    if(status !== "delete") {
      refresh_page(function() {
        status = "delete";
        present_page.find('thead > tr').prepend("<th>Select</th>")
        present_page.find('tbody > tr').each(function(index) {
          $(this).prepend("<td><input type=\"checkbox\"></td>")
        });
        present_page.find('div.form.delete-button').addClass('show');
      });
    }
  });

  $(document).on("click", 'button.cancel-button', function() {
    refresh_page(function() {
      status = "";
    });
  });

  $(document).on("click", 'button.refresh-button', function() {
    console.log('refresh');
    refresh_page(function() {
      status = "";
    }, true);
  });

  $(document).on("click", 'button.save-button', function() {
    // console.log('click');
    var send_data = [];
    var input_box = present_page.find('input');
    input_box.each(function(index) {
      if($(this).val() === "") {
        return false;
      }
      send_data.push($(this).val());
    });
    if(send_data.length !== input_box.length) {
      alert("Please input every field.");
      return;
    }
    var data_str = JSON.stringify(send_data);
    data_str = data_str.substring(1, data_str.length - 1);
    var link = "";
    if(status === "add") {
      link = "connect-data.php?command=2&table=" + present_page_str + "&data=" + data_str;
    } else if(status === "edit") {
      link = "connect-data.php?command=4&table=" + present_page_str + "&data=" + data_str + "&old_id=" + old_id;
    }
    // console.log(link);
    $.get(link, function(data) {
      // console.log(data);
      if(data == "true") {
        console.log('Success');
        refresh_page(function() {
          status = "";
        }, true);
      } else {
        alert("Insert failed.")
        console.log('Failed');
      }
    });
  });

  $(document).on("click", 'button.delete-button', function() {
    var checked = present_page.find("input:checked");
    checked.each(function(index) {
      var col = $(this).closest("tr").find('td');
      // console.log(col);
      $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
        var table_json = JSON.parse(data);
        var head = table_json.head;
        var id = "";
        col.each(function(index) {
          if(index > 0 && head[index - 1].Key === "PRI") {
            id = $(this).text();
            return false;
          }
        });
        // console.log("id: " + id);
        $.get("connect-data.php?command=3&table=" + present_page_str + "&id=" + id, function(data) {
          // console.log(data);
          if(data == "true") {
            console.log('Success');
            refresh_page();
            status = "";
          } else {
            alert("Insert failed.")
            console.log('Failed');
          }
        });
      });
    });
  });

  // edit record
  $(document).on("click", 'tr', function() {
    // console.log('edit');
    if(status === "") {
      status = "edit";
      var row = $(this);
      $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
        var table_json = JSON.parse(data);
        var head = table_json.head;
        var col = row.find("td");
        col.each(function(index) {
          var input_box_html = "<input type=\""
          var type = "text";
          if(head[index].Type === "date") {
            type = "date"
          }
          if(head[index].Key === "PRI") {
            old_id = $(this).text();
          }
          input_box_html += type + "\" value=\"" + $(this).text() + "\">";
          $(this).html(input_box_html);
        });
        present_page.find('div.form.add-button').addClass('show');
      });
    }
  });
});

function refresh_page(do_after_done, progress_bar) {
  if (typeof progress_bar === 'undefined') {
    progress_bar = false;
  }
  if(progress_bar) {
    $("main .progress-bar").addClass("show");
  }
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
        var col = '<th>' + head[i].Field + '</th>';
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
      if (typeof do_after_done !== 'undefined') {
        do_after_done();
      }
      remove_progress_bar()
    });
  } else {
    present_table_col_count = -1;
  }
  status = "";
}

function remove_progress_bar() {
  setTimeout(function() {
    $("main .progress-bar").removeClass("show");
  }, 800);
}
