/**
 * Salient Portfolio.
 *
 * @author ThemeNectar
 */
 /* global Waypoint */
 /* global imagesLoaded */
 /* global nectar_theme_info */
 
(function( $ ) {
  
  "use strict";
  
  /*-------------------------------------------------------------------------*/
  /*	1.	Salient Portfolio Element
  /*-------------------------------------------------------------------------*/
  
  function SalientPortfolio(el, fullWidthContentColumns) {
    
    this.$el = el;
    this.fullWidthContentColumns = fullWidthContentColumns;
    
    this.$window = $(window);
    this.onMobile = false;
    this.clearIsoAnimation = null;
    this.mediaQuerySize = '';
    
    this.mouseEventHandler();
    this.portfolioFiltersInit();
    this.masonryInit();
    this.resizeHandler();
    
    if( this.$el.find('.inner-wrap[data-animation="perspective"]').length > 0) {
      this.perspectiveAnimationInit();
    }
    
    this.portfolioAccentColor();
    this.isotopeCatSelection();
    this.portfolioCommentOrder();
    
  }
  
  
  SalientPortfolio.prototype.masonryInit = function() {
    
    var instance = this;
    
    this.$el.imagesLoaded(function(){

      // initial call to setup isotope.
      var $layoutMode = ( instance.$el.hasClass('masonry-items')) ? 'packery' : 'fitRows';
      var $startingFilter = (instance.$el.attr('data-starting-filter') != '' && instance.$el.attr('data-starting-filter') != 'default') ? '.' + instance.$el.attr('data-starting-filter') : '*';
      var $rtlLayout = ( $('body.rtl').length > 0 ) ? false : true;
      instance.reLayout();
      
      instance.$el.addClass('isotope-activated');
      
      instance.$el.isotope({
        itemSelector : '.element',
        filter: $startingFilter,
        layoutMode: $layoutMode,
        transitionDuration: '0.6s',
        isOriginLeft: $rtlLayout,
        packery: {
          gutter: 0
        }
      }).isotope( 'layout' );
      
      // Starting filters.
      if($startingFilter != '*'){
        
        // Custom starting filter.
        if( instance.$el.parent().parent().find('.portfolio-filters').length > 0 ) {
          instance.$el.parent().parent().find('.portfolio-filters ul a[data-filter="'+$startingFilter+'"]').trigger('click');
        } else {
          instance.$el.parent().parent().find('.portfolio-filters-inline ul a[data-filter="'+$startingFilter+'"]').trigger('click');
        }
        
        
      } else {
        
        // Default filter of "all".
        if(instance.$el.parent().parent().find('.portfolio-filters-inline[data-alignment="left"]').length > 0 || 
        instance.$el.parent().parent().find('.portfolio-filters-inline[data-alignment="center"]').length > 0) {
          instance.$el.parent().parent().find('.portfolio-filters-inline .container > ul > li:nth-child(1) a').trigger('click').addClass('active');
        } else {
          instance.$el.parent().parent().find('.portfolio-filters-inline .container > ul > li:nth-child(2) a').trigger('click').addClass('active');
        }
        
      }
      
      instance.loadAnimationWaypoint();
      
      // Call the reLayout to get things rollin'.
      instance.masonryZindex();
      var self = this;
      setTimeout(function(){ instance.masonryZindex(); },800);
      
      
      
      // Inside full width content.
      if(instance.$el.parents('.full-width-content').length > 0) { 
        setTimeout(function(){ instance.fullWidthContentColumns(); },200); 
       }
      
      // fadeout the loading animation
      $('.portfolio-loading').stop(true,true).fadeOut(200);
      
      // FadeIn items one by one.
      if(instance.$el.find('.inner-wrap').attr('data-animation') === 'none') {
        instance.$el.find('.inner-wrap').removeClass('animated');
      } 
      
    });
    

    // Portfolio external links.
    $(".portfolio-items").find("a[href*='http://']:not([href*='" + window.location.hostname + "'])").attr("target", "_blank");
    $(".recent_projects_widget").find("a[href*='http://']:not([href*='" + window.location.hostname + "'])").attr("target", "_blank");
    
    $(".portfolio-items").find("a[href*='https://']:not([href*='" + window.location.hostname + "']):not([href*='youtube.com']):not([href*='vimeo.com'])").attr("target", "_blank");
    $(".recent_projects_widget").find("a[href*='https://']:not([href*='" + window.location.hostname + "'])").attr("target", "_blank");
    
  };
  
  SalientPortfolio.prototype.resizeHandler = function(){
    
    var self = this;
    
    this.$window.on('resize', function(){
    
      setTimeout(function(){
        self.reLayout();
        self.masonryZindex();
        self.portfolioCommentOrder();
      },30);
      
    });
    
  };
  
  
  SalientPortfolio.prototype.mouseEventHandler = function() {
    
    // sorting  
    if( this.$el.parent().parent().find('.portfolio-filters').length > 0 ) {
      this.$el.parent().parent().find('.portfolio-filters ul li a').on('click', this.isoClickFilter.bind(this));
    } else {
      this.$el.parent().parent().find('.portfolio-filters-inline ul li a').on('click', this.isoClickFilter.bind(this));
    }
    
    if( $('body.page-template-template-portfolio').length > 0 && $('#page-header-wrap .portfolio-filters').length > 0 ) {
      $('#page-header-wrap .portfolio-filters ul li a').on('click', this.isoClickFilter.bind(this));
    } 
    
    // portfolio sort
    $('body').on('mouseenter','.portfolio-filters',function(){
      if(!this.onMobile) {
        $(this).find('> ul').stop(true,true).slideDown(500,'easeOutExpo');
      }
      $(this).find('a#sort-portfolio span').html($(this).find('a#sort-portfolio').attr('data-sortable-label'));
    });
    
    $('body').on('mouseleave','.portfolio-filters',function(){
      var $activeCat = $(this).find('a.active').html();
      if( typeof $activeCat == 'undefined' || $activeCat.length == 0) {
        $activeCat = $(this).attr('data-sortable-label');
      }
      
      $(this).find('a#sort-portfolio span').html($activeCat);
      
      if(!this.onMobile) {
        $(this).find('> ul').stop(true,true).slideUp(500,'easeOutExpo');
      }
    });
    
    // portfolio selected category
    $('body').on('click','.portfolio-filters ul li a', function(){
      $(this).parents('.portfolio-filters').find('#sort-portfolio span').html($(this).html());
    });
    
    // portfolio prevent jump on parent dropdown click
    $('body').on('click','.portfolio-filters > a#sort-portfolio', function(){
      return false;
    });
    
    // portfolio description remove on hover
    var $tmpTitle = '';
    $('.portfolio-items > .col a[title]').on('mouseenter', function () {
      if( $(this).attr('title').length > 0 ) {
        $tmpTitle = $(this).attr('title');
        $(this).attr('title', '');
      }
    });
    $('.portfolio-items > .col a[title]').on('mouseleave', function () {
      if( $tmpTitle.length > 0 ) {
        $(this).attr('title', $tmpTitle);
      }
    });
    
    $('.portfolio-items > .col a[title]').on('mousedown', function () {
      if( $tmpTitle.length > 0 ) {
        $(this).attr('title', $tmpTitle);
      }
    });
    

  };
  
  
  SalientPortfolio.prototype.portfolioFiltersInit = function() {
    
    // Mobile sort menu
    if( $('body').hasClass('mobile') || navigator.userAgent.match(/(iPad|IEMobile)/) ) {
      
      this.onMobile = true;
      
      $('body').off('mouseenter mouseleave', '.portfolio-filters');
      
      this.$el.parent().parent().find('.portfolio-filters > a').on('click',function(e) {
        if(e.originalEvent !== undefined) { 
          $(this).parents('.portfolio-filters').find('> ul').stop(true,true).slideToggle(600,'easeOutCubic'); 
        }
      });
      
      this.$el.parent().parent().find('.portfolio-filters ul li a').on('click',function(e) {
        if(e.originalEvent !== undefined) { 
          $(this).parents('.portfolio-filters').find('> ul').stop(true,true).slideToggle(600,'easeOutCubic'); 
          
          var $activeCat = $(this).html();
          $(this).parents('.portfolio-filters').find('a#sort-portfolio span').html($activeCat);
          
        }
      });
      
    }
    
    // portfolio more details page menu highlight
    $('body.single-portfolio #header-outer nav > ul > li > a:contains("Portfolio")').parents('li').addClass('current-menu-item');
    
  };
  
  
  
  SalientPortfolio.prototype.isoClickFilter = function(e) {
  
    var $timeout;		 
    var self = this;

    if(window.innerWidth > 690 && !navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)){
      
      clearTimeout($timeout);
      $timeout = setTimeout(function(){ self.masonryZindex();  },600);
      
    }
    
    var selector = $(e.target).attr('data-filter');
    
    this.$el.isotope({ filter: selector }).attr('data-current-cat',selector);
    
    // fade in all incase user hasn't scrolled down yet
    if(this.$el.find('.inner-wrap[data-animation="none"]').length === 0) {
      this.$el.find('.col').addClass('animated-in');
    }
    
    // active classes
    $(e.target).closest('ul:not(.children)').find('li a').removeClass('active');
    $(e.target).addClass('active');
    
    if($(e.target).parents('.portfolio-filters-inline').length > 0) {
      $(e.target).parents('.portfolio-filters-inline').find('#current-category').html($(e.target).html());
    }
    
    // update pp
    if(this.$el.find('a[rel^="prettyPhoto"]').length > 0) {
      setTimeout(this.updatePrettyPhotoGallery.bind(this),170);
    }
    
    else {
      setTimeout(this.updateMagPrettyPhotoGallery.bind(this),170);
    }
    
    return false;
  };
  
  
  
  SalientPortfolio.prototype.loadAnimationWaypoint = function() {
    
    
    var $portfolioOffsetPos = ($('#nectar_fullscreen_rows').length > 0) ? '200%' : '90%';
    
    if(this.$el.find('.inner-wrap').attr('data-animation') === 'none') { return; }
    
    this.$el.find('.col').each(function(i) {
      
      var $that = $(this);
      
      //loaded visible
      if($(this).visible(true) || $(this).parents('#nectar_fullscreen_rows').length > 0) {
        
        var $portfolioAnimationDelay = ($that.is('[data-masonry-type="photography"].masonry-items')) ? 90 : 115;
        $(this).delay($portfolioAnimationDelay *i).queue(function(next){
          $(this).addClass("animated-in");
          next();
        });
        
      } else {
        
        // not already visible
        var waypoint = new Waypoint({
          element: $that,
          handler: function() {
            
            if($that.parents('.wpb_tab').length > 0 && $that.parents('.wpb_tab').css('visibility') === 'hidden' || $that.hasClass('animated-in')) { 
              waypoint.destroy();
              return;
            }
            
            var $portfolioAnimationDelay = ($that.is('[data-masonry-type="photography"].masonry-items')) ? 85 : 100;
            
            setTimeout(function(){
              $that.addClass("animated-in");
            },$portfolioAnimationDelay * $that.attr('data-delay-amount'));
            
            
            waypoint.destroy();
          },
          offset: $portfolioOffsetPos
          
        }); //waypoint
      }
      
    }); //each
    
    
  };
  
  SalientPortfolio.prototype.perspectiveAnimationInit = function() {
    
    var lastScrollTop = $(window).scrollTop();
    var self = this;
    
    this.$el.css('perspective-origin','50% '+ (lastScrollTop + $(window).height()) + 'px');
    
    requestAnimationFrame(updatePerspectiveOrigin);
    
    function updatePerspectiveOrigin() {
      
      var scrollTop = $(window).scrollTop();
      
      if (lastScrollTop === scrollTop) {
        requestAnimationFrame(updatePerspectiveOrigin);
        return;
      } else {
        lastScrollTop = scrollTop;
        self.$el.css('perspective-origin','50% '+ (lastScrollTop + $(window).height()) + 'px');
        requestAnimationFrame(updatePerspectiveOrigin);
      }
    }
    
  };
  
  

  
  SalientPortfolio.prototype.portfolioItemWidths = function() {
    
    var isFullWidth = this.$el.attr('data-col-num') === 'elastic';

    if(isFullWidth) { 
      
      var $elWidth = Math.floor(this.$el.width());
      var $colSize = 4;
      var $mult    = (this.mediaQuerySize === 'one') ? 1 : 2;
      
      if(this.mediaQuerySize === 'five') {
        $colSize = 5;
      }
      else if(this.mediaQuerySize === 'four') {
        $colSize = 4;
      }
      else if(this.mediaQuerySize === 'three') {
        $colSize = 3;
      }
      else if(this.mediaQuerySize === 'two') {
        $colSize = 2;
      }
      else if(this.mediaQuerySize === 'one') {
        $colSize = 1;
      }
      
      if(this.$el.is('[data-ps="6"]') && $colSize == 5) {
        $colSize = 4;
      }
      
      // photography
      if( isFullWidth && this.$el.is('[data-masonry-type="photography"]') && !this.$el.hasClass('no-masonry') ) {
        if(this.mediaQuerySize === 'five') {
          $colSize = 6;
        }
        if(this.mediaQuerySize === 'four') {
          $colSize = 5;
        }
        if(this.mediaQuerySize === 'three') {
          $colSize = 4;
        }
      }
      
      if( $elWidth % $colSize === 0 ) {
        this.$el.find('.elastic-portfolio-item:not(.wide):not(.wide_tall)').css('width',Math.floor($elWidth/$colSize) +'px');
        this.$el.find('.elastic-portfolio-item.wide, .elastic-portfolio-item.wide_tall').css('width',Math.floor($elWidth/$colSize*$mult) +'px');
      } else {
        
        var $loopEndNum = ($(window).width() > 1000) ? 6 : 3;
        if(this.$el.hasClass('fullwidth-constrained') && $(window).width() > 1000) { 
          $loopEndNum = 4; 
        }
        
        // find closest number to give 0.
        for(var i = 1; i<$loopEndNum; i++) {
          if( ($elWidth - i) % $colSize === 0 ) {
            this.$el.find('.elastic-portfolio-item:not(.wide):not(.wide_tall)').css('width',($elWidth-i)/$colSize +'px');
            this.$el.find('.elastic-portfolio-item.wide, .elastic-portfolio-item.wide_tall').css('width',($elWidth-i)/$colSize*$mult +'px');
          }
        }
        
      }
      
    } // isFullWidth
    
  };
  
  
  
  SalientPortfolio.prototype.masonryZindex = function() {
    
    // escape if no browser support
    if($('body .portfolio-items:not(".carousel") > .col').length > 0 && 
    $('body .portfolio-items:not(".carousel") > .col').offset().left) {
      
      var self = this;
      
      $('body .portfolio-items:not(".carousel")').each(function(){
        
        var $coords = {};
        var $zindexRelation = {};
        var $that = $(this);
        
        $(this).find('> .col').each(function(){
          var $itemOffset = $(this).offset();
          $itemOffset = $itemOffset.left;
          
          $coords[$(this).index()] = $itemOffset;
          $(this).css('z-index',Math.abs(Math.floor($(this).offset().left/20)));
        });
        
        var $corrdsArr = jQuery.map($coords, function (value) { return value; });
        
        $corrdsArr = self.removeDuplicates($corrdsArr);
        $corrdsArr.sort(function(a,b){ return a-b; });
        
        for(var i = 0; i < $corrdsArr.length; i++){
          $zindexRelation[$corrdsArr[i]] = i; 
        }
        
        jQuery.each($coords,function(k,v){
          
          var $zindex;
          var $coordCache = v;
          jQuery.each($zindexRelation,function(k,v){
            if($coordCache === k) {
              $zindex = v;
            }
          });
          
          $that.find('> .col:eq('+k+')').attr('data-delay-amount',$zindex);
        });
        
        
      });
      
      
      
    }
    
    
  };
  
  
  SalientPortfolio.prototype.removeDuplicates = function(inputArray) {
    var i;
    var len = inputArray.length;
    var outputArray = [];
    var temp = {};
    
    for (i = 0; i < len; i++) {
      temp[inputArray[i]] = 0;
    }
    for (i in temp) {
      outputArray.push(i);
    }
    return outputArray;
  };
  
  
  
  SalientPortfolio.prototype.reLayout = function() {
    
    var self = this;
    clearTimeout(this.clearIsoAnimation);
    
    this.$el.find('.col').addClass('no-transition');
    
    this.clearIsoAnimation = setTimeout(function(){  
      self.$el.find('.col').removeClass('no-transition'); 
    },700); 
    
    
    if(window.innerWidth > 1600) {
      
      if(this.$el.hasClass('fullwidth-constrained')) {
        if(this.$el.is('[data-masonry-type="photography"]')) {
          this.mediaQuerySize = 'three';
        } else {
          this.mediaQuerySize = 'four';
        }
        
      } else {
        if(this.$el.hasClass('constrain-max-cols')) {
          this.mediaQuerySize = 'four';
        } else {
          this.mediaQuerySize = 'five';
        }
      }
      
    } else if(window.innerWidth <= 1600 && window.innerWidth > 1300){
      
      if(this.$el.hasClass('fullwidth-constrained')) {
        if(this.$el.is('[data-masonry-type="photography"]')) {
          this.mediaQuerySize = 'three';
        } else {
          this.mediaQuerySize = 'four';
        }
      } else {
        this.mediaQuerySize = 'four';
      }
    } else if(window.innerWidth <= 1300 && window.innerWidth > 990){
      
      if(this.$el.hasClass('constrain-max-cols')) {
        this.mediaQuerySize = 'four';
      } else {
        this.mediaQuerySize = 'three';
      }
      
    } else if(window.innerWidth <= 990 && window.innerWidth > 470){
      this.mediaQuerySize = 'two';
    } else if(window.innerWidth <= 470){
      this.mediaQuerySize = 'one';
    }
    
    // boxed
    if($('#boxed').length > 0) {
      if(window.innerWidth > 1300){
        this.mediaQuerySize = 'four';
      } else if(window.innerWidth < 1300 && window.innerWidth > 990){
        
        if(this.$el.hasClass('constrain-max-cols')) {
          this.mediaQuerySize = 'four';
        } else {
          this.mediaQuerySize = 'three';
        }
        
      } else if(window.innerWidth < 990){
        this.mediaQuerySize = 'one';
      }
      
    }
    

    // set widths
    this.portfolioItemWidths();
    
    
    // sizing for large items
    if(!this.$el.is('[data-bypass-cropping="true"]')) {
      
      if( this.$el.find('.col.elastic-portfolio-item[class*="regular"]:visible').length > 0 || 
      this.$el.find('.col.elastic-portfolio-item[class*="wide"]:visible').length > 0 || 
      this.$el.find('.col.elastic-portfolio-item[class*="tall"]:visible').length > 0 || 
      this.$el.find('.col.elastic-portfolio-item[class*="wide_tall"]:visible').length > 0) {
        
        var $gutterSize = (this.$el.is('[data-gutter*="px"]') && this.$el.attr('data-gutter').length > 0 && this.$el.attr('data-gutter') != 'none') ? parseInt(this.$el.attr('data-gutter')) : 0;
        var multipler = (window.innerWidth > 470) ? 2 : 1;
        
        // reset height for calcs
        var $itemClassForSizing = 'regular';
        
        if(this.$el.find('.col.elastic-portfolio-item[class*="regular"]:visible').length === 0 && 
          this.$el.find('.col.elastic-portfolio-item.wide:visible').length > 0) {
          
          $itemClassForSizing = 'wide';
          
        } else if(this.$el.find('.col.elastic-portfolio-item[class*="regular"]:visible').length === 0 && 
          this.$el.find('.col.elastic-portfolio-item.wide_tall:visible').length > 0) {
          
          $itemClassForSizing = 'wide_tall';
          multipler = 1;
          
        } else if(this.$el.find('.col.elastic-portfolio-item[class*="regular"]:visible').length === 0 && 
          this.$el.find('.col.elastic-portfolio-item.tall:visible').length > 0) {
          
          $itemClassForSizing = 'tall';
          multipler = 1;
          
        }
        
        this.$el.find('.col.elastic-portfolio-item.'+$itemClassForSizing+' img').css('height','auto');
        
        var tallColHeight = this.$el.find('.col.elastic-portfolio-item.'+$itemClassForSizing+':visible img').height();
        
        this.$el.find('.col.elastic-portfolio-item[class*="tall"] img, .col.elastic-portfolio-item.wide img, .col.elastic-portfolio-item.regular img').removeClass('auto-height');
        this.$el.find('.col.elastic-portfolio-item[class*="tall"] img:not(.custom-thumbnail)').css('height',(tallColHeight*multipler) + ($gutterSize*2));
        
        if($itemClassForSizing === 'regular' || $itemClassForSizing === 'wide') {
          this.$el.find('.col.elastic-portfolio-item.wide img:not(.custom-thumbnail), .col.elastic-portfolio-item.regular img:not(.custom-thumbnail)').css('height',tallColHeight);
        } else {
          this.$el.find('.col.elastic-portfolio-item.wide img:not(.custom-thumbnail), .col.elastic-portfolio-item.regular img:not(.custom-thumbnail)').css('height',(tallColHeight/2) - ($gutterSize*2));
        }
        
        this.$el.find('.col.elastic-portfolio-item[class*="tall"] .parallaxImg').css('height',(tallColHeight*multipler) + parseInt(this.$el.find('.col.elastic-portfolio-item').css('padding-bottom'))*2 );
        
        if($itemClassForSizing === 'regular' || $itemClassForSizing === 'wide') {
          this.$el.find('.col.elastic-portfolio-item.regular .parallaxImg, .col.elastic-portfolio-item.wide .parallaxImg').css('height',tallColHeight);
        } else {
          this.$el.find('.col.elastic-portfolio-item.regular .parallaxImg, .col.elastic-portfolio-item.wide .parallaxImg').css('height',(tallColHeight/2) - ($gutterSize*2));
        }
        
      } else {
        this.$el.find('.col.elastic-portfolio-item[class*="tall"] img, .col.elastic-portfolio-item.wide img, .col.elastic-portfolio-item.regular img').addClass('auto-height');
      }
      
    } // bypass cropping option
    
    // non masonry
    if(this.$el.hasClass('no-masonry') && this.$el.find('.col:first:visible').length > 0 && this.$el.parents('.wpb_gallery').length === 0){
      
      // skip style 9
      if( !this.$el.is('[data-ps="9"]') && !this.$el.is('[data-bypass-cropping="true"]') ) {
        
        // reset height for calcs
        this.$el.find('.col img').css('height','auto');
        var tallColHeight = this.$el.find('.col:first:visible img').height();
        this.$el.find('.col img:not(.custom-thumbnail)').css('height',tallColHeight);
        this.$el.find('.col .parallaxImg').css('height',tallColHeight);
      }
      
    }
    
    
    
    if(this.$el.isotope()) {
      this.$el.isotope( 'layout' );
    }
    
    
  };
  
  
  
  SalientPortfolio.prototype.updatePrettyPhotoGallery = function(){
    
    
    if(this.$el.find('a[rel^="prettyPhoto"]').length > 0) {
      
      var $unique_id = Math.floor(Math.random()*10000);
      var $currentCat = this.$el.attr('data-current-cat');
      this.$el.find('.col'+$currentCat).find('a[rel^="prettyPhoto"]').attr('rel','prettyPhoto['+$unique_id+'_sorted]');
      
    } 
    
    
  };
  
  SalientPortfolio.prototype.updateMagPrettyPhotoGallery = function() {
    
    
    var $currentCat = this.$el.attr('data-current-cat');
    var $unique_id = Math.floor(Math.random()*10000);
    
    if(this.$el.is('[data-lightbox-only="true"]')){
      
      this.$el.find('.col').each(function(){
        
        $(this).find('a.gallery').removeClass('gallery').removeClass('magnific');
        
        if($(this).is($currentCat)) {

          // parallax styles
          if($(this).find('.parallaxImg-wrap').length > 0) {
            
            if($('body[data-ls="fancybox"]').length > 0) {
              $(this).find('.work-item > a:not([target="_blank"])').attr('data-fancybox','group_'+$unique_id);
            } else {
              $(this).find('.work-item > a:not([target="_blank"])').addClass('gallery').addClass('magnific');
            }
            
          } else {
            // others
            
            if($('body[data-ls="fancybox"]').length > 0) {
              $(this).find('.work-item a:not([target="_blank"])').attr('data-fancybox','group_'+$unique_id);
            } else {
              $(this).find('.work-item a:not([target="_blank"])').addClass('gallery').addClass('magnific');
            }
            
          }
          
        }
        
      });
      
    }
    
    else if (this.$el.find('.work-item.style-1').length > 0){
      
      this.$el.find('.col').each(function(){
        
        $(this).find('a.gallery').removeClass('gallery').removeClass('magnific');
        
        if($(this).is($currentCat)) {
          
          if($('body[data-ls="fancybox"]').length > 0) {
            $(this).find('.work-info .vert-center a:first-of-type').attr('data-fancybox','group_'+$unique_id);
          } 
          else {
            $(this).find('.work-info .vert-center a:first-of-type').addClass('gallery').addClass('magnific');
          }
          
        }
        
      });
    }
    
    
  };
  
  
  
  SalientPortfolio.prototype.portfolioAccentColor = function() {
    

    this.$el.find('.col').each(function(){
      if ($(this).has('[data-project-color]')) { 
        $(this).find('.work-info-bg, .bottom-meta').css('background-color',$(this).attr('data-project-color'));
        
        // style5
        $(this).find('.parallaxImg-rendered-layer .bg-overlay').css('border-color',$(this).attr('data-project-color'));
        
      }
    });
    
  };
  
  
  
  SalientPortfolio.prototype.isotopeCatSelection = function() {
    
    var isotopeCatArr = [];
    var $portfolioCatCount = 0;
    this.$el.parent().parent().find('div[class^=portfolio-filters] ul li').each(function(i){
      if($(this).find('a').length > 0) {
        isotopeCatArr[$portfolioCatCount] = $(this).find('a').attr('data-filter').substring(1);	
        $portfolioCatCount++;
      }
    });
    
    
    // ice the first (all)
    isotopeCatArr.shift();
    
    
    var allItemCats = '';
    var self = this;
    
    this.$el.find('> div').each(function(){
      allItemCats += $(this).attr('data-project-cat');
    });
    allItemCats = allItemCats.split(' ');
    
    // remove the extra item on the end of blank space
    allItemCats.pop();
    
    // make sure the array has no duplicates
    var itemCats = [];
    $.each(allItemCats, function(i, el){
        if($.inArray(el, itemCats) === -1) {
          itemCats.push(el);
        }
    });


    
    // if user has chosen a set of filters to display - only show those
    var $userSelectedCats;
    
    if(this.$el.is('[data-categories-to-show]') && 
    this.$el.attr('data-categories-to-show').length != 0 && 
    this.$el.attr('data-categories-to-show') != 'all') {
      
      $userSelectedCats = this.$el.attr('data-categories-to-show').replace(/,/g , ' ');
      $userSelectedCats = $userSelectedCats.split(' ');
      
      if(!this.$el.hasClass('infinite_scroll')) {
        this.$el.removeAttr('data-categories-to-show');
      }
      
    } else {
      $userSelectedCats = itemCats;
    }
    
    
    // Find which categories are actually on the current page
    var notFoundCats = [];
    jQuery.grep(isotopeCatArr, function(el) {
      
      if (jQuery.inArray(el, itemCats) == -1) notFoundCats.push(el);
      if (jQuery.inArray(el, $userSelectedCats) == -1) notFoundCats.push(el);
      
    });
    
    // manipulate the list
    if(notFoundCats.length != 0){
      
      this.$el.parent().parent().find('div[class^=portfolio-filters] ul li').each(function(){
        if($(this).find('a').length > 0) {
          if( jQuery.inArray($(this).find('a').attr('data-filter').substring(1), notFoundCats) != -1 ){ 
            
            if($(this).find('> ul.children').length > 0) {
              $(this).find('> a').hide(); 
            } else {
              $(this).hide(); 
            }
            
          } else {
            $(this).show();
          }
        }
      });
      
    }
    
    
  };
  
  
  
  
  
  // portfolio single comment order
  SalientPortfolio.prototype.portfolioCommentOrder = function(){
    
    if($('body').hasClass('mobile') && $('body').hasClass('single-portfolio') && $('#respond').length > 0){
      $('#sidebar').insertBefore('.comments-section');
    }
    
    else if($('body').hasClass('single-portfolio') && $('#respond').length > 0) {
      $('#sidebar').insertAfter('.post-area');
    }
    
  };
  
  
  
  
  
  /*-------------------------------------------------------------------------*/
  /*	2.	Salient Fullscreen Recent Project Slider
  /*-------------------------------------------------------------------------*/
  
  function SalientRecentProjectsFullScreen(el) {
    
    this.$el = el;
    this.rotationSpeed = (el.attr('data-autorotate').length > 0) ? parseInt(el.attr('data-autorotate')) : false;
    this.rotationInterval = null;
    this.$window = $(window);
    
    this.splitLineText();
    this.positionFix();
    this.sliderCalcs();
    this.sliderInit();
    this.resizeHandler();
  }
  
  
  SalientRecentProjectsFullScreen.prototype.resizeHandler = function() {
    $(window).resize(this.sliderCalcs.bind(this));
    $(window).resize(this.splitLineText.bind(this));
  };
  
  SalientRecentProjectsFullScreen.prototype.positionFix = function() {
    
    // remove outside of column setups 
    
    if(this.$el.parents('.span_12').find('> .wpb_column').length > 1){
      var $zoomProjects = this.$el.clone();
      var $zoomProjectsRow = this.$el.parents('.span_12');
      this.$el.remove();
      $zoomProjectsRow.prepend($zoomProjects);
      this.$el = $zoomProjects;
    }

  };
  
  
  SalientRecentProjectsFullScreen.prototype.sliderCalcs = function() {
    
    var $bodyBorderSize = ($('.body-border-top').length > 0 && $(window).width() > 1000) ? $('.body-border-top').height(): 0;
    
    // frontend editor fix
    var usingFrontEndEditor = (typeof window.vc_iframe === 'undefined') ? false : true;
    
    if(usingFrontEndEditor) {
      if(this.$el.parents('.wpb_row').parent().index() > 1) { 
        this.$el.parents('.first-section').removeClass('first-section'); 
      }
    }
    
    if(this.$el.parents('.first-section').length > 0) {
      this.$el.css('height',$(window).height() - this.$el.offset().top - $bodyBorderSize);
    } else {
      this.$el.css('height',$(window).height());
    }
    
    
  };
  
  
  
  SalientRecentProjectsFullScreen.prototype.sliderRotate = function(){

    if($('body.vc_editor').length > 0) { return; }
    
    var $controlSelector = (this.$el.find('.project-slides').length > 0) ? '.dot-nav > span' : '.controls > li';
    var $controlSelectorInd = (this.$el.find('.project-slides').length > 0) ? 'span' : ' li';
    
    var $slideLength  = this.$el.find($controlSelector).length;
    var $currentSlide = this.$el.find($controlSelector+'.active').index();
    
    if( $currentSlide+1 === $slideLength) {
      this.$el.find($controlSelector+':first-child').trigger('click');
    } else {
      this.$el.find($controlSelector+'.active').next($controlSelectorInd).trigger('click');
    }
    
  };
  
  SalientRecentProjectsFullScreen.prototype.sliderResetRotate = function(){
    clearInterval(this.rotationInterval);
    
    // reinit autorotate
    if(this.rotationSpeed != 0) {
      var slide_interval = (this.rotationSpeed < 100) ? 4000 : this.rotationSpeed;
      this.rotationInterval = setInterval(this.sliderRotate.bind(this),slide_interval);
    }
    
  };
  
  
  SalientRecentProjectsFullScreen.prototype.splitLineText = function() {
    
    
    var $slideClass = (this.$el.find('.project-slides').length > 0) ? '.project-slide' : '.nectar-recent-post-slide';
    var $slideInfoClass = (this.$el.find('.project-slides').length > 0) ? '.project-info h1' : '.inner-wrap h2 a';
    
    this.$el.find($slideClass).each(function(i){
      
      $(this).find($slideInfoClass).each(function(){
        
        var textArr = $(this).text();
        textArr = textArr.trim();
        textArr = textArr.split(' ');
        
        $(this)[0].innerHTML = '';
        
        for(var i=0;i<textArr.length;i++) {
          $(this)[0].innerHTML += '<span>'+ textArr[i] + '</span> ';
        }
        
      });
      
      $(this).find($slideInfoClass + ' > span').wrapInner('<span class="inner" />');
      
    });
    

  };
  
  
  SalientRecentProjectsFullScreen.prototype.sliderInit = function() {
    
    
    var $projLength = this.$el.find('.project-slide').length;
    var self = this;
    
    // autorotate
    if(this.rotationSpeed != 0) {
      var slide_interval = (this.rotationSpeed < 100) ? 4000 : this.rotationSpeed;
      this.rotationInterval = setInterval(this.sliderRotate.bind(this),slide_interval);
    }
    
    // next/prev
    this.$el.find('.zoom-slider-controls .next').on('click',function(){
      
      // thres
      var $that = $(this);
      if(!$that.parent().hasClass('timeout')) {
        setTimeout(function(){
          $that.parent().removeClass('timeout');
        },1150);
      }
      
      if($(this).parent().hasClass('timeout')) {
        return false;
      }
      
      $(this).parent().addClass('timeout');
      
      // switch logic
      self.sliderResetRotate();
      
      var $current = $(this).parents('.nectar_fullscreen_zoom_recent_projects').find('.project-slide.current');
      var $sliderInstance = $(this).parents('.nectar_fullscreen_zoom_recent_projects');
      
      $sliderInstance.find('.project-slide').removeClass('next').removeClass('prev');
      $sliderInstance.find('.project-slide').each(function(i){
        
        if(i < $current.index()+1 && $current.index()+1 < $projLength) {
          $(this).addClass('prev');
        }
        else {
          $(this).addClass('next');
        }
        
      });
      
      if($current.index()+1 === $projLength) {
        $sliderInstance.find('.project-slide:first-child').addClass('no-trans');
      }
      
      setTimeout(function(){
        
        if($current.index()+1 === $projLength) {
          $sliderInstance.find('.project-slide:first-child')
            .removeClass('no-trans')
            .removeClass('next')
            .removeClass('prev')
            .addClass('current');
          $sliderInstance.find('.project-slide:last-child')
            .removeClass('next')
            .removeClass('current')
            .addClass('prev');
        } else {
          
          $current
            .next('.project-slide')
            .removeClass('next')
            .removeClass('prev')
            .addClass('current');
          $current
            .removeClass('current')
            .addClass('prev');
        }
        
        // update dot nav
        if($sliderInstance.find('.dot-nav').length > 0) {
          $sliderInstance.find('.dot-nav span.active').removeClass('active');
          $sliderInstance.find('.dot-nav span:nth-child('+ ($sliderInstance.find('.project-slide.current').index() + 1) +')').addClass('active');
        }
        
      },30);
      
      return false;
      
    });
    
    this.$el.find('.zoom-slider-controls .prev').on('click',function(){
      
      // thres
      var $that = $(this);
      if(!$that.parent().hasClass('timeout')) {
        setTimeout(function(){
          $that.parent().removeClass('timeout');
        },1150);
      }
      
      if($(this).parent().hasClass('timeout')) {
        return false;
      }
      
      $(this).parent().addClass('timeout');
      
      self.sliderResetRotate();
      
      // switch logic
      var $current = $(this).parents('.nectar_fullscreen_zoom_recent_projects').find('.project-slide.current');
      var $sliderInstance = $(this).parents('.nectar_fullscreen_zoom_recent_projects');
      
      
      $sliderInstance.find('.project-slide').removeClass('next').removeClass('prev');
      $sliderInstance.find('.project-slide').each(function(i){
        
        if(i < $current.index() || $current.index() == 0) {
          $(this).addClass('prev');
        }
        else {
          $(this).addClass('next');
        }
      });
      
      if($current.index() == 0) {
        $sliderInstance.find('.project-slide:last-child').addClass('no-trans');
      }
      
      setTimeout(function(){
        
        if($current.index() == 0) {
          
          $sliderInstance.find('.project-slide:last-child')
            .removeClass('no-trans')
            .removeClass('next')
            .removeClass('prev')
            .addClass('current');
          $sliderInstance.find('.project-slide:first-child')
            .removeClass('next')
            .removeClass('prev')
            .removeClass('current')
            .addClass('next');
            
        } else {
          $current.prev('.project-slide').removeClass('next').removeClass('prev').addClass('current');
          $current.removeClass('current').addClass('next');
        }
        
        //update dot nav
        if($sliderInstance.find('.dot-nav').length > 0) {
          $sliderInstance.find('.dot-nav span.active').removeClass('active');
          $sliderInstance.find('.dot-nav span:nth-child('+ ($sliderInstance.find('.project-slide.current').index() + 1) +')').addClass('active');
        }
        
      },30);
      
      
      return false;
      
    });
    
    // pagination
    this.$el.find('> .normal-container > .dot-nav').remove();
    this.$el.find('> .normal-container').append('<div class="dot-nav"></div>');
    for(var $i=0;$i < $projLength;$i++) {
      if($i == 0) {
        this.$el.find('.dot-nav').append('<span class="dot active"><span></span></span>');
      } else {
        this.$el.find('.dot-nav').append('<span class="dot"><span></span></span>');
      }
      
    }
    
    
    var $dotIndex = 1;
    
    this.$el.find('.dot-nav > span').on('click',function(){
      
      if($(this).hasClass('active')) {
        return;
      }
      
      // thres
      var $that = $(this);
      if(!$that.parent().hasClass('timeout')) {
        setTimeout(function(){
          $that.parent().removeClass('timeout');
        },1150);
      }
      
      if($(this).parent().hasClass('timeout')) {
        return;
      }
      
      $(this).parent().addClass('timeout');
      
      self.sliderResetRotate();
      
      // switch logic
      $(this).parent().find('span.active').removeClass('active');
      $(this).addClass('active');
      
      $dotIndex = $(this).index() + 1;
      
      var $current = $(this).parents('.nectar_fullscreen_zoom_recent_projects').find('.project-slide.current');
      var $sliderInstance = $(this).parents('.nectar_fullscreen_zoom_recent_projects');
      
      var $prevIndex = $current.index() + 1;
      
      $sliderInstance.find('.project-slide').removeClass('next').removeClass('prev');
      
      $sliderInstance.find('.project-slide').each(function(i){
        if(i < $dotIndex-1) {
          $(this).addClass('prev');
        }
        else {
          $(this).addClass('next');
        }
      });
      
      // going prev
      if($prevIndex > $dotIndex) {
        
        $sliderInstance.find('.project-slide')
          .eq($dotIndex-1)
          .addClass('no-trans')
          .addClass('prev')
          .removeClass('next');
        
        setTimeout(function(){
          
          $sliderInstance.find('.project-slide')
            .eq($dotIndex-1)
            .removeClass('no-trans')
            .removeClass('next')
            .removeClass('prev')
            .addClass('current');
            
          $current
            .removeClass('current')
            .addClass('next');
          
        },30);
        
      } 
      
      // going forawrd
      else {
        $sliderInstance.find('.project-slide').eq($dotIndex-1).addClass('no-trans').addClass('next').removeClass('prev');
        setTimeout(function(){
          $sliderInstance.find('.project-slide').eq($dotIndex-1).removeClass('no-trans').removeClass('next').removeClass('prev').addClass('current');
          $current.removeClass('current').addClass('prev');
        },30);
        
      }
      
    });	
    
    
  };
  
  
  
  /*-------------------------------------------------------------------------*/
  /*	3.	Salient Recent Project Carousel
  /*-------------------------------------------------------------------------*/
  
  function SalientRecentProjectsCarousel(el) {
    
    this.$el = el;
    
    this.carouselInit();
    this.resizeHandler();
    
  }
  
  
  SalientRecentProjectsCarousel.prototype.resizeHandler = function() {
    $(window).resize(this.carouselHeightCalcs.bind(this));
  };
  
  SalientRecentProjectsCarousel.prototype.carouselInit = function() {
    
    var $that = this.$el; 
    var self = this;
    var maxCols = (this.$el.parents('.carousel-wrap').attr('data-full-width') === 'true') ? 'auto' : 3 ;
    var scrollNum = (this.$el.parents('.carousel-wrap').attr('data-full-width') === 'true') ? 'auto' : '' ;
    var colWidth = (this.$el.parents('.carousel-wrap').attr('data-full-width') === 'true') ? 500 : 453 ;
    var scrollSpeed, easing;
    var $autoplayBool = (this.$el.attr('data-autorotate') === 'true') ? true : false;
    var $themeSkin, $themeSkin2;
    
    if($('body.ascend').length > 0 && this.$el.parents('.carousel-wrap').attr('data-full-width') !== 'true' || 
    $('body.material').length > 0 && this.$el.parents('.carousel-wrap').attr('data-full-width') !== 'true') {
      
      if(this.$el.find('li').length % 3 === 0) {
        $themeSkin = true;
        $themeSkin2 = true;
      } else {
        $themeSkin = false;
        $themeSkin2 = true;
      }
      
    } else {
      $themeSkin = true;
      $themeSkin2 = true;
    }
    
    (parseInt(this.$el.attr('data-scroll-speed'))) ? scrollSpeed = parseInt(this.$el.attr('data-scroll-speed')) : scrollSpeed = 700;
    (this.$el.is('[data-easing]')) ? easing = this.$el.attr('data-easing') : easing = 'linear';
    
    // Handle coloring.
    this.$el.find('.col').each(function() {
      if ($(this).has('[data-project-color]')) { 
        $(this).find('.work-info-bg, .bottom-meta').css('background-color',$(this).attr('data-project-color'));
      }
    });
    
    var $element = $that;
    if($that.find('img').length === 0) { 
      $element = $('body'); 
    }
    
    imagesLoaded($element,function(){
      
      $that.carouFredSel({
        circular: $themeSkin,
        infinite: $themeSkin2,
        height : 'auto',
        responsive: true,
        items       : {
          width : colWidth,
          visible     : {
            min         : 1,
            max         : maxCols
          }
        },
        swipe       : {
          onTouch     : true,
          onMouse         : true,
          options      : {
            excludedElements: "button, input, select, textarea, .noSwipe",
            tap: function(event, target){ 
              if($(target).attr('href') && 
              !$(target).is('[target="_blank"]') && 
              !$(target).is('[data-fancybox^="group_"]') && 
              !$(target).is('[rel^="prettyPhoto"]') && 
              !$(target).is('.magnific-popup') && 
              !$(target).is('.magnific')) {
                window.open($(target).attr('href'), '_self'); 
              }
            }
          },
          onBefore : function(){
            // hover effect fix
            $that.find('.work-item').trigger('mouseleave');
            $that.find('.work-item .work-info a').trigger('mouseup');
          }
        },
        scroll: {
          items			: scrollNum,
          easing          : easing,
          duration        : scrollSpeed,
          onBefore	: function( data ) {
            
            if($('body.ascend').length > 0 && $that.parents('.carousel-wrap').attr('data-full-width') != 'true' || 
            $('body.material').length > 0 && $that.parents('.carousel-wrap').attr('data-full-width') != 'true') {
              $that.parents('.carousel-wrap').find('.item-count .total').html(Math.ceil($that.find('> li').length / $that.triggerHandler("currentVisible").length));
              
            }	
          },
          onAfter	: function( data ) {
            if($('body.ascend').length > 0 && $that.parents('.carousel-wrap').attr('data-full-width') != 'true' || 
            $('body.material').length > 0 && $that.parents('.carousel-wrap').attr('data-full-width') != 'true') {
              $that.parents('.carousel-wrap').find('.item-count .current').html( $that.triggerHandler('currentPage') +1);
              $that.parents('.carousel-wrap').find('.item-count .total').html(Math.ceil($that.find('> li').length / $that.triggerHandler("currentVisible").length));
              
            }	
          }
          
        },
        prev    : {
          button  : function() {
            return $that.parents('.carousel-wrap').find('.carousel-prev');
          }
        },
        next    : {
          button  : function() {
            return $that.parents('.carousel-wrap').find('.carousel-next');
          }
        },
        auto    : {
          play: $autoplayBool
        }
      }, { transition: true }).animate({'opacity': 1},1300);
      
      $that.parents('.carousel-wrap').wrap('<div class="carousel-outer">');
      
      if($that.parents('.carousel-wrap').attr('data-full-width') === 'true') {
        $that.parents('.carousel-outer').css('overflow','visible');
      }
      
      // add count for non full width ascend skin
      if($('body.ascend').length > 0 && $that.parents('.carousel-wrap').attr('data-full-width') != 'true' || 
      $('body.material').length > 0 && $that.parents('.carousel-wrap').attr('data-full-width') != 'true') {
        $('<div class="item-count"><span class="current">1</span>/<span class="total">'+($that.find('> li').length / $that.triggerHandler("currentVisible").length) +'</span></div>').insertAfter($that.parents('.carousel-wrap').find('.carousel-prev'));
      }
      
      $that.addClass('finished-loading');
      
      self.carouselHeightCalcs();
      
    });//images loaded
    
    
    
    
  };
  
  
  
  SalientRecentProjectsCarousel.prototype.carouselHeightCalcs = function(){
    
    if( !this.$el.hasClass('finished-loading') ) { 
      return; 
    }
    
    var that = this;
    var bottomSpace = (this.$el.parents('.carousel-wrap').attr('data-full-width') === 'true' && this.$el.find('.style-2, .style-3, .style-4').length > 0) ? 0 : 28 ;
    var tallestMeta = 0;
    
    this.$el.find('> li').each(function(){
      ($(this).find('.work-meta').height() > tallestMeta) ? tallestMeta = $(this).find('.work-meta').height() : tallestMeta = tallestMeta;
    });	
    
    setTimeout(function(){
      that.$el.parents('.caroufredsel_wrapper').css({
        'height' : (that.$el.find('.work-item').outerHeight() + tallestMeta + bottomSpace -2) + 'px'
      });
    },30);
  
    
    if($('body.ascend').length > 0 && this.$el.parents('.carousel-wrap').attr('data-full-width') != 'true' || 
    $('body.material').length > 0 && this.$el.parents('.carousel-wrap').attr('data-full-width') != 'true') {
      this.$el.parents('.carousel-wrap').find('.item-count .current').html(Math.ceil((this.$el.triggerHandler("currentPosition")+1)/this.$el.triggerHandler("currentVisible").length));
      this.$el.parents('.carousel-wrap').find('.item-count .total').html(Math.ceil(this.$el.find('> li').length / this.$el.triggerHandler("currentVisible").length));
    }	
    
    
  };
  
  
  window.SalientPortfolio = SalientPortfolio;
  window.SalientRecentProjectsFullScreen = SalientRecentProjectsFullScreen;
  window.SalientRecentProjectsCarousel = SalientRecentProjectsCarousel;
  
  
}( jQuery ));



