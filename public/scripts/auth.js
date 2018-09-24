"use strict";

/**----------------------------- */
/* Show & Hide Sign Up Section
/**----------------------------- */  

function showSignupForm(){
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
  let password = '';
  let formMessages = $('#form-messages');
  if($('.password').val() === $('.password2').val()){
    password = $('.password').val();
  } else {
    showScreen('signup');
    $(formMessages).text('Please make sure passwords match'); 
  }
  let data = {
    firstName:$('.first').val(),
    lastName: $('.last').val(),
    username: $('.username').val(),
    email: $('.email').val(),
    // rank: $('.rank > option:selected').val(),
    // affiliates: $('.affiliates').val(),
    password: password
  };

  // Submit the form using AJAX.
  $.ajax({
    type: 'POST',
    url: `${API_URL}/users`,
    data: data
  }).then(function(response) {
    console.log(response);
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Set the message text.

    let authToken = response.authToken;
    
    if(window.localStorage){
      window.localStorage.setItem('authToken', authToken);
      $(formMessages).text('Your Account was successfully created!');
    } 

    showAddCategoryBtn();
    // hideLoginItems();
    hideNavItemsWhenLoggedIn();
    showNavItemsAfterLogin();
    // return showMyCategoriesPage();
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
    // Make sure that the formMessages div has the 'error' class.
    $(formMessages).removeClass('success');
    $(formMessages).addClass('error');

    // Set the message text.
    if (data.responseText !== '') {
        $(formMessages).text('Your account creation was unsuccessful. Please make sure the information you entered is correct.');
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
/* Login section
/**----------------------------- */  
function showLoginForm(){
  $('#login-form').show();
  hideSignupForm();
  enableFormInputs();
  if(currentScreen() == 'categoryForm'){
    hideLoginForm();
  }
};

function hideLoginForm(){
  $('#login-form').hide();
};

// function getAuthToken(){
//   let authToken = '';

//   if(window.localStorage){
//     authToken = window.localStorage.getItem('authToken');
//   }
// };

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
    url: `${API_URL}/auth/login`,
    data: data
  }).then(function(response) {
    // let username =  $('.usersname').val();
    // console.log(response);
    let authToken = response.authToken;
   
    let user = JSON.stringify(response.user);
    
    if(window.localStorage){
      window.localStorage.setItem('authToken', authToken);
      window.localStorage.setItem('user', user);
      console.log('Ran');
      location.reload();
    }
    
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    $(formMessages).text('');
    $('.username').val('');
    $('.password').val('');
    
    hideLoginForm();
    
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
