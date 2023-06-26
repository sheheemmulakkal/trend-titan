document.querySelector('#register_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    var err = document.getElementById('errDiv')
    console.log(err);
    err.style.display = 'none'
    // Get form input values

    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;

    // Remove any existing error messages
    var errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(errorMessage) {
      errorMessage.remove();
    });

    var hasError = false; // Track if there is any error

    if (email === '') {
      // Fields are empty, display an error message
      var emptyFieldsErrorMessage = document.createElement('div');
      emptyFieldsErrorMessage.className = 'col-md-12 form-group error-message';
      emptyFieldsErrorMessage.innerHTML = `
        <label   
          style="border: 1px solid rgb(196, 0, 0); padding: 15px 0; width: 100%; background-color: rgb(255, 172, 172); color: rgb(196, 0, 0);"
          for=""
        >
          Fields should not be empty  
        </label>
      `;
      var form = document.querySelector('#register_form');
      form.insertBefore(emptyFieldsErrorMessage, form.firstChild);
      hasError = true;
    } else {
            // Regular expression for password validation
            var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(password)) {
              // Password is invalid, display an error message
              var passwordErrorMessage = document.createElement('div');
              passwordErrorMessage.className = 'col-md-12 form-group error-message';
              passwordErrorMessage.innerHTML = `
                <label   
                  style="border: 1px solid rgb(196, 0, 0); padding: 15px 0; width: 100%; background-color: rgb(255, 172, 172); color: rgb(196, 0, 0);"
                  for="password"
                >
                  Password should contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols
                </label>
              `;
              var form = document.querySelector('#register_form');
              form.insertBefore(passwordErrorMessage, form.firstChild);
              hasError = true;
            }
          }
        
      
    

    if (!hasError) {
      // No errors, proceed with form submission
      this.submit();
    }
  });