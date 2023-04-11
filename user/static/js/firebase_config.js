var firestore = null;

function RTEService() {}

RTEService.prototype.initFireStore = function () {
    var firebaseConfig = {
        apiKey: "AIzaSyBTmi6r_woN5BfrPBuwSvIfx1MSjzYn63U",
        authDomain: "web-instagram-1dd6a.firebaseapp.com",
        projectId: "web-instagram-1dd6a",
        storageBucket: "web-instagram-1dd6a.appspot.com",
        messagingSenderId: "410148021056",
        appId: "1:410148021056:web:65c0523f2508c6b3c3d0a5",
        measurementId: "G-VJLHE9BSDJ"
    };

    firebase.initializeApp(firebaseConfig);
    return firebase.firestore();
};


RTEService.prototype.getFirestore = function () {
  //Prevent to initialize firestore each time/
  if (firestore == null) {
    firestore = RTEService.prototype.initFireStore();
  }
  return firestore;
};



function deleteDoc(collection, docId){
  var db = RTEService.prototype.getFirestore();
  db.collection(collection).doc(docId).delete();
}



deleteDoc("like_214", "nayan@gmail.com")



function createDocs(collection, docId, data)
{
	
var db = RTEService.prototype.getFirestore();
  const collectionRef = db.collection(collection);
  const collectionSnapshot = collectionRef.get();
  if (collectionSnapshot.empty) {
    // Collection doesn't exist, create a new one
     collectionRef.doc(docId).set(data);
  } else
   {
    // Collection already exists, add document to it
     db.collection(collection).doc(docId).set(data);
  } 
     //docRef.set(data) 
}




// function retrieveData(getCollection)
//  {
// 		var db = RTEService.prototype.getFirestore();
//    		var postsRef = db.collection(getCollection);
		
// 			postsRef.get().then(querySnapshot => {
// 				querySnapshot.docs.forEach(doc => {
// 					var data = doc.data();
// 					console.log(data)
			
// 			  });
// 			});

// }





// function retrieveData(getCollection) {
// 	var db = RTEService.prototype.getFirestore();
// 	var postsRef = db.collection(getCollection);
// 	var posts = []

// 	postsRef.get().then(querySnapshot => {
// 	  var promises = [];
  
// 	  querySnapshot.docs.forEach(postDoc => {
// 		var post = postDoc.data();
// 		var postId = post.id;
  
// 			var commentsRef = db.collection('comments_' + postId);
// 			 commentsRef.get().then(commentsQuerySnapshot => {
// 			var comments = commentsQuerySnapshot.docs.map(commentDoc => commentDoc.data());
// 			//adding key comments in post
// 			post.comments = comments;
// 			});	
  
// 			var likesRef = db.collection('like_' + postId);
// 			likesRef.get().then(likesQuerySnapshot => {
// 			var likes = likesQuerySnapshot.docs.map(likeDoc => likeDoc.data());
// 			post.likes = likes;
// 			console.log(post)
// 			posts.push(post)
// 			});
// 	  });
// 	});
// 	return posts
// }

	// console.log(data.id)
          	// console.log(data.content)
          	// console.log(data.image)
			// console.log(data.user_profile)
         	// console.log(data.username)
          	// $(".content").html(data.content)
		    // $(".post_image").attr("src",data.image);
		  	// $(".user_profile").attr("src",data.user_profile)
      		// $(".username").html(data.username)