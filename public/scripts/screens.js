// Make specific screens
APP.screens.allExercises =  {
  title: "All Exercises",
  array: APP.exercises.all,
  url: '/exercises',
  show: showAllExercisesPage,
  hide: hideExercisesPage,
  nav: true
};

APP.screens.myExercises = {
  title: "My Exercises",
  array: APP.exercises.my,
  url: '/exercises/my',
  show: showMyExercisesPage,
  hide: hideExercisesPage,
  nav: true
};

APP.screens.intro = {
  title: "Home",
  show: showIntroPage,
  hide: hideIntroPage,
  nav: true
}

APP.screens.videoPicker = {
  title: "Video Picker",
  nav: false,
  prevPageToken: '',
  nextPageToken: '',
  searchTerm: '',
  videos: {
    results: [],
    selected: []
  }
}
