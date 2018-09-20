"use strict";

let comments = [];

function checkLoginStatusForComment(){
  if(!isLoggedIn()){
    // console.log(currentScreen());
    showScreen('login');
    enableFormInputs();
  } else {
    // hideAddCommentBtn();
    generateCommentElement();
    generateCommentData();
  }
}


function addComment(){

  checkLoginStatusForComment();

  let exerciseID = $('.exercise-id').val();
  console.log(exerciseID);
  let date = Date.now();
  
  let formMessages = $('#form-messages');
  let authToken = isLoggedIn();
  let data = {
    commentBody: $('.commentBody').val()
  };

  // user: $('.nav-username').text(),

  // AJAX To Exercises
  return $.ajax({
    type: 'POST',
    url:  `${API_URL}/exercises/${exerciseID}/comment/`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(_exercises){
    console.log(_exercises);
    
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
     exercises.length = 0;
     exercises.comments = [];
     _exercises.comments.forEach((_exercise) => {
        exercises.comments.push({_exercise});
        console.log(_exercises);
     });
     exercises.lastModified = Date.now();
     console.log(exercises.comments);
     generateCommentData(exercises.comments.user);
     return exercises;
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


function generateCommentElement(comment) {
  let commentBody = (comment && comment.commentBody) || '';
  let currentUserName  =  (getCurrentUser() && getCurrentUser().username) || '';
  // let currentUserName  =  (getCurrentUser().username) || '';
  let user = (comment && comment.user && comment.user.username) || currentUserName;
  let newComment = '';
  if($('.commentBody').val() === 'undefined'){
    newComment = $('.commentBody').val('');
  } else {
    newComment = $('.commentBody').val();
  }
 
  // username = user;
  // research the Date object's "toLocaleString" method
  
  showContinuedComments();
  
  let result = `
    <div class="col-4">
      <form method="POST" action="/exercises/comment/">
        <div class="input-field" data-id='${$('.exercise-id').val()}'>
          <label> Add Comment </label>
          <textarea name="body" class="commentBody" col="60" rows="5">${newComment}</textarea>
          <div class="logOfComments"></div>
        </div>
        <p class="commentUser"></p>
        <button value="save comment" name="save" class="commentSaveBtn">Submit</button>
      </form>
    </div>`;

 $('.continuedComments > .row').html(result);
}

// Generates pre-existing comments from all users
function generateCommentData(comment){
  if(!comment){
    return false;
  }

  let result = '';
  console.log(comment);
  comment.forEach(comm => {
    result += `
    <textarea class="commentBody">${comm._exercise.body}</textarea>
    `
    // ${username}
  })
  $('.logOfComments').append(result);
}

//-----------------------------------------------------------------------
function generateCommentString() {
  console.log("Generating comment element");

  comment = exercises.comments.map((comment) => generateCommentElement(comment));

  return comment.join("");
  console.log(exercise);
}


function renderComments() {
  console.log('`renderComments` ran');

  const commentString = generateCommentString(exercise);
  $('.continuedComments > .row').html(commentString);
}
