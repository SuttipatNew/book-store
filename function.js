var menu;
var table_page; //name of page that have to get data from db
var complex_page;
var command_map;
var action = "";
var selected_search_field = "";
var dialog;
$(document).ready(function() {
    dialog = document.querySelector('dialog');
    menu = ['home', 'publisher', 'book', 'book-no-bought', 'issue', 'ord_line', 'sub_agent', 'regular_cust', 'address', 'order_table', 'delivery', 'ord-on-day-sa', 'ord-delivery-sa', 'sa-receipt', 'rc-receipt', 'unique-book', 'ord-delivery-rc', 'ord-on-day-rc', 'ord-info-sa', 'ord-info-rc', 'customer'];
    table_page = ['publisher', 'book', 'issue', 'ord_line', 'sub_agent', 'regular_cust', 'address', 'order_table', 'delivery', 'customer'];
    complex_page = ['ord-on-day-sa', 'ord-delivery-sa', 'sa-receipt', 'book-no-bought', 'rc-receipt', 'unique-book', 'ord-delivery-rc', 'ord-on-day-rc', 'ord-info-sa', 'ord-info-rc']
    command_map = {
        'ord-on-day-sa': 6,
        'ord-delivery-sa': 7,
        'sa-receipt': 8,
        'book-no-bought': 9,
        'rc-receipt': 10,
        'unique-book': 11,
        'ord-delivery-rc': 12,
        'ord-on-day-rc': 13,
        'ord-info-sa': 14,
        'ord-info-rc': 15
    }
    // dialog.showModal();
});

function unbind_dialog() {
    $('dialog .confirm-button').unbind();
    $('dialog .close-button').unbind();
}

