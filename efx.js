efx = {};
efx.responsive = ($(window).width() > 992) ? 'desktop' : 'mobile';
efx.showDatePicker = 
	function(o = {})
	{
		let target;
		if(o.targetNode !== undefined)
		{
			target = $(o.targetNode);
		}
		if(o.targetSelector !== undefined)
		{
			target = $(o.targetSelector);
		}
		let weekdays_js = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		let weekdays_ru = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		let months_ru = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
		let caption_text = 'Выберите дату';
		function makeEfxDate(o)
		{
			let efxd = {};
			if(o === undefined)
			{
				efxd.jsd = new Date();
			}
			else
			{
				efxd.jsd = new Date(o.yyyy, o.mm, o.dd);
			}
			efxd.dd = efxd.jsd.getDate();
			efxd.mm = efxd.jsd.getMonth();
			efxd.yyyy = efxd.jsd.getFullYear();
			efxd.days = (new Date(efxd.yyyy, efxd.mm + 1, 0)).getDate();
			efxd.firstDay = mapDay((new Date(efxd.yyyy, efxd.mm, 1)).getDay());
			efxd.lastDay = mapDay((new Date(efxd.yyyy, efxd.mm, efxd.days)).getDay());
			efxd.display = months_ru[efxd.mm] + ' ' + efxd.yyyy;
			return efxd;
		}
		function mapDay(day)
		{
			return (day === 0) ? 6 : day - 1;
		}
		function dayStr(day)
		{
			return weekdays_ru[day % weekdays_ru.length];
		}
		function isoStr(yyyy, mm, dd)
		{
			return String(yyyy) + '-' + String(mm + 1).padStart(2, '0') + '-' + String(dd).padStart(2, '0');
		}
		function displayDays(shift = 0)
		{
			let curr  = makeEfxDate();
			if(shift !== 0)
			{
				curr = makeEfxDate(
					{
						yyyy: curr.yyyy,
						mm: curr.mm + shift,
						dd: curr.dd
					});
			}
			let prev = makeEfxDate(
				{
					yyyy: curr.yyyy,
					mm: curr.mm,
					dd: 0
				});
			let next = makeEfxDate(
				{
					yyyy: curr.yyyy, 
					mm: curr.mm + 1, 
					dd: 1
				});
			// console.log(prev);
			// console.log(curr);
			// console.log(next);
			let days = [];
			let weekday_cntr = curr.firstDay;
			if(prev.lastDay !== weekdays_ru.indexOf('Вс'))
			{
				// console.log('prev.days: ' + prev.days);
				// console.log('prev.lastDay: ' + prev.lastDay);
				weekday_cntr = 0;
				for(let i = prev.days - prev.lastDay; i <= prev.days; i++, weekday_cntr++)
				{
					days.push(
						{
							date: i,
							weekday: dayStr(weekday_cntr),
							type: 'prev'
						});
				}
			}
			for(let i = 1; i <= curr.days; i++, weekday_cntr++)
			{
				days.push(
					{
						date: i,
						weekday: dayStr(weekday_cntr),
						type: 'curr'
					});
			}
			for(let i = 1; i <= weekdays_ru.indexOf('Вс') - curr.lastDay; i++, weekday_cntr++)
			{
				days.push(
					{
						date: i,
						weekday: dayStr(weekday_cntr),
						type: 'next'
					});
			}
			display_node.html(curr.display);
			grid_node.empty();
			for(let i = 0; i < weekdays_ru.length; i++)
			{
				let item_node = $('<div>').addClass('header').html(weekdays_ru[i]);
				grid_node.append(item_node);
			}
			for(let i = 0; i < days.length; i++)
			{
				let item_node = $('<div>').addClass('item').addClass(days[i].type);
				if(days[i].weekday === 'Сб' || days[i].weekday === 'Вс')
				{
					item_node.addClass('weekend');
				}
				item_node.html(days[i].date);
				item_node.on('click',
					function(e)
					{
						let date = isoStr(curr.yyyy, curr.mm, days[i].date);
						if(target !== undefined)
						{
							// console.log(date);
							target.val(date).trigger('input');
						}
						modal_node.remove();
					})
				grid_node.append(item_node);
			}
		}
		let shift = 0;
		//
		// UI
		// 
		let modal_node = $('<div>').addClass('modal').addClass('date-picker');
		let window_node = $('<div>').addClass('window');
		let caption_node = $('<div>').addClass('caption');
		let icon_node = $('<img>').attr('src', '/images/icon.ekonom.logo.svg').addClass('icon');
		let text_node = $('<div>').addClass('text').html(caption_text);
		let close_node = $('<img>').attr('src', '/images/icon.close.svg').addClass('close');
		close_node.on('click', (e) => modal_node.remove());
		let body_node = $('<div>').addClass('body');
		let controls_node = $('<div>').addClass('controls');
		let prev_node = $('<button>').addClass('prev').on('click', (e) => displayDays(--shift));
		let display_node = $('<div>').addClass('display');
		let next_node = $('<button>').addClass('next').on('click', (e) => displayDays(++shift));
		let grid_node = $('<div>').addClass('grid');
		displayDays(shift);
		controls_node.append(prev_node);
		controls_node.append(display_node);
		controls_node.append(next_node);
		body_node.append(controls_node);
		body_node.append(grid_node);
		caption_node.append(icon_node);
		caption_node.append(text_node);
		caption_node.append(close_node);
		window_node.append(caption_node);
		window_node.append(body_node);
		modal_node.append(window_node);
		$('body').append(modal_node);
		// console.log(days);
	};
