"use strict";


/**----------------------------- */
/*    Movie Picker Controls
/**------------------------------ */

function showMoviePicker(){
  $('.video-picker').show();
  searchVideoForCategoryTitle();
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
   
  let html = ` <div class="row clearfix">`;
  $.each(data['items'], function (index, value) {

    
    html += htmlForVideoResult(value);     
    if( (index + 1) % 3 === 0 ){
      // console.log(index);
      html += '</div> <div class="row clearfix">'
    }
  });
  html += '</div>';

  $('.video-results').html(html);
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
          , maxResults: 6
          , pageToken: pageToken.current
          // , pageToken: 'CAYQAA'
      }
  }).done(youtubeOutput);
  
};

function searchVideoForCategoryTitle(){
  let title = $('.category-title').val();

  // if(title && !$('.added-videos > .row').children().length) {
  //   $('.video-search-input').val(title);
  //   $('.video-search-btn').focus().click();
  // }

  if(title) {
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
    let videoID = $(target).parent().parent().parent().find('img').attr('videoID');
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

/**-------------------------------------- */
/*     Preview Videos on Category Form*/
/**-------------------------------------- */

function previewVideosOnCategoryPage(){
  $('.category-form').on('click','.watchVideo',function(e){
    let target = $( e.target );
    let videoID = $(target).parent().parent().parent().find('img').attr('videoID');
    console.log(videoID);

    $('.popup').show()
    $('.overlayBg').show();
    $(window).scrollTop(0)
    $('.popup iframe').attr('src', `https://www.youtube.com/embed/${videoID}`);
    $('.resp iframe').attr('src', `https://www.youtube.com/embed/${videoID}`);
  });
  $('.overlayBg').click(function () {
    $('.popup').hide()
    $('.overlayBg').hide()
  });
}; 

function handlePreviewVideos(){
  previewVideos();
  previewVideosOnCategoryPage(); 
}

$(handlePreviewVideos);

/*--------------------------------*/
/*     JSON for selected videos
/*--------------------------------*/
function jsonforVideo(videoElement){
  let target = $(videoElement);
  const jsonVideo = {
    // _id: target.find('.video-title').attr('objectID'),
    title: target.find('.video-title').text(),
    url: target.find('.thumbnail').attr('src'),
    videoID: target.find('.thumbnail').attr('videoID')
  };

  if(target.find('.video-title').attr('objectID')){
    jsonVideo._id = target.find('.video-title').attr('objectID');
 }

 return jsonVideo;

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
  
  // //1. find actual video object based on videoResult element
  // let videoData = getVideoDataFromResultElement(videoResult);
  
  // //2. add videoData to our APP state
  // APP.screens.videoPicker.videos.selected.push(videoData);

  // //3. redraw our UI based on the changed APP state
  // redrawCurrentScreen();
  
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
      $('.added-videos > .row').append(htmlForVideoOnCategoryForm(video));
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
              <img  class="thumbnail" src="${video.url}" videoID="${video.videoID}" alt="video result thumbnail">
              <p class="url"><a href="https://www.youtube.com/watch?v=${video.videoID}" target="_blank"> ${video.videoID}</a></p>
              <div class="video-controls" data-videoId="${video._id}">
               ${videoControls(true)}

                </div>
              </div>`
}

function htmlForVideoResult(value){
  const videos = APP.screens.videoPicker.videos.selected;
  let title = value.snippet.title;
  // let selectedMatch = videos.find(video => video.videoID === value.id.videoId);

  // let selectedAttribute = selectedMatch ? ' selected' : '';
    return  `<div class="video-result">
              <div class="col-4${ /*selectedAttribute*/ '' } youtubeVideo">
                  <h3 class="video-title">${truncateVideoTitle(title)}</h3>
                  <img  class="thumbnail" src="${value.snippet.thumbnails.medium.url}" videoID="${value.id.videoId}">
                  <p class="url"><a href="https://www.youtube.com/watch?v=${value.id.videoId}" target="_blank"> ${value.id.videoId}</a></p>  
                  <div class="video-controls">
                    ${videoControls(false)} 
                  </div>
              </div>
            </div>`;
  
};

function truncateVideoTitle(title){

  let shortText = jQuery.trim(title).substring(0, 10)
      .split(" ").slice(0, -1).join(" ") + "...";
  return shortText;
  // $('.video-title').html('before: ' + title + '<br>' + 'after: ' + shortText);

}

function videoControls(isAdded){
  if(isAdded){
    return  `
    <div class="float-left">
      <button class="watchVideo">Watch Video</button>
    </div>
    <div class="float-right">
      <button class="deleteVideo">Delete Video</button>
    </div>`
  } 
    return `<div class="float-left">
      <button class="preview-video"><ion-icon name="play-circle"></ion-icon>Preview</button>     
    </div>
    <div class="float-right">
      <button class="select-video-btn"><ion-icon name="add-circle"></ion-icon>Select</button>
    </div>
    <div class="float-right">
      <button class="unselect-video-btn"><ion-icon name="undo"></ion-icon>Unselect</button>
    </div>`
  
};

/**--------------------------------- */
/*     Delete Video from Profile
/**--------------------------------- */

  function deleteVideoFromCategory(video_id){
    let category_id = APP.screens.categoryForm.currentCategoryId;
    let formMessages = $('#form-messages');
    let authToken = isLoggedIn(); 
    $.ajax({
      type: 'DELETE',
      url:  `${API_URL}/categories/videos/${video_id}`,
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then((newCategory) => {
      console.log(newCategory);

      console.log('.then after ajax call category_id : '+ category_id);
      replaceSavedCategory(categoryId, newCategory);  
      redrawCurrentScreen();
      $(formMessages).text(`Your video was deleted successfully!`);
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
