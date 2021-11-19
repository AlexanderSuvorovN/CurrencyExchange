<?php
	function ajaxResponse($o)
	{
		$GLOBALS['json']['status'] = $o['status'];
		if(isset($o['code']))
		{
			$GLOBALS['json']['code'] = $o['code'];
		}
		if(isset($o['message']))
		{
			$GLOBALS['json']['message'] = $o['message'];
		}
		$GLOBALS['dbh'] = null;
		echo json_encode($GLOBALS['json']);
		exit();
	}
	$json = array();
	try
	{
		$database = 'ekonom';
		$username = 'ekonom';
		$password = 'bV7vQ3yO0fwB7l';
		$dbh = new PDO("mysql:host=localhost;dbname=".$database.";charset=utf8", $username, $password);
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => 'Can not establish database connection: '.$e->getMessage()]);
	}
	try
	{
		$s = $dbh->prepare("SELECT `message`, `url` FROM `newsticker` WHERE (`active` = TRUE OR `active` IS NULL) AND (`date_start` <= NOW() OR `date_start` IS NULL) AND (`date_end` > NOW() OR `date_end` IS NULL)");
		$s->execute();
		$fetch = $s->fetchAll(PDO::FETCH_ASSOC);
		$json['data'] = $fetch;
		ajaxResponse(['status' => 'success']);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => $e->getMessage()]);
	}