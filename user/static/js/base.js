


var app = angular.module('ShowPostApp', []);
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{');
    $interpolateProvider.endSymbol('}');
  });

     



app.controller('postCtrl', function($scope, $http) 
{


//set user profile image
function showImage(img,target) {
var fr=new FileReader();
// when image is loaded, set the src of the image where you want to display it
fr.onload = function(e) { target.src = this.result; };
img.addEventListener("change",function() {
// fill fr with image data
fr.readAsDataURL(img.files[0]);
});
}
  
        var src = document.getElementById("img");
        var target = document.getElementById("target");
        showImage(src,target);


//post image set preview
function showImage(post_img,post_target) {
var fr=new FileReader();
// when image is loaded, set the src of the image where you want to display it
fr.onload = function(e) { post_target.src = this.result; };
post_img.addEventListener("change",function() {
  fr.readAsDataURL(post_img.files[0]);
});
}
  

    var post_src = document.getElementById("post_img");
    var target_post = document.getElementById("post_target");
    showImage(post_src,target_post);



        //post modal js
let myModal = new bootstrap.Modal(document.getElementById('postmodal'))

document.getElementById('post_modal_btnid').addEventListener('click', function() {
myModal.show()    
})


// on modal if after click on release modal should hide 
$('#post_close_modal').on("click",function()
{
$('#postmodal').modal('hide')   
});


        // Edit Profile modals js
let editprofilemodal = new bootstrap.Modal(document.getElementById('edit_profile_modal'))
document.getElementById('editprofile_modal_btnid').addEventListener('click', function() {
editprofilemodal.show()
})



        //on click button of closr edit profile button should hide
        $('#close_edit_profile_modal').on("click",function()
        {
        $('#edit_profile_modal').modal('hide');
        });




// edit profile AJAX
$(document).on("submit", "#edit_profile_form", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var formData = new FormData(this);
    $.ajax({
        method: 'PATCH',
        headers: {'X-CSRFToken': '{{ csrf_token }}'},
        url: "/postpage/",
        data: formData,
        contentType: false,
        success: function (data){
            if(data){
               alert("edit user.")
                }  
        },
        error: function() {
            alert('enter a valid data')
        }, 
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
})





    function loadLikesFunc (action, postId){
        console.log(action, postId)
        if(action == "like")
            {
                $("#heart_"+postId).html('<i class="fa fa-heart" aria-hidden="true" onclick="likefunc('+postId+')"></i>');
                $("#yourlike_"+postId).html("you and");
            }
        else if(action == "dislike")    
            {
                $("#heart_"+postId).html('<i class="fa fa-heart-o" aria-hidden="true" onclick="likefunc('+postId+')"></i>');
                $("#yourlike_"+postId).remove();
            }
        }  
   
        

    $scope.ajaxGet = function(url, callback=null){
        $http.get(url).then(function (response) 
            {
                if (callback){
                    callback(response)
                }
            
            });
        }

    $scope.myPostData = []
    $scope.getPostData = function(loadLikes=null, postId=null, action=null){
        $scope.ajaxGet('/postpage/', function(response){
            $scope.myPostData = response.data.PostData;  

        })
       

        /*$http.get('/postpage/').then(function (response) 
        {
           $scope.myPostData = response.data.PostData;  
           
        });*/

       if (loadLikes){
        setTimeout(function(){
            
            loadLikesFunc(action, postId)
        }, 200);
       }
    }
    $scope.getPostData()



    $scope.GetAllLikes = function(postid)
    {
        $scope.LikesData = []
        /*$scope.ajaxGet('like/' + postid +'/',function(responce)
        {
            $scope.LikesData = response.data.GetLikes;    
        })*/
        $http.get('like/' + postid +'/').then(function (response)  
        {
          $scope.LikesData = response.data.GetLikes; 
          
     });
   }

    likefunc = function(postId){

        var formData = new FormData();
        $.ajax({
          method: 'PATCH',
          headers: {'X-CSRFToken': '{{ csrf_token }}'},
          url:'like/' + postId+ '/',
          data: formData,
          contentType: false,
          success: function (data){
              if(data){
                $scope.getPostData(true, postId, data["action"])
                
            }
          },  
          error: function() {
              alert('enter a valid data')
          }, 
          cache: false,
          contentType: false,
          processData: false
       });
      return false;
      
      };

      $scope.likefuncScop = function(postId){
        likefunc(postId)
      }

    $(document).on("submit", "#post_form", function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        var formData = new FormData(this);
    
        $.ajax({
            method: 'POST',
            headers: {'X-CSRFToken': '{{ csrf_token }}'},
            url: "/postpage/",
            data: formData,
            contentType: false,
            success: function (data){
                if(data){
                    $scope.funcgetPostDatad()
                    }  
            },
            error: function() {
                alert('enter a valid data')
            }, 
            cache: false,
            contentType: false,
            processData: false
        });
        return false;
    })
    

    $scope.GetAllComment = function(postid)
    {
        $scope.CommentData = []
        $http.get('post/' + postid +'/comments/').then(function (response)  
        {
          $scope.CommentData = response.data.GetComments; 
          
     });
   }

    
    //savecomment and show comment
    $scope.SaveComment = function(postId)
    {  
        var formData = new FormData();
        formData.append('description', $('#description_'+postId).val())
        formData.append('post', postId)
        $.ajax({
            method: 'POST',
            headers: {'X-CSRFToken': '{{ csrf_token }}'},
            url: "/savecomment/",
            data: formData,
            contentType: false,
            success: function (data){
                if(data){
                    $scope.getPostData()
                  
                 }  
            },  
            error: function() {
                alert('enter a valid data')
            }, 
            cache: false,
            contentType: false,
            processData: false
         });
        return false;
    }
   

});