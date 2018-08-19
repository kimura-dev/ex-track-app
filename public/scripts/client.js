"use strict";

/**----------------------------- */
/* Global Vars
/**----------------------------- */  

let pageToken = {};
let videosSelected = []; 

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

/**-------------------------------- */
/* Exercise Add Submit Form section 
/**--------------------------------- */
function showAddExerciseForm(){
  $('.add-exercise-form').show();
};

function hideAddExerciseForm(){
  $('.add-exercise-form').hide();
};

/*--------------------------------*/
/*     JSON for selected videos
/*--------------------------------*/
function jsonforVideo(videoElement){
  let target = $(videoElement);
  return {
    title: target.find('.video-title').text(),
    url: target.find('.thumbnail').attr('src'),
    videoID: target.find('.thumbnail').attr('videoID')
  };
}

function submitExerciseForm(){
  let videos = [];
  $('.added-videos .col-4').each(function(){
    videos.push(jsonforVideo(this));
  });

  let data = {
    title: $('.exercise-title').val(),
    description: $('.exercise-description').val(), 
    status: $('.status > option:selected').val(),
    // allowComments: allowComments,
    videos: JSON.stringify(videos),
  };

  let formMessages = $('#form-messages');
  console.log('This is the request data'+ data);

  // AJAX 
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8080/api/exercises',
    data: data
  }).done(function(response) {
    console.log('This is the response data'+ response);
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Set the message text.
    $(formMessages).text(`${response.title} was added to your profile successfully!`);

    // Clear the form.
    $('.exercise-title').val('');
    $('.allow-comments').val('');
    hideAddExerciseForm();
    generateExerciseItemsString(response.videos);
    showCreatedExercise(response);
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

function showCreatedExercise(response){
  $('.userExercise').removeAttr('hidden');
  $('.userExercise').show();
  $('.user-ex-title').html(response.title);
  // $('.user-ex-status').html(response.status);
  // generateItemElement(response);
};

function generateItemElement(response) {
  console.log(response);
  return $('.user-ex-videos').append(`<div class="col-4 card">
                                <h3 class="video-title">${response.title}</h3>
                                  <img  class="thumbnail" src="${response.url}" videoID="${response.videoID}">
                                  <p class="url"><a href="https://www.youtube.com/watch?v=${response.videoID}" target="_blank"> ${response.videoID}</a></p>
                             </div>`);
};

function generateExerciseItemsString(videos) {
  console.log("Generating exercise items" + videos);

   videos.forEach((video) =>{return generateItemElement(video)});

};

/**----------------------------- */
/*    Movie Picker Controls
/**------------------------------ */

function showMoviePicker(){
  hideAddExerciseForm();
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
  pageToken.nextPage = data.nextPageToken;
  pageToken.prevPage = data.prevPageToken;
  var html = "";
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

function addSelectedVideo(e) {
  let button = $( this );
  let videoResult = button.closest('.video-result');
  videoResult.addClass('selected');
  let video = jsonforVideo(videoResult);
  $('.added-videos').append(htmlForVideo(video));
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
            <button class="select-video">Select</button>`
  
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
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    $(formMessages).text(`Welcome ${response.username}`);
    $('.usersname').val('');
    $('.password').val('');
    hideLoginForm();
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

  // Sign Up Form Click Event
  $('#sign-up-form > form').submit(function(){
    submitSignupForm();
  });
  
  // Show Add Exercise Form
  $('.btn-add-exercise').click(function(){
    $('.introduction-page').hide();
    $(this).hide();
    // showLoginForm();
    showAddExerciseForm();
  });

  // Show Video Picker 
  $('.add-video').click(function(e){
    e.preventDefault();
    showMoviePicker();
  });

  // Search Video Picker
  $('.video-search-btn').click(function(){
    searchMoviePicker();
  });
 
  // Add Video to Profile
  $('.video-results').on('click','.select-video', addSelectedVideo);

  // Close Video Picker 
  $('.closePickerBtn').click(function(e){
    e.preventDefault();
    hideMoviePicker();
    showAddExerciseForm();
  })

  // Save Exercise Click
  $('.add-exercise-form form').submit(function(){
    submitExerciseForm();
  });

  // Log In Click Event
  $('.logIn').click(function(){
    loggingIn();
  })

  // Submit Sign Up Form
  $('.submit-signup-btn').click(function(e){
    newUserSignUp();
  })

  // Delete Videos Click 
  $('.added-videos').on('click','.deleteVideo',function(e){
    deleteVideo(e);
  });

  // Set Status

  // $('.status').click(function(e){
  //   let button = e.target;
  //   console.log(button);
  // });   

  // $( document ).on( "click", function( event ) {
  //   $( event.target ).closest( "li" ).toggleClass( "highlight" );
  // });
  
  $('.returnToProfileBtn').click(function(){
    // addVideosToProfile(e);
    hideMoviePicker();
    showAddExerciseForm();
  });

  previewVideos();  

});