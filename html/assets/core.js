"use strict";

var domain = {};
var recycle = {};
recycle.three = () => {
  while (scene !== undefined && scene.children.length) {
		// var child = scene.children[0];
		// if (child.type == "Mesh") {
		// 	var mesh = child;
		// 	mesh.geometry.dispose();
		// 	mesh.geometry = undefined;
		// 	if (mesh.material.map) {
		// 		mesh.material.map.dispose();
		// 		mesh.material.map = undefined;
		// 	}
		// 	mesh.material.dispose();
		// 	mesh.material = undefined;
		// 	scene.remove(mesh);
		// }
		// else if (child.type == "Scene") {
		// 	scene.remove(child);
		// }
		// else {

		// }
		scene.remove(scene.children[0]);
  }
  console.log("three recycled");
}
var renderer;
var scene;
var lists = {};
var animes = {};
var showdown = new showdown.Converter({
	openLinksInNewWindow: true,
	tasklists: true
});
var scrolled;
var apiKey = {
	"braytech": "5afd1373be0bc"
}
var timed = false;
var index = {
	"s": false,
	"d": "challenges"
};

window.addEventListener("scroll", () => {
	scrolled = true;
});

domain.state = () => {
	if (document.location.pathname == "/") {
		return index;
	}
	else {
		return {
			"s": false,
			"d": document.location.pathname.match(/\/([a-zA-Z0-9._-]+)\/?.*/)[1]
		};
	}
}

document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
    document.title = "CLOVIS BRAY";
  } else  {
    var nn = domain.state().d;
		nn = nn.replace(/[_]/g, " ");
		document.title = nn.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
});

domain.sentinel = (target) => {

	var target = target ? target : "main";
	
	$.each($(target + " .image:not(.d)"), function() {

		var i = $(this);

		var top_of_element = i[0].getBoundingClientRect().top;
		var bottom_of_element = i[0].getBoundingClientRect().top + i[0].offsetHeight;
		var bottom_of_screen = document.body.scrollTop + window.innerHeight;

		if (bottom_of_screen >= top_of_element) {
			var itemImgLoaded = () => {
				i.css("background-image",`url("${ itemImg.src }")`);
				i.attr("data-width",itemImg.width);
				i.attr("data-height",itemImg.height);
				i.attr("data-ratio",(itemImg.width > itemImg.height ? (itemImg.height / itemImg.width) : (itemImg.width / itemImg.height)));
				if (i.hasClass("padding")) {
					i.css("padding-bottom",((itemImg.width > itemImg.height ? (itemImg.height / itemImg.width) : (itemImg.height / itemImg.width)) * 100) + "%");
				}
				i.addClass("d");
			}
			var itemImg = new Image();
			itemImg.onload = itemImgLoaded;
			itemImg.src = window.devicePixelRatio == 1 ? i.attr("data-1x") : i.attr("data-2x");
		}
		
	});

}

domain.inject = () => {
	var load = 0;
	var dir = domain.state().s ? domain.state().s : domain.state().d;
	var ht = $.ajax({
    url: "/" + dir + "/model.php",
    method: "get",
		cache: false,
    dataType: "html"
  }).then();
	var cs = $.ajax({
    url: "/" + dir + "/style.css",
		method: "get",
		cache: false,
    dataType: "text"
	}).then();
	var js = $.ajax({
    url: "/" + dir + "/script.js",
    method: "get",
		cache: false,
    dataType: "script"
	}).then();
  $.when(ht, cs, js).then(function(ht, cs, js) {
		var p = $("main").data("current");
		var e = domain.state().d.replace(/[^a-zA-Z0-9_]/g, "");
		
		$("main").empty();
		$("main").data("current",e);
		$("main").append("<style>" + cs[0] + "</style>");
		$("main").append(ht[0]);
		domain.rim(e);
	});
}

domain.status = () => {
	ga('set', 'page', document.location.pathname);
	ga('send', 'pageview');
	$("html").addClass("stateChange");
	var nn = domain.state().d;
			nn = nn.replace(/[_]/g, " ");
	document.title = nn.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	domain.inject();
}

domain.rim = function(g) {
	domain[g.replace(/[^a-zA-Z0-9_]/g, "")]();
	$("html").removeClass("stateChange");

	$(`header ul li a`).removeClass("active");
	if (domain.state().d == "challenges") {
		$(`header ul li a[href="/"]`).addClass("active");
	}
	else {
		$(`header ul li a[href="/${ document.location.pathname.match(/\/([a-zA-Z0-9._-]+)\/?.*/)[1] }/"]`).addClass("active");
	}

}

domain.run = () => {

	domain.status();

	setInterval(() => {
		if (scrolled) {
			domain.sentinel();
			scrolled = false;
		}
	}, 250);

	$(document).on("ajaxStart", function() {
		$("html").addClass("loading");
	});

	$(document).on("ajaxStop", function() {
		$("html").removeClass("loading");
	});
	
	$(window).on("mousemove", function(e) {
		var x = e.pageX;
		var y = e.pageY;
		
		$("body > .spinner").css({
			"top": `${ y }px`,
			"left": `${ x }px`
		});
	});

}

window.onpopstate = function(e) {
	if (domain.state().d != $("main").data("current")) {
		domain.status();
	}
	else if (domain.state().d == $("main").data("current")) {
		domain[domain.state().d.replace(/[^a-zA-Z0-9_]/g, "")]();
		ga('set', 'page', document.location.pathname);
		ga('send', 'pageview');
	}
	else {

	}
};

domain.utils = () => {

}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
domain.utils.rgbToHsl = (r, g, b) => {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
domain.utils.hslToRgb = (h, s, l) => {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

$(document).ready(() => {

	console.log('Running...');

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	domain.run();

	$("header .trigger").on("click", function(e) {
		e.preventDefault();

		$("header").toggleClass("display");

	});

	$("header h1 a, header ul li a").on("click", function(e) {
    e.preventDefault();
    
    var t = $(this).attr("href");
    
    history.pushState(t, t, t);

		if (domain.state().d != $("main").data("current")) {
			domain.status();
		}
		else if (domain.state().d == $("main").data("current")) {
			domain[domain.state().d.replace(/[^a-zA-Z0-9_]/g, "")]();
			ga('set', 'page', document.location.pathname);
			ga('send', 'pageview');
		}
		else {
	
		}

		$("header").removeClass("display");

	});

});