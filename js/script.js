

//*************************************************//
// Function to check whether Fluid stylesheet is active
//*************************************************//
function checkStylesheet() {
    // Get href value currently in stylesheet link
    currentHref = $("#stylesheet-fluid").attr("href");
    
    return currentHref == 'css/fluid.css';
}

//*************************************************//
// Function to compute age
//*************************************************//
function computeAge(birthday){
    
    var now = new Date();

    // Current age in milliseconds
    var ageMillisec = now - birthday;

    // Total number of years
    var years = ageMillisec / (1000 * 60 * 60 * 24 * 365.25);

    // Total number of months
    var months = years % 1;
    months *= 12;
    
    // Total number of days
    var days = months % 1;
    days *= 30;

    // Total number of hours
    var hours = days % 1;
    hours *= 24;

    // Total number of minutes
    var minutes = hours % 1;
    minutes *= 60;

    // Total number of seconds
    var seconds = minutes % 1;
    seconds *= 60;

    // Create age object
    var age = {
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds    
    }
    
    // Make every key an integer
    for (var key in age) {
        age[key] = Math.floor(age[key]);                    
    }
    
    // Put age in a string
    var ageString = age.years + ' Y : ' + age.months + ' M : ' + age.days + ' D : ' + age.hours + ' H : ' + age.minutes + ' M : ' + age.seconds + ' S ';  
    
    // Update age section of document
    $('.age').html('<b>Age: </b>' + ageString);
    
    return;
}


//*************************************************//
// Adjust size of links in side navigation
//*************************************************//
function applySideNavLinkResize() { 
    
    // Get key page attributes
    var docHeight = $(document).height()
    
    // Get height of navigation
    var navHeight = $('nav.side-nav ul').height();
    
    $('nav.side-nav li').each(function(index, li) {

        // Find section corresponding to li
        section = $(li).find('a').attr('href');

        // Get corresponding section's height
        sectionHeight = $(section).outerHeight();    
        
        // Get link gap (space between links) [for alternate side-nav implementation]
        //var linkGap = parseInt($('nav.side-nav li').css('margin-top'), 10);

        // Update li height in proportion to section's size within document
        liHeight = navHeight * (sectionHeight / docHeight);
        $(li).height(liHeight);
        $(li).find('a').css('line-height', liHeight + 'px');
    })
}


//*************************************************//
// Adjust size of scrolling cube
//*************************************************//
function applyCubeOffset() {
    
    // Get key page attributes
    var windowScroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    var docHeight = $(document).height()
    
    // Get height of side navigation
    var navHeight = $('nav.side-nav ul').height();
    
    // Get link gap (space between links) [for alternate side-nav implementation]
    //var linkGap = parseInt($('nav.side-nav li').css('margin-top'), 10);

    // Size of cube is proportional to size of window relative to document
    $('nav.side-nav .cube').height(navHeight * (windowHeight/docHeight));

    // Adjust width of cube
    var navWidth = $('nav.side-nav').width();
    $('nav.side-nav .cube').width(navWidth);

    // % of progress through page
    var progress = windowScroll / docHeight;

    // Get border width
    var border = parseInt($('nav.side-nav .cube').css('border-top-width'), 10);
    
    // Corresponding offset within nav at that progress level
    var cubeOffset = (navHeight * progress) - border;

    // Move cube to correspoding point within ul       
    $('nav.side-nav .cube').css('top', cubeOffset);
    
}


//*************************************************//
// Fade Intro section on scrolling
//*************************************************//
function applyIntroSectionFade() {
    
    // Get key page attributes
    var windowScroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    
    // Get offset of About Me section from top of document
    var sectionOffset = $('#section-about-me').offset().top;   
    
    // Get distance of section from top of viewport
    var sectionFromTop = sectionOffset - windowScroll;
    
    // Fade Intro section, should disappear when About Me sections reaches 2/3 of viewport height
    $('#section-intro').css('opacity', (3/1) * (sectionFromTop/windowHeight) - 1);
    
}


