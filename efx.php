<?php
	class Efx 
	{
		public $config = array();
		public $cookies = array();
		public $urlOptions = array();
	    public $date;
		public $timestamp;
		public $year;
		public $json;
		public function __construct()
		{
			if(preg_match('/\.local$/', strtolower($_SERVER["SERVER_NAME"])) === 0)
			{
				$this->config["env"] = "production";
			}
			else 
			{
				$this->config["env"] = "development";
			}		
			$this->config["debug"] = false;
			$this->config["docRootPath"] = $_SERVER["DOCUMENT_ROOT"];
			$preg_pattern = sprintf("/%s/i", preg_quote($this->config["docRootPath"], "/"));
			$preg_replace = "";
			$preg_source  = preg_replace("/\\\/i", "/", __DIR__);		
			// echo "preg_pattern: " . $preg_pattern . "<br>";
			// echo "preg_source: " . $preg_source . "<br>";
			$this->config["mainDirUrl"]  = preg_replace($preg_pattern, $preg_replace, $preg_source);
			$this->config["mainDirPath"] = __DIR__;
			/*
			thisDirUrl = pathinfo(SCRIPT_URL, PATHINFO_DIRNAME);
			*/
			$this->config["thisDirUrl"]   = pathinfo($_SERVER["PHP_SELF"], PATHINFO_DIRNAME);
			$this->config["thisDirPath"]  = getcwd();
			$this->config['appDirUrl']    = preg_replace("/\/..\/?$/i", "", $this->config["mainDirUrl"]);
			$this->config['imagesDirUrl'] = $this->config['appDirUrl']."/images";
			$this->config['videosDirUrl'] = $this->config['appDirUrl']."/videos";
			$this->config['fontsDirUrl']  = $this->config['appDirUrl']."/fonts";
			if($this->config["debug"])
			{
				echo "config[\"mainDirUrl\"]: {$this->config["mainDirUrl"]}<br>";
				echo "config[\"mainDirPath\"]: {$this->config["mainDirPath"]}<br>";
				echo "config[\"thisDirUrl\"]: {$this->config["thisDirUrl"]}<br>";
				echo "config[\"thisDirPath\"]: {$this->config["thisDirPath"]}<br>";
			}
		    $this->date = new DateTime();
			$this->timestamp = $this->date->getTimestamp();
			$this->year = $this->date->format("Y");
		}
		public function JQuery()
		{
			printf("<script src=\"/jquery/jquery-3.5.1.min.js\"></script>".PHP_EOL);
		}
		public function ConsoleLog($msg)
		{
			$date = new DateTime("now", new DateTimeZone("EUROPE/Prague"));	
			$logMsg = __CLASS__ . ", " . $date->format("Y-m-d, G:i:s.u") . ": " . $msg;
			echo "<script>" . PHP_EOL;
			echo "console.log(\"{$logMsg}\");" . PHP_EOL;
			echo "</script>" . PHP_EOL;
		}
		public function Meta()
		{
			print("<meta charset=\"utf-8\">".PHP_EOL);
			print("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">".PHP_EOL);
			print("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">".PHP_EOL);
			print("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">".PHP_EOL);
		}
		public function Title()
		{
			print("<title>ЭКОНОМ&dash;FX&trade;</title>".PHP_EOL);
		}
		public function FavIcon()
		{
			print("<link rel=\"icon\" href=\"/images/ekonom.logo.2.white.svg?v={$this->timestamp}\">".PHP_EOL);
		}
		public function Fonts()
		{
		    print("<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\">".PHP_EOL);
			print("<link href=\"https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap\" rel=\"stylesheet\">".PHP_EOL);
			print("<link href=\"https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap\" rel=\"stylesheet\">".PHP_EOL);
		}
		public function Style($url, $force = false)
		{
			$html = sprintf("<link type=\"text/css\" media=\"screen\" rel=\"stylesheet\" href=\"%s%s\">", $url, ($force) ? "?v={$this->timestamp}" : "");
			echo $html.PHP_EOL;
		}
		public function Script($url)
		{
			printf("<script src=\"%s\"></script>".PHP_EOL, $url);
		}
		public function Header()
		{
			require_once($this->config["mainDirPath"]."/header.php");
		}	
		public function Footer()
		{

			require_once($this->config["mainDirPath"]."/footer.php");
		}
	}
	$efx = new Efx();