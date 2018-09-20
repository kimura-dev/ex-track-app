"use strict";

/**-------------------------------- */
/*     Global App State
/**--------------------------------- */
let exercises = [];  
let myExercises = []; 

// General APP structure for refactor
const APP = {
  exercises: {},            // exercises.my, exercises.all, etc...
  currentScreen: 'intro',   // name of screen in APP.screens' keys
  screens: {},              // screens are UI components and also track state
  authToken: '',
  user: undefined
}

// Specific exercise arrays
APP.exercises.all = exercises;
APP.exercises.my = myExercises;

// Helper functions for data access into global app object

// gets the current screen object from APP.screens
function currentScreen(){
  if( APP.currentScreen 
    && APP.screens 
    && APP.currentScreen in APP.screens
  ){
    return APP.screens[APP.currentScreen];
  }
  return undefined;
}

function showScreen(screenName){
  let output;
  if( screenName && screenName in APP.screens ){
    APP.currentScreen = screenName;
    // console.log('screenName ' + screenName);
    Object.keys(APP.screens).forEach(screen => {
      const thisScreen = APP.screens[screen];
      if( thisScreen !== currentScreen() ){
        if( typeof thisScreen.hide === 'function' ){
            output = thisScreen.hide();
        }
      }
    });

    if( output && output.then ){
      return output.then( () => redrawCurrentScreen() );
    } 

    return Promise.resolve().then( () =>  redrawCurrentScreen() );
    // only calls .show() if the screen exists
  
  }  
};

function redrawCurrentScreen(){
  const screen = currentScreen();
  if( screen ) screen.show();
  else {
    if( APP.screens.intro ){
      APP.screens.intro.show();
    } else {
      console.log("No intro page to show.")
    }
  }
};

function getCurrentExercisesArray(){
  const screen = currentScreen();
  if(screen){
    return screen.array;
  } 
};

function getCurrentExercise(currentExerciseId){
  const exercises = getCurrentExercisesArray();
  if(exercises){
     return exercises.find(exercise => {
       return exercise._id === currentExerciseId;
    });
  }
};

function showExerciseFormBtns(){
  $('.exerciseFormBtn').removeClass('hidden');
  $('.exerciseFormBtn').show();
}

function hideExerciseFormBtns(){
  $('.exerciseFormBtn').addClass('hidden');
  $('.exerciseFormBtn').hide();
}

function showVideoPickerBtn(){
  $('.videoPickerBtn').removeClass('hidden');
  $('.videoPickerBtn').show();
}

function hideVideoPickerBtn(){
  // console.log('hide working');
  $('.videoPickerBtn').addClass('hidden');
  $('.videoPickerBtn').hide();
}


/**-------------------------------- */
/*     Hide & Show Functions
/**--------------------------------- */
function showExerciseForm(){
  $('.exercise-form').removeAttr('hidden');
  $('.exercise-form').show();
  if(!isLoggedIn()){
    disableFormInputs();
    
    hideExerciseFormBtns();
    hideVideoPickerBtn()
  } else {
    showExerciseFormBtns();
    enableFormInputs();
    showVideoPickerBtn();
  }
};

function hideExerciseForm(){
  // console.log( $('.exercise-form'));
  $('.exercise-form').attr('hidden');
  $('.exercise-form').hide();
  hideFormMessage();
};

function hideUserExercisePage(){
  $('.user-exercise-page').attr('hidden');
  $('.user-exercise-page').hide();
};

function showIntroPage(){
  $('.introduction-page').show();
}


function showDeleteExerciseBtn(){
  $('.delete-exercise-btn').removeAttr('hidden');
  $('.delete-exercise-btn').show();
}

function hideDeleteExerciseBtn(){
  $('.delete-exercise-btn').attr('hidden');
  $('.delete-exercise-btn').hide();
}

function showPrevNextBtn(){
  $('.button-options').removeAttr('hidden');
  $('.button-options').show();
}

function hidePrevNextBtn(){
  $('.button-options').attr('hidden');
  $('.button-options').hide();
}

function showAddExerciseBtn(){
  $('.add-exercise-btn').show();
}

function hideAddExerciseBtn(){
  $('.add-exercise-btn').hide();
}

/**-------------------------------- */
/*  Hide & Show Nav Items
/**--------------------------------- */
function hideNavItemsWhenLoggedIn(){
  $('.nav-login').attr('hidden');
  $('.nav-login').hide();
  $('.nav-signup').attr('hidden');
  $('.nav-signup').hide();
}

