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
	$pair = $_REQUEST['pair'] ?? null;
	$date_start = $_REQUEST['date_start'] ?? null;
	$date_end = $_REQUEST['date_end'] ?? null;
	if($pair === null)
	{
		ajaxResponse(['status' => 'failed', 'message' => 'Exchange pair has to be specified']);
	}
	$preg_pattern = '/^([a-zA-Z]{3}[a-zA-Z]?)\-([a-zA-Z]{3}[a-zA-Z]?)$/i';
	$preg_match = preg_match($preg_pattern, $pair, $matches);
	if($preg_match === 1)
	{
		$x_from = strtoupper($matches[1]);
		$x_to = strtoupper($matches[2]);
	}
	else
	{
		ajaxResponse(['status' => 'failed', 'message' => 'Incorrect format for exchange pair']);
	}
	if($date_start !== null && $date_start !== '')
	{
		$preg_pattern = '/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/i';
		$preg_match = preg_match($preg_pattern, $date_start);
		if($preg_match !== 1)
		{
			ajaxResponse(['status' => 'failed', 'message' => 'Incorrect format of start date']);
		}
	}
	else
	{
		$dto = new DateTime();
		$date_start = $dto->format("Y-m-01");
	}
	if($date_end !== null && $date_end !== '')
	{
		$preg_pattern = '/^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/i';
		$preg_match = preg_match($preg_pattern, $date_end);
		if($preg_match !== 1)
		{
			ajaxResponse(['status' => 'failed', 'message' => 'Incorrect format of end date']);
		}
	}
	else
	{
		$dto = new DateTime($date_start);
		$date_end = $dto->format("Y-m-t");
	}
	// echo 'pair: '.$pair.'<br>';
	// echo 'x_from: '.$x_from.'<br>';
	// echo 'x_to: '.$x_to.'<br>';
	// echo 'start_date: '.$date_start.'<br>';
	// echo 'end_date: '.$date_end.'<br>';
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
		$s = $dbh->prepare("SELECT DATE(`date`) AS `date`, `x_from`, `x_to`, `unit`, `forward_rate`, `reverse_rate` FROM `fx_rates` WHERE (`date` >= :date_start AND `date` <= :date_end) AND `x_from` = :x_from AND `x_to` = :x_to ORDER BY `date` DESC");
		$s->bindParam(':date_start', $date_start, PDO::PARAM_STR);
		$s->bindParam(':date_end', $date_end, PDO::PARAM_STR);
		$s->bindParam(':x_from', $x_from, PDO::PARAM_STR);
		$s->bindParam(':x_to', $x_to, PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetchAll(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			ajaxResponse(['status' => 'failed', 'message' => 'No records found that match criteria specified']);
		}
		$rates = $fetch;
		foreach($rates as &$r)
		{
			$r['spread'] = round($r['forward_rate'] - 1 / $r['reverse_rate'], 4);
		}
		$json['data'] = $rates;
		ajaxResponse(['status' => 'success']);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => $e->getMessage()]);
	}