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




// deleteDoc("posts", "post_226")
deleteDoc("comments_211", "comment_519")


function createDocs(collection, docId, data)
{
	
var db = RTEService.prototype.getFirestore();
  const collectionRef = db.collection(collection);
  const collectionSnapshot = collectionRef.get();
  if (collectionSnapshot.empty) {
     collectionRef.doc(docId).set(data);
  } else
   {
    // Collection already exists, add document to it
     db.collection(collection).doc(docId).set(data);
  } 
     //docRef.set(data) 
}		