"use strict";

let comments = [];

function addComment(){
  let categoryID = $('.category-id').val();
  
  let date = Date.now();
  let data = {
    body: $('#comment').val()
  }
  
  let formMessages = $('#form-messages');
  let authToken = isLoggedIn();
  console.log(data);

  // AJAX To Categories
  return $.ajax({
    type: 'POST',
    url:  `${API_URL}/categories/${categoryID}/comment/`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(newCategory){

    // Add comment to an category and display updated category with the comment appended 
    
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    $('#comment').val('');
    
    // update the category
    replaceSavedCategory(categoryId, newCategory);  
    redrawCurrentScreen();
    
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

    return `<div class="comment-container">
            <p class="comment">${commentBody}</p>
            <p class="comment-author">${user}</p>
          </div>`
  }

  let currentUserName  =  (getCurrentUser() && getCurrentUser().username) || '';
  
  return  `<div id="respond">
      <h3>Please <a href="#" class="a-login">login</a> to leave a comment</h3>
      <form id="commentform">
        <label for="comment-author" class="required">Your name</label>
        <p id="comment-author" value="" tabindex="1" required="required">${currentUserName}</p>
        <label for="comment" class="required">Your message</label>
        <textarea name="comment" id="comment" rows="10" tabindex="4"  required="required"></textarea>
        <input name="submit" type="submit" value="Submit comment" class="commentSaveBtn"/> 
      </form>
      </div>`;
}


function handleCommentSubmit(){
  $('.category-form').on('click', '.commentSaveBtn',function(e) {
    
    e.preventDefault();
    addComment();
    // const newComment = $('#comment').val();
    // console.log(newComment);
    // console.log()
    // addComment();

    // console.log('handleCommentSubmit')
    
  });
}


function getNewComment(){
  const newComment = $('#comment').val();
    console.log(newComment);
    return newComment;
}


function handleCommentsForApp(){
  handleCommentSubmit();
}

$( handleCommentsForApp );

