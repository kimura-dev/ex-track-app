"use strict";

/**-------------------------------- */
/*     Global App State
/**--------------------------------- */
let exercises = [];  
let myExercises = []; 

// Make general APP structure
const APP = {
  exercises: {},            // exercises.my, exercises.all, etc...
  currentScreen: 'intro',   // name of screen in APP.screens' keys
  screens: {},              // screens are UI components and also track state
  authToken: '',
  user: undefined
}

// Make specific exercise arrays
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

// // const foundExercise = exercises.find(isExercise); 
  
//   // console.log(currentExerciseId);
//   console.log('foundexercise '+ foundExercise);

/**-------------------------------- */
/*     Hide & Show Functions
/**--------------------------------- */
function showExerciseForm(){
  $('.exercise-form').removeAttr('hidden');
  $('.exercise-form').show();
};

function hideExerciseForm(){
  // console.log( $('.exercise-form'));
  $('.exercise-form').attr('hidden');
  $('.exercise-form').hide();
  hideFormMessage();
};

// function showGoBackBtn(){
//   $('.goBackToAllExerciseBtn').removeAttr('hidden');
//   $('.goBackToAllExerciseBtn').show();
// }

// function showGoBackBtn(){
//   $('.goBackToAllExerciseBtn').attr('hidden');
//   $('.goBackToAllExerciseBtn').hide();
// }

function hideUserExercisePage(){
  $('.user-exercise-page').attr('hidden');
  $('.user-exercise-page').hide();
  // $('.goBackToAllExerciseBtn').attr('hidden');
  // $('.goBackToAllExerciseBtn').hide();
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
  $('.navShowAllBtn').attr('hidden');
  $('.navShowAllBtn').hide();
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
  $('.navShowAllBtn').removeAttr('hidden');
  $('.navShowAllBtn').show();
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

  return user;
}

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
      $('.nav-username').text(getCurrentUser());
      // hideIntroPage();
      // hideLogInBtn
      // showMyExercisesPage();
      };

  //WAYPOINTS
  
  /* Animation on Scroll */
  // $('.js--intro-title').waypoint(function(direction){
  //   $('.js--intro-title').addClass('animated zoomIn');
  // }, {
  //  offset: '50%'
  // });


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
    
  });

  $('.topnav').on('click','.navShowAllBtn',function(){
    console.log('working');
    showScreen('allExercises');
    //  return showAllExercisesPage();
  });

  $('.topnav').on('click','.navShowMyBtn',function(){
    showScreen('myExercises');
    // return showMyExercisesPage();
  });

  $('.nav-login').click(function(){
    showScreen('login')
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
      $('#form-messages').text('Add a new technique!');
      clearExerciseForm();
      hideAddExerciseBtn();
      showScreen('exerciseForm');
    } else {
      showFormMessages();
      $(formMessages).text(`Please login or register to add a technique!`);
    }
   
   
  })

  // Sign Up Form Click Event
  $('#sign-up-form > form').submit(function(){
    submitSignupForm();
    // hideExerciseForm();
    // hideSignupForm();
    // showAddExerciseBtn();
    // showScreen('newUser');
    hideSignupForm();
  });
  
  // Show Login Form
  // $('.login-btn').click(function(){
  //   hideLogInBtn();
  //   showLoginForm(); 
  // });

  $('.promptLogin').click(function(){
    showScreen('login');
  })

  $('.enter').click(function(){
    showScreen('allExercises');
    hideAddExerciseBtn();
    // showGoBackBtn();
  });


  // Show Video Picker 
  $('.add-video-btn').click(function(e){
    e.preventDefault();
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
    console.log('Click Submit');
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
      showLoginForm();
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

    if(isLoggedIn()){
      showAddExerciseBtn();
      const currentExerciseId = getCurrentExerciseIdFromClick(e);
      const currentExercise = getCurrentExercise(currentExerciseId);
      console.log(currentExercise.comments);

      populateFormWExerciseData(currentExercise);
      renderVideosOnExercisesForm(currentExercise); 
    } else {
      showFormMessages();
      $('#form-messages').text(`Please login or register to view and comment on techniques!`);
    }

    
  });

/**------------------------------------------------------- */
/*  
/**------------------------------------------------------- */




  // Delete Exercise Click
  $('.delete-exercise-btn').click(function(e){
    e.preventDefault();
    // console.log( $('.exercise-id').val() );
    deleteExercise( $('.exercise-id').val() );
  });

  // Delete Videos Click 
  $('.added-videos').on('click','.deleteVideo', function(e){
    // let target = $( e.target );
    // console.log(videoID);
    deleteVideoFromExercise(video_id);
  });

  // Add Comment Btn
  $('.addCommentBtn').click(function(e){
    e.preventDefault();

    if(!isLoggedIn()){
      showLoginForm();
      hideExerciseForm();
    } else {
      hideAddCommentBtn();
      console.log('working');
      generateCommentElement();
    }
    
  })

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
