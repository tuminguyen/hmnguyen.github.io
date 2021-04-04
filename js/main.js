(function($) {
 
    $('.main-slider').owlCarousel({
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: false,
        loop:true,
        nav:true,
        dots: false,
        autoHeight: false,
        navText : ["<img src='image/prevarrow.png' />","<img src='image/nextarrow.png' />"],
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    })

    $('.demo-slider').owlCarousel({
        autoplay: true,
        autoplayTimeout: 1800,
        autoplayHoverPause: true,
        // loop:true,
        margin:10,
        nav:true,
        autoHeight:true,
        autoHeightClass: 'owl-height',
        pagination: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    })
    
    $(window).on('scroll', function () {
        if ( $(window).scrollTop() > 10 ) {
             $('.navbar').addClass('active');
        } else {
             $('.navbar').removeClass('active');
        }
    });
})(jQuery);