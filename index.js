$(function(e)
{
	function ajaxFxRates()
	{
		$.ajax(
			{
				url: '/ajax.fxrates.php',
				method: 'post',
				data:
					{
						pair: controls.pair.node.val().trim(),
						date_start: controls.date_start.node.val().trim(),
						date_end: controls.date_end.node.val().trim()
					},
				dataType: 'json'
			})
			.done(
				function(response)
				{
					// console.log(response);
					if(response.status === 'success')
					{
						// https://stackoverflow.com/questions/5731193/how-to-format-numbers
						for(let item of response.data)
						{
							item.unit = Number(item.unit).toLocaleString(undefined, { minimumFractionDigits: 4 });
							item.pair = item.x_from + '&nbsp;/&nbsp;' + item.x_to;
							item.forward_rate = Number(item.forward_rate).toLocaleString(undefined, { minimumFractionDigits: 4 });
							item.reverse_rate = Number(item.reverse_rate).toLocaleString(undefined, { minimumFractionDigits: 4 });
							item.spread = Number(item.spread).toLocaleString(undefined, { minimumFractionDigits: 4 });
						}
						//
						// Render chart
						//
						am4core.useTheme(am4themes_animated);
						var chart = am4core.create('chartdiv', am4charts.XYChart);
						//
						// Add data
						chart.data = generateChartData();
						//
						// Create axes
						var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
						dateAxis.renderer.minGridDistance = 50;
						dateAxis.renderer.grid.template.stroke = 'white';
						dateAxis.renderer.grid.template.location = 0.5;
						dateAxis.renderer.labels.template.fill = am4core.color('white');
						dateAxis.renderer.labels.template.fontSize = 14;
						dateAxis.renderer.ticks.template.disabled = false;
						dateAxis.renderer.ticks.template.strokeOpacity = 1;
						dateAxis.renderer.ticks.template.stroke = am4core.color('white');
						dateAxis.renderer.ticks.template.strokeWidth = 2;
						dateAxis.renderer.ticks.template.length = 8;
						dateAxis.renderer.ticks.template.location = 0.5;
						dateAxis.renderer.line.strokeOpacity = 1;
						dateAxis.renderer.line.strokeWidth = 2;
						dateAxis.renderer.line.stroke = am4core.color('white');
						//
						var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
						// valueAxis.title.text = 'Покупка';
						// valueAxis.title.fontWeight = 'bold';
						// valueAxis.title.color = am4core.color('white');
						valueAxis.renderer.grid.template.stroke = am4core.color('white');
						// valueAxis.renderer.grid.template.strokeWidth = 2;
						valueAxis.renderer.grid.template.strokeOpacity = 0.25;
						valueAxis.renderer.labels.template.fill = am4core.color('white');
						valueAxis.renderer.labels.template.fontSize = 14;

						valueAxis.renderer.ticks.template.disabled = false;
						valueAxis.renderer.ticks.template.strokeOpacity = 1;
						valueAxis.renderer.ticks.template.stroke = am4core.color('white');
						valueAxis.renderer.ticks.template.strokeWidth = 2;
						valueAxis.renderer.ticks.template.length = 8;
						valueAxis.renderer.line.strokeOpacity = 1;
						valueAxis.renderer.line.strokeWidth = 2;
						valueAxis.renderer.line.stroke = am4core.color('white');
						//
						// Create series
						var series = chart.series.push(new am4charts.LineSeries());
						series.dataFields.valueY = "rate";
						series.dataFields.dateX = "date";
						series.strokeWidth = 2;
						switch(response.data[0].x_from.toLowerCase())
						{
							case 'usd': 
								series.stroke = am4core.color('#1abc9c');
								break;
							case 'eur':
								series.stroke = am4core.color('#fd973d');
								break;
							case 'rub':
								series.stroke = am4core.color('#009ce8');
								break;
							case 'btc':
								series.stroke = am4core.color('#cf22e8');
								break;
							default:
								series.stroke = am4core.color('#1abc9c');
								break;
						}
						series.fill = series.stroke;
						series.fillOpacity = 0.2;
						// let gradient = new am4core.LinearGradient();
						// gradient.addColor(am4core.color('#1abc9c'));
						// gradient.addColor(am4core.color('rgba(0,0,0,.0)'));
						// series.fill = gradient;
						// gradient.rotation = 90;

						// var fillModifier = new am4core.LinearGradientModifier();
						// fillModifier.opacities = [1, 0];
						// fillModifier.offsets =   [1, 0];
						// fillModifier.gradient.rotation = 90;
						// series.segments.template.fillModifier = fillModifier;

						series.minBulletDistance = 10;		
						series.tooltipText = "{valueY}";
						series.tooltip.pointerOrientation = "vertical";
						series.tooltip.background.cornerRadius = 1;
						series.tooltip.background.fillOpacity = 0.75;
						series.tooltip.label.padding(6,12,6,12);
						//
						// Add scrollbar
						// chart.scrollbarX = new am4charts.XYChartScrollbar();
						// chart.scrollbarX.series.push(series);
						//
						// Add cursor
						chart.cursor = new am4charts.XYCursor();
						chart.cursor.xAxis = dateAxis;
						chart.cursor.snapToSeries = series;
						//
						function generateChartData() 
						{
							let chartData = [];
						    for(let item of response.data)
						    {
						    	chartData.push(
						    		{
						    			date: item.date,
						    			rate: item.forward_rate
						    		});
						    }
						    return chartData;
						}
						//
						// Render table
						//
						if(efx.responsive === 'desktop')
						{
							let table_node = $('<table>').addClass('fx');
							let thead_node = $('<thead>');
							let tbody_node = $('<tbody>');
							let tr_node;
							let th_node;
							let td_node;
							tr_node = $('<tr>');
							th_node = $('<th>').addClass('date').html('Дата').appendTo(tr_node);
							th_node = $('<th>').addClass('pair').html('Валютная пара').appendTo(tr_node);
							th_node = $('<th>').addClass('unit').html('Количество').appendTo(tr_node);
							th_node = $('<th>').addClass('forward-rate').html('Покупка').appendTo(tr_node);
							th_node = $('<th>').addClass('reverse-rate').html('Продажа').appendTo(tr_node);
							th_node = $('<th>').addClass('spread').html('Спред').appendTo(tr_node);
							tr_node.appendTo(thead_node);
							for(let item of response.data)
							{
								let date = item.date;
								let pair = item.x_from + '&nbsp;/&nbsp;' + item.x_to;
								let unit = item.unit;
								let forward_rate = item.forward_rate;
								let reverse_rate = item.reverse_rate;
								let spread = item.spread;
								tr_node = $('<tr>');
								td_node = $('<td>').addClass('date').html(date).appendTo(tr_node);
								td_node = $('<td>').addClass('pair').html(pair).appendTo(tr_node);
								td_node = $('<td>').addClass('unit').html(unit).appendTo(tr_node);
								td_node = $('<td>').addClass('forward-rate').html(forward_rate).appendTo(tr_node);
								td_node = $('<td>').addClass('reverse-rate').html(reverse_rate).appendTo(tr_node);
								td_node = $('<td>').addClass('spread').html(spread).appendTo(tr_node);
								tr_node.appendTo(tbody_node);
							}
							table_node.append(thead_node);
							table_node.append(tbody_node);
							$('section.fx-table').empty().append(table_node);
						}
						//
						// Render grid
						//
						if(efx.responsive === 'mobile')
						{
							let container_node = $('<div>').addClass('fx');
							for(let item of response.data)
							{
								let grid_node = $('<div>').addClass('grid');
								let item_node;
								let label_node;
								let value_node;
								item_node = $('<div>').addClass('date');
								label_node = $('<div>').addClass('label').html('Дата');
								value_node = $('<div>').addClass('value').html(item.date);
								item_node.append(label_node);
								item_node.append(value_node);
								grid_node.append(item_node);
								item_node = $('<div>').addClass('pair');
								label_node = $('<div>').addClass('label').html('Валютная пара');
								value_node = $('<div>').addClass('value').html(item.pair);
								item_node.append(label_node);
								item_node.append(value_node);
								grid_node.append(item_node);
								item_node = $('<div>').addClass('unit');
								label_node = $('<div>').addClass('label').html('Количество');
								value_node = $('<div>').addClass('value').html(item.unit);
								item_node.append(label_node);
								item_node.append(value_node);
								grid_node.append(item_node);
								item_node = $('<div>').addClass('forward-rate');
								label_node = $('<div>').addClass('label').html('Покупка');
								value_node = $('<div>').addClass('value').html(item.forward_rate);
								item_node.append(label_node);
								item_node.append(value_node);
								grid_node.append(item_node);
								item_node = $('<div>').addClass('reverse-rate');
								label_node = $('<div>').addClass('label').html('Продажа');
								value_node = $('<div>').addClass('value').html(item.reverse_rate);
								item_node.append(label_node);
								item_node.append(value_node);
								grid_node.append(item_node);
								item_node = $('<div>').addClass('spread');
								label_node = $('<div>').addClass('label').html('Спред');
								value_node = $('<div>').addClass('value').html(item.spread);
								item_node.append(label_node);
								item_node.append(value_node);
								grid_node.append(item_node);
								grid_node.appendTo(container_node);
							}
							$('section.fx-table').empty().append(container_node);
						}
					}
				});
	}
	function checkDateValid(dateStr)
	{
		return /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/.test(dateStr);
	}
	function markValid(input_node)
	{
		if(input_node.hasClass('invalid') === true)
		{
			input_node.removeClass('invalid');
		}
		input_node.addClass('valid');
	}
	function markInvalid(input_node)
	{
		if(input_node.hasClass('valid') === true)
		{
			input_node.removeClass('valid');
		}
		input_node.addClass('invalid');
	}
	function dateChanged(e)
	{
		let date_start = controls.date_start.node.val().trim();
		let date_end = controls.date_end.node.val().trim();
		let valid = true;
		if(checkDateValid(date_start) === true)
		{
			markValid(controls.date_start.node);
		}
		else
		{
			markInvalid(controls.date_start.node);
			valid = false;
		}
		if(checkDateValid(date_end) === true)
		{
			markValid(controls.date_end.node);
		}
		else
		{
			markInvalid(controls.date_end.node);
			valid = false;
		}
		// console.log('date_start: ' + date_start);
		// console.log('date_end: ' + date_end);
		if(valid === true)
		{
			let jsd_start = new Date(date_start);
			let jsd_end = new Date(date_end);
			if(jsd_start > jsd_end)
			{
				markInvalid(controls.date_end.node);
				markInvalid(controls.date_start.node);
				valid = false;
			}
		}
		if(valid === true)
		{
			ajaxFxRates();
		}
	}
	let controls = {};
	controls.node = $('section.controls');
	controls.pair = {};
	controls.pair.node = controls.node.find('select[name="pair"]');
	controls.date_start = {};
	controls.date_start.node = controls.node.find('input[name="date_start"]');
	controls.date_start.node.on('input', dateChanged);
	controls.date_start.node.siblings('button').on('click',
		function(e)
		{
			efx.showDatePicker({ targetNode: controls.date_start.node });
		});
	controls.date_end = {};
	controls.date_end.node = controls.node.find('input[name="date_end"]');
	controls.date_end.node.on('input', dateChanged);
	controls.date_end.node.siblings('button').on('click',
		function(e)
		{
			efx.showDatePicker({ targetNode: controls.date_end.node });
		});
	//
	// If parameters have been supplied for exchange pair
	//
	let x_from_node = $('body > input[name="x_from"]');	
	let x_to_node = $('body > input[name="x_to"]');
	if(x_from_node.length > 0 && x_to_node.length > 0)
	{
		let x_from = x_from_node.val().trim().toLowerCase();
		let x_to = x_to_node.val().trim().toLowerCase();
		if(x_from !== '' && x_to !== '')
		{
			controls.pair.node.val(x_from + '-' + x_to).change();
		}
	}
	//
	// Now it's safe to add event handler for the 'select'
	//
	controls.pair.node.on('change', ajaxFxRates);
	//
	// Set start date
	//
	let dto = new Date();
	let dd = String(dto.getDate()).padStart(2, '0');
	let mm = String(dto.getMonth() + 1).padStart(2, '0');
	let yyyy = dto.getFullYear();
	controls.date_start.node.val(yyyy+'-'+mm+'-01');
	//
	// Calculate end date
	// https://stackoverflow.com/questions/222309/calculate-last-day-of-month-in-javascript
	//
	dto = new Date(yyyy, Number(mm), 0);
	dd = String(dto.getDate()).padStart(2, '0');
	mm = String(dto.getMonth() + 1).padStart(2, '0');
	yyyy = dto.getFullYear();
	controls.date_end.node.val(yyyy+'-'+mm+'-'+dd);
	//
	// Start Ticker
	//
	if(efx.responsive === 'desktop')
	{
		efx.showTicker({targetNode: $('header > div.ticker')}); 		
	}
	else
	{
		efx.showTicker({targetNode: $('body > div.ticker.mobile')});
	}
	//
	// Start News Ticker
	// 
	efx.showNewsTicker({ targetNode: $('body > div.news-ticker') });
	//
	// Do AJAX
	//
	ajaxFxRates();
	//
	// Купить
	//
	$('header > button').click(
		function(e)
		{
			let modal_node = $('section.dummy > div.buy-eko.modal').clone();
			modal_node.find('div.window > div.caption > img.close').on('click',
				function(e)
				{
					$('body').css({ maxHeight: 'unset', overflow: 'unset' });
					modal_node.remove();
				});
			let jsd = new Date();
			let yyyy = String(jsd.getFullYear()).padStart(4, '0');
			let mm = String(jsd.getMonth() + 1).padStart(2, '0');
			let dd = String(jsd.getDate()).padStart(2, '0');
			let hh = String(jsd.getHours()).padStart(2, '0');
			let ii = String(jsd.getMinutes()).padStart(2, '0');
			date = yyyy+'-'+mm+'-'+dd+' '+hh+'-'+ii;
			modal_node.find('input[name="date"]').val(date);
			modal_node.find('select[name="security"]').on('change',
				function(e)
				{
					let val = $(this).val().trim().toLowerCase();
					let par_node = modal_node.find('input[name="par"]');
					if(val === 'eko')
					{
						par_node.attr('disabled', true);
						par_node.val(1);
					}
					if(val === 'eko-earlybird')
					{
						par_node.attr('disabled', false);
						par_node.val(1000);
					}
				});
			modal_node.find('select[name="security"]').trigger('change');
			modal_node.find('div.window > div.body > button').on('click',
				function(e)
				{
					let body_node = modal_node.find('div.window > div.body');
					let name = body_node.find('input[name="name"]').val().trim();
					let contact = body_node.find('input[name="contact"]').val().trim();
					let security = body_node.find('select[name="security"]').val().trim().toLowerCase();
					let par = body_node.find('input[name="par"]').val().trim();;
					let quantity = body_node.find('input[name="quantity"]').val().trim();
					let comment = body_node.find('input[name="comment"]').val().trim();
					let error = false;
					let message_node = $('<div>');
					if(name === '')
					{
						error = true;
						let node = $('<div>').html('Необходимо заполнить поле "Имя"');
						message_node.append(node);
					}
					if(contact === '')
					{
						error = true;
						let node = $('<div>').html('Необходимо заполнить поле "Контакт"');
						message_node.append(node);
					}
					if(par === '')
					{
						error = true;
						let node = $('<div>').html('Необходимо заполнить поле "Номинал"');
						message_node.append(node);
					}
					if(quantity === '')
					{
						error = true;
						let node = $('<div>').html('Необходимо заполнить поле "Количество"');
						message_node.append(node);
					}
					if(error !== true)
					{
						// e.preventDefault();
						grecaptcha.ready(
							function()
							{
								grecaptcha
									.execute('6LdGEJEaAAAAAENDP0vITP3OeK3rPnkanWmrvdmi', {action: 'submit'})
									.then(
										function(token)
										{
						  					// Add your logic to submit to your backend server here.
											$.ajax(
												{
													url: '/ajax.ekoorder.php',
													method: 'post',
													data:
														{
															date: date,
															name: name,
															contact: contact,
															security: security,
															par: par,
															quantity: quantity,
															comment: comment
														},
													dataType: 'json'
												})
												.done(
													function(response)
													{
														console.log(response);
														let order_id = response.data;
														let html_node = $('<div>').addClass('order-confirmation');
														let message_node = $('<h1>').text('Заявка на приобретение успешно отправлена!');
														let table_node = $('<table>');
														let tbody_node = $('<tbody>');
														let tr_node;
														let td_node;
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('№ заявки').appendTo(tr_node);
														$('<td>').addClass('value').text(order_id).appendTo(tr_node);
														tr_node.appendTo(tbody_node);						
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('Имя').appendTo(tr_node);
														$('<td>').addClass('value').text(name).appendTo(tr_node);
														tr_node.appendTo(tbody_node);
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('Контакт').appendTo(tr_node);
														$('<td>').addClass('value').text(contact).appendTo(tr_node);
														tr_node.appendTo(tbody_node);
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('Инструмент').appendTo(tr_node);
														$('<td>').addClass('value').text(security.toUpperCase()+'™').appendTo(tr_node);
														tr_node.appendTo(tbody_node);
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('Номинал').appendTo(tr_node);
														$('<td>').addClass('value').text(par).appendTo(tr_node);
														tr_node.appendTo(tbody_node);
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('Количество').appendTo(tr_node);
														$('<td>').addClass('value').text(quantity).appendTo(tr_node);
														tr_node.appendTo(tbody_node);
														tr_node = $('<tr>');
														$('<td>').addClass('field').text('Коментарий').appendTo(tr_node);
														$('<td>').addClass('value').text(comment).appendTo(tr_node);
														tr_node.appendTo(tbody_node);
														tbody_node.appendTo(table_node);
														html_node.append(message_node);
														html_node.append(table_node);
														efx.showMessageBox({ captionText: 'Заявка успешно отправлена', bodyHtml: html_node, controlsOkay: true });
														modal_node.remove();
													});
										});
							});
					}
					else
					{
						efx.showMessageBox({ captionText: 'Ошибка', bodyHtml: message_node, controlsOkay: true });
					}
				});
			$('body').css({ maxHeight: '100vh', overflow: 'hidden' });
			$('body').append(modal_node);
		})
});
am4core.ready(function(){});