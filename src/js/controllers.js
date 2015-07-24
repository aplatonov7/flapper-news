app.controller('PostsListCtrl', [
  '$scope',
  'posts',
  'auth',
  function ($scope, posts, auth) {
    $scope.userPost = {};
    $scope.posts = posts;
    $scope.currentUser = auth.currentUser();

    $scope.pageSize = 3;
    $scope.currentPage = 0;

    $scope.$watch(function () {
      return Math.ceil($scope.posts.container.length / $scope.pageSize)
    }, function () {
      $scope.totalPages = Math.ceil($scope.posts.container.length / $scope.pageSize);
    });

    $scope.prevPage = function () {
      $scope.currentPage--;
    };

    $scope.nextPage = function () {
      $scope.currentPage++;
    };

    $scope.paginationStatusNext = function () {
      return $scope.currentPage > (Math.ceil($scope.posts.container.length / $scope.pageSize)) - 2;
    };

    angular.element(document).ready(function () {
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

        $scope.userPost = {};
      }
    }
}]);

app.controller('PostsCtrl', [
  '$scope',
  'posts',
  'post',
  function ($scope, posts, post) {
    angular.element(document).ready(function () {
      componentHandler.upgradeAllRegistered();
    });

    $scope.post = post;
    $scope.posts = posts;

    $scope.submitForm = function () {
      posts.addComment(
        $scope.post,
        $scope.userComment
      );
    };
}]);

app.controller('NavCtrl', [
  '$scope',
  'auth',
  'login',
  function ($scope, auth, login) {
    $scope.login = login;
    $scope.auth = auth;
}]);

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  'login',
  function ($scope, $state, auth, login) {
    $scope.user = {};

    $scope.register = function () {
      auth.register($scope.user).error(function (error) {
        $scope.error = error;
      }).then(function () {
        login.close();
        $scope.user = {};
      });
    };

    $scope.logIn = function () {
      auth.logIn($scope.user).error(function (error) {
        $scope.error = error;
      }).then(function () {
        login.close();
        $scope.user = {};
      });
    };

    $scope.login = login;
  }]);