angular.module('journey' )

  .constant("pageSize", {DAYS: 7})

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
            postPromise: function(postService, errService) { // sends back posts
                var filter = postService.pageOneDateFilter();
                console.log('in PostPromise');
                console.log('filter = ', filter);
                return postService.getAllPosts(filter)
                .then(function( response ) {
                    console.log('in PostPromise response');
                    console.log('response = ', response);
                    return response;
                });
            },
            auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
                    console.log('checkForAuth', response);
                    return response;
                }, function(err) {
                    console.error('checkForAuth', err);
                    $state.go('login');
                });
            }
         }
      })
      .state('post', {
        url: '/post/:id',
        controller: 'postCtrl',
        templateUrl: './app/templates/postDetailTmpl.html',
        resolve: {
            postData:function(postService, errService, $stateParams) { 
                return postService.getOnePost($stateParams.id)
                .then(function(response) {
                    console.log('CheckingforSinglePost', response);
                    return response;
                },function(err) {
                    console.error('checkForSinglePost', err);
                });
            },
             auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
                    console.log('checkForAuth', response);
                    return response;
                }, function(err) {
                    console.error('checkForAuth', err);
                    $state.go('login');
                });
            }
        }
      })
      .state('profile', {
        url: '/profile/:id',
        templateUrl: './app/templates/profileTmpl.html',
        controller: 'profileCtrl',
        resolve: {
            user: function(userService, $stateParams) {  // sends back who's logged in
                return userService.getUser($stateParams.id)
                .then(function(response) {
                    console.log('check For User', response);
                    return response.data[0];
                }, function(err) {
                    console.error('check For User Error', err);
                   
                });
            },
            userAverage: function(user, postService)  {
                return postService.averageQuery
                ('user', 
                user._id, 'week', 'false')
                    .then(function(response) {
                    console.log('checking profile Average', response);
                   return  response.data[0];
                }, function(err) {
                   console.error('check for profile average', err);
  });
            },
             cohortAverage: function(user, postService)  {
                return postService.averageQuery
                ('cohort', 
                user._id, 'week', 'false')
                    .then(function(response) {
                    console.log('checking cohort Average', response);
                   return  response.data[0];
                }, function(err) {
                   console.error('check for profile average', err);
  });
            },
               followersAverage: function(user, postService)  {
                return postService.averageQuery
                ('followers', 
                user._id, 'week', 'false')
                    .then(function(response) {
                    console.log('checking followers Average', response);
                   return  response.data[0];
                }, function(err) {
                   console.error('check for profile average', err);
  });
            },
             mentorAverage: function(user, postService)  {
                return postService.averageQuery
                ('mentor', 
                user._id, 'week', 'false')
                    .then(function(response) {
                    console.log('checking mentor Average', response);
                   return  response.data[0];
                }, function(err) {
                   console.error('check for profile average', err);
  });
            },
            
      
      
             auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
                    console.log('checkForAuth', response);
                    return response;
                }, function(err) {
                    console.error('checkForAuth', err);
                    $state.go('login');
                });
              }
           } 
        });
      
                     
      $urlRouterProvider.otherwise('/');
    }
  ]);
