"use strict";

/**-------------------------------- */
/*     Global App State
/**--------------------------------- */
let exercises = []; // todo:  refactor so it is defined inside APP 
let myExercises = []; // todo: replace all references to exercises and myExercises with APP.exercises.all and APP.exercises.all

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
  if( screenName && screenName in APP.screens ){
    APP.currentScreen = screenName;
        
    Object.keys(APP.screens).forEach(screen => {
      const thisScreen = APP.screens[screen];
      if( thisScreen !== currentScreen() ){
        if( typeof thisScreen.hide === 'function' ){
          thisScreen.hide();
        }
      }
    });
    // only calls .show() if the screen exists
    redrawCurrentScreen();
  }  
}

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
}

// Example: show current page title
// console.log( currentScreen().title )

function currentExercise(){
  if( !exercises || !exercises.length || currentExerciseIndex < 0 ){
    return undefined;
  }
  return exercises[currentExerciseIndex];
}

// Example: showAllExercises if on exercises page, showMy.. if on my page, etc.
// currentScreen().render();


/**-------------------------------- */
/*     Hide & Show Functions
/**--------------------------------- */
function showExerciseForm(){
  $('.exercise-form').show();
};

function hideExerciseForm(){
  $('.exercise-form').hide();
};



function hideExercisesPage(){
  $('.user-exercise-page').attr('hidden');
  $('.user-exercise-page').hide();
};

function showIntroPage(){
  $('.introduction-page').show();
}

function hideIntroPage(){
  $('.introduction-page').hide();
}


function showDeleteExerciseBtn(){
  $('.delete-exercise-btn').removeAttr('hidden');
  $('.delete-exercise-btn').show();
}

function hideDeleteExerciseBtn(){
  $('.delete-exercise-btn').attr('hidden');
  $('.delete-exercise-btn').hide();
}

function showButtonOptions(){
  $('.button-options').removeAttr('hidden');
  $('.button-options').show();
}

function hideButtonOptions(){
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
function hideLoginItems(){
  $('.nav-login').hide();
  $('.nav-signup').hide();
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

  // Check Authtentication
  // if(window.localStorage){
  //   authToken = window.localStorage.getItem('authToken');
  //   loggingIn();
  // } 

  // $('#js-wp-1').waypoint(function(direction){
  //   $('#jw-wp-1').addClass('animated fadeIn');
  // });

  // CK Editor
  CKEDITOR.replace('body',{
    plugins: 'wysiwygarea,toolbar,basicstyles,link' 
  });

  // Popup Iframe and OverlayBg
  $('.popup').hide();
  $('.overlayBg').hide();

  // Youtube Toggle Search Pages
  $('.tokenClass').click(function () {
    console.log($(this).val());
    pageToken.current = $(this).val() == 'Next' ? pageToken.nextPage : pageToken.prevPage;
    searchYoutube();
  });

  // Nav Bar Icon Click Events
  $('.nav-signup').click(function(){
    showSignupForm();
    hideIntroPage();
    hideLogInBtn();
    hideExercisesPage();
  });

  $('.all-exercises-btn').click(function(){
    showScreen('allExercises');
    //  return showAllExercisesPage();
  });

  $('.nav-exercise-page').click(function(){
    showScreen('myExercises');
    // showMyExercisesPage();
  });

  $('.nav-login').click(function(){
    showLoginForm();
    hideLogInBtn();
    
  });

  $('.nav-logout').click(function(){
    console.log('Logout Click')
    logoutUser();
  });
  
  // Prevent Form Event Default
  $('form').submit(function(e){
    e.preventDefault();
  });

  $('.add-exercise-btn').click(function(){
    hideIntroPage();
    hideExercisesPage();
    hideAddExerciseBtn();
    showExerciseForm();
    // clearExerciseForm();
  })

  // Previous Button Click
  $(".prev-btn").click(function(){
    hideExerciseForm();
    hidePrevBtn();
    // showExercisesPage();
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
    hideLoginItems();
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
  $('.added-videos').on('click','.deleteVideo', function(){
    console.log(currentExerciseIndex);
    console.log(exercises);

    deleteVideoFromExercise(exercises[currentExerciseIndex]);
  });

  // Delete Exercise
  // $('.delete-exercise-btn').click(deleteExercise);
  
  $('.returnToProfileBtn').click(function(){
    addSelectedVideosToForm();
    hideMoviePicker();
    showExerciseForm();
  });

  //Edit Exercise Form Page 
  $('.user-exercise-page').on('click','.exercise-show', function(e){
    hideFormMessage();
    showAddExerciseBtn();
    currentExerciseIndex = getExerciseIndexFromClick(e);
    populateFormWExerciseData(exercises[currentExerciseIndex]);
    renderVideosOnExercisesForm(exercises[currentExerciseIndex]);
  });


    // checkIfExercisePopulated();

  // function checkIfExercisePopulated(){
  //   if(!window.localStorage.getItem('exercises')){
  //     setTimeout(checkIfExercisePopulated, 300);
  //     return false;
  //   }

  //   const exercises = window.localStorage.getItem('exercises');
  //   populateFormWExerciseData(exercises[currentExerciseIndex]);
  //   renderVideosOnExercisesForm(exercises[currentExerciseIndex]);
  // }

  // Delete Exercise Click
  $('.delete-exercise-btn').click(function(){
    console.log('works');
    // deleteExercise();
  });

   // Watch Videos On Exercise Form
  $('.video-results').on('click','.watchvideo',function(e){
    console.log('click');
    previewVideosOnExercisePage();
  });

  previewVideos(); 


});
