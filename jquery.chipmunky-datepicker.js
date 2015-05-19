/**
 * Datepicker v1.0
 * by Chipmunky - http://chipmunky.com/
 *
 * @license http://chipmunky.com/
 * - Free for personal and commercial use
 * - Thank you leave the author name, link and information license intact
 */

(function($) {
	$.fn.chipmunkyDatepicker = function(params) {
		return this.each(function () {
			// Params
			params = $.extend({
				classDatepickerWrapper: 'chipmunkyDatepicker',
				dateFormat: 'yyyy/mm/dd',
				months: [
					'Janvier',
					'Février',
					'Mars',
					'Avril',
					'Mai',
					'Juin',
					'Juillet',
					'Aout',
					'Septembre',
					'Octobre',
					'Novembre',
					'Décembre',
				],
				weekDays: [
					'Lundi',
					'Mardi',
					'Mercredi',
					'Jeudi',
					'Vendredi',
					'Samedi',
					'Dimanche',
				],
				weekAbstractDays: [
					'Lun',
					'Mar',
					'Mer',
					'Jeu',
					'Ven',
					'Sam',
					'Dim',
				],
				keyboardControls: true,
				replaceInput: true,
				disablePastDate: false,
				unavailableWeekDays: {},
				unavailableDates: {},
			}, params);
			
			var datepicker = {
				currentYear: false,
				currentMonth: false,
				currentDate: false,
				todayDate:false,
				selectedDate: false,
				weekDayIds: {
					0: 7,
					1: 1,
					2: 2,
					3: 3,
					4: 4,
					5: 5,
					6: 6,
				},
				init: function(e) {
					this.input = e;
					if (params.replaceInput) {
						this.input.hide();
					}
					this.datepickerWrapper = $('<div/>').addClass(params.classDatepickerWrapper).insertAfter(this.input);
									
					this.todayDate = new Date();
					this.todayDate.setHours(0);
					this.todayDate.setMinutes(0);
					this.todayDate.setSeconds(0);
					this.todayDate.setMilliseconds(0);
					
					this.selectedDate = new Date();
					this.selectedDate.setHours(0);
					this.selectedDate.setMinutes(0);
					this.selectedDate.setSeconds(0);
					this.selectedDate.setMilliseconds(0);
					
					this.unavailableDates = new Array();
					if (params.unavailableDates.length>0) {
						$.each(params.unavailableDates, function(k, date) {
							var disablededDate = new Date(date);
							disablededDate.setHours(0);
							disablededDate.setMinutes(0);
							disablededDate.setSeconds(0);
							disablededDate.setMilliseconds(0);
							datepicker.unavailableDates.push(disablededDate);
						});
					}
					
					if (e.val()) {
						this.setCurrentDate(e.val());
					}
					
					this.buildMonthsNav();
					this.buildMonthName();
					this.buildMonth();
				},
				buildMonthsNav: function() {
					var monthsNav = $('<ul/>').addClass('monthsNav').appendTo(this.datepickerWrapper);
					$('<li/>').addClass('prev').click(function() {
						datepicker.selectPrevMonth();
					}).appendTo(monthsNav);
					$('<li/>').addClass('next').click(function() {
						datepicker.selectNextMonth();
					}).appendTo(monthsNav);
				},
				selectPrevMonth: function() {
					if (this.selectedDate.getMonth() == 1) {
						this.selectedDate.setMonth(12);
						this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1);
					} else {
						this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
					}
					this.buildMonthName();
					this.buildMonth();
				},
				selectNextMonth: function() {
					if (this.selectedDate.getMonth() == 12) {
						this.selectedDate.setMonth(1) = 1;
						this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1);
					} else {
						this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
					}
					this.buildMonthName();
					this.buildMonth();
				},
				buildMonthName: function() {
					if (!this.monthName) {
						this.monthName = $('<div/>').addClass('monthName').appendTo(this.datepickerWrapper);
					}
					this.monthName.text(params.months[this.selectedDate.getMonth()] + ' ' + this.selectedDate.getFullYear());
				},
				buildMonth: function(){
					// Callendar
					if (!this.month) {
						this.month = $('<table/>').addClass('monthDays').appendTo(this.datepickerWrapper);
						var weekDays = $('<tr/>').appendTo($('<thead/>').appendTo(this.month));
						for (var d = 0; d < 7; d++) {
							$('<td/>').text(params.weekAbstractDays[d]).appendTo(weekDays);
						}
					} else {
						this.month.find('tbody').empty();
					}
					
					var monthSelected = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 0, 0, 0, 0, 0);
					var monthDays = monthSelected.getDate();
					var monthFirstDay = this.weekDayIds[new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1, 0, 0, 0, 0).getDay()];
					var nbCells = 0;
					this.monthDays = $('<tbody/>').appendTo(this.month);
					for (var d = 1; d < monthDays; d++) {
						if (nbCells == 0 || nbCells%7 == 0) {
							this.monthWeekDays = $('<tr/>').appendTo(this.monthDays);
						}
						var monthDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), d, 0, 0, 0, 0);
						if (d == 1 && monthFirstDay != 1) {
							for (var lmd = 1; lmd < monthFirstDay; lmd++) {
								$('<td/>').addClass('lastMonth').appendTo(this.monthWeekDays);
								nbCells++;
							}
						}
						var day = $('<td/>').text(d).data('date', this.formatDate(monthDate)).appendTo(this.monthWeekDays);
						var dayAvailable = 1;
						
						// Is current date
						if (this.todayDate.getTime() == monthDate.getTime()) {
							day.addClass('current');
						} else {
							// is past date
							if (params.disablePastDate) {
								if (this.todayDate.getTime() > monthDate.getTime()) {
									dayAvailable = 0;
								}
							}
						}
						
						// is disabled wek day
						if (params.unavailableWeekDays.length>0) {
							$.each(params.unavailableWeekDays, function(k, disabledWeekDay) {
								if (disabledWeekDay == datepicker.weekDayIds[monthDate.getDay()]) {
									dayAvailable = 0;
								}
							});
						}
						
						// is disabled date
						if (this.unavailableDates.length>0) {
							$.each(this.unavailableDates, function(k, disabledDate) {
								if (disabledDate.getTime() == monthDate.getTime()) {
									dayAvailable = 0;
								}
							});
						}
						
						// is selected day
						if (this.currentDate && this.currentDate.getTime() == monthDate.getTime()) {
							day.addClass('selected');
						}
						
						if (dayAvailable) {
							day.addClass('available').click(function() {
								datepicker.setCurrentDate($(this).data('date'));
								datepicker.input.val($(this).data('date')).trigger('change');
								$(datepicker.month).find('td').removeClass('selected');
								$(this).addClass('selected');
							});
						} else {
							day.addClass('unavailable');
						}
						
						// disable old days
						nbCells++;
						if (d == monthDays-1 && nbCells % 7 != 0) {
							while (nbCells % 7 != 0) {
								$('<td/>').addClass('nextMonth').appendTo(this.monthWeekDays);
								nbCells++;
							}
						}
					}
				},
				formatDate: function(date) {
					var year = date.getFullYear();
					var month = date.getMonth()+1;
					if (month < 10) {
						month = '0' + month;
					}
					var day = date.getDate();
					if (day < 10) {
						day = '0' + day;
					}
					
					switch (params.dateFormat) {
						case 'yyyy-mm-dd':
							return year + '-' + month + '-' + day;
						break;
						case 'yyyy/mm/dd':
							return year + '/' + month + '/' + day;
						break;
						case 'dd-mm-yyyy':
							return day + '-' + month + '-' + year;
						break;
						case 'dd/mm/yyyy':
							return day + '/' + month + '/' + year;
						break;
					}
				},
				setCurrentDate: function(date) {
					if (!date) {
						date = this.formatDate(this.todayDate);
					}
					this.currentDate = new Date(date);
					this.currentDate.setHours(0);
					this.currentDate.setMinutes(0);
					this.currentDate.setSeconds(0);
					this.currentDate.setMilliseconds(0);
					
					this.selectedDate = new Date(date);
					this.selectedDate.setHours(0);
					this.selectedDate.setMinutes(0);
					this.selectedDate.setSeconds(0);
					this.selectedDate.setMilliseconds(0);
				},
			};
			
			// Init datepickers
			datepicker.init($(this));
        });
	};
}( jQuery ));