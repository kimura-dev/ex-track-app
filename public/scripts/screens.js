// Make specific screens
APP.screens.allExercises =  {
  title: "All Exercises",
  array: APP.exercises.all,
  url: '/exercises',
  show: showAllExercisesPage,
  hide: hideUserExercisePage,
  nav: true
};

APP.screens.myExercises = {
  title: "My Exercises",
  array: APP.exercises.my,
  url: '/exercises/my',
  show: showMyExercisesPage,
  hide: hideUserExercisePage,
  nav: true
};

APP.screens.intro = {
  title: "Home",
  show: showIntroPage,
  hide: hideIntroPage,
  // have to hide and show login btn 
  nav: true
}

APP.screens.signup = {
  title: "Signup",
  // url: '/api/users',
  show: showSignupForm,
  hide: {
    hideSignupForm,
    hideLoginItems
  },
  nav: true
}

APP.screens.newUser = {
  title: "New User",
  show: showAddExerciseBtn,
  hide: {
    hideExerciseForm,
    hideSignupForm,
  },
  nav: true
}

APP.screens.login = {
  title: "Login",
  url: '/api/auth/login',
  show: showLoginForm,
  hide: {
    hideLoginForm,
    hideLoginItems
  },
  // submit: loggingIn,
  // loggedIn: true,
  nav: true
}

APP.screens.exerciseForm = {
  title: "Exercise Form",
  url: '/exercises',
  show: showExerciseForm,
  hide: {
    hideIntroPage,
    hideUserExercisePage,
    hideAddExerciseBtn
  },
  submit: submitExerciseForm,
  nav: false
}

APP.screens.videoPicker = {
  title: "Video Picker",
  nav: false,
  hide: hideExerciseForm,
  prevPageToken: '',
  nextPageToken: '',
  searchTerm: '',
  videos: {
    results: [],
    selected: []
  }
}
