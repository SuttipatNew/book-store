function load_data(table) {
  $.get("connect-data.php?command=1&table=" + table, function(data) {
    console.log(data);
  });
}
