PostsListCtrl = function ($scope, posts, auth, login) {
  $scope.userPost = {};
  $scope.posts = posts;
  $scope.auth = auth;
  $scope.login = login;
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
};

PostsCtrl = function ($scope, posts, post, auth, login) {
  angular.element(document).ready(function () {
    componentHandler.upgradeAllRegistered();
  });

  $scope.post = post;
  $scope.posts = posts;
  $scope.auth = auth;
  $scope.login = login;

  $scope.submitForm = function () {
    posts.addComment(
      $scope.post,
      $scope.userComment
    );
  };
};

NavCtrl = function ($scope, auth, login) {
  $scope.login = login;
  $scope.auth = auth;
};

AuthCtrl = function ($scope, $state, auth, login) {
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
};

PostsListCtrl.$inject = ['$scope', 'posts', 'auth', 'login'];
PostsCtrl.$inject = ['$scope', 'posts', 'post', 'auth', 'login'];
NavCtrl.$inject = ['$scope', 'auth', 'login'];
AuthCtrl.$inject = ['$scope', '$state', 'auth', 'login'];

app.controller('PostsListCtrl', PostsListCtrl);
app.controller('PostsCtrl', PostsCtrl);
app.controller('NavCtrl', NavCtrl);
app.controller('AuthCtrl', AuthCtrl);