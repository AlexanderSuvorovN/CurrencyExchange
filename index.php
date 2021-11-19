<?php
	require_once("./efx.php");
	$x_from = $_REQUEST['x_from'] ?? null;
	$x_to = $_REQUEST['x_to'] ?? null;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<?= $efx->Meta() ?>
	<?= $efx->Title() ?>
	<?= $efx->FavIcon() ?>
    <?= $efx->Fonts() ?>
	<?= $efx->Style("/efx.css", true) ?>
	<?= $efx->Style("/header.css", true) ?>
	<?= $efx->Style("/index.css", true) ?>
	<?= $efx->Style("/footer.css", true) ?>
	<?= $efx->JQuery() ?>
	<script src="https://cdn.amcharts.com/lib/4/core.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>
	<script src="https://www.google.com/recaptcha/api.js?render=6LdGEJEaAAAAAENDP0vITP3OeK3rPnkanWmrvdmi"></script>
	<?= $efx->Script('/efx.js') ?>
	<?= $efx->Script('/index.js') ?>
</head>
<body>
	<input type='hidden' name='x_from' value='<?= $x_from ?>'>
	<input type='hidden' name='x_to' value='<?= $x_to ?>'>
	<?php $efx->Header() ?>
	<section class='controls'>
		<div class='fieldset pair'>
			<div class='label'>
				Валютная пара
			</div>
			<div class='value'>
				<select name='pair'>
					<option value='rub-eko'>RUB / EKO</option>
					<option value='eur-eko'>EUR / EKO</option>
					<option value='usd-eko'>USD / EKO</option>
					<option value='btc-eko'>BTC / EKO</option>
				</select>
			</div>
		</div>
		<div class='fieldset date-start'>
			<div class='label'>
				Начало периода
			</div>
			<div class='value'>
				<input name='date_start' type='text'>
				<button></button>
			</div>
		</div>
		<div class='fieldset date-end'>
			<div class='label'>
				Конец периода
			</div>
			<div class='value'>
				<input name='date_end' type='text'>
				<button></button>
			</div>
		</div>
	</section>
	<section class='chart'>
		<div id="chartdiv"></div>
	</section>
	<section class='fx-table'>
	</section>
	<?php $efx->Footer() ?>
	<section class='dummy' style='display: none'>
		<div class='buy-eko modal'>
			<div class='window'>
				<div class='caption'>
					<img class='icon' src='/images/icon.ekonom.logo.svg'>
					<div class='text'>Заявка на приобретение</div>
					<img class='close' src='/images/icon.close.svg'>
				</div>
				<div class='body'>
					<p>
						Запросы выполняются по курсу на дату, указанную в форме заявки
					</p>
					<input type='text' name='date' disabled="true">
					<input type='text' name='name' placeholder='Имя'>
					<input type='text' name='contact' placeholder='E-mail, телефон или Telegram'>
					<select name='security'>
						<option value='eko'>EKO™</option>
						<option value='eko-earlybird'>EKO-EARLYBIRD™</option>
					</select>
					<div class='grid'>
						<div class='par'>
							<input type='number' name='par' placeholder='Номинал' min='1'>
						</div>
						<div class='quantity'>
							<input type='number' name='quantity' placeholder='Количество' min='1'>
						</div>
					</div>
					<input type='text' name='comment' placeholder='Коментарий'>
					<button>Отправить</button>
				</div>
			</div>
		</div>
	</section>
</body>
</html>