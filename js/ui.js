$(function() {
	"use strict";

	$(window).on("load",function(){
		$(".nav").mCustomScrollbar({
			theme: "minimal-dark",
			scrollInertia: 500
		});
	});

	$(document).ready(function() {
		// 카테고리 리스트 마우스오버 효과
		$(".ban_box li").mouseenter(function() {
			$(this).find(".detail").stop().fadeIn();
			$(this).find("div").stop().animate({height:"182px"},200);	
		});
		$(".ban_box li").mouseleave(function() {
			$(this).find(".detail").stop().fadeOut("fast");
			$(this).find(".ban_in").stop().animate({height:"89px"},100);
			$(this).find(".ban_in2").stop().animate({height:"125px"},100);
		});

		// 패치노트 리스트 마우스오버 효과
		$(".over_li li").mouseenter(function() {
			$(this).find("div").stop().animate({padding:"36px 15px"},200);
		});
		$(".over_li li").mouseleave(function() {
			$(this).find(".over_ban").stop().animate({padding:"12px 15px"},100);
		});
		
		// 상단으로 이동
		$(".top").click(function() {
			$("html, body").animate({"scrollTop" : "0px"}, 700, 'easeInOutExpo');
		});

		footerResize();
		closeResize();
	});

	$(window).resize(function() {
		footerResize();
		closeResize();
	});
	
	$(window).scroll(function() {
		// 탑 버튼 모션
		var scroll = $(window).scrollTop();
		if (scroll < 500) {
			$(".top").stop().animate({right:"-57px"}, 200);
		} else {
			$(".top").stop().animate({right:"11px"}, 200);
		}
/*		if (scroll < 20) {
			$(".cate_top").stop().css({"background":"none"}).fadeOut();
		} else {
			$(".cate_top").stop().css({"background":"url(img/ban_bg.png) 0 0"}).fadeIn();
		}
*/	});
	
	// Footer resize event
	function footerResize() {
		var wd = $(window).height();
		if (wd < 882) {
			$(".footer").attr("style","position:relative;margin-top:110px;");
		} else {
			$(".footer").attr("style","");
		}	
	}
	// 닫기 버튼 resize event
	function closeResize() {
		var wd2 = $(window).width();
		if (wd2 < 1280) {
			$(".close").attr("style","position:absolute;top:11px;left:1223px");
		} else {
			$(".close").attr("style","");
		}	
	}
});
