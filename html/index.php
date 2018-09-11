<?php

ob_start('ob_gzhandler');

// if (isset($_GET["dev"])) {
// 	setcookie("dev", "true", strtotime('+365 days'), "/");
// }

// if (!isset($_COOKIE['dev'])) {
// 	echo "brb :D";
// 	exit;
// }

?><!DOCTYPE html>
<html lang="en" class="loading stateChange">

<head>
	<meta charset="UTF-8" />
	<meta name="theme-color" content="#151e21">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<meta name="generator" content="Thomas Chapman with Coffee" />
	<title>CLOVIS BRAY</title>
	<link rel="stylesheet" href="/assets/core.css">
	<link rel="stylesheet" href="/assets/webfonts/neue/style.css">
	<link rel="stylesheet" href="/assets/webfonts/destiny/style.css">
	<link rel="stylesheet" href="/assets/webfonts/symbols/style.css">
	<link rel="icon" type="image/png" href="/assets/favicon-16.png" sizes="16x16">
	<link rel="icon" type="image/png" href="/assets/favicon-32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="/assets/favicon-96.png" sizes="96x96">
	<meta property="og:title" content="braytech.org">
	<meta property="og:description" content="A Destiny fan with too much free, braytech.org displays current world activities, Xûr stuff, collectibles checklists, heroic public event guides, and probably more. It's the development playground of justrealmilk, a Guardian from Australia. He enjoys tinkering with Destiny's API and having afternoon tea with Lakshmi-2.">
	<meta property="og:url" content="https://braytech.org/">
	<meta property="og:image" content="https://braytech.org/guides/assets/heroic-public-events/cabal-excavation/featured.jpg">
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-86401488-4', 'auto');
		ga('send', 'pageview');
	</script>
</head>

<body>

	<svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;">
		<filter id="sharpBlur" width="150%" height="150%" x="-25%" y="-25%" color-interpolation-filters="sRGB">
			<feGaussianBlur stdDeviation="3"></feGaussianBlur>
			<feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 10 0"></feColorMatrix>
			<feComposite in2="SourceGraphic" operator="in"></feComposite>
		</filter>
		<filter id="bluntBlur" width="150%" height="150%" x="-25%" y="-25%" color-interpolation-filters="sRGB">
			<feGaussianBlur stdDeviation="17"></feGaussianBlur>
			<feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 10 0"></feColorMatrix>
			<feComposite in2="SourceGraphic" operator="in"></feComposite>
		</filter>
		<filter id="ultraBlur" width="150%" height="150%" x="-25%" y="-25%" color-interpolation-filters="sRGB">
			<feGaussianBlur stdDeviation="45"/>
			<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0 0 0 0 10 0"/>
			<feGaussianBlur stdDeviation="45"/>
     	<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0 0 0 0 10 0"/>
    	<feComposite in2="SourceGraphic" operator="in"></feComposite>
		</filter>
	</svg>

	<header>
		<h1><a href="/"><i class="destiny-clovis_bray"></i></a></h1>
		<a class="trigger"></a>
		<ul>
			<li><a href="/">Now</a></li>
			<li><a href="/xur/">Xûr</a></li>
			<li><a href="/progression/">Progression</a></li>
			<li><a href="/creators/">Creators</a></li>
		</ul>
	</header>

	<div class="spinner">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.08 71.68">
			<polygon class="a" points="30.04 59.7 10.87 48.64 1 54.34 30.04 71.1 30.04 59.7"/>
			<polygon class="e" points="1 17.34 10.87 23.04 30.04 11.97 30.04 0.58 1 17.34"/>
			<polygon class="f" points="9.87 46.91 9.87 24.77 0 19.07 0 52.6 9.87 46.91"/>
			<polygon class="d" points="32.04 0.58 32.04 11.97 51.2 23.04 61.08 17.34 32.04 0.58"/>
			<polygon class="b" points="61.08 54.34 51.2 48.64 32.04 59.7 32.04 71.1 61.08 54.34"/>
			<polygon class="c" points="52.2 24.77 52.2 46.91 62.08 52.6 62.08 19.07 52.2 24.77"/>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.08 71.68">
			<polygon class="c" points="21.8 29.35 30.04 24.59 30.04 14.32 12.9 24.21 21.8 29.35"/>
			<polygon class="b" points="20.8 40.6 20.8 31.08 11.9 25.95 11.9 45.73 20.8 40.6"/>
			<polygon class="d" points="32.04 14.32 32.04 24.59 40.28 29.35 49.17 24.21 32.04 14.32"/>
			<polygon class="e" points="41.28 31.08 41.28 40.6 50.17 45.73 50.17 25.95 41.28 31.08"/>
			<polygon class="a" points="30.04 47.09 21.8 42.33 12.9 47.47 30.04 57.36 30.04 47.09"/>
			<polygon class="f" points="40.28 42.33 32.04 47.09 32.04 57.36 49.17 47.47 40.28 42.33"/>
		</svg>
	</div>

	<div class="loadingScreen"></div>

	<main></main>

	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.14/moment-timezone-with-data-2012-2022.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/three.js/93/three.min.js"></script>	
	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
	<script src="/assets/three.js/OrbitControls.js"></script>
	<script src="/assets/three.js/three.tgxloader.js"></script>
	<script src="/assets/core.js"></script>

</body>
</html>
