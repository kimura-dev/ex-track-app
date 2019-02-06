"use strict";

/**----------------------------- */
/* Show & Hide Sign Up Section
/**----------------------------- */  

function showSignupForm(){
  let formMessages = $('#form-messages'); 
  $(formMessages).text('Sign Up here to begin creating categories!')
  $('#sign-up-form').show();
  hideLoginForm();
  if(currentScreen() == 'categoryForm'){
    hideSignupForm();
  }
}

function hideSignupForm(){
  $('#sign-up-form').hide();
}

/**----------------------------- */
/*   AJAX Submit Signup Form
/**----------------------------- */  
function submitSignupForm(){
  let formMessages = $('#form-messages');

  let data = {
    firstName:$('.first').val(),
    lastName: $('.last').val(),
    username: $('.username').val(),
    email: $('.email').val(),
    password: $('.password').val()
  };

  // Submit the form using AJAX.
  $.ajax({
    type: 'POST',
    url: `${API_URL}/users`,
    data: data
  }).then(function(response) {
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Set the message text
    let authToken = response.authToken;
    let user = JSON.stringify(response);
    
    if(window.localStorage){
      window.localStorage.setItem('authToken', authToken);
      window.localStorage.setItem('user', user);
      $(formMessages).text('Your Account was successfully created!');
    } 

    $(formMessages).text('Awesome, your accounts created!! Add a category and begin finding videos!');
    showScreen('myCategories');
  
    // Clear the form.
    $('.first').val('');
    $('.last').val('');
    $('.usersname').val('');
    $('.email').val('');
    $('.rank > option:selected').val('');
    $('.affiliates').val('');
    $('.password').val('');
    $('.password2').val('');
   
  }).fail(function(data) {
    redrawCurrentScreen();
    // Make sure that the formMessages div has the 'error' class.
    $(formMessages).removeClass('success');
    $(formMessages).addClass('error');

    // Set the message text.
    if (data.responseJSON) {
        $(formMessages).text(`Your ${data.responseJSON.location} ${data.responseJSON.message}`);
    } else {
        $(formMessages).text('Oops! An error occured and your message could not be sent.');
    }
    
  });
};

function isLoggedIn(){
  let authToken= '';
  if(window.localStorage.getItem('authToken') !== null){
    authToken = window.localStorage.getItem('authToken');
  }
  return authToken;
}

function getCurrentUser(){
  let user = '';
  if(window.localStorage){
    user = window.localStorage.getItem('user');
  }

  return JSON.parse(user) || '';
}

/**-------------------------------- */
/*  Hide & Show Log In Btn
/**--------------------------------- */

function showLogInBtn(){
  $('.login-btn').show();
}

function hideLogInBtn(){
  $('.login-btn').hide();
}

/**----------------------------- */
/*     SHOW LOGIN FORM
/**----------------------------- */  
function showLoginForm(){
  $('#login-form').show();
  let formMessages = $('#form-messages'); 
  $(formMessages).text('Login below!')
  hideSignupForm();
  enableFormInputs();
  if(currentScreen() == 'categoryForm'){
    hideLoginForm();
  }
};

function hideLoginForm(){
  $('#login-form').hide();
};

/**------------------------------- */
/*    Login AJAX
/**-------------------------------- */

function loggingIn(username, password){

  let data = {
    username: username || $('.login-username').val(),
    password: password || $('.login-password').val()
  };
  let formMessages = $('#form-messages');
  $.ajax({
    type: 'POST',
    url: `${API_URL}/auth/login`,
    data: data
  }).then(function(response) {
    let authToken = response.authToken;
    let user = JSON.stringify(response.user);

    if(window.localStorage){
      window.localStorage.setItem('authToken', authToken);
      window.localStorage.setItem('user', user);
    }
    
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    $(formMessages).text('');
    $('.username').val('');
    $('.password').val('');
        
    return showScreen('myCategories');
    
  }).fail(function(data) {
    $(formMessages).removeClass('success');
    $(formMessages).addClass('error');
    if (data.responseText !== '') {
        $(formMessages).text(data.responseText);
    } else {
        $(formMessages).text('Oops! An error occured and your message could not be sent.');
    }
  });
};

function logoutUser(){
  localStorage.removeItem('authToken');
  location.reload();
}
