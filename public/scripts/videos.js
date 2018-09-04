"use strict";


/**----------------------------- */
/*    Movie Picker Controls
/**------------------------------ */

function showMoviePicker(){
  // hideExerciseForm();
  $('.video-picker').show();
  searchVideoForExerciseTitle();
};

function searchMoviePicker(){
  searchYoutube();
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
  // console.log(data);
  // console.log(pageToken);

  let html = "";
  $.each(data['items'], function (index, value) {
    html += htmlForVideoResult(value);     
  });
  $('.video-results > .row').html(html);
  // showPrevNextBtn();
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
          , maxResults: 4
          , pageToken: pageToken.current
          // , pageToken: 'CAYQAA'
      }
  }).done(youtubeOutput);
  
};

function searchVideoForExerciseTitle(){
  let title = $('.exercise-title').val();

  if(title && !$('.added-videos > .row').children().length) {
    $('.video-search-input').val(title);
    $('.video-search-btn').focus().click();
  }
}

/**------------------------- */
/*     Preview Videos
/**------------------------- */

function previewVideos(){
  $('.video-results').on('click', '.preview-video', function (e) {
    let target = $( e.target );
    // let videoID = $(target).closest('.video-result').find('img').attr('videoID');   
    let videoID = $(target).parent().parent().find('img').attr('videoID');
    // console.log(videoID);
    $('.popup').show()
    $('.overlayBg').show();
    $(window).scrollTop(0)
    // $('.popup iframe').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('videoID'));
    $('.popup iframe').attr('src', `https://www.youtube.com/embed/${videoID}`);
  });
  $('.overlayBg').click(function () {
    $('.popup').hide()
    $('.overlayBg').hide()
  });
}; 

/**------------------------- */
/*     Preview Videos
/**------------------------- */

function previewVideosOnExercisePage(){
  let target = $( e.target );
  // let videoID = $(target).closest('.video-result').find('img').attr('videoID');   
  let videoID = $(target).parent().parent().find('img').attr('videoID');
  console.log(videoID);
  $('.popup').show()
  $('.overlayBg').show();
  $(window).scrollTop(0)
  // $('.popup iframe').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('videoID'));
  $('.popup iframe').attr('src', `https://www.youtube.com/embed/${videoID}`);
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

function getVideoDataFromResultElement(videoResultElement){
  const videoJSON = jsonforVideo(videoResultElement);
  const videos = APP.screens.videoPicker.videos.results;
  return videos.find(result => result.video_id === videoJSON.video_id)
}

function selectVideoResult(e) {

  let videosArray = [];

  let button = $( this );
  let videoResult = button.closest('.video-result');
  
  // old DOM-centric implementation
  videoResult.addClass('selected');

  // new APP state-centric implementation
  
  //1. find actual video object based on videoResult element
  let videoData = getVideoDataFromResultElement(videoResult);
  
  //2. add videoData to our APP state
  APP.screens.videoPicker.videos.selected.push(videoData);

  //3. redraw our UI based on the changed APP state
  redrawCurrentScreen();
  
}

function unselectVideoResult(e) {
  let button = $( this );
  let videoResult = button.closest('.video-result');
  videoResult.removeClass('selected');
}

function addSelectedVideosToForm(){
  $('.video-result.selected').each(function(index, videoResult){
    let video = jsonforVideo($(videoResult));
    if( !isVideoAddedToForm(video.videoID) ){
      $('.added-videos > .row').append(htmlForVideo(video));
    }
  });
};

function isVideoAddedToForm(videoID){
  return $(`.added-videos *[videoID="${videoID}"]`).length > 0;
}

function markSelectedVideos(){
  $('.added-videos > .row > .col-4').each(function(index, selectedVideo){
    selectedVideo = jsonforVideo($(selectedVideo));
    let videoResult =isVideoInResults(selectedVideo.videoID);
    if( videoResult ){
      $(videoResult).addClass('selected');
    }
  });
};

function isVideoInResults(videoID){
  let videoResult = $(`.video-result *[videoID="${videoID}"]`);
  return videoResult.length ? videoResult : false;
}

// function (e){
//   let button = $(this);
// }

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
  const videos = APP.screens.videoPicker.videos.selected;
  // let selectedMatch = videos.find(video => video.videoID === value.id.videoId);

  // let selectedAttribute = selectedMatch ? ' selected' : '';
  
  
    return  `<div class="col-4 video-result${ /*selectedAttribute*/ '' }">
            <h3 class="video-title">${value.snippet.title}</h3>
            <img  class="thumbnail" src="${value.snippet.thumbnails.medium.url}" videoID="${value.id.videoId}">
            <p class="url"><a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank"> ${value.id.videoId}</a></p>  
            <div class="video-controls">
            ${videoControls(false)}
            </div>
          </div>`
  
};

    // return `<div class="col-4 video-result${ /*selectedAttribute*/ '' }">
    //   <div class="video">
    //     <img class="video-image" src="${value.snippet.thumbnails.medium.url}" videoID="${value.id.videoId}" />
    //     <div class="video-content">
    //       <h3 class="video-title">${value.snippet.title}</h3>
    //       <p class="url"><a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank">${value.id.videoId}</a></p>
    //     </div>
    //     <div class="video-controls">
    //       ${videoControls(false)}
    //     </div>
    //   </div>
    // </div>`;


function videoControls(isAdded){
  if(isAdded){
    return  `
    <button class="watchVideo">Watch Video</button>
    <button class="deleteVideo">Delete Video</button>`
  } 
    return `<button class="preview-video"><ion-icon name="play-circle"></ion-icon>Preview</button>
            <button class="select-video-btn"><ion-icon name="add-circle"></ion-icon>Select</button>
            <button class="unselect-video-btn"><ion-icon name="undo"></ion-icon>Unselect</button>`
  
};

  function deleteVideoFromExercise(exercise){
  let authToken = '';

  if(window.localStorage){
    authToken = window.localStorage.getItem('authToken');
  }

  $.ajax({
    type: 'DELETE',
    url: `http://localhost:8080/api/exercises/${exercise_id}/videos/${video_id}`,
  }).then(() => {
    console.log('Deleted Video from exercise')
  });
};



/**------------------------------- */
/*     Delete Video from Profile
/**-------------------------------- */
function deleteVideo(){
  let target = $( e.target );
  $(target).parent().remove();  
};
