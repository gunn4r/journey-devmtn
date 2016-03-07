angular.module('journey')
  .controller('postCtrl', function($stateParams, $scope, postService, auth, $interval, postData, userService, errService) {

    $scope.userId = auth.data._id;
    
    $scope.scrollTo = function(id) {
      $('.feed .scroll-body').slimScroll({ scrollTo: $(id).offset().top - 150 + 'px' });
    };

    $scope.postData = postData.data;
    if (!$scope.postData.numComments) {
      $scope.postData.numComments = 0;
    }

    // FOLLOW
    $scope.following = false;
    if (
      auth.data.usersFollowing && auth.data.usersFollowing.indexOf($scope.postData.user._id) != -1) {
      $scope.following = true;
    }

    $scope.follow = function() {
      $scope.usersFollowing = auth.data.usersFollowing;
      $scope.usersFollowing.push($scope.postData.user._id);
      userService.updateUser({
            usersFollowing: $scope.usersFollowing
          },
          auth.data._id)
        .then(function(response) {
          $scope.following = true;
        }, function(err) {
          console.error('Following Error', err);
        });
    };

    $scope.unfollow = function() {
      $scope.usersFollowing = auth.data.usersFollowing;
      var index = $scope.usersFollowing.indexOf($scope.postData.user._id);
      $scope.usersFollowing.splice(index, 1);
      userService.updateUser({
            usersFollowing: $scope.usersFollowing
          },
          auth.data._id)
        .then(function(response) {
          $scope.following = false;
        }, function(err) {
          console.error('Following Error', err);
        });
    };

    // COMMENTS
    postService.getComments($scope.postData._id)
      .then(function(response) {
        $scope.comments = response.data;
      }, function(err) {
        console.error('checking for Comment Error', err);
      });


    $scope.addComment = function() {
      var post = {
        body: $scope.commentBody,
        user: auth.data._id,
        postParent: $scope.postData._id
      };
      postService.postComments(post)
        .then(function(response) {
          $scope.postData.numComments++;
          $scope.commentBody = '';
          response.data.user = {
            firstName: auth.data.firstName,
            lastName : auth.data.lastName,
            email : auth.data.email
          };
          $scope.comments.unshift(response.data);
        }, function(err){ errService.error(err); });
    };


    // DAYS USER HAS BEEN IN PROGRAM
    var a = moment(new Date());
    var b = moment($scope.postData.user.startDate);
    $scope.daysInProgram = a.diff(b, 'days');

    // USER AVERAGE
    postService.averageQuery('user', $scope.postData.user._id, 'allTime')
      .then(function(response) {
        $scope.userAverage = Math.round(response.data[0].avg);
        $scope.userCount = response.data[0].count;
      }, function(err) {
        console.error('checkForUserAverage', err);
      });
    // COHORT AVERAGE
    postService.averageQuery('cohort', $scope.postData.user._id, 'allTime')
      .then(function(response) {
        $scope.cohortAverage = Math.round(response.data[0].avg);
        $scope.cohortCount = response.data[0].count;
      }, function(err) {
        console.error('checkForCohortAverage', err);
      });

    //    USER LAST WEEK
    postService.averageQuery('user', $scope.postData.user._id, 'week')
      .then(function(response) {
        $scope.userAverageLastWeek = Math.round(response.data[0].avg);
        $scope.userCountLastWeek = response.data[0].count;
      }, function(err) {
        console.error('checkForUserAverageWeekly', err);
      });


    // COHORT LAST WEEK
    postService.averageQuery('cohort', $scope.postData.user._id, 'week')
      .then(function(response) {
        $scope.cohortAverageLastWeek = Math.round(response.data[0].avg);
        $scope.cohortLastWeekCount = response.data[0].count;
      }, function(err) {
        console.error('checkForcohortLastWeek', err);
      });



    


    $scope.userInfo = auth.data;


  });
