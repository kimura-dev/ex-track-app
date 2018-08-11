/**Sign Up section 
 * HTML form
 * Function to show and hide
 * func to make api req to api/users
 * succ signup func - auto login
 * signup failure func - err message to user from server
*/
function showSignupForm(){
  $('#sign-up-form').show();
  hideLoginForm();
}

function hideSignupForm(){
  $('#sign-up-form').hide();
}
/**Login section 
 * HTML form
 * Function to show and hide
 * func to make api req to api/auth/login
 * succ func - dashboard
 * failure func - err message to user from server
*/
function showLoginForm(){
  $('#login-form').show();
  hideSignupForm();
}
function hideLoginForm(){
  $('#login-form').hide();
}
/**Dashboard section 
 * HTML Framework
 * JS func to generate HTML for sub sections of dashboards
 * Function to show and hide each sub section
 * functions to cache data for future reference to the use
 * failure func - err message to user from server
*/

$(function onPageReady(){
  // Does client think user is logged in - if so does the 
  // server agree that the users logged in. If client and server both 
  // agree im logged in then show the dashboard. If not show
  // the log in form.


  $('.sign-up').click(function(e){
    e.preventDefault();
    // $('.log-in').hide();
    showSignupForm();
  });
  $('.log-in').click(function(e){
    e.preventDefault();
    showLoginForm();
  });
  $('#sign-up-form > form').submit(function(e){
    e.preventDefault();
    submitSignupForm();
  })
  showLoginForm();

})



  // Use jquery to pullout the val of the form inputs
  // Make an ajax req w/ form data
  // Handle successes and failures
function submitSignupForm(){
  let data = {
    firstName:$('.first').val(),
    lastName: $('.last').val(),
    username: $('.username').val(),
    email: $('.email').val(),
    rank: $('.rank > option:selected').val(),
    affiliates: $('.affiliates').val(),
    password: $('.password').val(),
    password2: $('.password2').val()
  };
  let formMessages = $('#form-messages');

  // Submit the form using AJAX.
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8080/api/users',
    data: data
  }).done(function(response) {
    // console.log(data);
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    // if(password !== password2){
    //   alert('Passwords do not match');
    // }

    // Set the message text.
    $(formMessages).text(response);

    // Clear the form.
    $('#name').val('');
    $('#email').val('');
    $('#message').val('');
  }).fail(function(data) {
    // Make sure that the formMessages div has the 'error' class.
    $(formMessages).removeClass('success');
    $(formMessages).addClass('error');

    // Set the message text.
    if (data.responseText !== '') {
        $(formMessages).text(data.responseText);
    } else {
        $(formMessages).text('Oops! An error occured and your message could not be sent.');
    }
  });
};
  