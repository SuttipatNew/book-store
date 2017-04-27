var menu = ['home', 'book', 'sub_agent'];
var req_page = ['book', 'sub_agent']; //name of page that have to get data from db
var present_page = {selector : $("div.page.home"), str : "home"};
var old_page_html = "";
var present_table_col_count = -1;
var action = "";
var old_id = "";
var checked = null;
var input_box = null;
var data_str = "";
var link = "";
var check_length = 0;
var selected_search_field = "";
var target = null;
$(document).ready(function() {


	var dialog = document.querySelector('dialog');
	var showDialogButton = document.querySelector('button.delete-button');
	if (!dialog.showModal) {
		dialogPolyfill.registerDialog(dialog);
	}

	// console.log('start');
	bind_all();

	$(document).on("click", 'button.cancel-button', function() {
		refresh_page(false, function() {
			action = "";
		});
	});

	$(document).on("click", 'button.refresh-button', function() {
		// console.log('refresh');
		refresh_page(true, function() {
			bind_all();
		});
	});

	$(document).on("click", 'button.save-button', function() {
		console.log(action);
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
		if (action === "add") {
			$.get(link, function(data) {
				// console.log(data);
				if (data == "true") {
					console.log('Success');
					refresh_page(function() {
						action = "";
					}, true);
				} else {
					alert("Insert failed.")
					console.log('Failed');
				}
			});
		} else if (action === "edit") {
			if(confirm("Do you want to save changes?")) {
				$.get(link, function(data) {
					// console.log(data);
					if (data == "true") {
						console.log('Success');
						refresh_page(function() {
							action = "";
						}, true);
					} else {
						alert("Insert failed.")
						console.log('Failed');
					}
				});
			}
		}
	});

    $(document).on("click", 'button.delete-button', function() {
        checked = present_page.selector.find("tbody input:checked");
        check_length = checked.length;
        // console.log(checked.length);
        if (checked.length > 0) {
	        if(confirm("Do you want to save changes?")) {
                // console.log(checked.length);
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
                                if(index === check_length - 1) {
                                    refresh_page(function() {
	                                    action = "";
									});
                                }
                            } else {
                                alert("Delete failed.")
                                console.log('Failed');
                            }
                        });
                    });
                });
            }
        }
    });

	// edit record
	$(document).on("click", 'tr', function() {
		// console.log('edit');
		if (action === "") {
			var row = $(this);
			$.get("connect-data.php?command=1&table=" + present_page_str, function(data) {
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
						type = "date"
					}
					if (head[index].Key === "PRI") {
						old_id = $(this).text();
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
            if (action !== "") {
                refresh_page();
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

	$("#professsion").change(function(){
			// console.log("eiei")
			selected_search_field = $('#professsion option:selected').text();
			console.log(selected_search_field);
	});
});
