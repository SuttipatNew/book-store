<?php
/* command
  1 = select
  2 = INSERT
  3 = DELETE
  4 = UPDATE
*/
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
    echo "{";
    $tmp = $row;
    end($tmp);
    foreach ($row as $key => $value) {
     echo " \"" . $key . "\" : \"" . $value . "\"";
     if($key != key($tmp)) {
       echo ",";
     }
    }
    echo "}";
    // echo "\"" . $row['Field'] . "\"";
    if($row = $result->fetch_assoc()) {
      echo ",";
    }
  }
  echo "], ";
  echo "\"column\" : " . $col_num . ", \n";
  echo "\n\"body\" : ";
  $sql = "SELECT * FROM " . $_GET['table'];
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    echo "[";
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
    echo "]}\n";
  } else {
    // echo "0 results";
    echo "\"\" }";
  }
} else if($_GET['command'] == '2') {
  $sql = "INSERT INTO " . $_GET['table'];

  // get columns name
  $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
  $result = $conn->query($tmp);
  $field = "(";
  $row = $result->fetch_assoc();
  while($row) {
    $field .= $row['Field'];
    if($row = $result->fetch_assoc()) {
      $field .= ",";
    }
  }
  $field .= ")";
  $sql .= " " . $field . " VALUES " . "(" . $_GET['data'] . ")";
  if ($conn->query($sql) === TRUE) {
    echo "true";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
} else if($_GET['command'] == '3') {
  $sql = "DELETE FROM " . $_GET['table'] . " WHERE ";

  // find primary key
  $prim = "";
  $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
  $result = $conn->query($tmp);
  $row = $result->fetch_assoc();
  while($row) {
    $type = $row['Key'];
    if($type == "PRI") {
      $prim = $row['Field'];
      break;
    }
  }

  $sql .= $prim . " = " . $_GET['id'];
  if ($conn->query($sql) === TRUE) {
    echo "true";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
} else if($_GET['command'] == '4') {
  $sql = "UPDATE " . $_GET['table'] . " SET ";
  $data = json_decode("[" . $_GET['data'] . "]");
  $prim = "";
  $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
  $result = $conn->query($tmp);
  $row = $result->fetch_assoc();
  $i = 0;
  while($row) {
    $sql .= $row['Field'] . " = \"" . $data[$i] . "\"";
    $type = $row['Key'];
    if($type == "PRI") {
      $prim = $row['Field'];
    }
    if($row = $result->fetch_assoc()) {
      $sql .= ", ";
    }
    $i++;
  }
  $sql .= " WHERE " . $prim . " = " . $_GET['old_id'];
  // echo $sql;
  if ($conn->query($sql) === TRUE) {
    echo "true";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

$conn->close();
?>
