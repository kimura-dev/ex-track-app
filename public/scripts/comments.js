"use strict";

let comments = [];

function addComment(){

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
     _exercises.comments.forEach((_exercise) => {
        exercises.comments.push({_exercise});
        console.log(_exercises);
     });
     exercises.lastModified = Date.now();

     generateCommentElement();
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


function generateCommentElement() {
  let date = Date.now(); 

 showContinuedComments();

  let result = `
    <div class="col-4">
      <form method="POST" action="/exercises/comment/">
        <div class="input-field" data-id='${$('.exercise-id').val()}'>
          <label for="comment"> Add Comment 
            <textarea name="comment" class="commentBody" col="40" rows="2" required></textarea>
          </label>
        </div>
        <p class="commentUser">${getCurrentUser()}</p>
        <button value="save comment" name="save" class="commentSaveBtn">Submit</button>
      </form>
    </div>`;

 $('.continuedComments > .row').html(result);
}

function generateExistingCommentElement(commentBody,user) {
  let date = Date.now(); 
  let commentBody = $('.commentBody').val();
 showContinuedComments();

  let result = `
    <div class="col-4">
      <form method="POST" action="/exercises/comment/">
        <div class="input-field" data-id='${$('.exercise-id').val()}'>
          <label> Add Comment </label>
          <textarea name="body" class="commentBody" col="60" rows="5">${commentBody}</textarea>
        </div>
        <p class="commentUser">${user}</p>
        <button value="save comment" name="save" class="commentSaveBtn">Submit</button>
      </form>
    </div>`;

 $('.continuedComments > .row').html(result);
}

function generateCommentString() {
  console.log("Generating comment element");

  comment = exercises.comments.map((exercise) => generateCommentElement(exercise));

  return comment.join("");
  console.log(exercise);
}


function renderComments() {
  console.log('`renderComments` ran');

  const commentString = generateCommentString(exercise);
  $('.continuedComments > .row').html(commentString);
}
