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
	function fetchByDate($date = null)
	{
		if($date === null)
		{
			$date = (new DateTime())->format('Y-m-d');
		}
		// $date = '2021-03-03';
		$s = $GLOBALS['dbh']->prepare("SELECT DATE(`date`) AS `date`, `x_from`, `x_to`, `unit`, `forward_rate` FROM `fx_rates` WHERE DATE(`date`) = :date");
		$s->bindParam(':date', $date, PDO::PARAM_STR);
		$s->execute();
		$fetch = $s->fetchAll(PDO::FETCH_ASSOC);
		return $fetch;
	}
	function fetchLatest()
	{
		$s = $GLOBALS['dbh']->prepare("SELECT DATE(`date`) AS `date` FROM `fx_rates` ORDER BY `date` DESC");
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch === false)
		{
			return false;
		}
		else
		{
			return fetchByDate($fetch['date']);
		}
	}
	function processFetch($fetch)
	{
		if(count($fetch) === 0)
		{
			return null;
		}
		$items = [];
		$items[] = array(
			'type' => 'fxname',
			'value' => 'ЭКОНОМ-FX&trade;');
		$items[] = array(
			'type' => 'date', 
			'value' => $fetch[0]['date']);
		foreach ($fetch as $row)
		{			
			$x['type'] = 'quote';
			$x['value'] = array();
			$x['value']['x_from'] = $row['x_from'];
			$x['value']['x_to'] = $row['x_to'];
			$x['value']['forward_rate'] = $row['forward_rate'];
			// echo 'x_from: '.$x['value']['x_from'].'<br>';
			// echo 'x_to: '.$x['value']['x_to'].'<br>';
			// echo 'forward_rate: '.$x['value']['forward_rate'].'<br>';
			//
			// https://stackoverflow.com/questions/6796866/php-date-yesterday
			$date_curr = new DateTime($row['date']);
			$date_prev = $date_curr->sub(new DateInterval('P1D'))->format('Y-m-d');
			$s = $GLOBALS['dbh']->prepare("SELECT `forward_rate` FROM `fx_rates` WHERE DATE(`date`) = :date_prev AND `x_from` = :x_from AND `x_to` = :x_to LIMIT 1");
			$s->bindParam(':date_prev', $date_prev, PDO::PARAM_STR);
			$s->bindParam(':x_from', $x['value']['x_from'], PDO::PARAM_STR);
			$s->bindParam(':x_to', $x['value']['x_to'], PDO::PARAM_STR);
			$s->execute();
			$fetch = $s->fetch(PDO::FETCH_ASSOC);
			if($fetch !== false)
			{
				// echo 'date_prev: '.$date_prev.'<br>';
				// echo 'forward_rate: '.$fetch['forward_rate'].'<br>';
				$x['value']['change'] = round(($x['value']['forward_rate'] - $fetch['forward_rate']) / $fetch['forward_rate'] * 100, 4);
				// echo 'change: '.$x['value']['change'].'<br>';
			}
			else
			{
				$x['value']['change'] = null;
			}
			$items[] = $x;
		}
		return $items;
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
		$fetch = fetchByDate();
		if($fetch === false || count($fetch) === 0)
		{
			$fetch = fetchLatest();
			if($fetch === false || count($fetch) === 0)
			{
				$json['data'] = null;
				ajaxResponse(['status' => 'success', 'message' => 'No FX records found']);
			}
		}
		$json['data'] = processFetch($fetch);
		ajaxResponse(['status' => 'success']);
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => $e->getMessage()]);
	}