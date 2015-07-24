/* Post managing service */
app.factory('posts', [
  'imgurLinkGenerator',
  '$http',
  'auth',
  function (imgurLinkGenerator, $http, auth) {
    var o = {
      container: []
    };

    function Comment(author, body, rating) {
      this.author = author ? author : 'John Doe';
      this.body = body ? body : 'No comment';
      this.rating = rating ? rating : 0;
    }

    function Post(title, link, content, comments, rating) {
      this.title = title ? title : '';
      this.link = link ? link : '';
      this.content = content ? content : '';
      this.comments = comments ? comments : [];
      this.rating = rating ? rating : 0;
    }

    o.Post = Post;
    o.Comment = Comment;

    o.getAll = function () {
      return $http.get('/posts').success(function (data) {
        angular.copy(data, o.container);
      });
    };

    o.getPostById = function (id) {
      return $http.get('/posts/' + id).then(function (res) {
        return res.data;
      });
    };

    o.addPost = function (post) {
      post.author = auth.currentUser();

      if (!(post.image + '').match(/^(http:\/\/){0,1}i.imgur.com\/[A-Za-z0-9]{5,7}\.(jpg|png|jpeg|gif)$/i)) {
        imgurLinkGenerator.getImgurLink().then(function (src) {
          post.image = src;
          $http.post('/posts', post, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          }).success(function (data) {
            o.container.push(data);
          });
        });
      } else {
        $http.post('/posts', post, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        }).success(function (data) {
          o.container.push(data);
        });
      }
    };

    o.addComment = function (post, comment) {
      comment.author = auth.currentUser();

      return $http.post(
        '/posts/' + post._id + '/comments',
        comment, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        }
      ).success(function (comment) {
        post.comments.push(comment);
      });
    };

    o.upvotePost = function (post) {
      return $http.put('/posts/' + post._id + '/upvote', null, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        })
        .success(function (data) {
          post.rating += 1;
        });
    };

    o.downvotePost = function (post) {
      return $http.put('/posts/' + post._id + '/downvote', null, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        })
        .success(function (data) {
          post.rating -= 1;
        });
    };

    o.upvoteComment = function (post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        })
        .success(function (data) {
          comment.rating += 1;
        });
    }

    o.downvoteComment = function (post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
          headers: {
            Authorization: 'Bearer ' + auth.getToken()
          }
        })
        .success(function (data) {
          comment.rating -= 1;
        });
    }

    return o;
}]);

/* Authentification service */
app.factory('auth', [
  '$http',
  '$window',
  function ($http, $window) {
    var auth = {};

    auth.saveToken = function (token) {
      $window.localStorage['flapper-news-token'] = token;
    };

    auth.getToken = function () {
      return $window.localStorage['flapper-news-token'];
    };

    auth.isLoggedIn = function () {
      var token = auth.getToken();

      if (token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    auth.currentUser = function () {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.username;
      }
    };

    auth.register = function (user) {
      return $http.post('/register', user).success(function (data) {
        auth.saveToken(data.token);
      });
    };

    auth.logIn = function (user) {
      return $http.post('/login', user).success(function (data) {
        auth.saveToken(data.token);
      });
    };

    auth.logOut = function () {
      $window.localStorage.removeItem('flapper-news-token');
    };

    return auth;
}]);

app.factory('login', [
  '$rootScope',
  'auth',
  function ($rootScope, auth) {
    var login = {};
    
    login.open = function() {      
      if (!auth.isLoggedIn()) {
        login.mode = true;
        login.modal = true;
      }
    };
    
    login.close = function() {
      login.modal = false;
    };

    return login;
}]);

/* Service for imgur link generation */
app.factory('imgurLinkGenerator', ['$q', function ($q) {
  var url = "http://i.imgur.com/",

    table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    table_length = table.length - 1;

  function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  function generate(deferred) {
    var length = rand(0, 1) ? 5 : 7,
      str = "",
      chr, i;

    while (length--) {
      chr = table[rand(0, table_length)];
      str += chr;
    }

    img = new Image();

    img.addEventListener("load", function () {
      if (this.width <= 300 || this.height <= 300) {
        generate(deferred);
      } else {
        deferred.resolve(this.src);
      }
    }, false);

    img.addEventListener("error", function () {
      generate(deferred);
    }, false);

    img.src = url + str + ".jpg";
  }

  var getImgurLink = function () {
    var deferred = $q.defer();

    generate(deferred);

    return deferred.promise;
  };

  return {
    getImgurLink: getImgurLink
  };
}]);