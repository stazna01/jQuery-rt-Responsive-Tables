/* jQuery rt Responsive Tables - v1.0.2 - 2014-07-07
* https://github.com/stazna01/jQuery-rt-Responsive-Tables
*
* This plugin is built heavily upon the work by Chris Coyier
* found at http://css-tricks.com/responsive-data-tables/
*
* Copyright (c) 2014 Nathan Stazewski; Licensed MIT */

(function ( $ ) {
$.fn.rtResponsiveTables = function( options ) {
	// This is the easiest way to have default options.
	var settings = $.extend({
		// These are the defaults.
		containerBreakPoint: 0 //allows a user to force the vertical mode at a certain pixel width of its container, in the case when a table may technically fit but you'd prefer the vertical mode
		}, options );
		
	rtStartingOuterWidth = $(window).width(); //used later to detect orientation change across all mobile browsers (other methods don't always work on Android)
	is_iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent ); //needed due to the fact that iOS scrolling causes false resizes
	rt_responsive_table_object = this;
	function isEmpty( el ){
		return !$.trim(el.html())
		}
		
	function rt_write_css(rt_class_identifier) {
		rt_css_code = '<style type="text/css">';
		$(rt_class_identifier).find('th').each(function(index, element) {
			rt_css_code += rt_class_identifier +'.rt-vertical-table td:nth-of-type('+(index+1)+'):before { content: "'+$(this).text()+'"; }';
			});
		rt_css_code += '</style>';
		$(rt_css_code).appendTo('head');
		}
		
	function determine_table_width (rt_table_object) { //outerWidth doesn't work properly in Safari if the table is overflowing its container
		rt_table_width = 0;
		if(rt_table_object.hasClass('rt-vertical-table')) {
			rt_table_width = rt_table_object.outerWidth();
			} else {
				rt_table_object.find('th').each(function(index, element) {
					rt_table_width += $(this).outerWidth();
					});
				rt_table_width = rt_table_width; //this seems to fix a rounding bug in firefox
				}
		return rt_table_width;
		}
	
	function fix_responsive_tables() {
		if ($("table.rt-responsive-table").length) {
			
			$("table.rt-responsive-table").each(function( index ) {
				rt_containers_width = $(this).parent().width();
				rt_current_width = determine_table_width($(this))-1;  //this "-1" seems to fix an issue in firefox without harming any other browsers
				rt_max_width = $(this).attr('data-rt-max-width');
				rt_has_class_rt_vertical_table = $(this).hasClass('rt-vertical-table');
				
				if ($(this).attr("data-rtContainerBreakPoint")) {
					rt_user_defined_container_breakpoint = $(this).attr("data-rtContainerBreakPoint");
					} else {
						rt_user_defined_container_breakpoint = settings.containerBreakPoint;
						}
				
				if (rt_containers_width < rt_current_width || rt_containers_width <= rt_user_defined_container_breakpoint) { //the parent element is less than the current width of the table or the parent element is less than or equal to a user supplied breakpoint
					$(this).addClass('rt-vertical-table'); //switch to vertical orientation (or at least keep it that orientation)
					
					if(rt_max_width > rt_current_width && rt_max_width > rt_user_defined_container_breakpoint) { //the max width was set too high and needs to be adjusted to this lower number
							$(this).attr('data-rt-max-width', rt_current_width);
							} else if (rt_max_width > rt_current_width && rt_max_width <= rt_user_defined_container_breakpoint) { //same as above but in this case the breakpoint is larger or equal so it needs to be set as the max width
								$(this).attr('data-rt-max-width', rt_user_defined_container_breakpoint);
								}
							
					} else if (rt_containers_width > rt_max_width && rt_containers_width > rt_user_defined_container_breakpoint) { //the parent element is bigger than the max width and user supplied breakpoint
						$(this).removeClass('rt-vertical-table');  //switch to horizontal orientation (or at least keep it that orientation)
						
						if((rt_max_width > rt_current_width && !rt_has_class_rt_vertical_table) && (rt_max_width > rt_user_defined_container_breakpoint && !rt_has_class_rt_vertical_table)) { //max width is greater than the table's current width and it's in horizontal mode currently...so the max width was set to low and needs to be adjusted to a higher number
							$(this).attr('data-rt-max-width', rt_current_width);
							} else if((rt_max_width > rt_current_width && !rt_has_class_rt_vertical_table) && (rt_max_width <= rt_user_defined_container_breakpoint && !rt_has_class_rt_vertical_table)) { //same as above but in this case the user supplied breakpoint is larger or equal so it needs to be set as the max width
								$(this).attr('data-rt-max-width', rt_user_defined_container_breakpoint);
								}
							
						} else { //equal
								
								}
				});			
			}
		}
		
	rt_responsive_table_object.each(function(index, element) {
		$(this).addClass('rt-responsive-table-'+index).addClass('rt-responsive-table');
		if (index == rt_responsive_table_object.length-1) {
			$(window).resize(function() {
				if(!is_iOS || (is_iOS && (rtStartingOuterWidth !== $(window).width()))) {
					rtStartingOuterWidth = $(window).width(); //MUST update the starting width so future orientation changes will be noticed
					fix_responsive_tables();
					}
				});
			rt_responsive_table_count = $('table.rt-responsive-table').length;
			$('table.rt-responsive-table').each(function(index2, element2) {
				rt_write_css('table.rt-responsive-table-'+index2);
				$('table.rt-responsive-table-'+index2).attr('data-rt-max-width', determine_table_width($(this)));
				$(this).find("td,th").each(function(index3, element3) { //empty td tags made them disappear
                    if (isEmpty($(this))) {
						$(this).html("&#160;");
						}
                	});
				if (rt_responsive_table_count - 1 == index2) {
					fix_responsive_tables();
					}
				});
			}
		});
		
	return this;
	};
}( jQuery ));