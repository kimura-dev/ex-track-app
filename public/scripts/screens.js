// gets the current screen object from APP.screens

function currentScreen(){
  if( APP.currentScreenName 
    && APP.screens 
    && APP.currentScreenName in APP.screens
  ){
    return APP.screens[APP.currentScreenName];
  }
  return undefined;
}

function showScreen(screenName){
  let output;

  if( screenName && screenName in APP.screens ){
    APP.lastScreen = currentScreen();

    APP.currentScreenName = screenName;
    // Hiding the screens that aren't the one that was selected
    Object.keys(APP.screens).forEach(screen => {
      const thisScreen = APP.screens[screen];
      if( thisScreen !== currentScreen() ){
        if( typeof thisScreen.hide === 'function' ){
            output = thisScreen.hide();
        }
      }

      // console.log(screenName);
    });

    const screen = APP.screens[screenName];

    function showAndRender(screen){

      (screen && typeof screen.show === 'function' ) && screen.show();
      (screen && typeof screen.render === 'function' ) && screen.render();

      $('#myTopnav').removeClass('responsive');
    }

    if( output && output.then ){
      return output.then( () =>  showAndRender(screen));
    } 

    return Promise.resolve().then( () => showAndRender(screen) );
    
  }  
};

function redrawCurrentScreen(){
  const screen = currentScreen();
  if( screen && typeof screen.render === 'function' ) screen.render();
  else if( screen && typeof screen.show === 'function' ) screen.show();

  console.log('RedrawCurrentScreen: '+screen);
};


// Make specific screens
APP.screens.allCategories =  {
  title: "All Categories",
  array: APP.categories.all,
  url: '/categories',
  show: showAllCategoriesPage,
  hide: hideUserCategoryPage,
  nav: true
};

// console.log(APP.categories.all);

APP.screens.myCategories = {
  title: "My Categories",
  array: APP.categories.my,
  url: '/categories/my',
  show: showMyCategoriesPage,
  hide: hideUserCategoryPage,
  nav: true
};

APP.screens.intro = {
  title: "Home",
  show: showIntroPage,
  hide: function hideIntroPage(){
    $('.introduction-page').hide();
  },
  // have to hide and show login btn 
  nav: true
}

APP.screens.signup = {
  title: "Signup",
  show: showSignupForm,
  hide: hideSignupForm,
  nav: true
}

APP.screens.newUser = {
  title: "New User",
  show: showAddCategoryBtn,
  hide: {
    hideCategoryForm,
    hideSignupForm,
  },
  nav: true
}

APP.screens.login = {
  title: "Login",
  url: '/api/auth/login',
  show: showLoginForm,
    // hideNavItemsWhenLoggedIn
  nav: true
}

APP.screens.categoryForm = {
  title: "Category Form",
  url: '/categories',
  show: showCategoryForm,
  hide: hideCategoryForm,
  submit: submitCategoryForm,
  nav: false,
  currentCategoryId: false, 
  render: renderCategoryForm
}

APP.screens.videoPicker = {
  title: "Video Picker",
  nav: false,
  hide: hideCategoryForm,
  prevPageToken: '',
  nextPageToken: '',
  searchTerm: '',
  videos: {
    results: [],
    selected: []
  }
}
