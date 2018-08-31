"use strict";

let videosSelected = [];
let video = []; 
let exercises = []; 
let myExercises = [];
let exerciseId = '';
const REFRESH_PERIOD = 1000 * 60; // 60,000 milliseconds
let lastExercisePage = '';
let currentExerciseIndex = -1;
const API_URL = 'http://localhost:8080/api';


// let url = '';

/**-------------------------------- */
/* Exercise Form Hide & Show 
/**--------------------------------- */
function showExerciseForm(){
  $('.exercise-form').show();
};

function hideExerciseForm(){
  $('.exercise-form').hide();
};

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
  console.log(authToken);

  // AJAX To Exercises
  $.ajax({
    type: exerciseId ? 'PUT':'POST',
    url: `http://localhost:8080/api/exercises/${ exerciseId ? exerciseId  : ''}`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(response) {
    console.log('post exercises'+response);
    
    // Make sure that the formMessages div has the 'success' class.
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');

    // Clear the form.
    // $('.exercise-title').val('');
    // $('.exercise-id').val('');
    // $('.exercise-description').val('');
    // $('.added-videos').html('');
    // $('.allow-comments').val('');
    // CKEDITOR.replace( 'body' );
    clearExerciseForm();
    hideExerciseForm();
   
    addExerciseToLocalArrays(response, exerciseId);
    console.log(exercises);

    // Comment add the new exercise to my exercises array as well
    // showLastExercisesPage(); 
      return showMyExercisesPage();

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

function addExerciseToLocalArrays(exercise, exerciseId){
  // Create Exercise Array
  if(exerciseId){
    $('#form-messages').text(`${exercise.title} was edited successfully!`);
    showDeleteExerciseBtn();
    const index = exercises.findIndex((exercise) => {
      return exercise._id === exerciseId;
    });

    const myIndex = myExercises.findIndex((exercise) => {
      return exercise._id === exerciseId;
    });

    if (index >= 0){
      exercises[index] = exercise;
      // console.log(response);
    }

    if (myIndex >= 0){
      myExercises[myIndex] = exercise;
      // console.log(response);
    }
   
  } else {
    $('#form-messages').text(`${exercise.title} was added successfully!`);
    exercises.push(exercise);
    myExercises.push(exercise);
  }

}

function showLastExercisesPage(){
   
}

/**--------------------------------------------------- */
/*    Show All and Show My Exercise Pages
/**---------------------------------------------------- */
function showExercisesPage(){
  showExercisesPage(exercises, '/exercises');
};

function showMyExercisesPage(){
  showExercisesPage(myExercises, '/exercises/my');
};

function showExercisesPage(exercises, url){
  let timeSince = Date.now() - (exercises.lastModified || 0);
  lastExercisePage = url;
  let doUI = function(){
    console.log('On view click',exercises)
    $('.user-exercise-page').removeAttr('hidden');
    $('.user-exercise-page').show();
    renderAllExercisesPage(exercises, url);
    showAddExerciseBtn();
  }

  if(timeSince >= REFRESH_PERIOD){
    return getAllExercises(exercises, url).then(doUI);
  } else {
    doUI();
    return Promise.resolve();
  } 
};


function renderAllExercisesPage(exercises, url){
  let htmlForPage = exercises.map(htmlForAllExercisesPage).join('');
  // console.log(htmlForPage);
  $('.user-exercise-page > .row').html(htmlForPage); 
};

function htmlForAllExercisesPage(exercise){
  let videoSrc = '';
  let videoID = '';

  if(exercise.videos && exercise.videos.length){
    videoSrc = exercise.videos[0].url;
    videoID = exercise.videos[0].videoID;
  };

  return `<div class="col-4">
                 <div class="exercise">
                     <a class="exercise-show" href="#">View
                     <img class="exercise-image" src="${videoSrc}" videoID="${videoID}" />
                     </a>
                     <h3 class="user-exercise-title">${exercise.title}</h3>
                   <div class="exercise-content">
                     <p>${exercise.description}</p>
                   </div>
                 </div>
              </div>`;
};

/**--------------------------------------------------- */
/*     Display Users Exercise Data to Form
/**---------------------------------------------------- */

function getExerciseIndexFromClick(e){
  const target = $(e.currentTarget).closest('.exercise').closest('.col-4');
  
  let index = target.index();

  return index;
};

function renderVideosOnExercisesForm(exercise){
  let htmlForVideo = exercise.videos.map(htmlForVideoOnExerciseForm).join('');
  $('.added-videos').html(htmlForVideo); 
};

function htmlForVideoOnExerciseForm(video){

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

  if(exercise){
    $('.exercise-id').val(exercise._id || '') ;
    $('.exercise-title').val(exercise.title || '') ;
    $('.exercise-description').val(exercise.description || '');
    hideAllExercisesPage();
    showExerciseForm();
  }
};

// function sendExerciseData(){
//   console.log(exercises);
//   return exercises;
// };

function getAllExercises(exercises, url){
  let authToken = '';

  if(window.localStorage){
    authToken = window.localStorage.getItem('authToken');
  }
  // getAuthToken();

  // AJAX To Exercises
  return $.ajax({
    type: 'GET',
    cache: false,
    url: API_URL + ( url || '/exercises' ),
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(_exercises){
     exercises.length = 0;
     console.log('.')
     _exercises.forEach((_exercise) => {
        exercises.push(_exercise);
        console.log('==',exercises);
     });
    //  window.localStorage.setItem('exercises', JSON.stringify(exercises))
     exercises.lastModified = Date.now();
     return exercises;
  });

};

function deleteExercise(){
  $.ajax({
    type: 'DELETE',
    url: `http://localhost:8080/api/exercises/${exercise_id}`,
  }).then( (exercise) => {
    // code here
  });
};

function clearExerciseForm(){
  $('.exercise-title').val('');
  $('.exercise-id').val('');
  $('.exercise-description').val('');
  $('.added-videos').html('');
  $('.allow-comments').val('');
  CKEDITOR.instances['body'].setData('');
  // CKEDITOR.replace( 'body' );
}
