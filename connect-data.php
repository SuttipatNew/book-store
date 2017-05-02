<?php
/* command
  1 = select (show everything jingerbell in table)
  2 = INSERT
  3 = DELETE
  4 = UPDATE
  5 = search
  6 = view order on day
  7 = view delivery order
  8 = get sub agent receipt
  9 = find books which never be bought
  10 = get regular customer receipt
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

if ($_GET['command'] == '1') {
    if (!isset($_GET['sql']) || $_GET['sql'] == "false") {
        $sql = "SHOW COLUMNS FROM ". $_GET['table'];
        $result = $conn->query($sql);
        echo "{ \"head\" : [";
        $row = $result->fetch_assoc();
        $col_num = 0;
        while ($row) {
            $col_num++;
            echo "{";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                echo " \"" . $key . "\" : \"" . $value . "\"";
                if ($key != key($tmp)) {
                    echo ",";
                }
            }
            echo "}";
        // echo "\"" . $row['Field'] . "\"";
        if ($row = $result->fetch_assoc()) {
            echo ",";
        }
        }
        echo "], ";
        echo "\"column\" : " . $col_num . ", \n";
        echo "\n\"body\" : ";
    }
    $sql = "SELECT * FROM " . $_GET['table'];
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        echo "[";
        $row = $result->fetch_assoc();
        while ($row) {
            echo "[";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                echo "\"" . $value . "\"";
                if ($key != key($tmp)) {
                    echo ",";
                }
            }
            echo "]";
            if ($row = $result->fetch_assoc()) {
                echo ",";
            }
        }
        echo "]}\n";
    } else {
        // echo "0 results";
    echo "\"\" }";
    }
} elseif ($_GET['command'] == '2') {
    $tmp = "SELECT * FROM " . $_GET['table'];
    $result = $conn->query($tmp);
    if ($result->num_rows == 0) {
        $tmp = "TRUNCATE TABLE " . $_GET['table'];
        $conn->query($tmp);
        if (isset($_GET['sql']) && $_GET['sql'] == "true") {
            echo $tmp . '<br>';
        }
    }



    $sql = "INSERT INTO " . $_GET['table'];

  // get columns name
    $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
    $result = $conn->query($tmp);
    $field = "(";
    $row = $result->fetch_assoc();
    while ($row) {
        $field .= $row['Field'];
        if ($row = $result->fetch_assoc()) {
            $field .= ",";
        }
    }
    $field .= ")";
    $value = "(";
    $data = json_decode($_GET['data']);
    for ($i = 0; $i < count($data); $i++) {
        if ($data[$i] == "timestamp") {
            $value .= "NOW()";
        } elseif ($data[$i] == "id") {
            $value .= "NULL";
        } else {
            $value .= "\"" . $data[$i] . "\"";
        }
        if ($i < count($data) - 1) {
            $value .= ",";
        }
    }
    $value .= ")";
    $sql .= " " . $field . " VALUES " . $value;
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    if ($conn->query($sql) === true) {
        echo "true";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($_GET['command'] == '3') {
    $sql = "DELETE FROM " . $_GET['table'] . " WHERE ";

  // find primary key
  $prim = "";
    $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
    $result = $conn->query($tmp);
    $row = $result->fetch_assoc();
    while ($row) {
        $type = $row['Key'];
        if ($type == "PRI") {
            $prim = $row['Field'];
            break;
        }
    }

    $sql .= $prim . " = " . $_GET['id'];
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    if ($conn->query($sql) === true) {
        echo "true";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} elseif ($_GET['command'] == '4') {
    $sql = "UPDATE " . $_GET['table'] . " SET ";
    $data = json_decode($_GET['data']);
    $prim = "";
    $tmp = "SHOW COLUMNS FROM ". $_GET['table'];
    $result = $conn->query($tmp);
    $row = $result->fetch_assoc();
    $i = 0;
    while ($row) {
        if ($data[$i] == "timestamp") {
            $value = "NOW()";
            $sql .= $row['Field'] . " = " . $value;
        } else {
            $sql .= $row['Field'] . " = \"" . $data[$i] . "\"";
        }
        $type = $row['Key'];
        if ($type == "PRI") {
            $prim = $row['Field'];
        }
        if ($row = $result->fetch_assoc()) {
            $sql .= ", ";
        }
        $i++;
    }
    $sql .= " WHERE " . $prim . " = \"" . $_GET['old_id'] . "\"";
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
  // echo $sql;
  if ($conn->query($sql) === true) {
      echo "true";
  } else {
      echo "Error: " . $sql . "<br>" . $conn->error;
  }
} elseif ($_GET['command'] == '5') {
    // echo "hello";
    $sql = "SELECT * FROM ".$_GET['table'];
    $sql .= " WHERE ".$_GET['field']." LIKE \"%";
    $sql .= $_GET['data']."%\"";
     // echo $_GET['table']
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
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
       while ($row) {
           echo "[";
           $tmp = $row;
           end($tmp);
           foreach ($row as $key => $value) {
               echo "\"" . $value . "\"";
               if ($key != key($tmp)) {
                   echo ",";
               }
           }
           echo "]";
           if ($row = $result->fetch_assoc()) {
               echo ",";
           }
       }
       echo "]\n";
   }
} elseif ($_GET['command'] == '6') {
    $sql = "SHOW COLUMNS FROM order_table";
    $result = $conn->query($sql);
    $data_json .= "{ \"head\" : [";
    $row = $result->fetch_assoc();
    $col_num = 0;
    while ($row) {
        $col_num++;
        $data_json .= "\"" . $row['Field'] . "\"";
        if ($row = $result->fetch_assoc()) {
            $data_json .= ",";
        }
    }
    $data_json .= "], ";
    $data_json .= "\"column\" : " . $col_num . ", \n";
    $data_json .= "\n\"body\" : [";
    $sql = "SELECT *";
    $sql .= " FROM order_table WHERE OrdDate = CURDATE() ORDER BY CustID";
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        while ($row) {
            $data_json .= "[";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                $data_json .= "\"" . $value . "\"";
                if ($key != key($tmp)) {
                    $data_json .= ",";
                }
            }
            $data_json .= "]";
            if ($row = $result->fetch_assoc()) {
                $data_json .= ",";
            }
        }
    }
    $data_json .= "]}\n";
    echo $data_json;
} elseif ($_GET['command'] == '7') {
    $head = array('order_table.OrdID', 'sub_agent.SAName', 'Addr', 'Lane', 'Road');
    $data_json = "{ \"head\" : [";
    $sql = "SELECT ";
    for ($i = 0; $i < count($head); $i++) {
        $sql .= $head[$i];
        $data_json .= "\"" . $head[$i] . "\"";
        if ($i != count($head) - 1) {
            $sql .= ", ";
            $data_json .= ", ";
        }
    }
    $data_json .= "], \"column\" : " . count($head) . ", \"body\" : [";
    $sql .= " FROM order_table INNER JOIN sub_agent ON order_table.CustID = sub_agent.SAID INNER JOIN address ON sub_agent.AddrID = address.AddrID WHERE OrdDate = CURDATE() AND OrdID IN (SELECT OrdID FROM delivery)";
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        while ($row) {
            $data_json .= "[";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                $data_json .= "\"" . $value . "\"";
                if ($key != key($tmp)) {
                    $data_json .= ",";
                }
            }
            $data_json .= "]";
            if ($row = $result->fetch_assoc()) {
                $data_json .= ",";
            }
        }
    }
    $data_json .= "]}\n";
    echo $data_json;
} elseif ($_GET['command'] == '8') {
    $head = array('SAName', 'SUM(Price*(100-Discount)/100)');
    $data_json = "{ \"head\" : [";
    $sql = "SELECT ";
    for ($i = 0; $i < count($head); $i++) {
        $sql .= $head[$i];
        $data_json .= "\"" . $head[$i] . "\"";
        if ($i != count($head) - 1) {
            $sql .= ", ";
            $data_json .= ", ";
        }
    }
    $data_json .= "], \"column\" : " . count($head) . ", \"body\" : [";
    $sql .= " FROM order_table INNER JOIN ord_line ON order_table.OrdID = ord_line.OrdID
INNER JOIN issue ON ord_line.IssueID = issue.IssueID
INNER JOIN book ON issue.BookID = book.BookID
INNER JOIN sub_agent ON sub_agent.SAID = order_table.CustID
WHERE MONTH(order_table.OrdDate) = MONTH(CURDATE())
GROUP BY CustID
HAVING COUNT(*) > 0";
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        while ($row) {
            $data_json .= "[";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                $data_json .= "\"" . $value . "\"";
                if ($key != key($tmp)) {
                    $data_json .= ",";
                }
            }
            $data_json .= "]";
            if ($row = $result->fetch_assoc()) {
                $data_json .= ",";
            }
        }
    }
    $data_json .= "]}\n";
    echo $data_json;
} elseif ($_GET['command'] == '9') {
    $head = array('BookTitle');
    $data_json = "{ \"head\" : [";
    $sql = "SELECT ";
    for ($i = 0; $i < count($head); $i++) {
        $sql .= $head[$i];
        $data_json .= "\"" . $head[$i] . "\"";
        if ($i != count($head) - 1) {
            $sql .= ", ";
            $data_json .= ", ";
        }
    }
    $data_json .= "], \"column\" : " . count($head) . ", \"body\" : [";
    $sql .= " FROM book INNER JOIN issue ON book.BookID = issue.BookID
WHERE NOT EXISTS
(SELECT * FROM ord_line WHERE issue.issueID = ord_line.issueID)";
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        while ($row) {
            $data_json .= "[";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                $data_json .= "\"" . $value . "\"";
                if ($key != key($tmp)) {
                    $data_json .= ",";
                }
            }
            $data_json .= "]";
            if ($row = $result->fetch_assoc()) {
                $data_json .= ",";
            }
        }
    }
    $data_json .= "]}\n";
    echo $data_json;
} elseif ($_GET['command'] == '10') {
    $head = array('RCName', 'SUM(Price*(100-Discount)/100)');
    $data_json = "{ \"head\" : [";
    $sql = "SELECT ";
    for ($i = 0; $i < count($head); $i++) {
        $sql .= $head[$i];
        $data_json .= "\"" . $head[$i] . "\"";
        if ($i != count($head) - 1) {
            $sql .= ", ";
            $data_json .= ", ";
        }
    }
    $data_json .= "], \"column\" : " . count($head) . ", \"body\" : [";
    $sql .= " FROM order_table INNER JOIN ord_line ON order_table.OrdID = ord_line.OrdID
INNER JOIN issue ON ord_line.IssueID = issue.IssueID
INNER JOIN book ON issue.BookID = book.BookID
INNER JOIN regular_cust ON regular_cust.RCID = order_table.CustID
WHERE MONTH(order_table.OrdDate) = MONTH(CURDATE())
GROUP BY CustID
HAVING COUNT(*) > 0";
    if (isset($_GET['sql']) && $_GET['sql'] == "true") {
        echo $sql;
        return;
    }
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        while ($row) {
            $data_json .= "[";
            $tmp = $row;
            end($tmp);
            foreach ($row as $key => $value) {
                $data_json .= "\"" . $value . "\"";
                if ($key != key($tmp)) {
                    $data_json .= ",";
                }
            }
            $data_json .= "]";
            if ($row = $result->fetch_assoc()) {
                $data_json .= ",";
            }
        }
    }
    $data_json .= "]}\n";
    echo $data_json;
}

$conn->close();