/*
* jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
*/
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b+c;return-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b+c;return d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b+c;return-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b*b+c;return d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){if(b==0)return c;if(b==e)return c+d;if((b/=e/2)<1)return d/2*Math.pow(2,10*(b-1))+c;return d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){if((b/=e/2)<1)return-d/2*(Math.sqrt(1-b*b)-1)+c;return d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;if(!g)g=e*.3*1.5;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);if(b<1)return-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c;return h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;if((b/=e/2)<1)return d/2*b*b*(((f*=1.525)+1)*b-f)+c;return d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){if((b/=e)<1/2.75){return d*7.5625*b*b+c}else if(b<2/2.75){return d*(7.5625*(b-=1.5/2.75)*b+.75)+c}else if(b<2.5/2.75){return d*(7.5625*(b-=2.25/2.75)*b+.9375)+c}else{return d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}},easeInOutBounce:function(a,b,c,d,e){if(b<e/2)return jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c;return jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})


//visible
!function(t){var i=t(window);t.fn.visible=function(t,e,o){if(!(this.length<1)){var r=this.length>1?this.eq(0):this,n=r.get(0),f=i.width(),h=i.height(),o=o?o:"both",l=e===!0?n.offsetWidth*n.offsetHeight:!0;if("function"==typeof n.getBoundingClientRect){var g=n.getBoundingClientRect(),u=g.top>=0&&g.top<h,s=g.bottom>0&&g.bottom<=h,c=g.left>=0&&g.left<f,a=g.right>0&&g.right<=f,v=t?u||s:u&&s,b=t?c||a:c&&a;if("both"===o)return l&&v&&b;if("vertical"===o)return l&&v;if("horizontal"===o)return l&&b}else{var d=i.scrollTop(),p=d+h,w=i.scrollLeft(),m=w+f,y=r.offset(),z=y.top,B=z+r.height(),C=y.left,R=C+r.width(),j=t===!0?B:z,q=t===!0?z:B,H=t===!0?R:C,L=t===!0?C:R;if("both"===o)return!!l&&p>=q&&j>=d&&m>=L&&H>=w;if("vertical"===o)return!!l&&p>=q&&j>=d;if("horizontal"===o)return!!l&&m>=L&&H>=w}}}}(jQuery);




jQuery(document).ready(function($) {
  
  "use strict";
  
  // when not using Salient, get things rollin'
  if( nectar_theme_info.using_salient != 'true' ) {
    
    // portfolio el.
    var portfolioArr = [];
    
    $('.portfolio-items:not(.carousel)').each(function(i){
      
      $(this).attr('instance',i);
      $(this).parent().parent().find('div[class^=portfolio-filters]').attr('instance',i);
      
			portfolioArr[i] = new SalientPortfolio($(this));
		});
    
    // fullscreen project slider.
    
    var fsProjectSliderArr = [];
    
    $('.nectar_fullscreen_zoom_recent_projects').each(function(i){      
			fsProjectSliderArr[i] = new SalientRecentProjectsFullScreen($(this));
		});
    
    
    // project carousel.
    var projectCarouselArr = [];
    $('ul.portfolio-items.carousel').each(function(i){
      projectCarouselArr[i] = new SalientRecentProjectsCarousel($(this));
    });

  }
  
});
