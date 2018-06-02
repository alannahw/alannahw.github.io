var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$logos = $( '#pt-logos' ).children( 'div.pt-logo' ),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrEl = false,
		endNextEl = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );
		$logos.each( function() {
			var $logo = $( this );
			$logo.data( 'originalClassList', $logo.attr( 'class' ) );
		} );

		var stateObject = {};
		if (window.location.pathname == '/teapotchemistry/index.php'){
	    	history.pushState(stateObject,"Teapot Chemistry Home",'/teapotchemistry/index.php#home'); ;
	    }
		var path = window.location.href;
	    var pathId = path.split('#')[1];
	    highlightLink(pathId);

		$pages.eq( 0 ).addClass( 'pt-page-current' );
		//$logos.eq( 0 ).addClass( 'pt-page-current' );

		$('li.navlinks').click(function(){
			var nextlink = this.id.split("-")[0];
			var page = $('#' + nextlink);
			var logo = $('#' + nextlink + '-logo');
			highlightLink(nextlink);
			//nextEl( logo, $logos, 'pt-page-moveFromLeft', 'pt-page-moveToLeft' );
			nextEl( page, $pages, 'pt-page-moveFromRight', 'pt-page-moveToLeft' );
			
		});

	}

	function highlightLink(activeLink) {
		$("li.navlinks a").each(function () {
			var link = $(this);
			var href = $(this).attr('href');
			link.removeClass('active');
			if (href == '#'+activeLink){
	            link.addClass('active');
	        }
	    });
	}

	function nextEl(el, els, inClass, outClass) {

		
		var $currEl = '';
		els.each( function( index, element ){
			if ($(this).hasClass('pt-page-current')) {
				$currEl = $(this);
			}
		});
		if (el[0].id == $currEl[0].id) {
			return false;
		}

		if( isAnimating == el ) {
			return false;
		}

		isAnimating = el;
		var $nextEl = el.addClass( 'pt-page-current' );

		$currEl.addClass( outClass ).on( animEndEventName, function() {
			$currEl.off( animEndEventName );
			endCurrEl = true;
			if( endNextEl ) {
				onEndAnimation( $currEl, $nextEl );
			}
		} );

		$nextEl.addClass( inClass ).on( animEndEventName, function() {
			$nextEl.off( animEndEventName );
			endNextEl = true;
			if( endCurrEl ) {
				onEndAnimation( $currEl, $nextEl );
			}
		} );

		if( !support ) {
			onEndAnimation( $currEl, $nextEl );
		}

	}



	function onEndAnimation( $outEl, $inEl ) {
		endCurrEl = false;
		endNextEl = false;
		resetPage( $outEl, $inEl );
		isAnimating = false;
	}

	function resetPage( $outEl, $inEl ) {
		$outEl.attr( 'class', $outEl.data( 'originalClassList' ) );
		$inEl.attr( 'class', $inEl.data( 'originalClassList' ) + ' pt-page-current' );

	}

	init();

	return { 
		init : init,
		nextEl : nextEl,
	};

})();