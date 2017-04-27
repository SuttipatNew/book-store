function bind_all() {
    $('a.mdl-navigation__link').unbind().bind('click.change_page', change_page);

    $('button.add-button').unbind().bind('click.add_mode', add_mode);

    $('button.delete-button-select').unbind().bind("click.delete_mode", delete_mode);

    // console.log("bind");
}

function refresh_page(progress_bar, _callback) {
    if (typeof progress_bar !== 'undefined' && progress_bar) {
        $("main .progress-bar").addClass("show");
    }
    present_page.selector.html(old_page_html);
    old_page_html = present_page.selector.html();
    bind_all();
    present_page.selector.addClass("show");
    if (req_page.indexOf(present_page_str) != -1) {
        $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
            // console.log(JSON.parse(data));
            var table_json = JSON.parse(data);
            var head = table_json.head;
            present_table_col_count = table_json.column;
            for (var i = 0; i < present_table_col_count; i++) {
                var col = '<th>' + head[i].Field + '</th>';
                // console.log(col);
                present_page.selector.find('thead > tr').append(col);
            }
            var body = table_json.body;
            for (var i = 0; i < body.length; i++) {
                var row = "<tr>\n";
                for (var j = 0; j < present_table_col_count; j++) {
                    row += "<td>" + body[i][j] + "</td>\n";
                }
                row += "</tr>\n"
                present_page.selector.find('tbody').append(row);
            }
            if (typeof _callback !== 'undefined') {
                _callback();
            }
            remove_progress_bar()
        });
    } else {
        present_table_col_count = -1;
        if (typeof do_after_done !== 'undefined') {
            _callback();
        }
    }
}

function remove_progress_bar() {
    setTimeout(function() {
        $("main .progress-bar").removeClass("show");
    }, 800);
}

function change_page() {
    bind_all();
    $("main .progress-bar").addClass("show");
    var title = $(this).html().substring($(this).html().indexOf("</i>") + "</i>".length, $(this).html().length);
    $('span.mdl-layout-title').text(title);
    var classes = $(this).attr('class');
    var selected_menu = -1;
    for (var i = 0; i < menu.length; i++) {
        if (classes.indexOf(menu[i]) != -1) {
            selected_menu = i;
            break;
        }
    }
    if (selected_menu != -1) {
        present_page_str = menu[selected_menu];
        $('div.page').removeClass('show');
        if (present_page.selector !== "") {
            present_page.selector.html(old_page_html);
        }
        present_page.selector = $('div.page.' + present_page_str);
        old_page_html = $(present_page.selector.html());
        $('div.page.' + present_page_str).addClass("show");
        if (req_page.indexOf(present_page_str) != -1) {
            $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
                // console.log(data);
                var table_json = JSON.parse(data);
                var head = table_json.head;
                present_table_col_count = table_json.column;
                for (var i = 0; i < present_table_col_count; i++) {
                    var col = '<th>' + head[i].Field + '</th>';
                    // console.log(col);
                    var dropdown = "<option value=\"option " + i + "\">" + head[i].Field + "</option>";

                    $('div.' + present_page_str + ' thead > tr').append(col);
                    $("#professsion").append(dropdown);

                }
                var body = table_json.body;
                if (body !== "") {
                    for (var i = 0; i < body.length; i++) {
                        var row = "<tr>\n";
                        for (var j = 0; j < present_table_col_count; j++) {
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
}

function add_mode() {
    console.log('add haha');
    refresh_page(false, function() {
        $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
            action = "add";
            var table_json = JSON.parse(data);
            var head = table_json.head;
            var row = "<tr>\n";
            for (var i = 0; i < present_table_col_count; i++) {
                var type = "text";
                var disabled = "";
                if (head[i].Type === "date" && head[i].Field !== "LastUpdate") {
                    type = "date";
                }
                if (head[i].Field === "LastUpdate") {
                    disabled = " disabled value=\"timestamp\"";
                }
                row += "<td><input type=\"" + type + "\"" + disabled + "></td>\n";
            }
            row += "</tr>\n";
            present_page.selector.find('tbody').append(row);
            present_page.selector.find('div.form.add-button').addClass('show');
        });
        $("button.add-button").unbind();
    });
}

function delete_mode() {
    console.log('delete');
    if (present_page.selector.find('tbody > tr').length > 0) {
        console.log('adding checkbox');
        refresh_page(false, function() {
            present_page.selector.find('thead > tr').prepend("<th><input type=\"checkbox\"></th>")
            present_page.selector.find('tbody > tr').each(function(index) {
                $(this).prepend("<td><input type=\"checkbox\"></td>")
            });
            present_page.selector.find('div.form.delete-button').addClass('show');
            $('button.delete-button-select').unbind();
        });
    }
}
