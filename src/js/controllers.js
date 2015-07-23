app.controller('MainCtrl', [
  '$scope',
  'posts',
  function ($scope, posts) {   
    $scope.userPost = {};
    $scope.posts = posts;
    
    $scope.pageSize = 3;
    $scope.currentPage = 0;
    
    $scope.$watch(function() {
      return Math.ceil($scope.posts.container.length / $scope.pageSize)
    }, function() {
      $scope.totalPages = Math.ceil($scope.posts.container.length / $scope.pageSize);
    });
    
    $scope.prevPage = function() {
      $scope.currentPage--;
    };
    
    $scope.nextPage = function() {
      $scope.currentPage++;
    };
    
    $scope.paginationStatusNext = function() {
      return $scope.currentPage > (Math.ceil($scope.posts.container.length / $scope.pageSize)) - 2;
    };
    
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
    
    var post = {};
    posts.getPostById($stateParams.id, post);
    $scope.post = post;
    
    $scope.submitForm = function() {
      posts.addComment(
        $scope.post,
        $scope.userComment.author, 
        $scope.userComment.body
      );
    };
}]);