"use strict";

let pageToken = {};

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