//*************************************************//
// Bind mouse and tap behavior to the .btn-block class, figure
// Used to replace :hover pseudo-class due to unwanted mobile behavior
//*************************************************//
function bindMouseTouchHover() {
    
    // Elements with desired hover effect
    $hoverElements = $("figure.portfolio-fig, a.btn-block, button.btn-block");
    
    // Bind elements to beginning of hover/touch
    $hoverElements.on('touchstart, mouseenter', function() {
        $(this).addClass('js-hover');
    });
    
    // Bind elements to end of hover/touch
    $hoverElements.on('touchend, mouseleave', function() {
        $(this).removeClass('js-hover');
    });
}


//*************************************************//
// Create in-page scroll animation when using page anchors
//*************************************************//
function bindScrollAnimation() {
 
    // Scroll animation within page (down arrow, fixed side nav, or pullmenu)
    // Note: selector excludes linkes in pull navigations, those are handled by hammer.js
    $("a[href*='#']:not([href='#'], .pull-nav-menu-link)").click(function(e){

        e.preventDefault();

        // The section corresponding to the link user clicks  (down arrow / side nav)
        target = $(this.hash);

        //$(document).unbind('touchstart touchmove', false);
        
        $('body, html').animate ({
            // Scroll body to the distance of that target's offset from the top
            scrollTop: target.offset().top
        }, {
            duration: 800
        });    

    });
}


//*************************************************//
// Toggle Transition CSS Stylesheet (Transition Theme)
//*************************************************//
function bindStylesheetToggle() {
    
    // Get two theme buttons
    $themeButtons = $("#theme-button-side-nav, #theme-button-pull-nav");
    
    // Bind theme buttons to following click event
    $themeButtons.on('click',function() {
        
        // Get href of fluid stylesheet
        var fluidHref = "css/fluid.css";
        
        // Variable used to store new href value
        var newHref = "";
        
        // If fluid stylesheet is inactive, prepare to active it
        if (!checkStylesheet()) {
            newHref = fluidHref;
            fillColor = "white";
            $themeButtons.text("Clean");
        } 
        // Otherwise set color of circles back to black
        else {
            fillColor = "black";
            $themeButtons.text("Fluid");
        }
        
        // Update href in link tag
        $("#stylesheet-fluid").attr("href", newHref);
    
        // Update color of fill in Bounce Animation
        BA.setFillColor(fillColor);
    });
    
    return;
}



//*************************************************//
// Resize hover overlay in portfolio
//*************************************************//
function applyPortfolioResize() {
    
    // Get width and height of portfolio images
    imgHeight = $('.section#section-portfolio figure.portfolio-fig img').height();
    imgWidth = $('.section#section-portfolio figure.portfolio-fig img').width();

    // Resize overlays to size of images
    $('.section#section-portfolio figcaption.visit-site').height(imgHeight);
    $('.section#section-portfolio figcaption.visit-site').width(imgWidth);

}


/*************************************************/
// Bind all resize events
/*************************************************/
$(window).resize(function(e){
    
    applyPortfolioResize();
    applyCubeOffset();

});
                 

/*************************************************/
// Bind all scroll events
/*************************************************/
$(window).scroll(function(e) {
    
    applyIntroSectionFade();
    applySideNavLinkResize()
    applyCubeOffset();

});


/*************************************************/
// Wait to load DOM, initiate all functions
/*************************************************/
$(document).ready(function() {
    
    
    // Update age breakdown every second
    var birthday = new Date(1991, 4, 7, 14, 30);
    setInterval(function() { computeAge(birthday); }, 500)
    
    // Implement scroll animation for page anchors
    bindScrollAnimation();
    
    // Trigger scroll and resize events when DOM loads
    $(window).scroll();
    $(window).resize(); 

    // Reveal resized side navigation
    $('nav.side-nav').show();
    
    // Implement functionality of the pull navigation
    applyPullNav();
    
    // Initiate bounce animation
    BA = new BounceAnimation();
    BA.init();    
    
    // Implement stylesheet toggle
    bindStylesheetToggle();
    
    bindMouseTouchHover();
    
    
    // Update color of circles and button text as necessary 
    $themeButtons = $("#theme-button-side-nav, #theme-button-pull-nav");
    
    // If stylesheet is inactive when DOM loads, make circles black
    if (!checkStylesheet()) {
        BA.setFillColor("black");
        $themeButtons.text("Fluid");
    } 
    // Otherwise make circles white
    else {
        BA.setFillColor("white");
        $themeButtons.text("Clean");
    }
    
})

