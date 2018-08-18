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

/*--------------------------------*/
/*     JSON for selected videos
/*--------------------------------*/
function jsonforVideo(videoElement){
  let target = $(videoElement);
  return {
    title: target.find('.video-title').text(),
    url: target.find('.url a').attr('href'),
    // videoID: target.parent().prev().prev().attr('videoID'),
    videoID: target.find('.thumbnail').attr('videoID')

  };
}

/**-------------------------------- */
/* Exercise Add Submit Form section 
/**--------------------------------- */
function showAddExerciseForm(){
  $('.add-exercise-form').show();
};

function hideAddExerciseForm(){
  $('.add-exercise-form').hide();
};

function submitExerciseForm(){
  let videos = [];
  let allowComments;
  if($('select > option').val() === 'public'){
    allowComments = true;
  } else {
    allowComments = false;
  }

  if(videosSelected.length > 0){
    videos = videosSelected;
  } else {
    videos = null;
  }

  $('.added-videos .col-4').each(function(){
    videos.push(jsonforVideo(this));
  });
  let data = {
    title: $('.exercise-title').val(),
    description: $('.exercise-description').val(),
    status: $('.status > option:selected').val(),
    allowComments: allowComments,
    videos: videos,
    ratings:[{
      date: {
        default: Date.now
      },
      user: {

      },
      value: {

      }
    }],
    allowComments: {
      
    },
    // user: username,
    date:{
      type: Date,
      default: Date.now
    }
  };

  let formMessages = $('#form-messages');
  console.log('This is the request data'+ data);

  // Submit the form using AJAX.
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
  let title = response.title;

  // if (allowComments === 'true'){
  //   $('.userExercises > .row').append(`<div></div>`)
  // }
  let allowComments = response.allowComments;
  let comments = response.comments;
  let date = response.date;
  let ratings = response.ratings;
  let status = response.status;
  let videos = response.videos;
  // $('.userExercises > .row').html(`<div class="col-12">
  //                                   <form>
  //                                     <fieldset>
  //                                       <legend>Technique</lengend>
  //                                       <h3>${response.title}</h3>
  //                                       <p>${response.date}</p>
  //                                       <section class="ratings">
  //                                         <h3>Rate this:</h3>
  //                                         <span class="fa fa-star checked" data-rating-value="1"></span>
  //                                         <span class="fa fa-star checked" data-rating-value="2"></span>
  //                                         <span class="fa fa-star" data-rating-value="3"></span>
  //                                         <span class="fa fa-star" data-rating-value="4"></span>
  //                                         <span class="fa fa-star" data-rating-value="5"></span>
  //                                       </section>
  //                                       <div class="row">
  //                                         <div class="col-4">
  //                                           <select name="status" class="status">
  //                                             <option value="public" name="public" class="public">Public</option>
  //                                             <option value="private" name="private" class="private">Private</option>
  //                                           </select>
  //                                           <label for="status">Status</label>
  //                                         </div>
  //                                       </div>
  //                                       <div class="row">
  //                                         <div class="col-4">
  //                                           <h3 class="video-title">${response.videos}</h3>
  //                                           <img  class="thumbnail" src="${url}" videoID="${videoID}">
  //                                           <p class="url"><a href="https://www.youtube.com/watch?v=${videoID}" target="_blank"> ${videoID}</a></p>
  //                                          <textarea name="body" class="description" col="40" row="6"></textarea>
  //                                          <div class="noteBtn">
  //                                            <button value="save" class="saveNote">Save Note</button>
  //                                            <button value="save" class="cancelNote">Cancel Note</button>
  //                                            <button value="save" class="editNote">Edit Note</button>
  //                                            <button class="deleteVideo">Delete Video</button>
  //                                          </div
  //                                         </div>
  //                                       </div
                                        
  //                                     </fieldset>
  //                                    <button class="editTech">Edit Technique</button>
  //                                    <button class="deleteTech">Delete Technique</button>
  //                                   </form>
  //                                  </div>`)

  $('.userExercises').removeAttr('hidden');
  $('.userExercises').html(``);
}


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
let pageToken = {};

