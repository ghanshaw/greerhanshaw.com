//***************************************************************//
//***************************************************************//
//
// Create functionality of pull navigation. Pull navigation
// consists of pull navigation menu (the ul of links) and 
// pull nav handle (div of icons used to interact with nav)
//
//***************************************************************//
//***************************************************************//




//*************************************************//
// Implement functionality of the pull navigation
// Bind pull nav to various events (tap, pan, etc.)
//*************************************************//
function applyPullNav() {

    //-------------------------------//
    // Global Variables
    //-------------------------------//
    
    // Create pull nav variables    
    var $pullNav = $('.pull-nav');
    var $pullNavMenu = $('.pull-nav-menu');
    var $pullNavHandle = $('.pull-nav-handle');
    
    // Flag indicating if pull nav is open
    var isOpen = false; 
    
    // Create variables for each bar in pull nav handle
    var $bar1 = $('.pull-nav-handle .bar1');
    var $bar2 = $('.pull-nav-handle .bar2');
    var $bar3 = $('.pull-nav-handle .bar3');
    var $bar4 = $('.pull-nav-handle .bar4');
    
    
    // Height of pull nav handle
    var pullHandleHeight = $pullNavHandle.height();

    // Hammer instances
    var hammerPullHandle;
    var hammerMenuItems;
    
    //-------------------------------//
    // Initialize Hammer Instances
    //-------------------------------//
    
    createHammerInstance();
    
    //*************************************************//
    // Create new hammer instances; allow pull-nav to detect mobile gestures
    //*************************************************//
    function createHammerInstance() {
    
        // Get list of pull nav menu links
        var pullNavMenuLinks = document.getElementsByClassName('pull-nav-menu-link');
    
        // Array to store hammer instances of pull nav items (global variable)
        hammerMenuLinks = []
    
        // Create new hammer instance for each HTMLDocumentpull nav item
        for (var i = 0; i < pullNavMenuLinks.length; i++) {

            hammerMenuLinks[i] = new Hammer(pullNavMenuLinks[i], {});
            hammerMenuLinks[i].get('doubletap').set({ enable: false });
            hammerMenuLinks[i].get('press').set({ enable: false });
            hammerMenuLinks[i].get('pan').set({ enable: false });
            
            // Call method whenever user clicks link in pull nav
            hammerMenuLinks[i].on('tap', function(event) {
                menuItemTap(event);
            });

        }
    
        // Create new hammer instance for pull nav handle (global variable)
        var pullNavHandle = document.getElementById('pull-nav-handle');
        hammerPullHandle = new Hammer(pullNavHandle, {});
    
        // Disable unneccessary actions (recognizers)
        hammerPullHandle.get('doubletap').set({ enable: false });
        hammerPullHandle.get('press').set({ enable: false });
    
        // Set pan to vertical direction
        hammerPullHandle.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
        
    }
    
 
    //*************************************************//
    //  Close pull nav  and scroll to section 
    //  when user taps/clicks menu link
    //*************************************************// 
    function menuItemTap(event) {
        
        // Close pull nav
        closePullNav();
        
        // Note: following logic mirrors scroll animation in script.js
        // Stop default event behavior
        event.preventDefault();

        // Exit if link is also theme button
        if (event.target.id == 'theme-button-pull-nav') {
            
            // Simulate click event to change theme
            $('#theme-button-pull-nav').click()
            return;
        }
        
        // The section corresponding to the link user clicks  (pull nav)
        target = $(event.target.hash);
        
        $('body, html').animate ({
            // Scroll body to the distance of that target's offset from the top
            scrollTop: target.offset().top
        }, {
            duration: 800
        });    
        
    }
    
    //*************************************************//
    // Close pull nav when window changes from portrait to landscape
    // Implemented due to nav issues on larger screens
    //*************************************************//
    $(window).on('orientationchange', function(event) {
        
        /* 
        /  On tablets, window transitions from
        /  pull nav to side nav during landscape change.
        /  This causes problems because mouse events are disabled
        /  when pull nav is open.
        */
        
        var screenWidth = screen.width;
        var screenHeight = screen.height;
        var isLargeScreen = false;
        
        if (screenWidth >= 768 || screenHeight >= 768) {
            isLargeScreen = true;
        }
        
        // Close nav if nav is open and screen is larger
        if (isOpen && isLargeScreen) {
            
            // Close navigation
            closePullNav();
            
        }
        
    })
    
    //*************************************************//
    //  Resize pull nav when window's dimentions change
    //*************************************************//
    $(window).on('resize', function() {
        
        // Get current height of window (viewport)
        var windowHeight = $(window).height();
                
        // Get maximum height of pull nav menu (viewport height - pull nav handle)
        var maxPullMenuHeight = windowHeight - pullHandleHeight;
        
        if (isOpen) {
        
            $('.pull-nav-menu').height(maxPullMenuHeight);
        }
        
    });
    

    //*************************************************//
    //  Open pull nav fully
    //*************************************************//    
    function openPullNav() {      
        
        // Set flag to true, indicating menu is open
        isOpen = true;
        
        // Get current height of window (viewport)
        var windowHeight = $(window).height();
        
        // Get current height of window (viewport) and pull menu
        var pullMenuHeight = $pullNavMenu.height();
             
        // Compute amount of viewport not travelled
        var distanceLeft = windowHeight - pullMenuHeight;
        
        // Get maximum height of pull nav menu (viewport height - pull nav handle)
        var maxPullMenuHeight = windowHeight - pullHandleHeight;
        
        // Animate opening of pull nav (by increasing height of pull nav menu)
        $pullNavMenu.animate({
            height: maxPullMenuHeight
        }, {
            duration: Math.max(distanceLeft, 200),
            
            // Implement gradual pull nav handle transformation
            // Handle icons rotate with distance travelled
            step: function(now) {

                currentHeight = now;
                
                $bar1.css('opacity', 1 - currentHeight/maxPullMenuHeight);
                $bar2.css('transform', 'rotate(' + 45 * currentHeight/maxPullMenuHeight + 'deg)');
                $bar3.css('transform', 'rotate(' + -45 * currentHeight/maxPullMenuHeight + 'deg)');
                $bar4.css('opacity', 1 - currentHeight/maxPullMenuHeight);
                
            },
        });  

        
        // Show grey overlay beneath pull nav after opening
        $('.pull-nav-overlay').show();
        
        // Disable scrolling when menu is open (only works for desktop)
        $('body').css('overflow', 'hidden');
        $('body').css('position', 'relative');
        
        // Deactivate scrolling (necessary for mobile)
        $(document).on('touchstart touchmove', false); 
                         
        // Add scroll bar to overlay to maintain width of page,
        // (prevents elements from jumping when scrolling is disabled)
        $('.pull-nav-overlay').css('overflow-y', 'scroll');

        // Animate appearance of grey overlay
        $('.pull-nav-overlay').fadeTo(Math.max(distanceLeft, 200), 0.7);               

    }

    //*************************************************//
    //  Close pull nav fully
    //*************************************************//    
    function closePullNav() {
        
        // Set flag to false, indicating menu is closed
        isOpen = false;
        
        // Reactivate scrolling capabilities
        $(document).off('touchstart touchmove', false); 
        
        // Get current height of window (viewport)
        var windowHeight = $(window).height();
        
        // Get current pull menu height
        var pullMenuHeight = $pullNavMenu.height();
        
        // Get maximum height of pull nav menu (viewport height - pull nav handle)
        var maxPullMenuHeight = windowHeight - pullHandleHeight; 
        
        //$menu.css('overflow', 'hidden');
        
        // Animate closing of pull nav (by decreasing height of pull nav menu)
        $pullNavMenu.animate({
            height: 0
        }, {
            duration: Math.max(pullMenuHeight, 200),
            step: function(now) {

                currentHeight = now;
                
                $bar1.css('opacity', 1 - currentHeight/maxPullMenuHeight);
                $bar2.css('transform', 'rotate(' + 45 * currentHeight/maxPullMenuHeight + 'deg)');
                $bar3.css('transform', 'rotate(' + -45 * currentHeight/maxPullMenuHeight + 'deg)');
                $bar4.css('opacity', 1 - currentHeight/maxPullMenuHeight);

            },
        })

        // Reenable scrolling on body
        $('body').css('overflow', 'initial');        
        
        // Animate disappearance of grey overlay
        $('.pull-nav-overlay').fadeTo(Math.max(pullMenuHeight, 200), 0, function() {
            
            // Hide pull nav overlay after fade is complete
            $('.pull-nav-overlay').hide();
            
        });   
        
    }
    
    
    //*************************************************//
    //  Bind pull nav to panning gesture (dragging on desktop)
    //  Increase size of pull nav items as user pans
    //*************************************************//
    hammerPullHandle.on('pan', function(e) {
        
        // Don't pan if menu is open
        if (isOpen) { return; }
        
        // Get current height of window (viewport)
        var windowHeight = $(window).height();
        
        // Get vertical distance travelled by user
        distanceY = e.deltaY;

        // Get maximum height of pull nav menu (viewport height - pull nav handle)
        maxPullMenuHeight = windowHeight - pullHandleHeight;
        
        // Get distance travelled as percent of maximum allowable distance 
        distancePercent = distanceY / maxPullMenuHeight;
        
        // Get degree offset from [0, 45] with respect to distance travelled
        degreeOffset = 45 * distancePercent;
        
        // Get opacity factor, opacity at given distance travelled
        // Opacity decreases to 0 before distance travelled is 100%
        opacityFactor = 1 - ((distancePercent) * 1.5);
        
        /*console.log('degreeOffset: ' + degreeOffset);
        console.log('distanceY: ' + distanceY);
        console.log('isOpen: ' + isOpen);
        console.log('maxPullMenuHeight: ' + maxPullMenuHeight);
        console.log('openHeight: ' + openHeight);*/


        // Slowly increase height of pull nav and transform pull nav handle
        if (distanceY <= maxPullMenuHeight) {
            
            $pullNavMenu.css('height', distanceY);
            
            $bar1.css('opacity', opacityFactor);
            $bar2.css('transform', 'rotate(' + degreeOffset + 'deg)');
            $bar3.css('transform', 'rotate(' + -degreeOffset + 'deg)');
            $bar4.css('opacity', opacityFactor);
        }

    })
    
    //*************************************************//
    //  Bind pull nav to end of panning gesture (dragging on desktop)
    //  Open or close menu based on location within viewport
    //*************************************************// 
    hammerPullHandle.on('panend', function(e) {

        // Get current height of window (viewport)
        var windowHeight = $(window).height();
        
        // Get updated open height
        var openHeight = windowHeight * 0.4;
        
        // Get current pull nav menu height
        var pullMenuHeight = $pullNavMenu.height();
        
        // If menu is approx halfway through window's height, pull menu to bottom
        if (!isOpen && pullMenuHeight >= openHeight) {
            
            console.log('Wasn\'t open, far enough');
            openPullNav();
        
        } 
    
        // Otherwise, push menu back to top of screen
        else if (!isOpen && pullMenuHeight < openHeight) {
            
            console.log("Wasn't open, not far enough")
            closePullNav();
        
        }
        
        // If menu is already open, and user drags anywhere, close it
        else if (isOpen) {
    
            console.log("Was open");
            closePullNav();
        
        }
        
    })
    
    
    //*************************************************//
    //  Bind pull nav to tapping gesture (clicking on desktop)
    //*************************************************// 
    hammerPullHandle.on('tap', function(e) {
        
        // If menu is closed, open it
        if (!isOpen) {
            
            openPullNav();
        
        } 
        
        // Otherwise, closed it
        else if (isOpen) {
    
            closePullNav();
        
        }

    });
    
  
    //*************************************************//
    //  Bind pull nav to swiping gesture
    //*************************************************// 
    hammerPullHandle.on('swipe', function(e) {
        // Not implemented
    })    


    
}