function bind_all() {
    // console.log('bind_all');
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

    $('i.search-button').unbind().bind("click", search);

    // $(document).keyup(function(e) {
    //     if (e.keyCode === 13) {
    //      search();
    //     }
    // });

    $("#professsion").unbind().change(function() {
        // console.log("eiei")
        selected_search_field = $('#professsion option:selected').text();
        // console.log(selected_search_field);
    });

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
    if (table_page.indexOf(present_page.str) != -1) {
        $.get("connect-data.php?command=1&table=" + present_page.str, function(data) {
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
        $.get("connect-data.php?command=1&table=" + present_page.str + '&sql=true', function(data) {
            console.log(data);
        });
    } else if (complex_page.indexOf(present_page.str) !== -1) {
        console.log(present_page.str);
        load_complex_page(command_map[present_page.str]);
        remove_progress_bar();
        // if(present_page.str === "ord-delivery") {
        //     load_ord_delivery();
        //     remove_progress_bar();
        // } else if(present_page.str === 'ord-on-day-sa') {
        //     load_ord_on_day();
        //     remove_progress_bar();
        // } else if(present_page.str === 'sa-receipt') {
        //     load_sa_receipt();
        //     remove_progress_bar();
        // } else if(present_page.str === 'book-no-bought') {
        //     load_book_no_bought();
        //     remove_progress_bar();
        // }
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
    classes = classes.replace('mdl-navigation__link ', '');
    for (var i = 0; i < menu.length; i++) {
        if (classes === menu[i]) {
            selected_menu = i;
            break;
        }
    }
    // console.log(selected_menu);
    if (selected_menu != -1) {
        // console.log('change_page page');
        var last_page_selector = present_page.str;
        present_page.str = menu[selected_menu];
        $('div.page').removeClass('show');
        if (present_page.selector !== "") {
            present_page.selector.html(old_page_html);
        }
        present_page.selector = $('div.page.' + present_page.str);
        old_page_html = $(present_page.selector.html());
        $('div.page.' + present_page.str).addClass("show");
        if (table_page.indexOf(present_page.str) != -1) {
            console.log("connect-data.php?command=1&table=" + present_page.str);
            $.get("connect-data.php?command=1&table=" + present_page.str, function(data) {
                // console.log(data);
                var table_json = JSON.parse(data);
                var head = table_json.head;
                present_table_col_count = table_json.column;

                $('#professsion').empty();
                var select_field_msg = '<option value="">Select search field...</option>';
                $("#professsion").append(select_field_msg);

                for (var i = 0; i < present_table_col_count; i++) {
                    var col = '<th>' + head[i].Field + '</th>';
                    var dropdown = "<option value=\"option " + i + "\" id=\"field_choice\">" + head[i].Field + "</option>";
                    // console.log(dropdown);

                    $('div.' + present_page.str + ' thead > tr').append(col);
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
                        $('div.' + present_page.str + ' tbody').append(row);
                    }
                }

                remove_progress_bar()
            });
            $.get("connect-data.php?command=1&table=" + present_page.str + "&sql=true", function(data) {
                console.log(data);
            });
        } else if (complex_page.indexOf(present_page.str) !== -1) {
            console.log(JSON.stringify(command_map));
            load_complex_page(command_map[present_page.str]);
            remove_progress_bar();
            // if(present_page.str === "ord-delivery") {
            //     load_ord_delivery();
            //     remove_progress_bar();
            // } else if(present_page.str === 'ord-on-day-sa') {
            //     load_ord_on_day();
            //     remove_progress_bar();
            // } else if(present_page.str === 'sa-receipt') {
            //     load_sa_receipt();
            //     remove_progress_bar();
            // } else if(present_page.str === 'book-no-bought') {
            //     load_book_no_bought();
            //     remove_progress_bar();
            // }
        } else {
            present_table_col_count = -1;
            remove_progress_bar();
        }
    } else {
        remove_progress_bar();
    }
}

function add_mode() {
    action = "add";
    refresh_page(false, function() {
        $.get("connect-data.php?command=1&table=" + present_page.str, function(data) {
            action = "add";
            var table_json = JSON.parse(data);
            var head = table_json.head;
            var row = "<tr>\n";
            for (var i = 0; i < present_table_col_count; i++) {
                var type = "text";
                var disabled = "";
                if (head[i].Type === "date" && head[i].Field !== "LastUpdate") {
                    type = "date";
                } else if (head[i].Type.indexOf("int") !== -1 && head[i].Key !== "PRI") {
                    type = "number";
                }
                // if (head[i].Key === "PRI" && head[i].Type.indexOf("int") !== -1) {
                //     disabled = " disabled value=\"id\"";
                // }
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
    // console.log('delete');
    action = "delete"
    if (present_page.selector.find('tbody > tr').length > 0) {
        // console.log('adding checkbox');
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
        link = "connect-data.php?command=2&table=" + present_page.str + "&data=" + data_str;
    } else if (action === "edit") {
        link = "connect-data.php?command=4&table=" + present_page.str + "&data=" + data_str + "&old_id=" + old_id;
    }
    console.log(link);
    if (action === 'add') {
        $.get(link, function(data) {
            // console.log(data);
            if (data == "true") {
                // console.log('Success');
                refresh_page(true, function() {
                    action = "";
                });
            } else {
                alert("Insert failed.")
                // console.log('Failed');
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
                    // console.log('Success');
                    refresh_page(true, function() {
                        action = "";
                    });
                } else {
                    alert("Insert failed.")
                    // console.log('Failed');
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
    // console.log('delete_data');
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
                console.log("connect-data.php?command=1&table=" + present_page.str);
                $.get("connect-data.php?command=1&table=" + present_page.str, function(data) {
                    var table_json = JSON.parse(data);
                    var head = table_json.head;
                    var id = "";
                    col.each(function(index) {
                        if (index > 0 && head[index - 1].Key === "PRI") {
                            id = $(this).text();
                            return false;
                        }
                    });
                    console.log("connect-data.php?command=3&table=" + present_page.str + "&id=" + id);
                    $.get("connect-data.php?command=3&table=" + present_page.str + "&id=" + id, function(data) {
                        if (data == "true") {
                            // console.log('Success');
                            if (index === check_length - 1) {
                                refresh_page(function() {
                                    action = "";
                                });
                            }
                        } else {
                            alert("Delete failed.")
                            // console.log('Failed');
                            action = "delete";
                        }
                    });
                    $.get("connect-data.php?command=3&table=" + present_page.str + "&id=" + id + "&sql=true", function(data) {
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

function load_complex_page(command) {
    console.log('command:' + command);
    $.get("connect-data.php?command=" + command, function(data) {
        // console.log(data);
        var table_json = JSON.parse(data);
        var head = table_json.head;
        present_table_col_count = table_json.column;

        $('#professsion').empty();
        var select_field_msg = '<option value="">Select search field...</option>';
        $("#professsion").append(select_field_msg);

        for (var i = 0; i < present_table_col_count; i++) {
            var col = '<th>' + head[i] + '</th>';
            var dropdown = "<option value=\"option " + i + "\" id=\"field_choice\">" + head[i] + "</option>";
            // console.log(dropdown);

            $('div.' + present_page.str + ' thead > tr').append(col);
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
                $('div.' + present_page.str + ' tbody').append(row);
            }
        }
    });
    $.get("connect-data.php?command=" + command + "&sql=true", function(data) {
        console.log(data);
    });
}

function search() {
    // console.log('click search');
    var keyword = $('input.search-box').val();
    if (keyword !== '') {
        // var table_json = JSON.parse(data);
        console.log(keyword + ' ' + selected_search_field);
        console.log(selected_search_field);
        var php_command = "connect-data.php?command=5&table=" + present_page.str;
        php_command += "&field=" + selected_search_field + "&data=" + keyword;
        console.log("php command: " + php_command);
        $.get(php_command, function(data) {
            // console.log('get data');
            // console.log(data);
            // refresh_page(true);
            while ($('tbody tr').length > 0) {
                $('tbody tr').remove();
            }
            var data_json = JSON.parse(data);
            // console.log(data_json[0][1]);
            for (var i = 0; i < data_json.length; i++) {
                var row = "<tr>\n";
                for (var j = 0; j < data_json[i].length; j++) {
                    row += "<td>" + data_json[i][j] + "</td>\n";
                }
                row += "</tr>";
                $('tbody').append(row);
            }
        });
        $.get(php_command + "&sql=true", function(data) {
            console.log(data);
        });

    }
}