function youtubeOutput(data) {
  pageToken.nextPage = data.nextPageToken;
  pageToken.prevPage = data.prevPageToken;
  var html = "";
  $.each(data['items'], function (index, value) {
    html += `<div class="col-4">
              <h3 class="video-title">${value.snippet.title}</h3>
              <img  class="thumbnail" src="${value.snippet.thumbnails.medium.url}" videoID="${value.id.videoId}">
              <p class="url"><a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank"> ${value.id.videoId}</a></p>  
              <div class="video-btn">
                <button class="preview-video">Preview</button>
                <button class="select-video">Select</button>
              </div>
            </div>`;     
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

/**-------------------------------- */
/*   Add Videos to Selected Array
/**-------------------------------- */

function selectedVideosArray(){
  let images = [{title:title, url:url, videoID:videoID,}];
  videosSelected.push(images[0]);
}

/**---------------------------- */
/*     Add Videos to Profile
/**---------------------------- */
let videosSelected = []; 
function addVideosToProfile(e) {
  let target = $( e.target );
  let title = $(target).parent().prev().prev().prev().text();
  let url = $(target).parent().prev().prev().attr('src');
  let videoID = $(target).parent().prev().prev().attr('videoID');
  let images = [{title:title, url:url, videoID:videoID}];
  videosSelected.push(images[0]);
  $('.added-videos').append(`<div class="col-4">
                                <h3 class="video-title">${title}</h3>
                                <img  class="thumbnail" src="${url}" videoID="${videoID}">
                                <p class="url"><a href="https://www.youtube.com/watch?v=${videoID}" target="_blank"> ${videoID}</a></p>
                                <textarea name="body" class="description" col="40" row="6"></textarea>
                                <button value="save" class="saveNote">Save Note</button>
                                <button value="save" class="cancelNote">Cancel Note</button>

                                <button class="deleteVideo">Delete Video</button>
                              </div>`);
  hideMoviePicker();
  showAddExerciseForm(); 
};

/**------------------------------- */
/*     Delete Video from Profile
/**-------------------------------- */
function deleteVideo(e){
  let target = $( e.target );
  $(target).parent().remove();  
};

/**------------------------------- */
/*   Show Comments in profile
/**-------------------------------- */

// function showComments(){
//   let allow = $('input[checked]').val();
//   if(allow === 'on'){
//     if(user){
//        $('commentSection').show();
//     } else {

//     }
//   };
// };

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
/*        DASHBOARD
/**---------------------- */

function showDashboard(){
  
};

/**--------------------- */
/*    On Page Ready/
       Click Events
/**--------------------- */
$(function onPageReady(){
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
  $('.video-results').on('click','.select-video',function(e){
    addVideosToProfile(e);
    // selectedVideosArray(e);
  });

  // Close Video Picker 
  $('.closePickerBtn').click(function(e){
    e.preventDefault();
    hideMoviePicker();
    showAddExerciseForm();
  })

  // Save Exercise Click
  $('.add-exercise-form form').submit(function(){
    // let status = $('.status > option').val();
    // console.log(status);
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
  //   let target = e.target;
  //   // console.log(target);
  // });   

  // $( document ).on( "click", function( event ) {
  //   $( event.target ).closest( "li" ).toggleClass( "highlight" );
  // });
  
  $('.returnToProfileBtn').click(function(){
    // addVideosToProfile(e);
    hideMoviePicker();
    showAddExerciseForm();
  });

  // Rate Stars Click
  $('.fa-star').click(function(){
    $(this).toggleClass('checked');
  });

  $('.status').click(function(e){
    let target = e.target;
    console.log(target);
  })

  previewVideos();  
});
