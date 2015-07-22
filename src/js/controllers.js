app.controller('MainCtrl', [
  '$scope',
  'posts',
  function ($scope, posts) {   
    $scope.userPost = {};
    $scope.posts = posts;
    
    angular.element(document).ready(function() {
      componentHandler.upgradeAllRegistered();
    });

    $scope.submitForm = function () {
      if ($scope.userPost.title) {
        var post = {
          title: $scope.userPost.title,
          content: $scope.userPost.content,
          image: $scope.userPost.image,
          rating: 0,
        };

        posts.addPost(post);
      }
    }
}]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts) {    
    angular.element(document).ready(function() {
      componentHandler.upgradeAllRegistered();
    });

    $scope.post = posts.container[$stateParams.id];
    
    $scope.submitForm = function() {
      posts.addComment(
        $scope.post,
        $scope.userComment.author, 
        $scope.userComment.body
      );
    };
}]);