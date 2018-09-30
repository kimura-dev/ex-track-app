"use strict";

let comments = [];

function friendlyDate(date){
  let commentDate = Date.now();

  if(typeof date === 'string'){
    commentDate = new Date(Date.parse(date));
  } else if (typeof date !== 'undefined'){
    commentDate = date;
  }

  let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  options.timeZoneName = 'short';

  commentDate = commentDate.toLocaleDateString('en-US', options);

  return commentDate;
}

function addComment(){
  let commentMessages = $('#comment-messages');
  let categoryID = $('.category-id').val();

  let date =  Date.now();

  let data = {
    body: $('#comment').val(),
    date
  }

  let authToken = isLoggedIn();

  // AJAX To Categories
  return $.ajax({
    type: 'POST',
    url:  `${API_URL}/categories/${categoryID}/comment/`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(newCategory){
    // let newComment = newCategory.comments[newCategory.comments.length-1].body;
    let commentUser = newCategory.comments[newCategory.comments.length-1].user;

    // Add comment to an category and display updated category with the comment appended     
    $(commentMessages).removeClass('error');
    $(commentMessages).addClass('success');
    $(commentMessages).text(`${commentUser}, your comment has been added!`);

    $('#comment').val('');
    
    // update the category
    replaceSavedCategory(categoryId, newCategory);  
    redrawCurrentScreen();
    
  }).fail(function(data) { 
    $(commentMessages).removeClass('success');
    $(commentMessages).addClass('error');

    if (data.responseText !== '') {
        $(commentMessages).text(data.responseText);
    } else {
        $(commentMessages).text('Oops! An error occured and your message could not be sent.');
    }
  });

};

function renderCommentsOnCategoryForm(category){
  
  let results = category.comments.map(generateCommentElement);
  $('.comment-section > .row').html(generateCommentElement());
  $('.comment-section > .row').append(results.join('\n'));

  if(!isLoggedIn()){
    hideSubmitCommentBtn();
  }
}


function generateCommentElement(comment) {
  if(comment){
    let commentBody = comment.body || '';
    let user = comment.user || '';
    let commentId =  comment._id || '';
    let commentDate = friendlyDate(comment.date);

    return `<div class="comment-container">
            <input name="comment id" type"id" value="${commentId}"hidden>             
            <p class="comment-author">${user}</p>
            <p class="comment-date">${commentDate}</p>
            <p class="comment">${commentBody}</p>
          </div>`
  }
  
  let currentUserName  =  (getCurrentUser() && getCurrentUser().username) || '';
  
  return  `<div id="respond">
      <h3>Please <a href="#" class="a-login">login</a> to leave a comment</h3>
      <form id="commentform">
        <label for="comment-author" class="required">Your name</label>
        <p class="comment-author"  required="required">${currentUserName}</p>
        <label for="comment" class="required">Your message</label>
        <textarea name="comment" id="comment" rows="10" tabindex="4"  required></textarea>
        <input name="submit" type="submit" value="Submit comment" class="commentSaveBtn"/> 
      </form>
      </div>`;
}


function handleCommentSubmit(){
  $('.category-form').on('click', '.commentSaveBtn',function(e) { 
    let commentMessages = $('#comment-messages');
    e.preventDefault();
    if(!$('#comment').val()){
      $(commentMessages).text(`Please put in your comment!`); 
    } 
    
    addComment(); 

  });
}

function getNewComment(){
  const newComment = $('#comment').val();
    return newComment;
}


function handleCommentsForApp(){
  handleCommentSubmit();
}

$( handleCommentsForApp );

