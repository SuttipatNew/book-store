var menu = ['home', 'book', 'sub_agent', 'regular_cust', 'order_table', 'ord-on-day'];
var table_page = ['book', 'sub_agent', 'regular_cust', 'order_table']; //name of page that have to get data from db
var complex_page = ['ord-on-day'];
var present_page = {
    selector: $("div.page.home"),
    str: "home"
};
var old_page_html = "";
var present_table_col_count = -1;
var old_id = "";
var checked = null;
var input_box = null;
var data_str = "";
var link = "";
var check_length = 0;
var target = null;
$(document).ready(function() {
    console.log('start');
    bind_all();
    // edit record
    $(document).on("dblclick", 'div.page tbody tr', function() {
        // console.log('edit');
        if (action === "" && table_page.indexOf(present_page.str) !== -1) {
            var row = $(this);
            $.get("connect-data.php?command=1&table=" + present_page.str, function(data) {
                action = "edit";
                var table_json = JSON.parse(data);
                var head = table_json.head;
                var col = row.find("td");
                col.each(function(index) {
                    var input_box_html = "<input type=\""
                    var type = "text";
                    var disabled = "";
                    var text = $(this).text();
                    if (head[index].Type === "date" && head[index].Field !== "LastUpdate") {
                        type = "date";
                    } else if (head[index].Type.indexOf("int") !== -1 && head[index].Key !== "PRI") {
                        type = "number";
                    }
                    if (head[index].Key === "PRI") {
                        old_id = $(this).text();
                        disabled = " disabled";
                    }
                    if (head[index].Field === "LastUpdate") {
                        disabled = " disabled";
                        text = "timestamp"
                    }
                    input_box_html += type + "\"" + disabled + " value=\"" + text + "\">";
                    $(this).html(input_box_html);
                });
                present_page.selector.find('div.form.add-button').addClass('show');
            });
        }
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            if (action === "") {
                refresh_page(false, function() {
                    action = "";
                });
            }
        }
    });

    $(document).on('click', 'th > input', function() {
        if (this.checked) {
            present_page.selector.find("input:checkbox").attr("checked", true);
        } else {
            present_page.selector.find("input:checkbox").attr("checked", false);
        }
    });

    $("#professsion").change(function() {
        // console.log("eiei")
        selected_search_field = $('#professsion option:selected').text();
        console.log(selected_search_field);
    });
});