function hideNavItemsBeforeLogin(){
  // $('.navShowAllBtn').attr('hidden');
  // $('.navShowAllBtn').hide();
  $('.navShowMyBtn').attr('hidden');
  $('.navShowMyBtn').hide();
  $('.nav-logout').attr('hidden');
  $('.nav-logout').hide();
}

function showAllExercisePageHeader(){
  $('.allExercisePageHeader').removeAttr('hidden');
  $('.allExercisePageHeader').show();
}

function hideAllExercisePageHeader(){
  $('.allExercisePageHeader').attr('hidden');
  $('.allExercisePageHeader').hide();
}

function hideUsernameHeader(){
  $('.usernameHeader').attr('hidden');
  $('.usernameHeader').hide();
}

function showUsernameHeader(){
  $('.usernameHeader').removeAttr('hidden');
  $('.usernameHeader').show();
}

function showNavItemsAfterLogin(){
  // $('.navShowAllBtn').removeAttr('hidden');
  // $('.navShowAllBtn').show();
  $('.navShowMyBtn').removeAttr('hidden');
  $('.navShowMyBtn').show();
  $('.nav-logout').removeAttr('hidden');
  $('.nav-logout').show();
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
/*  Hide & Show Form Message
/**--------------------------------- */
hideNavItemsBeforeLogin();

function hideFormMessage(){
  $('#form-messages').attr('hidden');
  $('#form-messages').hide();
}

function showFormMessages(){
  $('#form-messages').removeAttr('hidden');
  $('#form-messages').show();
}

/**-------------------------------- */
/*  Hide & Show Add Comment Btn
/**--------------------------------- */

function showAddCommentBtn(){
  $('.addCommentBtn').removeAttr('hidden');
  $('.addCommentBtn').show();
}

function hideAddCommentBtn(){
  $('.addCommentBtn').attr('hidden');
  $('.addCommentBtn').hide();
}

/**-------------------------------- */
/*  Hide & Show Add Comment Btn
/**--------------------------------- */

function showContinuedComments(){
  $('.continuedComments').removeAttr('hidden');
  $('.continuedComments').show();
}

function hideContinuedComments(){
  $('.continuedComments').attr('hidden');
  $('.continuedComments').hide();
}

function showloginRegisterPrompt(){
  $('.loginOrRegisterPrompt').removeAttr('hidden');
  $('.loginOrRegisterPrompt').show();
}

function hideLoginRegisterPrompt(){
  $('.loginOrRegisterPrompt').attr('hidden');
  $('.loginOrRegisterPrompt').hide();
}

function enableFormInputs(){
  $('form input').prop('disabled', false);
  $('.status').prop('disabled', false);
  $('textarea').prop('readonly', false);
  showExerciseFormBtns(); 
  showVideoPickerBtn();   
}

function disableFormInputs(){
  $('form input').prop('disabled', true);
  $('.status').prop('disabled', 'disabled'); 
  $('textarea').prop('readonly', true); 
  hideExerciseFormBtns();
  hideVideoPickerBtn();
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


// const user = getCurrentUser();
// if( user && user.username === exercise.user.username ){
//   $('.nav-username').text((getCurrentUser() ? getCurrentUser().username : ''));
// }

/**--------------------- */
/*    On Page Ready/
       Click Events
/**--------------------- */
$(function onPageReady() {

    if(isLoggedIn()){
      showNavItemsAfterLogin();
      hideNavItemsWhenLoggedIn();
      showScreen('myExercises');
      hideLoginForm();

      console.log(getCurrentUser());
      // hideIntroPage();
      // hideLogInBtn
      // showMyExercisesPage();
      };

  // Popup Iframe and OverlayBg
  $('.popup').hide();
  $('.overlayBg').hide();

  // Youtube Toggle Search Pages
  $('.tokenClass').click(function () {
    // console.log($(this).val());
    pageToken.current = $(this).val() == 'Next' ? pageToken.nextPage : pageToken.prevPage;
    searchYoutube();
  });

  // Nav Bar Icon Click Events
  $('.nav-signup').click(function(){
    // console.log('working');
    showScreen('signup');
    enableFormInputs();
    
  });

  $('.topnav').on('click','.navShowAllBtn',function(){
    // console.log(currentScreen());
    if(currentScreen() == 'allExercises'){
      console.log('Already here!');
    }
    showScreen('allExercises');
  });

  $('.topnav').on('click','.navShowMyBtn',function(){
    showScreen('myExercises');
    // return showMyExercisesPage();
  });

  $('.nav-login').click(function(){
    showScreen('login')
    enableFormInputs();
  });

  $('.nav-logout').click(function(){
    console.log('Logout Click')
    logoutUser();
  });

  $('.nav-username').click(function(){
      showScreen('myExercises');
  });
  
  // Prevent Form Event Default
  $('form').submit(function(e){
    e.preventDefault();
  });

  $('.add-exercise-btn').click(function(){
    let formMessages = $('#form-messages');
  
    if(isLoggedIn()){
      showFormMessages();
      $('#form-messages').text('Add a new technique!');
      clearExerciseForm();
      hideAddExerciseBtn();
      showScreen('exerciseForm');
      enableFormInputs();
    } else {
      showFormMessages();
      $('#form-messages').text(`Please login or register to add a technique!`);
    }
   
   
  })

  // Sign Up Form Click Event
  $('#sign-up-form > form').submit(function(){
    submitSignupForm();
    hideSignupForm();
  });

  $('.promptLogin').click(function(){
    showScreen('login');
  });

  $('.promptRegister').click(function(){
    showScreen('signup');
  })

  $('.enter').click(function(){
    showScreen('allExercises');
    hideAddExerciseBtn();
    // showGoBackBtn();
  });


  // Show Video Picker 
  $('.add-video-btn').click(function(e){
    e.preventDefault();
    searchVideoForExerciseTitle();
    hideAddExerciseBtn();
    hideExerciseForm();
    showMoviePicker();
  });

  // Search Video Picker
  $('.video-search-btn').click(function(){
    searchMoviePicker();
  });
 
  // Add Video to Profile
  $('.video-results').on('click','.select-video-btn',  selectVideoResult);

  $('.video-results').on('click','.unselect-video-btn', unselectVideoResult);


  // Close Video Picker 
  $('.closePickerBtn').click(function(e){
    e.preventDefault();
    hideMoviePicker();
    showExerciseForm();
  })

  // Save Exercise Click
  $('.exercise-form form').submit(function(e){
    e.preventDefault();
    showFormMessages();
    submitExerciseForm();
  });

  // Log In Click Event
  $('.logIn').click(function(){
    loggingIn();
  });

  $('.a-login').click(function(){
    if(!isLoggedIn()){
      showScreen('login');
      enableFormInputs();
      hideExerciseForm();
    }
  });

  $('.addVideosToProfileBtn').click(function(){
    addSelectedVideosToForm();
    hideMoviePicker();
    showExerciseForm();
  });



/**------------------------------------------------------- */
/*   Collects and displays the exercise data to the form 
/**------------------------------------------------------- */

  $('.user-exercise-page').on('click','.exercise-show', function(e){
      generateCommentElement();
      // generateCommentData();
      showAddExerciseBtn();
      const currentExerciseId = getCurrentExerciseIdFromClick(e);
      const currentExercise = getCurrentExercise(currentExerciseId);
      // console.log(currentExercise.user.username);
      // console.log(currentExercise.username);

      // console.log(currentExercise);

      // console.log(currentExercise.comments);

      populateFormWExerciseData(currentExercise);
      renderVideosOnExercisesForm(currentExercise); 

      // console.log(getCurrentUser().username);

      if((getCurrentUser() ? getCurrentUser().username : '') === currentExercise.username){
        enableFormInputs();
      } else {
        disableFormInputs();
      }
    
  });

/**------------------------------------------------------- */
/*  
/**------------------------------------------------------- */

  // Delete Exercise Click
  $('.delete-exercise-btn').click(function(e){
    e.preventDefault();
    // console.log( $('.exercise-id').val() );
    // console.log('delete technique working');
    // console.log($('.exercise-id').val());

    deleteExercise( $('.exercise-id').val() );
  });

  // Delete Videos on exercise  
  $('.added-videos').on('click','.deleteVideo', function(e){
    let videoId = $(this).parent().parent().attr('data-videoId');
    // console.log(videoId);

    deleteVideoFromExercise(videoId);

  });


  // Add Comment Btn
  // $('.addCommentBtn').click(function(e){
  //   e.preventDefault();

    // if(!isLoggedIn()){
    //   console.log(currentScreen());
    //   showScreen('login');
    //   enableFormInputs();
    // } else {
    //   hideAddCommentBtn();
    //   generateCommentElement();
    //   generateCommentData();
    // }
    
  // });
 
  // Comment Submit Btn
  $('.exercise-form').on('click', '.commentSaveBtn',function(e){
    e.preventDefault();
    addComment();
  })

  // Embedded Videos Previews
  previewVideos();
  previewVideosOnExercisePage(); 
  // renderComments();


});
