"use strict";

/**-------------------------------- */
/*     Global App State
/**--------------------------------- */
let categories = [];  
let myCategories = []; 

// General APP structure for refactor
const APP = {
  categories: {},            
  currentScreen: 'intro',   
  screens: {},              
  authToken: '',
  user: undefined
}

// Specific categories arrays
APP.categories.all = categories;
APP.categories.my = myCategories;

/**-------------------------------- */
/*     Hide & Show Functions
/**--------------------------------- */

function showCategoryFormBtns(){
  $('.categoryFormBtn').removeClass('hidden');
  $('.categoryFormBtn').show();
}

function hideCategoryFormBtns(){
  $('.categoryFormBtn').addClass('hidden');
  $('.categoryFormBtn').hide();
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

function hideUserCategoryPage(){
  $('.user-category-page').attr('hidden');
  $('.user-category-page').hide();
};

function showIntroPage(){
  $('.introduction-page').show();
}


function showDeleteCategoryBtn(){
  $('.delete-category-btn').removeAttr('hidden');
  $('.delete-category-btn').show();
}

function hideDeleteCategoryBtn(){
  $('.delete-category-btn').attr('hidden');
  $('.delete-category-btn').hide();
}

function showPrevNextBtn(){
  $('.button-options').removeAttr('hidden');
  $('.button-options').show();
}

function hidePrevNextBtn(){
  $('.button-options').attr('hidden');
  $('.button-options').hide();
}

function showAddCategoryBtn(){
  $('.add-category-btn').show();
}

function hideAddCategoryBtn(){
  $('.add-category-btn').hide();
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

function showAllCategoryPageHeader(){
  $('.allCategoryPageHeader').removeAttr('hidden');
  $('.allCategoryPageHeader').show();
}

function hideAllCategoryPageHeader(){
  $('.allCategoryPageHeader').attr('hidden');
  $('.allCategoryPageHeader').hide();
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

function clearFormMeassage(){
  $('#form-messages').html('');
}
function showloginRegisterPrompt(){
  $('.loginOrRegisterPrompt').removeAttr('hidden');
  $('.loginOrRegisterPrompt').show();
}

function hideLoginRegisterPrompt(){
  $('.loginOrRegisterPrompt').attr('hidden');
  $('.loginOrRegisterPrompt').hide();
}

function hideSubmitCommentBtn(){
  $('.commentSaveBtn').attr('hidden');
  $('.commentSaveBtn').hide();
}
/**-------------------------------- */
/*  Hide & Show FORM INPUTS
/**--------------------------------- */

function enableFormInputs(){
  $('form.category-form input').prop('disabled', false);
  $('.status').prop('disabled', false);
  $('form.category-form textarea').prop('readonly', false);
  // $('.status-content').removeAttr('hidden'); 
  $('.status-content').show(); 
  $('.pickerContentOnForm').show(); 



  showCategoryFormBtns(); 
  showVideoPickerBtn();   
}

function disableFormInputs(){
  $('form.category-form input').prop('disabled', true);
  $('.status').prop('disabled', 'disabled'); 
  $('form.category-form textarea').prop('readonly', true); 
  // $('.status-content').attr('hidden'); 
  // $('.status-content').attr('hidden', 'hidden'); 
  $('.status-content').hide(); 
  $('.pickerContentOnForm').hide(); 
  hideCategoryFormBtns();
  hideVideoPickerBtn();
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function responsiveNav() {
  var nav = document.getElementById("myTopnav");
  if (nav.className === "topnav") {
      nav.className += " responsive";
  } else {
      nav.className = "topnav";
  }
}

/**--------------------- */
/*    On Page Ready/
       Click Events
/**--------------------- */
$(function onAppStart() {

    if(isLoggedIn()){
      showNavItemsAfterLogin();
      hideNavItemsWhenLoggedIn();
      showScreen('myCategories');
      hideLoginForm();
      };

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
    showScreen('signup');
    enableFormInputs();
    
  });

  $('.topnav').on('click','.navShowAllBtn',function(){
    if(currentScreen() == 'allCategories'){
      console.log('Already here!');
    }
    showScreen('allCategories');
    hideMoviePicker();
  });

  $('.topnav').on('click','.navShowMyBtn',function(){
    showScreen('myCategories');
    hideMoviePicker();
  });

  $('.nav-login').click(function(){  
    showScreen('login')
    enableFormInputs();
  });

  $('.nav-logout').click(function(){
    // let formMessages = $('#form-messages'); 
    // $(formMessages).text('You are now Logged!')
    console.log('Logout Click')
    logoutUser();
  });

  $('.nav-username').click(function(){
      showScreen('myCategories');
  });

  $('.comment-section').on('click','.a-login',function(e){
    e.preventDefault();
    if(!isLoggedIn()){
      showScreen('login');
    }

    // console.log('a-login');
  });
  
  // Prevent Form Event Default
  $('form').submit(function(e){
    e.preventDefault();
  });

  $('.add-category-btn').click(function(){
    // console.log($('.category-title').val());
    let formMessages = $('#form-messages'); 

    if(isLoggedIn()){
      showFormMessages();
      $('#form-messages').text('Create your Category here! !');
      hideAddCategoryBtn();
      setCurrentCategory(false);  
      showScreen('categoryForm');
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
    // $('body').css({
    //   'background-image': "url("+'/styles/imgs/video-hero.jpg'+")",
    //   'background-position': 'center',
    //   'height': '100vh',
    //   'background-repeat': 'no-repeat',
    //   'background-size': 'contain, cover',
    //   'background-attachment': 'fixed',
    //   'margin': '0'
    // });
    showScreen('allCategories');
    hideAddCategoryBtn();
  });


  // Show Video Picker 
  $('.add-video-btn').click(function(e){
    e.preventDefault();
    searchVideoForCategoryTitle();
    hideAddCategoryBtn();
    hideCategoryForm();
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
    showCategoryForm();
  })

  // Save Category Click
  $('.category-form form').submit(function(e){
    e.preventDefault();
    showFormMessages();
    submitCategoryForm();
  });

  // Log In Click Event
  $('.logIn').click(function(){
    loggingIn();
  });

  $('.addVideosToProfileBtn').click(function(){
    addSelectedVideosToForm();
    hideMoviePicker();
    showCategoryForm();
  });

/**------------------------------------------------------- */
/*   Collects and displays the category data to the form 
/**------------------------------------------------------- */

  $('.user-category-page').on('click','.category-show', function(e){
    const currentCategoryId = getCurrentCategoryIdFromClick(e);
    setCurrentCategory(currentCategoryId);  
    showScreen('categoryForm');
  });

/**------------------------------------------------------- */
/*  
/**------------------------------------------------------- */

  // Delete Category Click
  $('.delete-category-btn').click(function(e){
    e.preventDefault();
    
    deleteCategory( $('.category-id').val() );
  });

  // Delete Videos on category  
  $('.added-videos').on('click','.deleteVideo', function(e){
    let videoId = $(this).closest('.video-controls').attr('data-videoId');

    if(videoId){
      deleteVideoFromCategory(videoId);   
    } else {
      $(this).closest('.categoryOnForm').closest('.col-4').remove();
    }

  });


});