efx.showTicker = 
	function(o = {})
	{
		if(o.displayFxName === undefined)
		{
			o.displayFxName = true;
		}
		if(o.displayDate === undefined)
		{
			o.displayDate = true;
		}
		if(o.duplicateFrame === undefined)
		{
			o.duplicateFrame = true;
		}
		if(o.targetNode === undefined)
		{
			o.targetNode = $('body');
		}
		if(o.animationSpeed === undefined)
		{
			o.animationSpeed = 30000;
		}
		let ajax_url = 'ajax.ticker.php';
		let ticker_node = $('<div>').addClass('efx-ticker');			
		let frame_node = $('<div>').addClass('frame');
		$.ajax(
			{
				url: ajax_url,
				method: 'post',
				data: null,
				dataType: 'json'
			})
			.done(
				function(response)
				{
					// console.log(response);
					if(response.status === 'success')
					{
						for(let item of response.data)
						{
							let item_node = $('<div>').addClass('item').addClass(item.type);
							if(item.type === 'quote')
							{
								item.value.forward_rate = Number(item.value.forward_rate).toLocaleString(undefined, { minimumFractionDigits: 4 });
								item.value.change = Number(item.value.change).toLocaleString(undefined, { minimumFractionDigits: 2 });
								let pair_node = $('<div>').addClass('pair');
								let rate_node = $('<div>').addClass('rate');
								let change_node = $('<div>').addClass('change');
								let hidden_node = $('<input>').attr('type', 'hidden').attr('name', 'url');
								pair_node.html(item.value.x_from + '&nbsp;/&nbsp;' + item.value.x_to);
								rate_node.html(item.value.forward_rate);
								change_node.html(item.value.change + '%');
								if(item.value.change == 0)
								{
									change_node.addClass('flat');
								}
								if(item.value.change > 0)
								{
									change_node.addClass('up');
								}
								if(item.value.change < 0)
								{
									change_node.addClass('down');
								}
								hidden_node.val('https://fx.ekonom.spb.ru/?x_from='+item.value.x_from+'&x_to='+item.value.x_to);
								item_node.append(pair_node);
								item_node.append(rate_node);
								item_node.append(change_node);
								item_node.append(hidden_node);
							}
							if(item.type === 'fxname' && o.displayFxName === true)
							{
								item_node.html(item.value);
							}
							if(item.type === 'date' && o.displayDate === true)
							{
								item_node.html(item.value);
							}
							frame_node.append(item_node);
						}
						ticker_node.append(frame_node);
						o.targetNode.css('overflow', 'hidden').append(ticker_node);
						let ticker_width = ticker_node.width();
						let frame_width = frame_node.width();
						// console.log('ticker_width: ' + ticker_width);
						// console.log('frame_width: '+ frame_width);
						let frames = Math.round(ticker_width / frame_width) + 2;
						// console.log('frames: ' + frames);
						for(let i = 1; i < frames; i++)
						{
							ticker_node.append(frame_node.clone());
						}
						frames = ticker_node.find('div.frame');
						frames.find('div.item.quote').on('click',
							function(e)
							{
								window.location = $(this).children('input[name="url"]').val();
							});
						function repeatFrame()
						{
							let first_frame = frames.eq(0);
							let last_frame = frames.last();
							frames.css('left', '0px');
							first_frame.insertAfter(last_frame);
						}
						function doAnimation()
						{
							frames.animate(
									{'left': '-'+frame_width+'px'}, 
									o.animationSpeed, 
									'linear', 
									function()
									{
										// console.log('doAnimation Callback');
										repeatFrame();
										doAnimation();
									});
						}
						doAnimation();
					}
				});
	};
