function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

// Main Navigation
var FluidNav = {
	init: function() {
		$("a[href*=#]").click(function(e) {
			e.preventDefault();
			if($(this).attr("href").split("#")[1]) {
				FluidNav.goTo($(this).attr("href").split("#")[1], $(this).attr("href").split("#")[2]);
			}
		});

		FluidNav.goTo(window.location.hash.substring() != "" ? window.location.hash.split("#")[1] : "login", window.location.hash.substring() != "" ? window.location.hash.split("#")[2] : "");
	},
	goTo: function(page, section) {
		if (page != $(".page.current").attr("id")) {
			var next_page = $("#"+page);
			var nav_item = $('nav ul li a[href="#'+page+'"]');


			$("nav ul li").removeClass("current");
			nav_item.parent().addClass("current");
			FluidNav.resizePage((next_page.height() + 40), true, function() {
				 $(".page").removeClass("current"); next_page.addClass("current");
			});
			$(".page").fadeOut(500);
			next_page.fadeIn(500);

			next_page.find(".focus").focus().select();

			if (nav_item.length == 0)
				return false;

			FluidNav.centerArrow(nav_item);
		} else {
			$(".page.current .focus").focus().select();
		}

		if (section) {
            var tab_container = $(".tabs ul.nav li a."+section).parent().parent().parent();
    		$(".tabs ul.nav li a."+section).parent().parent().find("li").removeClass("current");
    		$(".tabs ul.nav li a."+section).parent().addClass("current");
    		$(".pane", tab_container).hide();
    		$("#"+$(".tabs ul.nav li a."+section).attr("class")+".pane", tab_container).show();
    		tab_container.find(".focus").focus().select();
        }
			//$(".tabs ul.nav li a."+section).click();
	},
	centerArrow: function(nav_item, animate) {
		var left_margin = (nav_item.parent().position().left + nav_item.parent().width()) + 24 - (nav_item.parent().width() / 2);
		if(animate != false) {
			$("nav .arrow").animate({
				left: left_margin - 8
			}, 500, function() { $(this).show(); });
		} else {
			$("nav .arrow").css({ left: left_margin - 8 });
		}
	},
	resizePage: function(size, animate, callback) {
		if(size) { var new_size = size; } else { var new_size = $(".page.current").height() + 40; }
		if(!callback) { callback = function(){}; }
		if(animate) {
			$("#pages").animate({ height: new_size }, 400, function() { callback.call(); });
		} else {
			$("#pages").css({ height: new_size });
		}
	}
};

// Fix page height and nav on browser resize
$(window).resize(function() {
		FluidNav.resizePage();
		FluidNav.centerArrow($("nav ul li.current a"), false);
});

