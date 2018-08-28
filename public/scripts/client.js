"use strict";

// const state = {
//   loggedIn: false
// }

// function renderHomePage() {
 
//   if (state.loggedIn) {
//     console.log('You are logged in.')
//   } else {
//     console.log('You are not logged in.')
//   }
// }

// function logIn() {
//   state.loggedIn = true;
// }

// renderHomePage()
// logIn()
// renderHomePage()

  // if key in local storage
  // make AJAX request to API to validate
  // then set proper state

/**------------------------------------ */ 
/*  Hide & Show Users exercise Page
/**------------------------------------ */
function showUserExercisesPage(){
  $(".user-exercise-page").show()
}

function hideUserExercisesPage(){
  $(".user-exercise-page").hide()
}

/**-------------------------------- */
/*  Hide & Show Introduction Page
/**--------------------------------- */
function showIntroPage(){
  $('.introduction-page').show();
}

function hideIntroPage(){
  $('.introduction-page').hide();
}

/**-------------------------------- */
/*  Hide & Show Add Exercise Btn
/**--------------------------------- */

function showAddExerciseBtn(){
  $('.add-exercise-btn').show();
}

function hideAddExerciseBtn(){
  $('.add-exercise-btn').hide();
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

/**-------------------------------- */
/*  Hide & Show Log In Btn
/**--------------------------------- */
function showPrevBtn(){
  $('.prev-btn').removeAttr('hidden');
  $('.prev-btn').show();
}

function hidePrevBtn(){
  $('.prev-btn').attr('hidden');
  $('.prev-btn').hide();
}

/**-------------------------------- */
/*  Hide & Show Form Message
/**--------------------------------- */
function hideFormMessage(){
  $('#form-messages').attr('hidden');
  $('#form-messages').show();
}

function showFormMessages(){
  $('#form-messages').removeAttr('hidden');
  $('#form-messages').show();
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
      x.className += " responsive";
  } else {
      x.className = "topnav";
  }
}
/**--------------------- */
/*    On Page Ready/
       Click Events
/**--------------------- */
$(function onPageReady(){
  let authToken = '';

  if(window.localStorage){
    authToken = window.localStorage.getItem('authToken');
    loggingIn();
  }
  // CK Editor
  CKEDITOR.replace('body',{
    plugins: 'wysiwygarea,toolbar,basicstyles,link' 
  });

  // Popup Iframe and OverlayBg
  $('.popup').hide();
  $('.overlayBg').hide();

  // Youtube Toggle Search Pages
  $('.tokenClass').click(function () {
    pageToken.current = $(this).val() == 'Next' ? pageToken.nextPage : pageToken.prevPage;
    searchYoutube();
  });

  // Nav Bar Icon Click Events
  $('.nav-signup').click(function(){
    showSignupForm();
    hideIntroPage();
    hideLogInBtn();
  });

  $('.nav-exercise-page').click(function(){
    // if(authToken){
    //   renderUserExercisesPage();
    //   showUserExercisesPage();
    //   showAddExerciseBtn();
    // } else {
    //   showLoginForm();
    // }
    
  });

  $('.nav-logs').click(function(){
    console.log('Logs Page');
    
  });

  $('.nav-exercises').click(function(){
    showLoginForm();
    
  });

  $('.nav-login').click(function(){
    showLoginForm();
    hideLogInBtn();
    
  });

  // Prevent Form Event Default
  $('form').submit(function(e){
    e.preventDefault();
  });

  $('.add-exercise-btn').click(function(){
    hideIntroPage();
    hideUserExercisesPage();
    hideAddExerciseBtn();
    showExerciseForm();
    clearExerciseForm();
  })

  // Previous Button Click
  $(".prev-btn").click(function(){
    hideExerciseForm();
    hidePrevBtn();
    showUserExercisesPage();
    showAddExerciseBtn();
  })

  // Sign Up Form Click Event
  $('#sign-up-form > form').submit(function(){
    submitSignupForm();
  });
  
  // Show Login Form
  $('.login-btn').click(function(){
    // hideIntroPage();
    hideLogInBtn();
    showLoginForm();
    // showExerciseForm();
  });

  // Show Video Picker 
  $('.add-video-btn').click(function(e){
    e.preventDefault();
    showMoviePicker();
  });

  // Search Video Picker
  $('.video-search-btn').click(function(){
    searchMoviePicker();
  });
 
  // Add Video to Profile
  $('.video-results').on('click','.select-video-btn', selectVideoResult);

  $('.video-results').on('click','.unselect-video-btn', unselectVideoResult);


  // Close Video Picker 
  $('.closePickerBtn').click(function(e){
    e.preventDefault();
    hideMoviePicker();
    showExerciseForm();
  })

  // Save Exercise Click
  $('.exercise-form form').submit(function(){
    showFormMessages();
    submitExerciseForm();
  });

  // Log In Click Event
  $('.logIn').click(function(){
    loggingIn();
  })

  // A href Log In
  $(".a-login").click(function(){
    showLoginForm();
  });

  // Submit Sign Up Form
  $('.submit-signup-btn').click(function(e){
    newUserSignUp();
    hideExerciseForm();
  })

  // Delete Videos Click 
  $('.added-videos').on('click','.deleteVideo',function(e){
    deleteVideo(e);
  });

  // Delete Exercise
  $('.delete-exercise-btn').click(deleteExercise);
  
  $('.returnToProfileBtn').click(function(){
    addSelectedVideosToForm();
    hideMoviePicker();
    showExerciseForm();
  });

  // Edit Exercise Form Page 
  $('.user-exercise-page').on('click','.exercise-show', function(e){
    hideFormMessage();
    showAddExerciseBtn();
    currentExerciseIndex = getExerciseIndexFromClick(e);
    populateFormWExerciseData(exercises[currentExerciseIndex]);
    renderVideosOnExercisesForm(exercises[currentExerciseIndex]);
  });

  previewVideos(); 

});