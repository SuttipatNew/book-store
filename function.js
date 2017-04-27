var action = "";
var dialog;
$(document).ready(function() {
    dialog = document.querySelector('dialog');
    // dialog.showModal();
});

function unbind_dialog() {
    $('dialog .confirm-button').unbind();
    $('dialog .close-button').unbind();
}

function bind_all() {
    $('a.mdl-navigation__link').unbind().bind('click.change_page', change_page);

    $('button.add-button').unbind().bind('click.add_mode', add_mode);

    $('button.delete-button-select').unbind().bind("click.delete_mode", delete_mode);

    $('button.cancel-button').unbind().bind("click", function() {
        refresh_page(false);
        action = "";
    });

    $('button.refresh-button').unbind().bind("click", function() {
        refresh_page(true);
        action = "";
    });

    $('button.save-button').unbind().bind('click', save_data);

    $('button.delete-button').unbind().bind("click", delete_data);

    dialog = document.querySelector('dialog');
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

        // print sql command
        $.get("connect-data.php?command=1&table=" + present_page_str + '&sql=true', function(data) {
            console.log(data);
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
    action = "add";
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
                if (head[i].Key === "PRI") {
                    disabled = " disabled value=\"id\"";
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
        $("tr").unbind();
        action = "";
    });
}

function delete_mode() {
    console.log('delete');
    action = "delete"
    if (present_page.selector.find('tbody > tr').length > 0) {
        console.log('adding checkbox');
        refresh_page(false, function() {
            present_page.selector.find('thead > tr').prepend("<th><input type=\"checkbox\"></th>")
            present_page.selector.find('tbody > tr').each(function(index) {
                $(this).prepend("<td><input type=\"checkbox\"></td>")
            });
            present_page.selector.find('div.form.delete-button').addClass('show');
            $('button.delete-button-select').unbind();
            $('tr').unbind();
        });
    }
}

function save_data() {
    var send_data = [];
    input_box = present_page.selector.find('input');
    input_box.each(function(index) {
        if ($(this).val() === "") {
            return false;
        }
        send_data.push($(this).val());
    });
    if (send_data.length !== input_box.length) {
        alert("Please input every field.");
        return;
    }
    data_str = JSON.stringify(send_data);
    link = "";
    if (action === "add") {
        link = "connect-data.php?command=2&table=" + present_page_str + "&data=" + data_str;
    } else if (action === "edit") {
        link = "connect-data.php?command=4&table=" + present_page_str + "&data=" + data_str + "&old_id=" + old_id;
    }
    console.log(link);
    if (action === 'add') {
        $.get(link, function(data) {
            // console.log(data);
            if (data == "true") {
                console.log('Success');
                refresh_page(true, function() {
                    action = "";
                });
            } else {
                alert("Insert failed.")
                console.log('Failed');
            }
        });

        // print sql command
        $.get(link + '&sql=true', function(data) {
            console.log(data);
        });
    } else if (action === 'edit') {
        dialog.showModal();
        $('dialog .confirm-button').bind('click', function() {
            if (dialog.open) {
                dialog.close();
            }
            unbind_dialog();
            $.get(link, function(data) {
                // console.log(data);
                if (data == "true") {
                    console.log('Success');
                    refresh_page(true, function() {
                        action = "";
                    });
                } else {
                    alert("Insert failed.")
                    console.log('Failed');
                }
            });
            $.get(link + '&sql=true', function(data) {
                console.log(data);
            });
        });
        $('dialog .close-button').bind('click', function() {
            if (dialog.open) {
                dialog.close()
            }
            unbind_dialog();
        });
    }
}

function delete_data() {
    console.log('delete_data');
    action = "";
    checked = present_page.selector.find("tbody input:checked");
    check_length = checked.length;
    // console.log(checked.length);
    if (checked.length > 0) {
        dialog.showModal();
        // console.log(checked.length);

        $('dialog .confirm-button').bind('click', function() {
            if (dialog.open) {
                dialog.close();
            }
            unbind_dialog();
            checked.each(function(index) {
                var col = $(this).closest("tr").find('td');
                // console.log(col);
                console.log("connect-data.php?command=1&table=" + present_page_str);
                $.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
                    var table_json = JSON.parse(data);
                    var head = table_json.head;
                    var id = "";
                    col.each(function(index) {
                        if (index > 0 && head[index - 1].Key === "PRI") {
                            id = $(this).text();
                            return false;
                        }
                    });
                    console.log("connect-data.php?command=3&table=" + present_page_str + "&id=" + id);
                    $.get("connect-data.php?command=3&table=" + present_page_str + "&id=" + id, function(data) {
                        if (data == "true") {
                            console.log('Success');
                            if (index === check_length - 1) {
                                refresh_page(function() {
                                    action = "";
                                });
                            }
                        } else {
                            alert("Delete failed.")
                            console.log('Failed');
                            action = "delete";
                        }
                    });
                    $.get("connect-data.php?command=3&table=" + present_page_str + "&id=" + id + "&sql=true", function(data) {
                        console.log(data);
                    });
                });
            });
        });
        $('dialog .close-button').bind('click', function() {
            if (dialog.open) {
                dialog.close();
            }
            unbind_dialog();
        });
    }
}
