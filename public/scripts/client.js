/**Sign Up section 
 * HTML form
 * Function to show and hide
 * func to make api req to api/users
 * succ signup func - auto login
 * signup failure func - err message to user from server
*/
function showSignupForm(){
  $('#sign-up-form').show();
  hideLoginForm();
}

function hideSignupForm(){
  $('#sign-up-form').hide();
}

  
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
    console.log(data);
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

/**Login section 
 * HTML form
 * Function to show and hide
 * func to make api req to api/auth/login
 * succ func - dashboard
 * failure func - err message to user from server
*/
function showLoginForm(){
  $('#login-form').show();
  hideSignupForm();
}
function hideLoginForm(){
  $('#login-form').hide();
}

/**Dashboard section 
 * HTML Framework
 * JS func to generate HTML for sub sections of dashboards
 * Function to show and hide each sub section
 * functions to cache data for future reference to the use
 * failure func - err message to user from server
*/

/**Exercise Add Form section 
 * HTML Framework
 * JS func to generate HTML for sub sections of dashboards
 * Function to show and hide each sub section
 * functions to cache data for future reference to the use
 * failure func - err message to user from server
*/

function showAddExerciseForm(){
  $('.add-exercise-form').show();
}

function hideAddExerciseForm(){
  $('.add-exercise-form').hide();
}

// Use jquery to pullout the val of the form inputs
// Make an ajax req w/ form data
// Handle successes and failures

function submitExerciseForm(){
  let data = {
    title: $('.exercise-title').val(),
    description: $('.exercise-description').val(),
    status: $('.status > option:selected').val(),
    allowComments: $('.allow-comments').val(),
    videos:[{
      title: $('.exercise-title').val(),
      description: $('.exercise-description').val(),
      url: $('img').attr('src').val()
    }],
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
      
    }
  };
  console.log(data);
  let formMessages = $('#form-messages');

  // Submit the form using AJAX.
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8080/api/exercises',
    data: data
  }).done(function(response) {
    console.log(data);
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Set the message text.
    $(formMessages).text(response);

    // Clear the form.
    $('.exercise-title').val('');
    $('.exercise-description').val('');
    $('.status > option:selected').val('');
    $('.allow-comments').val('');
    hideAddExerciseForm();
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

$(function onPageReady(){
  // Does client think user is logged in - if so does the 
  // server agree that the users logged in. If client and server both 
  // agree im logged in then show the dashboard. If not show
  // the log in form.

  $('.nav-signup').click(function(){
    showSignupForm();
  });

  $('.nav-exercises').click(function(){
    showLoginForm();
  });

  $('.nav-login').click(function(){
    showLoginForm();
  });

  $('#sign-up-form > form').submit(function(e){
    e.preventDefault();
    submitSignupForm();
  });
  
  $('.btn-add-exercise').click(function(e){
    e.preventDefault();
    showAddExerciseForm();
    $('.introduction-page').hide();
    // $('.add-exercise-form').show();
    // showLoginForm();
  });

});

function youtubeOutput (data) {
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
                  
  	    })
  	    $('.video-results > .row').html(html);
  	}

// function searchYoutube() {
  // 	let query = $('#search').val()+' '+'the movie';
  // 	$.ajax({
  // 	    url: 'https://www.googleapis.com/youtube/v3/search'
  // 	    , dataType: 'json'
  // 	    , type: 'GET'
  // 	    , data: {
  // 	        key: 'AIzaSyA9YIeJMUAUAO5QaCo0wzfbdGlLIbjo1D4'
  // 	        , q: query
  // 	        , part: 'snippet'
  // 	        , maxResults: 6
  // 	        , pageToken: pageToken.current
  // 	    }
  // 	}).done(youtubeOutput);
  // }