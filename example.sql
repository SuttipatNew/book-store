-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 30, 2017 at 09:35 PM
-- Server version: 5.7.18-0ubuntu0.16.04.1
-- PHP Version: 7.1.4-1+deb.sury.org~xenial+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `AddrID` int(11) NOT NULL,
  `Addr` varchar(200) NOT NULL,
  `Lane` varchar(200) NOT NULL,
  `Road` varchar(200) NOT NULL,
  `SubDistID` int(11) NOT NULL,
  `Postal` int(11) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`AddrID`, `Addr`, `Lane`, `Road`, `SubDistID`, `Postal`, `LastUpdate`) VALUES
(1, '1', '1', '1', 1, 1, '2017-04-30 00:00:00'),
(2, '2', '2', '2', 2, 2, '2017-04-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `BookID` char(5) CHARACTER SET utf8mb4 NOT NULL,
  `BookTitle` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
  `Price` double NOT NULL,
  `PubID` int(3) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`BookID`, `BookTitle`, `Price`, `PubID`, `LastUpdate`) VALUES
('B0001', 'ไทยรัฐ เช้า', 10, 1, '2017-04-30 21:35:14'),
('B0002', 'ไทยรัฐ บ่าย', 10, 1, '2017-04-30 21:35:09'),
('B0003', 'เดลินิวส์ เช้า', 10, 2, '2017-04-30 21:30:21');

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `DvlID` int(11) NOT NULL,
  `OrdID` int(11) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `delivery`
--

INSERT INTO `delivery` (`DvlID`, `OrdID`, `LastUpdate`) VALUES
(1, 1, '2017-04-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `order_table`
--

CREATE TABLE `order_table` (
  `OrdID` int(1) NOT NULL,
  `CustID` char(4) CHARACTER SET utf8 NOT NULL,
  `Discount` double NOT NULL,
  `OrdDate` date NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_table`
--

INSERT INTO `order_table` (`OrdID`, `CustID`, `Discount`, `OrdDate`, `LastUpdate`) VALUES
(1, 'S001', 15, '2017-04-30', '2017-04-30 21:21:03'),
(2, 'S002', 2, '2017-04-30', '2017-04-30 20:36:20'),
(3, 'S001', 3, '2017-04-30', '2017-04-30 21:17:37');

-- --------------------------------------------------------

--
-- Table structure for table `ord_line`
--

CREATE TABLE `ord_line` (
  `IssueID` int(11) NOT NULL,
  `OrdID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `publisher`
--

CREATE TABLE `publisher` (
  `PubID` char(4) NOT NULL,
  `PubName` varchar(200) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `regular_cust`
--

CREATE TABLE `regular_cust` (
  `RCID` char(4) NOT NULL,
  `RCName` varchar(200) NOT NULL,
  `AddrID` int(11) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `regular_cust`
--

INSERT INTO `regular_cust` (`RCID`, `RCName`, `AddrID`, `LastUpdate`) VALUES
('C001', 'ป่าไม้', 2, '2017-04-30 13:09:48');

-- --------------------------------------------------------

--
-- Table structure for table `sub_agent`
--

CREATE TABLE `sub_agent` (
  `SAID` char(4) CHARACTER SET utf8 NOT NULL,
  `SAName` varchar(200) CHARACTER SET utf8 NOT NULL,
  `AddrID` int(4) NOT NULL,
  `LastUpdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `sub_agent`
--

INSERT INTO `sub_agent` (`SAID`, `SAName`, `AddrID`, `LastUpdate`) VALUES
('S001', 'ศูนย์หนังสือชะอำ', 1, '2017-04-30 20:33:32'),
('S002', 'เอกวรา', 2, '2017-04-30 20:35:51'),
('S003', 'กิจเจริญ', 3, '2017-04-30 21:17:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`AddrID`);

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`BookID`);

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`DvlID`);

--
-- Indexes for table `order_table`
--
ALTER TABLE `order_table`
  ADD PRIMARY KEY (`OrdID`),
  ADD UNIQUE KEY `OrdID` (`OrdID`);

--
-- Indexes for table `ord_line`
--
ALTER TABLE `ord_line`
  ADD PRIMARY KEY (`IssueID`,`OrdID`);

--
-- Indexes for table `publisher`
--
ALTER TABLE `publisher`
  ADD PRIMARY KEY (`PubID`);

--
-- Indexes for table `regular_cust`
--
ALTER TABLE `regular_cust`
  ADD PRIMARY KEY (`RCID`);

--
-- Indexes for table `sub_agent`
--
ALTER TABLE `sub_agent`
  ADD PRIMARY KEY (`SAID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `AddrID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `delivery`
--
ALTER TABLE `delivery`
  MODIFY `DvlID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `order_table`
--
ALTER TABLE `order_table`
  MODIFY `OrdID` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
