app.factory('posts', [
  'imgurLinkGenerator',
  '$http',
  function (imgurLinkGenerator, $http) {
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
    
    o.getAll = function() {
      return $http.get('/posts').success(function(data) {
        angular.copy(data, o.container);
      });
    };
    
    o.getPostById = function(id, post) {
      o.currentPost = {};
      return $http.get('/posts/' + id).success(function(data) {
        angular.copy(data, post);
      });
    };
    
    o.addPost = function(post) {
      if (!(post.image + '').match(/^(http:\/\/){0,1}i.imgur.com\/[A-Za-z0-9]{5,7}\.(jpg|png|jpeg|gif)$/i)) {
        imgurLinkGenerator.getImgurLink().then(function (src) {
          post.image = src;
          $http.post('/posts', post).success(function(data){
            o.container.push(data);
          });
        });
      } else {
        $http.post('/posts', post).success(function(data){
          o.container.push(data);
        });
      }
    };
    
    o.addComment = function(post, author, body) {
      var comment = new Comment(author, body);
      post.comments.push(comment);
    }
    
    o.upvote = function(element) {
      element.rating += 1;
    }

    o.downvote = function(element) {
      element.rating -= 1;
    }

    return o;
}]);

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