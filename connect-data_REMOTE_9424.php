<?php
/* command
  1 = select (show everything jingerbell in table)
  2 = INSERT
  3 = DELETE
  4 = UPDATE
  5 = search
*/
date_default_timezone_set("Asia/Bangkok");
// echo "The time is " . date("Y-m-d");
$timestamp = date("Y-m-d");
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
    if(!isset($_GET['sql']) || $_GET['sql'] == "false") {
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
    }
  $sql = "SELECT * FROM " . $_GET['table'];
  if(isset($_GET['sql']) && $_GET['sql'] == "true") {
      echo $sql;
      return;
  }
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
  $value = "(";
  $data = json_decode($_GET['data']);
  for($i = 0; $i < count($data); $i++) {
    if($data[$i] == "timestamp") {
      $value .= "CURDATE()";
    } else {
        $value .= "\"" . $data[$i] . "\"";
    }
    if($i < count($data) - 1) {
      $value .= ",";
    }
  }
  $value .= ")";
  $sql .= " " . $field . " VALUES " . $value;
  if(isset($_GET['sql']) && $_GET['sql'] == "true") {
      echo $sql;
      return;
  }
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
  if(isset($_GET['sql']) && $_GET['sql'] == "true") {
      echo $sql;
      return;
  }
  if ($conn->query($sql) === TRUE) {
    echo "true";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
} else if($_GET['command'] == '4') {
  $sql = "UPDATE " . $_GET['table'] . " SET ";
  $data = json_decode($_GET['data']);
  $prim = "";
  $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
  $result = $conn->query($tmp);
  $row = $result->fetch_assoc();
  $i = 0;
  while($row) {
      if($data[$i] == "timestamp") {
        $value = "CURDATE()";
        $sql .= $row['Field'] . " = " . $value;
    } else {
        $sql .= $row['Field'] . " = \"" . $data[$i] . "\"";
    }
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
  if(isset($_GET['sql']) && $_GET['sql'] == "true") {
      echo $sql;
      return;
  }
  // echo $sql;
  if ($conn->query($sql) === TRUE) {
    echo "true";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
} else if($_GET['command'] == '5') {
  // echo "hello";
     $sql = "SELECT * FROM ".$_GET['table'];
     $sql .= " WHERE ".$_GET['field']." LIKE \"%";
     $sql .= $_GET['data']."%\"";
     // echo $_GET['table']
     if(isset($_GET['sql']) && $_GET['sql'] == "true") {
      echo $sql;
      return;
      }
     $result = $conn->query($sql);
   //   if ($conn->query($sql) === TRUE) {
   //    echo "Database searched successfully";
   // }
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
    echo "]\n";
  }
}

$conn->close();
?>
