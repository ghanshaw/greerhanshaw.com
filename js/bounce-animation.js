//*************************************************//
// Create animation of balls bouncing against the 
// edges of the viewport
//*************************************************//
var BounceAnimation = function() {

    //-------------------------------//
    // Global Variables
    //-------------------------------//    
    
    this.canvas = $('#myCanvas');
    this.canvasVanilla = document.getElementById("myCanvas");
    this.context = this.canvasVanilla.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.fillColor = "#333";
    
    // Create and rename array of circles
    this.circlesArray = [];
    circles = this.circlesArray;
    
    // Boolean indicating whether first circle has entered canvas
    this.entered = false; 
    
    // Create 15 balls on medium+ devices, 10 on smaller devices
    this.circlesLimit = window.innerWidth >= 992 ? 15 : 10;
        
    
    //*************************************************//
    // Initialize BounceAnimation (create first circle and start drawing)
    //*************************************************//
    this.init = function() {

        this.firstCircle();
        this.draw();

    }

    //*************************************************//
    // Create first circle
    //*************************************************//
    this.firstCircle = function(){

        //----------------------------------------------//
        // Create first circle outside bounds of canvas
        //----------------------------------------------//  

        // Random size of radius, dx, dy
        var r = this.randBtwn(3, 5);
        
        //----------------------------------------------//
        // 1. Choose random edge of canvas
        //----------------------------------------------// 
        
        // Create random point outside edge of canvas
        
        // There are four edges (x = 0, x = width, y = 0, y = height)
        // Add radius to push circle reasonable distance outside bounds
        var edges = [ -(r*5), this.width + (r*5), -(r*5), this.height + (r*5) ];       
        
        // Randomly select one of edges
        edge = this.choose(edges);       

        
        //----------------------------------------------//
        // 2. Create x values and y values based on chosen edge
        //----------------------------------------------// 
        
        // Create x and y variables (coordinates)
        var x = 0;
        var y = 0;

        // If point is outside x range
        if (edge == 0 || edge == 1) {

            x = edges[edge];
            y = this.randBtwn(0, this.height);

        } 
        // If point is outside y range
        else if (edge == 2 || edge == 3) {

            y = edges[edge];
            x = this.randBtwn(0, this.width);

        }

        //----------------------------------------------//
        // 3. Choose dx and dy such that circle always 
        //    points towards central region of canvas
        //----------------------------------------------// 
        
        // Choose a random point in center of canvas
        
        // x sub c, y sub c are random points in center region of canvas
        var xc = this.randBtwn(.2 * this.width, .8 * this.width);
        var yc = this.randBtwn(.2 * this.height, .8 * this.height);
        
        // Compute dx and dy using the slope formula (delta x / delta y)
        var dx = xc - x;
        var dy = yc - y;
        
        //----------------------------------------------//
        // 4. Reduce magnitude of dx and dy while maintaining dx/dy
        //----------------------------------------------// 
        
        // Maximum size of dx or dy, assures reasonable initial speed
        var maxDelta = this.randBtwn(3, 5);
        
        // Find divisor that pushes larger number down to maxDelta
        var divisor1 = Math.abs(dx/maxDelta);
        var divisor2 = Math.abs(dy/maxDelta);
        
        var divisor = divisor1 > divisor2 ? divisor1 : divisor2;
        
        // Decrease magnitudes of dx and dy
        dx /= divisor;
        dy /= divisor;
 
        //----------------------------------------------//
        // 4. Update circles array 
        //----------------------------------------------// 
        
        // Update circles array with first circle
        circles[0] = {
            'x' : x, 
            'y' : y, 
            'dx' : dx, 
            'dy' : dy, 
            'r' : r
        }
        
        return;

    }


    //*************************************************//
    // Create a circle that roughly reverses path of original (instead of bouncing)
    //*************************************************//
    this.spawnCircle = function(x, y, dx, dy, r) {

        // Range of distortion, used to introduce variability in circles
        range = [.75, 1.25]

        // Add noise, slighly modifying dx and dy
        noise = this.randBtwn(range[0], range[1]);
        dx *= noise;

        noise = this.randBtwn(range[0], range[1]);
        dy *= noise;

        // Give circle new random radius
        r = this.randBtwn(3, 5);

        // Reverse both dx and dy to (roughly) follow original path (plus noise)
        dx = -dx;
        dy = -dy;

        // Update x and y position
        x += dx;
        y += dy;

        // Shift x and y as neccesary to prevent circle from intersecting edge
        
        x = Math.max(r, x);     // Make sure you're at least r away from the edge 
        x = Math.min(this.width - r, x);        // Make sure x is at most full width - r away from x

        y = Math.max(r, y);
        y = Math.min(this.height - r, y);

        // Update circles array with new circle
        circle = {
            'x' : x,
            'y' : y,
            'dx' : dx,
            'dy' : dy,
            'r' : r
        }

        circles.push(circle);
        
        return;
    }

    //*************************************************//
    // Draw frame of animation
    // Draw each circle in circle array, then shift by dx and dy
    // Create new circle as neccessary
    //*************************************************//
    this.draw = function() {

        
        // Resize canvas as neccessary (perhaps viewport has changed)
        this.context.canvas.width = this.width = $(window).width();
        this.context.canvas.height = this.height = $(window).height();
        

        // Clear canvas, prepare drawing settings
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        this.context.fillStyle = this.fillColor;
        
        
        // Number of circles in circles array
        circlesLength = circles.length;

        // Draw a circle of radius r at the coordinates x, y on the canvas for each circle in circle array
        for (var i = 0; i < circlesLength; i++) {

            // Draw the current circle in circle array
            this.context.arc(circles[i].x, circles[i].y, circles[i].r, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.fill();

            // Ignore bouncing logic until first circle enters canvas
            if (!this.entered) {
                
                // Update position of first circle
                circles[i].x += circles[i].dx;
                circles[i].y += circles[i].dy;

                // If circle is within bounds of canvas, update entered flag
                if (this.inBounds(circles[i].x, circles[i].y, circles[i].r)) {
                    this.entered = 1;
                }

                // Force next iteration of loop
                continue;
            }

            // If circle hits left or right edge, bounce and spawn
            // Include radius length to prevent circle from intersecting edge
            if (circles[i].x - circles[i].r < 0 || circles[i].x + circles[i].r > this.width) {

                // Create circle that roughly follows original path, if circle limit has not been reached
                if (circlesLength < this.circlesLimit) {
                    this.spawnCircle(circles[i].x, circles[i].y, circles[i].dx, circles[i].dy, circles[i].r);
                }
                
                // Bounce by reversing x direction of circle
                circles[i].dx = -circles[i].dx; 

            }
            if (circles[i].y - circles[i].r < 0 || circles[i].y + circles[i].r > this.height) {

                // Create circle that roughly follows original path, if circle limit has not been reached
                if (circlesLength < this.circlesLimit) {
                    this.spawnCircle(circles[i].x, circles[i].y, circles[i].dx, circles[i].dy, circles[i].r);
                }

                // Bounce by reversing y direction of circle
                circles[i].dy = -circles[i].dy;

            }

            // Update cirle's position
            circles[i].x += circles[i].dx;
            circles[i].y += circles[i].dy;

        }            
        
        // Allows browser to choose interval and frame rate
        // Removes need for setInterval()
        window.requestAnimationFrame(this.draw.bind(this));
    };

    //*************************************************//
    // Check whether circle is in bounds of canvas
    //*************************************************//
    this.inBounds = function(x, y, r) {
        return ((x - r > 0 && x + r < this.width) && (y - r > 0 && y + r < this.height));
    }

    //*************************************************//
    // Yield a random number between min and max (inclusive)
    //*************************************************//
    this.randBtwn = function(min, max) {
        return Math.random() * (max - min) + min;
    }

    //*************************************************//
    // Randonly select an index number of an element in an array
    //*************************************************//
    this.choose = function(choices) {
        var index = Math.floor(Math.random() * choices.length);
        return index;
    }
    
    //*************************************************//
    // Set color used to draw
    //*************************************************//
    this.setFillColor = function(color) {
        this.fillColor = color;
        return;
    }

}

