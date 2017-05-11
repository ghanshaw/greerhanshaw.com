function bindMenu() {

    // Get key page attributes
    var windowScroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    var docHeight = $(document).height()
    
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
    var windowHeight = $(window).height();
    var openHeight = windowHeight * 0.4;
    var closeHeight = windowHeight;
    var pullmenuOffset = parseInt($('.pullmenu').css('top'), 10);
    var pullmenuHeight = $pullmenu.height();



    var isOverOpenHeight = false;

    var isOpen = false;

    console.log('pullme');
    console.log($body);
    console.log($menu);
    
    
    
    
    $(document).on('resize', function() {
        windowHeight = $(window).height();  
        maxMenuHeight =  windowHeight - pullmenuHeight;
        
        if (isOpen) {
            $('.menu').height(maxMenuHeight);
        }
    })
    
    
    function openMenu() {      
        console.log('Opening menu');
        
        isOpen = true;
        
        
        menuHeight = $('.menu').height();
             
        distanceLeft = windowHeight - menuHeight;
        maxMenuHeight = windowHeight - pullmenuHeight;
        
        // Pull down menu
        $menu.animate({
            height: maxMenuHeight
        }, {
            duration: Math.max(distanceLeft, 200),
            step: function(now) {
                //console.log('Now I\'m: ' + now);
                //console.log('Degrees: ' + 45 * now/$windowHeight);
                currentHeight = now;
                
                $bar1.css('opacity', 1 - currentHeight/maxMenuHeight);
                $bar2.css('transform', 'rotate(' + 45 * currentHeight/maxMenuHeight + 'deg)');
                $bar3.css('transform', 'rotate(' + -45 * currentHeight/maxMenuHeight + 'deg)');
                $bar4.css('opacity', 1 - currentHeight/maxMenuHeight);

            },
            
        })  

        
        // Add grey overlay beneath menu
        $('.menu-overlay').show();
        $('body').css('overflow', 'hidden');
        $('.menu-overlay').css('overflow-y', 'scroll');

        $('.menu-overlay').animate({
            opacity: .7
            }, {
            duration: Math.max(distanceLeft, 200),
        })
        
                                   

    }
    
    function closeMenu() {
        
        console.log('Closing menu');
        
        isOpen = false;
        
        menuHeight = $('.menu').height();
        console.log(Math.max(menuHeight, 2000));
        
        $menu.css('overflow', 'hidden');
        
        // Pull up menu
        $menu.animate({
            height: 0
        }, {
            duration: Math.max(menuHeight, 200),
            step: function(now) {
                //console.log('Now I\'m: ' + now);
                //console.log('Degrees: ' + 45 * now/$windowHeight);
                currentHeight = now;
                
                $bar1.css('opacity', 1 - currentHeight/maxMenuHeight);
                $bar2.css('transform', 'rotate(' + 45 * currentHeight/maxMenuHeight + 'deg)');
                $bar3.css('transform', 'rotate(' + -45 * currentHeight/maxMenuHeight + 'deg)');
                $bar4.css('opacity', 1 - currentHeight/maxMenuHeight);

            },
        })

        
        $('body').css('overflow', 'initial');
        
        // Remove grey overlay beneath menu
        $('.menu-overlay').animate({
            opacity: 0
            }, {
            duration: Math.max(windowHeight, 200),
            complete: function(){
                $('.menu-overlay').hide();
                //$('.menu-overlay').css('overflow-y', 'hidden');
            }
        })
        
    }
    
    
    var menuItems = document.getElementsByClassName('item');
    hammerItems = []
    
    function itemTap() {
        console.log('Tapped item; close menu; go to section');
        closeMenu();
    }
    
    for (var i = 0; i < menuItems.length; i++) {
        console.log('initiate them!');
        
        hammerItems[i] = new Hammer(menuItems[i], {});
        hammerItems[i].get('doubletap').set({ enable: false });
        hammerItems[i].get('press').set({ enable: false });
        hammerItems[i].get('pan').set({ enable: false });
        hammerItems[i].on('tap', itemTap);
        
    }
    
    console.log('HammerItems');
    console.log(hammerItems);
    
    //hammerItems.get('doubletap').set({ enable: false });
    //hammerItems.get('press').set({ enable: false });
    //hammerItems.get('pan').set({ enable: false });
    
    var pullmenuWrapper = document.getElementById('pullmenu-wrapper');
    var hammerPull = new Hammer(pullmenuWrapper, {});
    
    // Disable unneccessary actions (recognizers)
    hammerPull.get('doubletap').set({ enable: false });
    hammerPull.get('press').set({ enable: false });
    
    // Set pan to vertical direction
    hammerPull.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
    
    $menu = $('.menu');
    var menuHeight = $menu.height();
    
    hammerPull.on('pan', function(e) {
        
        console.log('Panning it');
        
        if (isOpen) { return; }
        
        distanceY = e.deltaY;
        
        menuHeight = $(menu).height();
        
        // Confirm pullmenu offset (distance from top) is an integer
        //pullmenuOffset = Number.isInteger(pullmenuOffset) ? pullmenuOffset : 0;
        
        maxMenuHeight = windowHeight - pullmenuHeight;
        
        
        distancePercent = distanceY / (windowHeight - pullmenuHeight - pullmenuOffset);
        degreeOffset = 45 * distancePercent;
        
        opacityFactor = 1 - ((distancePercent) * 1.5);
        
        console.log('degreeOffset: ' + degreeOffset);
        console.log('distanceY: ' + distanceY);
        console.log('isOpen: ' + isOpen);
        console.log('menuHeight: ' + menuHeight);
        console.log('openHeight: ' + openHeight);


        // Slowly increase height of menu and transofrmation of menu icon
        if (distanceY <= maxMenuHeight) {
            $menu.css('height', distanceY);
            $pullmenu.find('.bar1').css('opacity', opacityFactor);
            $pullmenu.find('.bar2').css('transform', 'rotate(' + degreeOffset + 'deg)');
            $pullmenu.find('.bar3').css('transform', 'rotate(' + -degreeOffset + 'deg)');
            $pullmenu.find('.bar4').css('opacity', opacityFactor);
        }
        
        pullmenuAndMenuHeight = $('.menu-wrapper').height();
        
        /*if (pullmenuAndMenuHeight >= $(window).height()) {
            console.log('Too tall');
            hammerPull.stop();
            openMenu();
            //hammerPull.trigger('panend', e);
        }*/
        

        
        // Snap menu open or closed
        
    })
    
    hammerPull.on('panend', function(e) {
        
        // If menu is halfway through window's height, pull menu to bottom
        if (!isOpen && menuHeight >= openHeight) {
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

        
        
    })
  
    
    hammerPull.on('tap', function(e) {
        console.log('Tap dat!');
        
        // If menu is closed, open it
        if (!isOpen) {
            console.log('Tapped, Wasn\'t open, open it');
            
            openMenu();
        } 
        
        
        // Otherwise, closed it
        else if (isOpen) {
            console.log("Tapped, open already, close it")
            closeMenu();
        }
        

    })
    
    hammerPull.on('swipe', function(e) {
        console.log('Swiper is swiping');
    })
    

}