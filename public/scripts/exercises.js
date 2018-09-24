"use strict";

let video = [];
let categoryId = '';
const REFRESH_PERIOD = 1000 * 60; // 60,000 milliseconds
let lastCategoryPage = '';
let currentcategoryId = '';
let pageToken = {};
const API_URL = 'http://localhost:8080/api';


/**-------------------------------- */
/* Category Form Submit 
/**--------------------------------- */
function submitCategoryForm(){

  let videos = [];

  $('.added-videos .col-4').each(function(){
    videos.push(jsonforVideo(this));
  });

  let data = {
    title: $('.category-title').val(),
    description: $('.category-description').val(), 
    status: $('.status > option:selected').text(),
    videos: JSON.stringify(videos)
  };

  let categoryId = $('.category-id').val() || false;
  console.log(categoryId);
  if (categoryId){
    data._id = categoryId;
  }

  let formMessages = $('#form-messages');
  let authToken = isLoggedIn();

  // AJAX To Categories
  $.ajax({
    type: categoryId ? 'PUT':'POST',
    url: `${API_URL}/categories/${ categoryId ? categoryId  : ''}`,
    data: data,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(response) {
    $(formMessages).removeClass('error');
    $(formMessages).addClass('success');
    clearCategoryForm();
    addCategoryToLocalArrays(response, categoryId);
    showScreen('myCategories');


  }).fail(function(data) { 
    $(formMessages).removeClass('success');
    $(formMessages).addClass('error');

    if (data.responseJSON) {
        $(formMessages).text(data.responseJSON.message);
    } else {
        $(formMessages).text('Oops! An error occured and your message could not be sent.');
    }
  });
};


function addCategoryToLocalArrays(category, categoryId){
  // Create Category Array
  if(categoryId){
    $('#form-messages').text(`${category.title} was edited successfully!`);
    const index = categories.findIndex((category) => {
      return category._id === categoryId;
    });

    const myIndex = myCategories.findIndex((category) => {
      return category._id === categoryId;
    });

    if (index >= 0){
      categories[index] = category;

    }

    if (myIndex >= 0){
      myCategories[myIndex] = category;

    }
   
  } else {
    $('#form-messages').text(`${category.title} was added successfully!`);
    categories.push(category);
    myCategories.push(category);
  }



};

/**--------------------------------------------------- */
/*    Show All and Show My Category Pages
/**---------------------------------------------------- */
function showAllCategoriesPage(){
  if(!isLoggedIn()){
    showloginRegisterPrompt();
    hideAddCategoryBtn();  
  }
  // showAllCategoryPageHeader();
  hideUsernameHeader();
  showAllCategoryPageHeader();
  return showCategoriesPage(categories, '/categories');
};

function showMyCategoriesPage(){
  hideLoginRegisterPrompt();
  showAddCategoryBtn();
  showUsernameHeader();
  hideAllCategoryPageHeader();
 
 $('.usernameHeader').html((getCurrentUser() ? getCurrentUser().username : '') + "'s " + ' Categories');
  return showCategoriesPage(myCategories, '/categories/my');
};

function showCategoriesPage(categories, url){
  let timeSince = Date.now() - (categories.lastModified || 0);
  lastCategoryPage = url;
  let doUI = function(){

    $('.user-category-page').removeAttr('hidden');
    $('.user-category-page').show();
    renderAllCategoriesPage(categories, url);
    
  }

  if(timeSince >= REFRESH_PERIOD){
    return getAllCategories(categories, url).then(doUI);
  } else {
    doUI();
    return Promise.resolve();
  } 
};


function renderAllCategoriesPage(categories, url){
  
  let htmlForPage = categories.map(htmlForAllCategoriesPage).join('');

  $('.user-category-page > .row').html(htmlForPage); 
};

function htmlForAllCategoriesPage(category){
  let videoSrc = '';
  let videoID = '';

  if(category.videos && category.videos.length){
    videoSrc = category.videos[0].url;
    videoID = category.videos[0].videoID;
  };

  return `<div class="col-4">
                 <div class="category" data-id='${category.id}'>
                     <a class="category-show" href="#">View</a>
                     <img class="category-image" src="${videoSrc}" videoID="${videoID}" alt="video result thumbnail"/>
                     <h3 class="user-category-title">${category.title}</h3>
                   <div class="category-content">
                     <p>${category.description}</p>
                   </div>
                 </div>
              </div>`;
};

/**--------------------------------------------------- */
/*     Display Users Category Data to Form
/**---------------------------------------------------- */

function getCurrentCategoryIdFromClick(e){
  categoryId = $(e.currentTarget).closest('.category').attr('data-id');
  
  return categoryId;
};

function renderVideosOnCategoriesForm(category){

  let htmlForVideo = category.videos.map(htmlForVideoOnCategoryForm).join('');
  $('.added-videos > .row').html(htmlForVideo); 
};
 
function htmlForVideoOnCategoryForm(video){
  return `<div class="col-4">
           <div class="categoryOnForm">
            <h3 class="video-title" objectID="${video._id || ''}">${truncateVideoTitle(video.title)}</h3>
              <img  class="thumbnail" src="${video.url}" videoID="${video.videoID}">
              <p class="url"><a href="https://www.youtube.com/watch?v=${video.videoID}" target="_blank"> ${video.videoID}</a></p>
              <div class="video-controls" data-videoId="${video._id}">
                ${videoControls(true)}
              </div>
           </div>
          </div>`;
};


function populateFormWCategoryData(category) {

  let formMessages = $('#form-messages');

  if(category){

    $('.category-id').val(category._id || '') ;
    $('.category-title').val(category.title || '') ;
    $('.category-description').val(category.description || '');
    $('.addCategoryTitleToVidSect').text(`${category.title} Videos`)
    $(formMessages).text(`Your ${category.title} exericse!`);
    hideUserCategoryPage();

    showCategoryForm();
    showDeleteCategoryBtn();
    
  }
  
};

function getCurrentCategoriesArray(){
  const screen = currentScreen();
  if(screen){
    return screen.array;
  } 

  console.log(array);

};

function getCurrentCategory(currentCategoryId){
  const categories = getCurrentCategoriesArray();
  if(categories){
     return categories.find(category => {
       return category._id === currentCategoryId;
    });
  }
  // console.log(currentCategoryId);
};

function getCurrentCategoryComments(){
  comments = APP.screens.categoryForm.currentCategory.comments;
  console.log(comments);
}

function replaceSavedCategory(categoryId, newCategory){
  const categories = getCurrentCategoriesArray();
  if(categories){
     let oldIndex =  categories.findIndex(category => {
       return category._id === categoryId;
    });

    if(oldIndex >= 0){
      categories[oldIndex] = newCategory;
    }
  }
}

function setCurrentCategory(categoryId){
  APP.screens.categoryForm.currentCategoryId = categoryId;
}

function showCategoryForm(){
  $('.category-form').removeAttr('hidden');
  $('.category-form').show();

  let categoryFormScreen = currentScreen();

  if(APP.lastScreen){
    categoryFormScreen.array = APP.lastScreen.array;
  }

  if(!isLoggedIn()){
    disableFormInputs();
    showAddCategoryBtn();
    hideCategoryFormBtns();
    hideVideoPickerBtn()
  } else {
    showCategoryFormBtns();
    enableFormInputs();
    showVideoPickerBtn();

  }
};

function hideCategoryForm(){
  $('.category-form').attr('hidden');
  $('.category-form').hide();
  hideFormMessage();
};

function renderCategoryForm(){
  const currentCategory = getCurrentCategory(APP.screens.categoryForm.currentCategoryId);
  if(currentCategory){
    populateFormWCategoryData(currentCategory);
    renderVideosOnCategoriesForm(currentCategory); 
    renderCommentsOnCategoryForm(currentCategory);
    if((getCurrentUser() ? getCurrentUser().username : '') === currentCategory.username){
      enableFormInputs();
    } else {
      disableFormInputs();
    }
  } else {
    clearCategoryForm();
  }
}

function getAllCategories(categories, url){
  let authToken = isLoggedIn() ;
  
  // AJAX To Categories
  return $.ajax({
    type: 'GET',
    cache: false,
    url: API_URL + ( url || '/categories' ),
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then(function(_categories){
     categories.length = 0;
     _categories.forEach((_category) => {
        categories.push(_category);
     });
     categories.lastModified = Date.now();

     return categories;
  });

};


/**--------------------------------------- */
/*     Delete Categories & Videos
/**--------------------------------------- */

function deleteCategory(category_id){
  console.log(category_id);
  let formMessages = $('#form-messages');

  let authToken = isLoggedIn();

  $.ajax({
    type: 'DELETE',
    url: `${API_URL}/categories/${category_id}`,
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }).then((response) => {
    // location.reload(true);
 
    deleteSavedCategory(category_id);
    showScreen('myCategories');
    $(formMessages).text(`Your category was deleted successfully!`);

  });
  
};


function deleteSavedCategory(category_id){
  // Find the cate array  
  let currentCategoriesArray =  getCurrentCategoriesArray();
  
  // Find the index of cate Id in array.
  function findSavedCategory(category) {
    return category_id == category._id;
  }

  const categoryIndex = (currentCategoriesArray.findIndex(findSavedCategory)); 

  // array .splice to remove that index from the array
  currentCategoriesArray.splice(categoryIndex, 1);

  
};

function clearCategoryForm(){
  $('.category-title').val('');
  $('.category-id').val('');
  $('.category-description').val('');
  $('.added-videos > .row').html('');
  $('.addCategoryTitleToVidSect').html('');
  // $('.comment-section > .row').html('');
}