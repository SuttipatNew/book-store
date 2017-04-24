<?php
header('Content-Type: text/html; charset=utf-8');
$servername = "localhost";
$username = "user1";
$password = "1q2w3e4r";
$dbname = "test";

$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_set_charset($conn, "utf8");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if($_GET['command'] == '1') {
  $sql = "SHOW COLUMNS FROM ". $_GET['table'];
  $result = $conn->query($sql);
  echo "{ \"head\" : [";
  $row = $result->fetch_assoc();
  $col_num = 0;
  while($row) {
    $col_num++;
    echo "\"" . $row['Field'] . "\"";
    if($row = $result->fetch_assoc()) {
      echo ",";
    }
  }
  echo "],";
  echo "\n\"body\" : [";
  $sql = "SELECT * FROM " . $_GET['table'];
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    while($row) {
      echo "[";
      $tmp = $row;
      end($tmp);
      foreach($row as $key => $value) {
        echo "\"" . $value . "\"";
        if($key != key($tmp)) {
          echo ",";
        }
      }
      echo "]";
      if($row = $result->fetch_assoc()) {
        echo ",";
      }
    }
    echo "], \"column\" : " . $col_num . "}\n";
  } else {
    echo "0 results";
  }
}

$conn->close();
?>
