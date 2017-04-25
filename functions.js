function load_data(table) {
  var data = {};
  $.get("connect-data.php?command=1&table=" + table, function(data) {
    console.log(JSON.parse(data).head);
    data = JSON.parse(data);
  });
  return data;
}
