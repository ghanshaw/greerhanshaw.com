function bindMenu() {

    var $body = $('.body');
    var $menu = $('.menu');
    var $pullmenu = $('.menu-wrapper .pullmenu');
    var $bar1 = $pullmenu.find('.bar1');
    var $bar2 = $pullmenu.find('.bar2');
    var $bar3 = $pullmenu.find('.bar3');
    var $bar4 = $pullmenu.find('.bar4');
    
    
    var mousedown = false;
    var mousestart = 0;
    var mousenow = 0;
    var mousediff = 0;
    var defaultHeight = menuheight = $menu.height();
    var $windowHeight = $('html, body').height();
    var openHeight = $windowHeight * 0.4;
    var closeHeight = $windowHeight;



    var isOverOpenHeight = false;

    var isOpen = false;

    console.log('pullme');
    console.log($body);
    console.log($menu);
    
    
    
    
    function openMenu() {
        
        console.log('Open menu');
        
        isOpen = true;
        
        menuOffset = $windowHeight - $pullmenu.height() - 10;
        
        offsetPercent = menuOffset / $windowHeight;
        
        // Pull down menu
        $menu.animate({
            height: $windowHeight - $pullmenu.height() - 10
        }, {
            duration: Math.max($windowHeight - $menu.height(), 200),
            step: function(now) {
                //console.log('Now I\'m: ' + now);
                //console.log('Degrees: ' + 45 * now/$windowHeight);
                
                $bar1.css('opacity', 1 - now/$windowHeight);
                $bar2.css('transform', 'rotate(' + 45 * now/$windowHeight + 'deg)');
                $bar3.css('transform', 'rotate(' + -45 * now/$windowHeight + 'deg)');
                $bar4.css('opacity', 1 - now/$windowHeight);

            },
            
        })  

        // Add grey overlay beneath menu
        $('.menu-overlay').show();
        $('body').css('overflow', 'hidden');
        $('.menu-overlay').css('overflow-y', 'scroll');

        $('.menu-overlay').animate({
            opacity: .7
            }, {
            duration: Math.max($windowHeight - $menu.height(), 200),
        })
                                   

    }
    
    function closeMenu() {
        
        console.log('Close menu');
        
        isOpen = false;
        
        // Pull up menu
        $menu.animate({
            height: 0
        }, {
            duration: Math.max($windowHeight, 200),
            step: function(now) {
                //console.log('Now I\'m: ' + now);
                //console.log('Degrees: ' + 45 * now/$windowHeight);
                
                $bar1.css('opacity', 1 - now/$windowHeight);
                $bar2.css('transform', 'rotate(' + 45 * now/$windowHeight + 'deg)');
                $bar3.css('transform', 'rotate(' + -45 * now/$windowHeight + 'deg)');
                $bar4.css('opacity', 1 - now/$windowHeight);

            },
        })


        // Pull up pullmenu
        $pullmenu.animate({
            //bottom: -$pullmenu.height()
            
        }, {
            duration: Math.max($windowHeight, 200),
            complete: function() {
                // Everytime user releases pullmenu, becomes fixed
                // $pullmenu.css('bottom', 'auto');
                // $pullmenu.removeClass('fixed-absolute');
            }
        })
        
        $('body').css('overflow', 'initial');
        
        // Remove grey overlay beneath menu
        $('.menu-overlay').animate({
            opacity: 0
            }, {
            duration: Math.max($windowHeight, 200),
            complete: function(){
                $('.menu-overlay').hide();
                //$('.menu-overlay').css('overflow-y', 'hidden');
            }
        })
        

        
    }
    
    // Clicking the pullmenu opens the menu fully
    $pullmenu.on('click touch', function(e) {
                
        mousenow = e.pageY;
        
        // If mouse hasn't moved, its a click. Return.
        if (mousestart - mousenow != 0) {
            console.log("Inside 'click' section: It\'s not a click");   
            return;
        }
        
        "Inside 'click' section: It's a click."
        
        $(this).toggleClass('change');
        
        if (!isOpen) {

            openMenu();
            
        } else if (isOpen) {
            
            closeMenu();

        }
        
        return;
        
    })
    
    
    // Start dragging or clicking
    $pullmenu.on('mousedown touchstart', function(e) {

        mousedown = true;
        mousestart = e.pageY;
        menuHeight = $menu.height();
        
        $menu.addClass('mousedown');    // cursor: grabbing
        
        // Every time user clicks pullmene, becomes absolute
        // $pullmenu.addClass('fixed-absolute');
        // $pullmenu.css('bottom', -$pullmenu.height() - 10);
        
    });

    // Releasing drag
    $(document).on('mouseup touchend', function(e) {
        mousenow = e.pageY;
        console.log(mousenow);

        // Remove mousedown properties
        mousedown = false;
        $menu.removeClass('mousedown'); 
        
        
        
        // If mouse hasn't moved, its a click. Return.
        if (mousestart - mousenow == 0) {
            console.log("Inside 'drag' section, but it\'s a click");   
            return;
        }
        

        
        // If menu is halfway through window's height, pull menu to bottom
        if (!isOpen && $menu.height() >= openHeight) {
            console.log('Wasn\'t open, far enough');
            
            openMenu();
        } 
        // Otherwise, push menu back to top of screen
        else if (!isOpen && $menu.height() < openHeight) {
            console.log("Wasn't open, not far enough")
            closeMenu();
        }
        
        // If menu is already open, and user drags anywhere, close it
        else if (isOpen) {
            console.log("Was open");
            closeMenu();
        } 


        return;
        
    });

    $(document).on('mousemove touchmove', function(e) {
        if (!mousedown) {
            return;
        }

        mousenow = e.pageY;
        mousediff = mousenow - mousestart;
        
        distancePercent = mousediff / ($windowHeight - $pullmenu.height());
        degreeOffset = 45 * distancePercent;
        widthOffset = 1 - (distancePercent) * 2;


        // Slowly increase height of menu and offset of pullmenu
        if (mousediff > 0) {
            $menu.css('height', menuHeight + mousediff);
            $pullmenu.find('.bar1').css('opacity', widthOffset);
            $pullmenu.find('.bar2').css('transform', 'rotate(' + degreeOffset + 'deg)');
            $pullmenu.find('.bar3').css('transform', 'rotate(' + -degreeOffset + 'deg)');
            $pullmenu.find('.bar4').css('opacity', widthOffset);
            //$pullmenu.css('bottom', $windowHe);
        }
        
        // Slowly increase offset of pullmenu
        
        
        // Iterate through each item in menu, expaning the height of each item slowly
        $('.menu .item').each(function() {
            //var menuBottom = $('.menu').offset().top + $('.menu').height();
            //var itemTop = $(this).offset().top;
        });
        
                   
    });

}