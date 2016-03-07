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
        abstract: true,
        templateUrl: './app/templates/feedTmpl.html',
        controller: 'feedCtrl',
        resolve: {
            postPromise: function(postService, errService) { // sends back posts
                var filter = postService.pageOneDateFilter();
                return postService.getAllPosts(filter)
                .then(function( response ) {
                   return response;
                }, function(err) {
                    console.error('PostPromise', err);
                });
            },
            auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
                    return response;
                }, function(err) {
                    console.error('checkForAuth', err);
                    $state.go('login');
                });
            }
         }
      })
      .state('timeline', {
        parent: 'feed',
        url: 'timeline',
        templateUrl: './app/templates/timelineTmpl.html'
      })
      .state('standard', {
        parent: 'feed',
        url: 'standard',
        templateUrl: './app/templates/standardFeedTmpl.html'
      })
      .state('post', {
        url: '/post/:id',
        controller: 'postCtrl',
        templateUrl: './app/templates/postDetailTmpl.html',
        resolve: {
            postData:function(postService, errService, $stateParams) {
                return postService.getOnePost($stateParams.id)
                .then(function(response) {
                    return response;
                },function(err) {
                    console.error('checkForSinglePost', err);
                });
            },
             auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
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
            user: function(userService, $stateParams) {  // sends back user who is passed into state
                return userService.getUser($stateParams.id)
                .then(function(response) {
                    return response.data[0];
                }, function(err) {
                    console.error('check For User Error', err);
                });
            },
            userAverage: function(user, postService)  {
                return postService.averageQuery('user', 
                user._id, 'week', 'false')
                .then(function(response) {
                    return  response.data[0];
                }, function(err) {
                   console.error('check for user average', err);
                });
            },
            cohortAverage: function(user, postService)  {
                return postService.averageQuery('cohort', 
                user._id, 'week', 'false')
                .then(function(response) {
                   return  response.data[0];
                }, function(err) {
                   console.error('check for cohort average', err);
                });
            },
            followingAverage: function(user, postService)  {
                return postService.averageQuery('following', 
                user._id, 'week', 'false')
                .then(function(response) {
                   return  response.data[0];
                }, function(err) {
                   console.error('check for following average', err);
                });
            },
            mentorAverage: function(user, postService)  {
                return postService.averageQuery('mentor', 
                user._id, 'week', 'false')
                .then(function(response) {
                   return  response.data[0];
                }, function(err) {
                   console.error('check for mentor average', err);
                });
            },
            userPosts: function(user, postService)  {
                return postService.postsQuery('user', 
                user._id, 'month', 'false')
                .then(function(response) {
                    return  response.data;
                }, function(err) {
                   console.error('check for user posts', err);
                });
            },
            cohortPosts: function(user, postService)  {
                return postService.postsQuery('cohort', 
                user._id, 'month', 'false')
                .then(function(response) {
                   return  response.data;
                }, function(err) {
                   console.error('check for cohort posts', err);
                });
            },
            followingPosts: function(user, postService)  {
                return postService.postsQuery('following', 
                user._id, 'month', 'false')
                .then(function(response) {
                   return  response.data;
                }, function(err) {
                   console.error('check for following posts', err);
                });
            },
            mentorPosts: function(user, postService)  {
                return postService.postsQuery('mentor', 
                user._id, 'month', 'false')
                .then(function(response) {
                   return  response.data;
                }, function(err) {
                   console.error('check for mentor posts', err);
                });
            },
            auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
                    return response;
                }, function(err) {
                    console.error('checkForAuth', err);
                    $state.go('login');
                });
              }
           } 
        });
        
        
        
      
                     
        $urlRouterProvider.otherwise('/timeline');
    }
  ]);
