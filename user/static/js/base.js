
var csrfToken = null

function csrfFunc(token) {
    csrfToken = token
}

var app = angular.module('ShowPostApp', []);
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{');
    $interpolateProvider.endSymbol('}');
});

app.controller('postCtrl', function($scope, $http) {
    //set user profile image
    function showImage(img, target) {
        var fr = new FileReader();
        fr.onload = function(e) {
            target.src = this.result;
        };
        img.addEventListener("change", function() {
            fr.readAsDataURL(img.files[0]);
        });
    }

    var src = document.getElementById("img");
    var target = document.getElementById("target");
    showImage(src, target);

    //post image set preview
    function showImage(post_img, post_target) {
        var fr = new FileReader();
        // when image is loaded, set the src of the image where you want to display it
        fr.onload = function(e) {
            post_target.src = this.result;
        };
        post_img.addEventListener("change", function() {
            fr.readAsDataURL(post_img.files[0]);
        });
    }


    var post_src = document.getElementById("post_img");
    var target_post = document.getElementById("post_target");
    showImage(post_src, target_post);

    //post modal js
    let myModal = new bootstrap.Modal(document.getElementById('postmodal'))

    document.getElementById('post_modal_btnid').addEventListener('click', function() {
        myModal.show()
    })


    // on modal if after click on release modal should hide 
    $('#post_close_modal').on("click", function() {
        $('#postmodal').modal('hide')
    });

    let editprofilemodal = new bootstrap.Modal(document.getElementById('edit_profile_modal'))
    document.getElementById('editprofile_modal_btnid').addEventListener('click', function() {
        editprofilemodal.show()
    })
   
    $('#close_edit_profile_modal').on("click", function() {
        $('#edit_profile_modal').modal('hide');
    });





    // edit profile AJAX
    $(document).on("submit", "#edit_profile_form", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        makeAjaxRequest('PATCH',csrfToken, "/postpage/", new FormData(this), function(response){
            alert("edit user.")
        })
    })




    function loadLikesFunc(action, postId) {
        console.log(action, postId)
        if (action == "like") {
            $("#heart_" + postId).html('<i class="fa fa-heart" aria-hidden="true" onclick="likefunc(' + postId + ')"></i>');
            $("#yourlike_" + postId).html("you and");
        } else if (action == "dislike") {
            $("#heart_" + postId).html('<i class="fa fa-heart-o" aria-hidden="true" onclick="likefunc(' + postId + ')"></i>');
            $("#yourlike_" + postId).remove();
        }
    }
    $scope.ajaxGet = function(url, callback = null, postid = null) {
        $http.get(url).then(function(response) {
            if (callback) {
                callback(response)}
        });
    }
    $scope.myPostData = []
    function retrieveData(getCollection) {
        var db = RTEService.prototype.getFirestore();
        var postsRef = db.collection(getCollection);
    
        postsRef.get().then(querySnapshot => {
      
            querySnapshot.docs.forEach(postDoc => {
            var post = postDoc.data();
            var postId = post.id;   
      
                var commentsRef = db.collection('comments_' + postId).limit(2);
                //  db.collection('comments_' + postId).orderBy("desc").limit(2);
                commentsRef.get().then(commentsQuerySnapshot => {
                var comments = commentsQuerySnapshot.docs.map(commentDoc => commentDoc.data());
                //adding key comments in post
                post.comments = comments;
                });	
      
                var likesRef = db.collection('like_' + postId);
                likesRef.get().then(likesQuerySnapshot => {
                var likes = likesQuerySnapshot.docs.map(likeDoc => likeDoc.data());
                //adding key of likes
                post.likes = likes;
             
                    $scope.$apply(function (){
                        $scope.myPostData.push(post)
                        console.log($scope.myPostData)
                    })
                });
          });
        });
    }   
    
    $scope.getPostData = function(loadLikes = null, postId = null, action = null) {
         retrieveData("posts")
        

        if (loadLikes) {
            setTimeout(function() {

                loadLikesFunc(action, postId)
            }, 200);
        }
    }
    $scope.getPostData()


    $scope.GetAllLikes = function(postid) {
        $scope.LikesData = []
        $scope.ajaxGet('like/' + postid + '/', function(response) {
            $scope.LikesData = response.data.GetLikes;
        })
    }

    //onclick like is done
    likefunc = function(postId) {
        makeAjaxRequest('PATCH',csrfToken,'like/' + postId + '/', new FormData(), function(response){
            
            let likesSchemaname = "like_"+postId
            let likeDocName =  response.response.email
            if(response["action"] == "like"){
                createDocs(likesSchemaname,likeDocName, response.response)   
            }
            else{
                deleteDoc(likesSchemaname, likeDocName)
            }

        })

    };

    $scope.likefuncScop = function(postId) {
        likefunc(postId)
    }


   

    $(document).on("submit", "#post_form", function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var formdata =  new FormData(this)

        makeAjaxRequest('POST',csrfToken,"/postpage/", formdata, function(response){
            $scope.getPostData()
             createDocs("posts","post_"+response.id, response)   
                
        })  
    })




    $scope.GetAllComment = function(postid) {
        $scope.CommentData = []
        $http.get('post/' + postid + '/comments/').then(function(response) {
            $scope.CommentData = response.data.GetComments;

        });
    }
    //savecomment 
    $scope.SaveComment = function(postId) {
        var formData = new FormData();
        formData.append('description', $('#description_' + postId).val())
        formData.append('post', postId)
        makeAjaxRequest('POST', csrfToken,"/savecomment/",formData, function(response){
            $scope.getPostData()
            createDocs("comments_"+response.post_id,"comment_"+response.id, response)
        })
    }
});


