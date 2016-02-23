angular.module('journey' )
  .constant("pageSize", {POSTS: 4})

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'pageSize',
    function($stateProvider, $urlRouterProvider, pageSize) {
   
      $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: './app/templates/loginTmpl.html',
        controller: 'loginCtrl'
      })

      .state('feed', {
        url: '/',
        templateUrl: './app/templates/feedTmpl.html',
        controller: 'feedCtrl',
        resolve: {
           postPromise: function(postService) { // sends back posts
             return postService.getAllPost(pageSize.POSTS, 1);
           },
           postCount: function(postService) {
               return postService.getCount();
           },
           auth: function(authService) {  // sends back who's logged in
             return authService.checkForAuth();
           }
        }
      })

      .state('post', {
        url: '/post/:id',
        templateUrl: './templates/postsTmpl.html'
          //  controller: 'postCtrl',
          //  resolve: {
          //    postPromise: ['posts', function(postService){
          //       return postService.getAllPost(); }]
          //  }
      })

      .state('post.add', {
        url: '/add',
        templateUrl: './templates/addTmpl.html'
      })

      .state('post.edit', {
        url: '/edit',
        templateUrl: './templates/editTmpl.html'
      });

      $urlRouterProvider.otherwise('/');
    }
  ]);