efx.showNewsTicker = 
	function(o = {})
	{
		if(o.targetNode === undefined)
		{
			o.targetNode = $('body');
		}
		if(o.animationSpeed === undefined)
		{
			o.animationSpeed = 60000;
		}
		let ticker_node = $('<div>').addClass('efx-news-ticker');
		$.ajax(
			{
				url: '/ajax.newsticker.php',
				method: 'post',
				data: null,
				dataType: 'json'
			})
		.done(
			function(response)
			{
				// console.log(response);
				if(response.status === 'success')
				{
					let frame_node = $('<div>').addClass('frame');
					for(let item of response.data)
					{
						let item_node = $('<div>').addClass('item');
						/*
						if(response.data.length > 1)
						{
							item_node.css('border-right', '2px solid white');
						}
						*/
						item_node.css('border-right', '2px solid white');
						item_node.html(item.message);
						let hidden_node = $('<input>').attr('type', 'hidden').attr('name', 'url').val(item.url);
						item_node.append(hidden_node);
						frame_node.append(item_node);
					}
					ticker_node.append(frame_node);
					o.targetNode.append(ticker_node);
					let frame_width = frame_node.width();
					let ticker_width = ticker_node.width();
					let frames_count = Math.round(ticker_width / frame_width) + 2;
					// console.log('frames_count: ' + frames_count);
					for(let i = 1; i < frames_count; i++)
					{
						ticker_node.append(frame_node.clone());
					}
					frames = ticker_node.find('div.frame');
					frames.find('div.item').on('click',
						function(e)
						{
							let url = $(this).children('input[name="url"]').val();
							if(url !== null)
							{
								window.location = url;
							}
						});
					function repeatFrame()
					{
						let first_frame = frames.eq(0);
						let last_frame = frames.last();
						frames.css('left', '0px');
						first_frame.insertAfter(last_frame);
					}
					function doAnimation()
					{
						frames.animate(
							{'left': '-'+frame_width+'px' },
							o.animationSpeed,
							'linear',
							function()
							{
								repeatFrame();
								doAnimation();
							});
					}
					doAnimation();
				}
			});
		// console.log('Efx News Ticker');
	}
efx.showMessageBox =
	function(o = {})
	{
		if(o.captionText === undefined)
		{
			o.captionText = ''
		}
		if(o.bodyHtml === undefined)
		{
			o.bodyHtml = '';
		}
		if(o.controlsOkay === undefined)
		{
			o.controlsOkay = false;
		}
		if(o.closeCallback === undefined)
		{
			o.closeCallback = function(){};
		}
		let zIndex = 0;
		let modals = $('body > .modal');
		if(modals.length > 0)
		{
			zIndex = Number(modals.last().css('zIndex')) + 100;
		}
		else
		{
			zIndex = Number($('header').css('zIndex')) + 100;
		}
		let modal_node = $('<div>').addClass('modal').addClass('message-box').css('zIndex', zIndex);
		function close()
		{
			if(modals.length === 0)
			{
				$('body').css({ maxHeight: 'unset', overflow: 'unset' });
			}
			modal_node.remove();
			o.closeCallback();
		}
		let window_node = $('<div>').addClass('window');
		let caption_node = $('<div>').addClass('caption');
		let icon_node = $('<img>').addClass('icon').attr('src', '/images/icon.ekonom.logo.svg');
		let text_node = $('<div>').addClass('text').text(o.captionText);
		let close_node = $('<img>').addClass('close').attr('src', '/images/icon.close.svg');
		close_node.on('click', (e) => close());
		let body_node = $('<div>').addClass('body');
		caption_node.append(icon_node);
		caption_node.append(text_node);
		caption_node.append(close_node);
		body_node.append(o.bodyHtml);
		if(o.controlsOkay === true)
		{
			let controls_node = $('<div>').addClass('controls');
			let okay_node = $('<button>').addClass('okay').text('ОК').on('click', (e) => close());
			controls_node.append(okay_node);
			body_node.append(controls_node);
		}
		window_node.append(caption_node);
		window_node.append(body_node);
		modal_node.append(window_node);
		$('body').css({ maxHeight: '100vh', overflow: 'hidden' });
		modal_node.appendTo('body');
	}
$(function()
{
})


