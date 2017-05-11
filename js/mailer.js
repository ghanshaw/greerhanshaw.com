//*************************************************//
// Submit form and create email. Send message and 
// details to corresponding php script via AJAX
//*************************************************//
$(function submitForm() {
    
    // Get the form
    var $form =$('#ajax-contact');
    
    // Get the response div to update user about success/failure
    var $formResponse = $('#form-response');
    
    // Submit form
    $("form#ajax-contact").submit(function(e) {
        
        e.preventDefault();
        
        // Apply URL encoding to data from form 
        var formData = $form.serialize();
        
        // Perform AJAX request
        $.ajax({
        
            type: "POST",
            url: $form.attr('action'),
            data: formData
        
        }).done(function(response) {
         
            // Give the formresponse div the success class
            $formResponse.removeClass('alert alert-danger');
            $formResponse.addClass('alert alert-success');
            
            // Get the response from the AJAX request
            responseText = response; 
            
            // Formate response in appropriate html
            responseHTML = '<i class="fa fa-check-circle-o" aria-hidden="true"></i>' + responseText;
            
            // Update form response div
            $formResponse.html(responseHTML);
            
            // Clear the form for next submission
            $('form #name').val('');
            $('form #email').val('');
            $('form #message').val('');
        
        }).fail(function(data) {
            
            // Give the form response div the error class
            $formResponse.removeClass('alert alert-success');
            $formResponse.addClass('alert alert-danger');
            
            // Get or set the response text
            if (data.responseText !== undefined && data.responseText !== '') {
                
                // If AJAX returned a response, get that resopnse
                responseText = data.responseText; 
                
                // Format response in appropriate html
                responseHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' + responseText;
                
                // Update form response div
                $formResponse.html(responseHTML);
                
            } else {
                
                // IF AJAX did not return a response, create a response
                responseText = "Uh oh! Something went wrong and we couldn't send your message.";              
                
                // Format response in appropriate html
                responseHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>' + responseText;
                
                // Update form response div
                $formResponse.html(responseHTML);
            }     
        })  
    })
});