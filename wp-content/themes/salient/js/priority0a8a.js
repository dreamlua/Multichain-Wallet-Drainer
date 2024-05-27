/**
 * Salient priority script.
 *
 * @package Salient
 * @author ThemeNectar
 */
 /* global jQuery */


// Mobile Secondary Header Nav Always Visible.
var headerEl      = document.getElementById('header-outer');
var headerSpaceEl = document.getElementById('header-space');

if( typeof(headerEl) != 'undefined' && headerEl != null &&
    typeof(headerSpaceEl) != 'undefined' && headerSpaceEl != null &&
		headerSpaceEl.hasAttribute('data-secondary-header-display')) {

	headerSpaceEl.style.height = headerEl.clientHeight + 'px';

}


// DOM Ready.
jQuery(function($) {

	"use strict";

	var using_mobile_browser = false;
	if(navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {
		using_mobile_browser = true;
	}

	var nectarPageHeader;

  /**
  * Set the height of fullscreen page headers
  *
  * @since 9.0
  */
	function fullscreenHeightCalc() {
		var pageHeaderOffset = nectarPageHeader.offset().top;
    $('#page-header-wrap.fullscreen-header').css('height','auto');
		nectarPageHeader.css('height', ( parseInt(window.innerHeight) - parseInt(pageHeaderOffset)) +'px');
	}

	if( using_mobile_browser && $('#page-header-bg.fullscreen-header').length > 0 ) {

		nectarPageHeader = $('#page-header-bg');

		fullscreenHeightCalc();

		var $windowDOMWidth = window.innerWidth, $windowDOMHeight = window.innerHeight;

		$(window).resize(function(){
			if( ($(window).width() != $windowDOMWidth && $(window).height != $windowDOMHeight)){
				fullscreenHeightCalc();
				// Store the current window dimensions.
				$windowDOMWidth = window.innerWidth;
				$windowDOMHeight = window.innerHeight;
			}
		});

	}

  /**
  * Set the height of the fullscreen recent project slider
  *
  * @since 9.0
  */
	function portfolioFullScreenSliderCalcs() {

		var $bodyBorderSize = ($('.body-border-top').length > 0 && $(window).width() > 1000) ? $('.body-border-top').height(): 0;

		$('.nectar_fullscreen_zoom_recent_projects').each(function(){
			if($(this).parents('.first-section').length > 0) {
				$(this).css('height',$(window).height() - $(this).offset().top - $bodyBorderSize);
			} else {
				$(this).css('height',$(window).height());
			}
		});

	}

	if(using_mobile_browser && $('.nectar_fullscreen_zoom_recent_projects').length > 0) {
    portfolioFullScreenSliderCalcs();
  }


  /**
  * Move the needed HTML for the centered header bottom bar format.
  *
  * @since 9.0
  */
	function centeredNavBottomBarReposition() {

		var $headerSpan9 = $('#header-outer[data-format="centered-menu-bottom-bar"] header#top .span_9');
		var $headerSpan3 = $('#header-outer[data-format="centered-menu-bottom-bar"] header#top .span_3');
		var $secondaryHeader = $('#header-secondary-outer');

		var $logoLinkClone = $headerSpan3.find('#logo').clone();
		if($logoLinkClone.is('[data-supplied-ml="true"]')) {
			$logoLinkClone.find('img:not(.mobile-only-logo)').remove();
		}
		//trans
		$logoLinkClone.find('img.starting-logo').remove();


		if($secondaryHeader.length > 0) {
			$secondaryHeader.addClass('centered-menu-bottom-bar');
		}


		if($('#header-outer[data-condense="true"]').length > 0 && $('#header-outer[data-menu-bottom-bar-align="left"]').length == 0 ) {
			$headerSpan9.prepend($logoLinkClone);
		}
	}


	if($('#header-outer[data-format="centered-menu-bottom-bar"]').length > 0) {
		centeredNavBottomBarReposition();
	}


	// Add loaded class for "zoom out" page header effect.
	$('#page-header-bg[data-animate-in-effect="zoom-out"]').addClass('loaded');


  /**
  * Nectar Slider mobile font sizing override options.
  *
  * @since 9.0
  */
	function sliderFontOverrides() {

		var $overrideCSS = '';

		$('.nectar-slider-wrap').each(function(){

			if($(this).find('.swiper-container[data-tho]').length > 0) {

				var $tho = $(this).find('.swiper-container').attr('data-tho');
				var $tco = $(this).find('.swiper-container').attr('data-tco');
				var $pho = $(this).find('.swiper-container').attr('data-pho');
				var $pco = $(this).find('.swiper-container').attr('data-pco');

				// Tablets Viewport.
				if( $tho != 'auto' || $tco != 'auto' ) {

					$overrideCSS += '@media only screen and (max-width: 1000px) and (min-width: 690px) {';
					if($tho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content h2, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content h2, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content h2, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content h2, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content h2 { font-size:' + $tho + 'px!important; line-height:' + (parseInt($tho) + 10) + 'px!important;  }';
					if($pho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content p, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content p, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content p, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p { font-size:' + $tco + 'px!important; line-height:' + (parseInt($tco) + 10) + 'px!important;  }';
					$overrideCSS += '}';

				}


				// Phone Viewport.
				if( $pho != 'auto' || $pco != 'auto' ) {

					$overrideCSS += '@media only screen and (max-width: 690px) {';
					if($pho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content h2, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content h2, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content h2, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content h2, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content h2 { font-size:' + $pho + 'px!important; line-height:' + (parseInt($pho) + 10) + 'px!important;  }';
					if($pho != 'auto')
					$overrideCSS += '#'+$(this).attr('id')+ '.nectar-slider-wrap[data-full-width="false"] .swiper-slide .content p, #boxed .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p,  body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="true"] .swiper-slide .content p, body .nectar-slider-wrap#'+$(this).attr('id')+ '[data-full-width="boxed-full-width"] .swiper-slide .content p, body .full-width-content .vc_span12 .nectar-slider-wrap#'+$(this).attr('id')+ ' .swiper-slide .content p { font-size:' + $pco + 'px!important; line-height:' + (parseInt($pco) + 10) + 'px!important;  }';
					$overrideCSS += '}';
				}

			}

		});


		if( $overrideCSS.length > 1 ) {

			var head = document.head || document.getElementsByTagName('head')[0];
			var style = document.createElement('style');

			style.type = 'text/css';
			if (style.styleSheet){
				style.styleSheet.cssText = $overrideCSS;
			} else {
				style.appendChild(document.createTextNode($overrideCSS));
			}

			head.appendChild(style);

			$('.nectar-slider-wrap .content').css('visibility','visible');
		}

	}

	sliderFontOverrides();


});
