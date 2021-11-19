<?php
	function ajaxResponse($o)
	{
		$json = array();
		$json['status'] = $o['status'];
		if(isset($o['code']))
		{
			$json['code'] = $o['code'];
		}
		if(isset($o['message']))
		{
			$json['message'] = $o['message'];
		}
		if(isset($o['data']))
		{
			$json['data'] = $o['data'];
		}
		$GLOBALS['dbh'] = null;
		echo json_encode($json);
		exit();
	}
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
		echo 'Ошибка при подключении к базе данных: '.$e->getMessage();
	}
	$date = $_REQUEST['date'] ?? null;
	$name = $_REQUEST['name'] ?? null;
	$contact = $_REQUEST['contact'] ?? null;
	$security = $_REQUEST['security'] ?? null;
	$par = $_REQUEST['par'] ?? null;
	$quantity = $_REQUEST['quantity'] ?? null;
	$comment = $_REQUEST['comment'] ?? null;
	$json = array();
	if($date === null || $name === null || $contact === null || $security === null || $par === null || $quantity === null)
	{
		ajaxResponse(['status' => 'failed', 'message' => 'Missing parameters']);
	}
	try
	{
		$s = $dbh->prepare("INSERT INTO `eko_orders` (`date`, `name`, `contact`, `security`, `par`, `quantity`, `comment`, `date_created`, `status`) VALUES (:date, :name, :contact, :security, :par, :quantity, :comment, NOW(), 'new')");
		$s->bindParam(':date', $date, PDO::PARAM_STR);
		$s->bindParam(':name', $name, PDO::PARAM_STR);
		$s->bindParam(':contact', $contact, PDO::PARAM_STR);
		$s->bindParam(':security', $security, PDO::PARAM_STR);
		$s->bindParam(':par', $par, PDO::PARAM_INT);
		$s->bindParam(':quantity', $quantity, PDO::PARAM_INT);
		$s->bindParam(':comment', $comment, PDO::PARAM_STR);
		$s->execute();
		$s = $dbh->prepare("SELECT LAST_INSERT_ID() AS `id`");
		$s->execute();
		$fetch = $s->fetch(PDO::FETCH_ASSOC);
		if($fetch !== FALSE)
		{
			ajaxResponse(['status' => 'success', 'data' => intval($fetch['id']), 'message' => 'Record has been successfully created']);
		}
		else
		{
			throw new Exception('Невозможно определить № заявки');
		}
	}
	catch(PDOException $e)
	{
		ajaxResponse(['status' => 'failed', 'message' => 'Ошибка при сохранения запроса: '.$e->getMessage()]);
	}