$(document).ready(function() {

	// Initialize navigation
	setTimeout(FluidNav.init, 10);

	// Home slider
	$("#slider").echoSlider({
		effect: "slide", // Default effect to use, supports: "slide" or "fade"
		easing: true, // Easing effect for animations
		pauseTime: 4000, // How long each slide will appear
		animSpeed: 500, // Speed of slide animation
		manualAdvance: false, // Force manual transitions
		pauseOnHover: true, // Pause on mouse hover
		controlNav: true, // Show slider navigation
		swipeNav: true // Enable touch gestures to control slider
	});

	// Drop down menus
	$("header nav ul li").hover(function() {
		if($(this).find("ul").size != 0) {
			$(this).find("ul:first").stop(true, true).fadeIn("fast");
		}
	}, function() {
		$(this).find("ul:first").stop(true, true).fadeOut("fast");
	});

	$("header nav ul li").each(function() {
		$("ul li:last a", this).css({ 'border' : 'none' });
	});

	// Enable mobile drop down navigation
	$("header nav ul:first").mobileMenu();

	// Form hints
	$("label").inFieldLabels({ fadeOpacity: 0.4 });

	$("nav select").change(function() {
		if(this.options[this.selectedIndex].value != "#") {
			var page = this.options[this.selectedIndex].value.split("#")[1];
	 		FluidNav.goTo(page);
			$("html,body").animate({ scrollTop:$('#'+page).offset().top }, 700);
		}
	});

	// Gallery hover
	$(".screenshot_grid div").each(function() {
		$("a", this).append('<span class="hover"></span>');
	});

	$(".screenshot_grid div").hover(function() {
		$("a", this).find(".hover").stop(true, true).fadeIn(400);
	}, function() {
		$("a", this).find(".hover").stop(true, true).fadeOut(400);
	});

	$("a.fancybox").fancybox({
		"transitionIn":			"elastic",
		"transitionOut":		"elastic",
		"easingIn":				"easeOutBack",
		"easingOut":			"easeInBack",
		"titlePosition":		"over",
		"fitToView": 			true,
		"padding":				0,
		"speedIn":      		500,
		"speedOut": 			500,
		"hideOnContentClick":	false,
		"overlayShow":       	false
	});

	// Custom jQuery Tabs
	$(".tabs").find(".pane:last").show().end().find("ul.nav li:last").addClass("current");
	$(".tabs ul.nav li a").click(function() {
		var tab_container = $(this).parent().parent().parent();
		$(this).parent().parent().find("li").removeClass("current");
		$(this).parent().addClass("current");
		$(".pane", tab_container).hide();
		$("#"+$(this).attr("class")+".pane", tab_container).show();
		tab_container.find(".focus").focus().select();
	});

	// Toggle lists
	$(".toggle_list ul li .title").click(function() {
		var content_container = $(this).parent().find(".content");
		if(content_container.is(":visible")) {
			var page_height = $(".page.current").height() - content_container.height();
			FluidNav.resizePage(page_height, true);
			content_container.slideUp();
			$(this).find("a.toggle_link").text($(this).find("a.toggle_link").data("open_text"));
		} else {
			var page_height = $(".page.current").height() + content_container.height() + 40;
			FluidNav.resizePage(page_height, true);
			content_container.slideDown();
			$(this).find("a.toggle_link").text($(this).find("a.toggle_link").data("close_text"));
		}
	});

	$(".toggle_list ul li .title").each(function() {
		$(this).find("a.toggle_link").text($(this).find("a.toggle_link").data("open_text"));
		if($(this).parent().hasClass("opened")) {
			$(this).parent().find(".content").show();
		}
	});

	// Tooltips
	$("a[rel=tipsy]").tipsy({fade: true, gravity: 's', offset: 5, html: true});

	$("ul.social li a").each(function() {
		if($(this).attr("title")) {
			var title_text = $(this).attr("title");
		} else {
			var title_text = $(this).text();
		}
		$(this).tipsy({
				fade: true,
				gravity: 'n',
				offset: 5,
				title: function() {
					return title_text;
				}
		});
	});

	// register user form
	$("#register #user form").submit(function(e) {
		e.preventDefault();

		if ($("#register #user input[name='selected']").length > 0 && $("#register #user input[name='selected']:checked").length == 0) {
			$("#register #user #selectError").text("Please select a character").show("slide");
			return false;
		}

		$("#register #user .error:visible").hide("slide");
		$("#register #user button[type='submit']").attr("disabled", true).addClass("disabled");
		$("#register #user #spinner").show();

		$.ajax({
			url: "register.php",
			type: "POST",
			data: $(this).serialize(),
			dataType: "JSON"
		}).done(function(response) {
			if (response && response.created) {
				$("#register #user form").hide("slide");
				$("#register #user #success").show("slide");
			} else if (response && response.characters) {
				if ($("#register #user input[name='selected']").length > 0) {
					$("#register #user #api_select").hide("slide");
					$("#register #user .selector, #register #user label").remove();
				}

				for (x in response.characters) {
					var character = response.characters[x];
					var radio = "<input type='radio' class='selector' name='selected' id='register_char_"+x+"' value='"+character.characterID+"'>";
					var label = "<label for='register_char_"+x+"'><img src='https://image.eveonline.com/Character/"+character.characterID+"_64.jpg' title='"+character.characterName+"' /></label>";

					$("#register #user #api_select").prepend(radio + label);
				}

				$("#register #user #api_select").show("slide");
                FluidNav.resizePage();
			} else if (response && response.error) {
				if (response.field == "username") {
					$("#register #user #userError").text(response.error).show("slide");
					$("#register #user input[name=username]").select();
				} else if (response.field == "password") {
					$("#register #user #passError").text(response.error).show("slide");
					$("#register #user input[name=password]").select();
				} else if (response.field == "api") {
					$("#register #user #apiError").text(response.error).show("slide");
					$("#register #user input[name=api_key]").select();
				} else if (response.field == "select") {
					$("#register #user #selectError").text(response.error).show("slide");
				}
			}
		}).always(function() {
			$("#register #user #spinner").hide();
			$("#register #user button[type='submit']").removeAttr("disabled").removeClass("disabled");
		});
	});

	$("#login #reg form").submit(function(e) {
		e.preventDefault();

		$("#login #reg .error:visible").hide("slide");
		$("#login #reg button[type='submit']").attr("disabled", true).addClass("disabled");
		$("#login #reg #spinner").show();

		$.ajax({
			url: "login.php",
			type: "POST",
			data: $(this).serialize(),
			dataType: "JSON"
		}).done(function(response) {
			if (response && response.result == "success") {
				window.location = "?system=" + (getUrlParameter("system")?getUrlParameter("system"):"");
			} else if (response && response.error) {
				if (response.field == "username") {
					$("#login #reg #userError").text(response.error).show("slide");
					$("#login #reg input[name=username]").select();
				} else if (response.field == "password") {
					$("#login #reg #passError").text(response.error).show("slide");
					$("#login #reg input[name=password]").select();
				}
			}
		}).always(function() {
			$("#login #reg #spinner").hide();
			$("#login #reg button[type='submit']").removeAttr("disabled").removeClass("disabled");
		});
	});

	$("#login #api form").submit(function(e) {
		e.preventDefault();

		$("#login #api .error:visible").hide("slide");
		$("#login #api button[type='submit']").attr("disabled", true).addClass("disabled");
		$("#login #api #spinner").show();

		$.ajax({
			url: "login.php",
			type: "POST",
			data: $(this).serialize(),
			dataType: "JSON"
		}).done(function(response) {
			if (response && response.result == "success") {
				window.location = "?system=" + (getUrlParameter("system")?getUrlParameter("system"):"");
			} else if (response && response.characters) {
				if ($("#login #api input[name='selected']").length > 0) {
					$("#login #api #api_select").hide("slide");
					$("#login #api .selector, #login #api label").remove();
				}

				for (x in response.characters) {
					var character = response.characters[x];
					var radio = "<input type='radio' class='selector' name='selected' id='login_char_"+x+"' value='"+character.characterID+"'>";
					var label = "<label for='login_char_"+x+"'><img src='https://image.eveonline.com/Character/"+character.characterID+"_64.jpg' title='"+character.characterName+"' /></label>";

					$("#login #api #api_select").prepend(radio + label);
				}

				$("#login #api #api_select").show("slide");
			} else if (response && response.error) {
				if (response.field == "api") {
					$("#login #api #apiError").text(response.error).show("slide");
					$("#login #api input[name=api_key]").select();
				} else if (response.field == "select") {
					$("#login #api #selectError").text(response.error).show("slide");
				}
			}
		}).always(function() {
			$("#login #api #spinner").hide();
			$("#login #api button[type='submit']").removeAttr("disabled").removeClass("disabled");
		});
	});

	$("#register #corp form").submit(function(e) {
		e.preventDefault();

		$("#register #corp .error:visible").hide("slide");
		$("#register #corp button[type='submit']").attr("disabled", true).addClass("disabled");
		$("#register #corp #spinner").show();

		$.ajax({
			url: "register.php",
			type: "POST",
			data: $(this).serialize(),
			dataType: "JSON"
		}).done(function(response) {
			if (response && response.result) {
				$("#register #corp form").hide("slide");
				$("#register #corp #success #name").text(response.character);
				$("#register #corp #success").show("slide");
			} else if (response && response.characters) {
				if ($("#register #corp input[name='selected']").length > 0) {
					$("#register #corp #api_select").hide("slide");
					$("#register #corp .selector, #register #corp label").remove();
				}

				for (x in response.characters) {
					var character = response.characters[x];
					var radio = "<input type='radio' class='selector' name='selected' id='corp_char_"+x+"' value='"+character.characterID+"'>";
					var label = "<label for='corp_char_"+x+"'><img src='https://image.eveonline.com/Character/"+character.characterID+"_64.jpg' title='"+character.characterName+"' /></label>";

					$("#register #corp #api_select").prepend(radio + label);
				}

				$("#register #corp #api_select").show("slide");
			} else if (response && response.error) {
				if (response.field == "api") {
					$("#register #corp #apiError").text(response.error).show("slide");
					$("#register #corp input[name=api_key]").select();
				} else if (response.field == "select") {
					$("#register #corp #selectError").text(response.error).show("slide");
				}
			}
		}).always(function() {
			$("#register #corp #spinner").hide();
			$("#register #corp button[type='submit']").removeAttr("disabled").removeClass("disabled");
		});
	});
});
