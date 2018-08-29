"use strict";

/**----------------------------- */
/* Show & Hide Sign Up Section
/**----------------------------- */  

function showSignupForm(){
  $('#sign-up-form').show();
  hideLoginForm();
}

function hideSignupForm(){
  $('#sign-up-form').hide();
}

/**----------------------------- */
/*   AJAX Submit Signup Form
/**----------------------------- */  
function submitSignupForm(){
  // let password = '';
  // if(password === password2){
  //   password = password;
  // } else {
  //   return `<div>Your passwords dont match!</div>`
  // }
  let data = {
    firstName:$('.first').val(),
    lastName: $('.last').val(),
    username: $('.username').val(),
    email: $('.email').val(),
    rank: $('.rank > option:selected').val(),
    affiliates: $('.affiliates').val(),
    // password: password,
    password: $('.password').val(),
    // password2: $('.password2').val()
  };
  let formMessages = $('#form-messages');
  
  // Submit the form using AJAX.
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8080/api/users',
    data: data
  }).then(function(response) {
    // console.log(data);
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Set the message text.
    $(formMessages).text(response);

    // Clear the form.
    $('.first').val('');
    $('.last').val('');
    $('.usersname').val('');
    $('.email').val('');
    $('.rank > option:selected').val('');
    $('.affiliates').val('');
    $('.password').val('');
    $('.password2').val('');
    hideSignupForm();
    showAddExerciseBtn();
  }).fail(function(data) {
    // Make sure that the formMessages div has the 'error' class.
    $(formMessages).removeClass('success');
    $(formMessages).addClass('error');

    // Set the message text.
    if (data.responseText !== '') {
        $(formMessages).text('Successfully created account');
    } else {
        $(formMessages).text('Oops! An error occured and your message could not be sent.');
    }
  });
};

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
/* Login section
/**----------------------------- */  
function showLoginForm(){
  $('#login-form').show();
  hideSignupForm();
};

function hideLoginForm(){
  $('#login-form').hide();
};

/**------------------------------- */
/*    Logging In Users
/**-------------------------------- */

function loggingIn(){
  let data = {
    username: $('.login-username').val(),
    password: $('.login-password').val()
  };
  let formMessages = $('#form-messages');
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8080/api/auth/login',
    data: data
  }).then(function(response) {
    let username =  $('.usersname').val();
    // console.log(response);
    let authToken = response.authToken;
    if(window.localStorage){
      window.localStorage.setItem('authToken', authToken);
    }
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    $(formMessages).text('');
    $('.usersname').val('');
    $('.password').val('');
    hideLoginForm();
    // hideIntroPage();
    hideLogInBtn();
    return getAllExercises().then(function(){
      // console.log('Working!');
      showAddExerciseBtn();
      renderUserExercisesPage();
      showUserExercisesPage();
    });
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
