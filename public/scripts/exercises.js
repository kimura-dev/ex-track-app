"use strict";

let video = [];
let exerciseId = '';
const REFRESH_PERIOD = 1000 * 60; // 60,000 milliseconds
let lastExercisePage = '';
let currentExerciseId = '';
let pageToken = {};
const API_URL = 'http://localhost:8080/api';


/**-------------------------------- */
/* Exercise Form Submit 
/**--------------------------------- */
function submitExerciseForm(){

  let videos = [];

  $('.added-videos .col-4').each(function(){
    videos.push(jsonforVideo(this));
  });

  let data = {
    // _id: exerciseId,
    title: $('.exercise-title').val(),
    description: $('.exercise-description').val(), 
    status: $('.status > option:selected').text(),
    videos: JSON.stringify(videos)
  };

  let exerciseId = $('.exercise-id').val() || false;

  if (exerciseId){
    data._id = exerciseId;
  }

  let formMessages = $('#form-messages');
  let authToken = isLoggedIn();

  // AJAX To Exercises
  $.ajax({
    type: exerciseId ? 'PUT':'POST',
    url: `${API_URL}/exercises/${ exerciseId ? exerciseId  : ''}`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(response) {
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    clearExerciseForm();
    addExerciseToLocalArrays(response, exerciseId);
    showScreen('myExercises');


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


function addExerciseToLocalArrays(exercise, exerciseId){
  // Create Exercise Array
  if(exerciseId){
    $('#form-messages').text(`${exercise.title} was edited successfully!`);
    const index = exercises.findIndex((exercise) => {
      return exercise._id === exerciseId;
    });

    const myIndex = myExercises.findIndex((exercise) => {
      return exercise._id === exerciseId;
    });

    if (index >= 0){
      exercises[index] = exercise;

    }

    if (myIndex >= 0){
      myExercises[myIndex] = exercise;

    }
   
  } else {
    $('#form-messages').text(`${exercise.title} was added successfully!`);
    exercises.push(exercise);
    myExercises.push(exercise);
  }

};

/**--------------------------------------------------- */
/*    Show All and Show My Exercise Pages
/**---------------------------------------------------- */
function showAllExercisesPage(){
  if(!isLoggedIn()){
    showloginRegisterPrompt();
    hideAddExerciseBtn();  
  }
  showAllExercisePageHeader();
  hideUsernameHeader();
  showAllExercisePageHeader();
  return showExercisesPage(exercises, '/exercises');
};

function showMyExercisesPage(){
  hideLoginRegisterPrompt();
  showAddExerciseBtn();
  showUsernameHeader();
  hideAllExercisePageHeader();
 
 $('.usernameHeader').html((getCurrentUser() ? getCurrentUser().username : '') + "'s " + ' Techniques');
  return showExercisesPage(myExercises, '/exercises/my');
};

function showExercisesPage(exercises, url){
  let timeSince = Date.now() - (exercises.lastModified || 0);
  lastExercisePage = url;
  let doUI = function(){

    $('.user-exercise-page').removeAttr('hidden');
    $('.user-exercise-page').show();
    renderAllExercisesPage(exercises, url);
    
  }

  if(timeSince >= REFRESH_PERIOD){
    return getAllExercises(exercises, url).then(doUI);
  } else {
    doUI();
    return Promise.resolve();
  } 
};


function renderAllExercisesPage(exercises, url){
  // console.log(exercises);
  let htmlForPage = exercises.map(htmlForAllExercisesPage).join('');

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
                 <div class="exercise" data-id='${exercise.id}'>
                     <a class="exercise-show" href="#">View
                     <img class="exercise-image" src="${videoSrc}" videoID="${videoID}" alt="video result thumbnail"/>
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

function getCurrentExerciseIdFromClick(e){
  exerciseId = $(e.currentTarget).closest('.exercise').attr('data-id');
  // console.log('ExerciseID ' + exerciseId);
  return exerciseId;
};

function renderVideosOnExercisesForm(exercise){
  let htmlForVideo = exercise.videos.map(htmlForVideoOnExerciseForm).join('');
  $('.added-videos > .row').html(htmlForVideo); 
};

function htmlForVideoOnExerciseForm(video){
  return `<div class="col-4">
           <div class="exerciseOnForm">
            <h3 class="video-title" objectID="${video._id || ''}">${truncateVideoElement(video.title)}</h3>
              <img  class="thumbnail" src="${video.url}" videoID="${video.videoID}">
              <p class="url"><a href="https://www.youtube.com/watch?v=${video.videoID}" target="_blank"> ${video.videoID}</a></p>
              <div class="video-controls" data-videoId="${video._id}">
                ${videoControls(true)}
              </div>
           </div>
          </div>`;
};

function populateFormWExerciseData(exercise) {

  let formMessages = $('#form-messages');

  if(exercise){

    $('.exercise-id').val(exercise._id || '') ;
    $('.exercise-title').val(exercise.title || '') ;
    $('.exercise-description').val(exercise.description || '');
    $('.addExerciseTitleToVidSect').text(`${exercise.title} Videos`)
    $(formMessages).text(`Your ${exercise.title} exericse!`);
    hideUserExercisePage();

    showExerciseForm();
    showDeleteExerciseBtn();
    
  }
  
};

function getAllExercises(exercises, url){
  let authToken = isLoggedIn() ;
  
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
     _exercises.forEach((_exercise) => {
        exercises.push(_exercise);
     });
     exercises.lastModified = Date.now();

     return exercises;
  });

};

/**--------------------------------------- */
/*     Delete Exercises & Videos
/**--------------------------------------- */

function deleteExercise(exercise_id){
  console.log(exercise_id);
  let formMessages = $('#form-messages');

  let authToken = isLoggedIn();

  $.ajax({
    type: 'DELETE',
    url: `${API_URL}/exercises/${exercise_id}`,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then((response) => {
    // location.reload(true);
  // console.log('exercise_id after ajax for delete'+ exercise_id);

    updateAllExercises(exercise_id);
    showScreen('myExercises');
    $(formMessages).text(`Your exercise was deleted successfully!`);

  });
  
};

function updateAllExercises(exercise_id){
  console.log(exercise_id);
  exercises = exercises.filter(function (item) {
    return !item._id.includes(exercise_id);
  }); 
  
};

function clearExerciseForm(){
  $('.exercise-title').val('');
  $('.exercise-id').val('');
  $('.exercise-description').val('');
  $('.added-videos > .row').html('');
  $('.addExerciseTitleToVidSect').html('');
  $('.allow-comments').val('');
}