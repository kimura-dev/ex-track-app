"use strict";

/**----------------------------- */
/* Global Vars
/**----------------------------- */  

let pageToken = {};
let videosSelected = [];
let video = []; 
let exercises = []; 
let exerciseId = '';
let currentExerciseIndex = -1;
const API_URL = 'http://localhost:8080/api';

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
/*  Hide & Show Log In Btn
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
/* Exercise Form Hide & Show 
/**--------------------------------- */
function showExerciseForm(){
  $('.exercise-form').show();
};

function hideExerciseForm(){
  $('.exercise-form').hide();
};

/*--------------------------------*/
/*     JSON for selected videos
/*--------------------------------*/
function jsonforVideo(videoElement){
  let target = $(videoElement);
  return {
    _id: target.find('.video-title').attr('objectID'),
    title: target.find('.video-title').text(),
    url: target.find('.thumbnail').attr('src'),
    videoID: target.find('.thumbnail').attr('videoID')
  };
}

/**-------------------------------- */
/* Exercise Form Submit 
/**--------------------------------- */
function submitExerciseForm(){

  let videos = [];
  let allowComments;
  if ( $( '.allowComments' ).prop( "checked" ) ) {
    allowComments = true;
    $('.comment-section').removeAttr('hidden');
    $('.comment-section').show();
  } else {
    allowComments = false;
  }
     
  $('.added-videos .col-4').each(function(){
    videos.push(jsonforVideo(this));
  });

  let exerciseId = $('.exercise-id').val() || undefined;

  let data = {
    _id: exerciseId,
    title: $('.exercise-title').val(),
    description: CKEDITOR.instances['body'].getData(), 
    status: $('.status > option:selected').text(),
    allowComments: allowComments,
    videos: JSON.stringify(videos)
  };

  // console.log(data);

  let formMessages = $('#form-messages');
  // console.log('This is the request data'+ data);

  let authToken = '';

  if(window.localStorage){
    authToken = window.localStorage.getItem('authToken');
  }
  // console.log(authToken);

  // AJAX To Exercises
  $.ajax({
    type: exerciseId ? 'PUT':'POST',
    url: `http://localhost:8080/api/exercises/${ exerciseId ? exerciseId  : ''}`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).done(function(response) {
    console.log(exercises);
    
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Clear the form.
    $('.exercise-title').val('');
    $('.exercise-id').val('');
    $('.exercise-description').val('');
    $('.added-videos').html('');
    $('.allow-comments').val('');
    hideExerciseForm();

    // Create Exercise Array
    if(exerciseId){
      $(formMessages).text(`${response.title} was edited successfully!`);
      // exercises[currentExerciseIndex].videos.push(video);
      const index = exercises.findIndex((exercise) => {
        return exercise._id === exerciseId;
      });

      if (index >= 0){
        exercises[index] = response;
        // console.log(response);
      }
     
    } else {
      $(formMessages).text(`${response.title} was added successfully!`);
      exercises.push(response);
    }
    
    renderUserExercisesPage();
    showUserExercisesPage();

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

/**--------------------------------------------------- */
/*    Get Exercise Data Displays Users Page
/**---------------------------------------------------- */
function showUserExercisesPage(){
  $('.user-exercise-page').removeAttr('hidden');
  $('.user-exercise-page').show();
};

function hideUserExercisesPage(){
  $('.user-exercise-page').attr('hidden');
  $('.user-exercise-page').hide();
};

function renderUserExercisesPage(){
  let htmlForPage = exercises.map(htmlForExercisePreview).join('');
  $('.user-exercise-page > .row').html(htmlForPage); 
};

function htmlForExercisePreview(exercise){
  // console.log(exercise);
  let videoSrc = '';
  let videoID = '';

  if(exercise.videos && exercise.videos.length){
    videoSrc = exercise.videos[0].url;
    videoID = exercise.videos[0].videoID;
  };

  return ` <div class="col-4">
                <div class="exercise">
                  <a class="exercise-show" href="#">View
                  <img class="exercise-image" src="${videoSrc}" videoID="${videoID}" />
                  </a>
                  <h3 class="user-exercise-title">${exercise.title}</h3>
                <div class="exercise-content">
                  <p>${exercise.description}</p>
                </div>
              </div>`;
};

/**--------------------------------------------------- */
/*     Display Users Exercise Data to Form
/**---------------------------------------------------- */

function getExerciseIndexFromClick(e){
  const target = $(e.currentTarget);
  let index = target.index();
  // console.log(index);
  return index;
};

function renderVideosOnExercisesForm(exercise){
  let htmlForVideo = exercise.videos.map(htmlForVideoOnExerciseForm).join('');
  $('.added-videos').html(htmlForVideo); 
};

function htmlForVideoOnExerciseForm(video){
  // console.log(exercise);
  return `<div class="col-4">
            <h3 class="video-title" objectID="${video._id}">${video.title}</h3>
            <img  class="thumbnail" src="${video.url}" videoID="${video.videoID}">
            <p class="url"><a href="https://www.youtube.com/watch?v=${video.videoID}" target="_blank"> ${video.videoID}</a></p>
            <div class="video-controls">
              ${videoControls(true)}
            </div>
          </div>`;
};

function populateFormWExerciseData(exercise) {
  // console.log(exercise._id);
  if(exercise){
    $('.exercise-id').val(exercise._id || '') ;
    $('.exercise-title').val(exercise.title || '') ;
    $('.exercise-description').val(exercise.description || '');
    hideUserExercisesPage();
    showExerciseForm();
  }
};

function getAllExercises(){
  let authToken = '';

  if(window.localStorage){
    authToken = window.localStorage.getItem('authToken');
  }
  // console.log(authToken);

  // AJAX To Exercises
  return $.ajax({
    type: 'GET',
    cache: false,
    url: API_URL+ '/exercises',
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).done(function(_exercises){
    exercises = [..._exercises];
    // exercises = _exercises;
  });

}


/**----------------------------- */
/*    Movie Picker Controls
/**------------------------------ */

function showMoviePicker(){
  hideExerciseForm();
  $('.video-picker').show();
};

function searchMoviePicker(){
  searchYoutube();
  $('.button-options').show();
}

function hideMoviePicker(){
  $('.video-picker').hide();
}

/**-------------------------------- */
/*   YouTube Search Movie Picker 
/**-------------------------------- */

function youtubeOutput(data) {
  // $('.video-search-input').val('');
  pageToken.nextPage = data.nextPageToken;
  pageToken.prevPage = data.prevPageToken;
  let html = "";
  $.each(data['items'], function (index, value) {
    html += htmlForVideoResult(value);     
  });
  $('.video-results > .row').html(html);
};

function searchYoutube() {
  let query = $('.video-search-input').val();
  $.ajax({
      url: 'https://www.googleapis.com/youtube/v3/search'
      , dataType: 'json'
      , type: 'GET'
      , data: {
          key: 'AIzaSyA9YIeJMUAUAO5QaCo0wzfbdGlLIbjo1D4'
          , q: query
          , part: 'snippet'
          , maxResults: 6
          , pageToken: pageToken.current
      }
  }).done(youtubeOutput);
};

/**------------------------- */
/*     Preview Videos
/**------------------------- */
function previewVideos(){
  $('.video-results').on('click', '.preview-video', function () {
    console.log('clicked');
    $('.popup').show()
    $('.overlayBg').show();
    $(window).scrollTop(0)
    $('.popup iframe').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('videoID'));
  });
  $('.overlayBg').click(function () {
    $('.popup').hide()
    $('.overlayBg').hide()
  });
}; 

/**---------------------------- */
/*     Add Videos to Profile
/**---------------------------- */

function addSelectedVideoToForm(e) {
  let button = $( this );
  let videoResult = button.closest('.video-result');
  let video = jsonforVideo(videoResult);
  $('.added-videos').append(htmlForVideo(video));
  // exercises[currentExerciseIndex].videos.push(video);
  // console.log(currentExerciseIndex);
};

/**---------------------------- */
/*    HTML For Videos 
/**---------------------------- */

function htmlForVideo(video){
  return `<div class="col-4">
              <h3 class="video-title">${video.title}</h3>
              <img  class="thumbnail" src="${video.url}" videoID="${video.videoID}">
              <p class="url"><a href="https://www.youtube.com/watch?v=${video.videoID}" target="_blank"> ${video.videoID}</a></p>
              <div class="video-controls">
            ${videoControls(true)}

              </div>
            </div>`
}

function htmlForVideoResult(value){
  return  `<div class="col-4 video-result">
            <h3 class="video-title">${value.snippet.title}</h3>
            <img  class="thumbnail" src="${value.snippet.thumbnails.medium.url}" videoID="${value.id.videoId}">
            <p class="url"><a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank"> ${value.id.videoId}</a></p>  
            <div class="video-controls">
            ${videoControls(false)}
            </div>
          </div>`
};

function videoControls(isAdded){
  if(isAdded){
    return  `
    <button class="watchVideo">Watch Video</button>
    <button class="deleteVideo">Delete Video</button>`
  } 
    return `<button class="preview-video">Preview</button>
            <button class="select-video-btn">Select</button>`
  
};

/**------------------------------- */
/*     Delete Video from Profile
/**-------------------------------- */
function deleteVideo(){
  let target = $( e.target );
  $(target).parent().remove();  
};

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
  }).done(function(response) {
    // console.log(response);
    let authToken = response;
    if(window.localStorage){
      window.localStorage.setItem('authToken', authToken.authToken);
    }
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    $(formMessages).text(`Welcome ${response.username}`);
    $('.usersname').val('');
    $('.password').val('');
    hideLoginForm();
    getAllExercises().then(function(){
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

function deleteExercise(){
  $.ajax({
    type: 'DELETE',
    url: `http://localhost:8080/api/exercises/${exercise_id}`,
  }).done(function(response){
    console.log(response);
  });
};


/**--------------------- */
/*    On Page Ready/
       Click Events
/**--------------------- */
$(function onPageReady(){
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
  });

  $('.nav-search-exercise').click(function(){
    console.log('working');
    $('.search-exercise').show();
  });

  $('.nav-logs').click(function(){
    console.log('Logs Page');
  });

  $('.nav-exercises').click(function(){
    showLoginForm();
  });

  $('.nav-login').click(function(){
    showLoginForm();
  });

  // Prevent Form Event Default
  $('form').submit(function(e){
    e.preventDefault();
  });

  $('.add-exercise-btn').click(function(){
    hideIntroPage();
    hideAddExerciseBtn();
    showExerciseForm();
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
  $('.video-results').on('click','.select-video-btn', addSelectedVideoToForm);

  // Close Video Picker 
  $('.closePickerBtn').click(function(e){
    e.preventDefault();
    hideMoviePicker();
    showExerciseForm();
  })

  // Save Exercise Click
  $('.exercise-form form').submit(function(){
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
    hideMoviePicker();
    showExerciseForm();
  });

  // Edit Exercise Form Page 
  $('.user-exercise-page').on('click','.exercise-show', function(e){
    // console.log(exercises);
    currentExerciseIndex = getExerciseIndexFromClick(e);
    populateFormWExerciseData(exercises[currentExerciseIndex]);
    renderVideosOnExercisesForm(exercises[currentExerciseIndex]);
  });

  // Select Video Btn
  $('.selected-video-btn').click(function(){
    $(this).css('color','#e8e8e8');
    // videoResult.addClass('vid-selected');
  });
 
  // $('.allowComments').click(function(){
  //   let commentVal = $(this).val();
  //   console.log(commentVal);
  //   if (commentVal == 'on'){

  //   }
  // })

  previewVideos(); 



});