var MAX_UPDATED_TIME_VISITOR = 0;
//Define the object specific properties inside the constructor
function RTEService(customerId) {
  this.customerId = customerId;
}

var firestore = null;
RTEService.prototype.initFireStore = function () {

  // For Carecoll app
  // var firebaseConfig = {
  //   apiKey: "AIzaSyACL7aZFZ0xTb-_mi2vTJAU2rVY7IaWN_0",
  //   authDomain: "carecoll.firebaseapp.com",
  //   projectId: "carecoll",
  //   storageBucket: "carecoll.appspot.com",
  //   messagingSenderId: "984628970654",
  //   appId: "1:984628970654:web:6f50f537ee53c82d1a278f",
  // };

  // For canery app

 var firebaseConfig = {
   apiKey: "AIzaSyDFLMkIqBmx_LMK1HDVmKVe_uQTOnpJORc",
   authDomain: "canary-35af4.firebaseapp.com",
   databaseURL: "https://canary-35af4-default-rtdb.firebaseio.com",
   projectId: "canary-35af4",
   storageBucket: "canary-35af4.appspot.com",
   messagingSenderId: "470103939184",
   appId: "1:470103939184:web:8701627fbf393d5d4b3cb5",
 };

  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  return db;
};

function addlogs(log) {
    // console.log(log);
}

RTEService.prototype.getFirestore = function () {
  //Prevent to initialize firestore each time/
  if (firestore == null) {
    firestore = RTEService.prototype.initFireStore();
  }

  return firestore;
};

// ========================Visitor function =============================

// TO use whenever a new visitor add ==> write operation
RTEService.prototype.addVisitor = function (visitorData) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .add(visitorData)
      .then((docRef) => {
        docId = docRef.id;
        addlogs("document is created with id" + docRef.id);
      });
  }catch(e){
    addlogs(e + "error - addVisitor")
  }
};

// set chat_count and last message for visitor
RTEService.prototype.setVisitorChatCount = function (visitorChatData) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("chat_count")
      .doc(visitorChatData["visitor_id"])
      .set(visitorChatData)
    }
  catch(e){
    addlogs(e + "error - setVisitorChatCount")
  }
};

RTEService.prototype.getVisitorChat = function (callback, visitor_id) {
  try{

    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("chat_count")
      .where("visitor_id", "==", visitor_id)
      .get()
      .then((visitors) => {
        callback(visitors);
      });
  }catch(e){
    addlogs(e + "error - getVisitorChat")
  }
};



RTEService.prototype.getAllVisitors = function (callback) {
  try {
    time_limit = moment().subtract(12, "hours").utc().format();
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .where("connectedOn", ">", time_limit)
      .get()
      .then((visitors) => {
        callback(visitors);
      });
  }catch(e){
    addlogs(e + "error - getAllVisitors")
  }
};


RTEService.prototype.onUpdateVisitor = function (vids, ispagereload,callback) {
  try{

    var db = this.getFirestore();

    total_visitors = []
    total_ids =[]

    if( vids != null && ispagereload){
      for (id of vids){
        total_ids.push(id)
      }
      addlogs(total_ids + 'visIdList')

      while (total_ids.length) {
        const batch = total_ids.splice(0, 10);
        db.collection("visitors")
        .doc(this.customerId)
        .collection("list")
        .where("visitor_id","in",batch)
        .get()
        .then((visitors) => {
        // .onSnapshot((visitors) => {
          addlogs('vids != null RTEService.prototype.onUpdateVisitor ' + 'Total visitors length at the time of page refresh - ' + visitors.docs.length)

          visitors.forEach((visitor) => {
            addlogs("vids != null RTEService.prototype.onUpdateVisitor >>>>>>>>>>>>>>>>>>>>>>>RTEService.prototype.onUpdateVisitor" + visitors.docs.length)
              total_visitors.push(visitor)
          })

          if(total_ids.length == 0){
            callback(total_visitors);
          }
        });
      }

    }else{
      return db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .where('updatedOn', '>', MAX_UPDATED_TIME_VISITOR)
      .onSnapshot((visitors) => {
        // addlogs('else part of snapshot limit data RTEService.prototype.onUpdateVisitor MAX_UPDATED_TIME_VISITOR' + MAX_UPDATED_TIME_VISITOR + 'MAX_UPDATED_TIME_VISITOR')
        // addlogs("else part of snapshot limit data  RTEService.prototype.onUpdateVisitor >>>>>>>>>>>>>>>>>>>>>>>RTEService.prototype.onUpdateVisitor" + visitors.docs.length)
        callback(visitors);
      });
    }
  }catch(e){
    addlogs(e + "error - onUpdateVisitor")
  }
};
	
RTEService.prototype.onUpdateVisitorWidget = function (visitorId,callback) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .where("visitor_id","==",visitorId)
      .onSnapshot((visitors) => {
        callback(visitors);
      });
  }catch(e){
    addlogs(e + "error - onUpdateVisitorWidget")
  }
};


RTEService.prototype.getVisitors = function (callback) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .get()
      .then((visitors) => {
        callback(visitors);
      });
  }catch(e){
    addlogs(e + "error - getVisitors")
  }
};

RTEService.prototype.changeOperatorStatus = function (docId, config) {
  try{
      var db = this.getFirestore();
        db.collection("visitors")
        .doc(this.customerId)
        .collection("list")
        .doc(docId)
        .update(config);
  }catch(e){
    addlogs(e + "error - changeOperatorStatus")
  }
};


RTEService.prototype.getOperatorAttendedChatData = function (operatorId, callback) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .where("operator_id", "array-contains", operatorId)
      .get()
      .then((visitors) => {
        callback(visitors);
    });
  }catch(e){
    addlogs(e + "error - getOperatorAttendedChatData")
  }
};

RTEService.prototype.getOperatorInvitedChatData = function (operatorId, callback) {
  try{

    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .where("invited_operatorId", "array-contains", operatorId)
      .get()
      .then((visitors) => {
        callback(visitors);
    });
  }catch(e){
    addlogs(e + "error - getOperatorInvitedChatData")
  }
};

// ========================Operator function =============================

// Operator observer fire every time on any action
RTEService.prototype.getOperators = function(callback) {
  try{
      var db = this.getFirestore();

      return db.collection("operators").doc(this.customerId)
      .collection("list")
      .onSnapshot((operators) => {
        callback(operators);
      })
   }catch(e){
    addlogs(e + "error - getOperators")
  }
}

// This will fire only when we call it
RTEService.prototype.getOperatorsList = function (callback) {
  try{

    var db = this.getFirestore();
    db.collection("operators")
      .doc(this.customerId)
      .collection("list")
      .get()
      .then((operators) => {
        callback(operators);
      });
  }catch(e){
    addlogs(e + "error - getOperatorsList")
  }
};

// Update operator instance
RTEService.prototype.updateOperatorInstance = function (docId, config) {
  try{
    var db = this.getFirestore();
    db.collection("operators")
      .doc(this.customerId)
      .collection("list")
      .doc(docId)
      .update(config);
  }catch(e){
    addlogs(e + "error - updateOperatorInstance")
  }
};

RTEService.prototype.removeOperatorInstance = function (docId) {
  try{
    var db = this.getFirestore();

    db.collection("operators")
      .doc(this.customerId)
      .collection("list")
      .doc(docId)
      .delete();
   }catch(e){
    addlogs(e + "error - removeOperatorInstance")
  }
};


RTEService.prototype.getCurrentOperator = function (docId, callback) {
  try{
    var db = this.getFirestore();
    db.collection("operators")
      .doc(this.customerId)
      .collection("list")
      .doc(docId)
      .get()
      .then((data) => {
        callback(data);
      });
   }catch(e){
    addlogs(e + "error - getCurrentOperator")
  }
};


// ========================Message function =============================

/**
 * msg - Chat message to pass other end
 * config - It is an object parameter to use for other configuration to avoid to many parameter in the function
 */
RTEService.prototype.sendChatMsg = function (msg, config) {
  try{

    var db = this.getFirestore();

    db.collection("messages")
      .doc(this.customerId)
      .collection(config.visitorMsgDocId)
      .add(msg);

    // addlogs(config.visitorMsgDocId + Date.now() + this.customerId + config)
    // db.collection("visitors")
    //   .doc(this.customerId)
    //   .collection("list")
    //   .where("visitor_id","in",[config.visitorMsgDocId])
    //   .get()
    //   .then((messages) => {
    //       messages.forEach((message) => {
    //       data = message.data()
    //       data["updatedOn"] = Date.now()
    //       addlogs(data + message.id)
    //        db.collection("visitors")
    //       .doc(this.customerId)
    //       .collection("list")
    //       .doc(message.id)
    //       .set(data);

    //     })
    //   });

  }catch(e){
    addlogs(e + "error - sendChatMsg")
  }
};

/**
 * callback - It's a callback function and trigger the callback function when new message received.
 * config - It is an object parameter to use for other configuration to avoid to many parameter in the function
 */
RTEService.prototype.onMessageReceive = function (callback, config) {
  try{
    var db = this.getFirestore();
    return db.collection("messages")
      .doc(this.customerId)
      .collection(config.visitorMsgDocId)
      .orderBy("message_at", "desc")
      .limit(2)
      .onSnapshot((messages) => {
        messages.forEach((message) => {
          addlogs("RTEService.prototype.onMessageReceive Time - " + new Date() + " message - " + message.data().text + " array - " + JSON.stringify(message.data()))
        })

        setTimeout(function(){
          callback(messages)
        },1000)


      });
  }catch(e){
    addlogs(e + "error - onMessageReceive")
  }
};


RTEService.prototype.getMessages = function (callback, config) {
  try{
    var db = this.getFirestore();

    db.collection("messages")
      .doc(this.customerId)
      .collection(config.visitorMsgDocId)
      .orderBy("message_at")
      .get()
      .then((messages) => {
        callback(messages);
      });
   }catch(e){
    addlogs(e + "error - getMessages")
  }
};


RTEService.prototype.getChatCountOnNewMsg = function (callback) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("chat_count")
      .orderBy("updatedOn", "desc")
      .limit(1)
      .onSnapshot((messages) => {
        callback(messages);
      });
 }catch(e){
    addlogs(e + "error - getChatCountOnNewMsg")
  }
};


RTEService.prototype.getMissedChatCount = function (visIdList,callback) {
  try{

    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("chat_count")
      .where("visitor_id","in",visIdList)
      .get()
      .then((messages) => {
        callback(messages);
      });

   }catch(e){
    addlogs(e + "error - getMissedChatCount")
  }
};

// ========================Notification function =============================


// Add only in notifier app
RTEService.prototype.addNotificationMsg = function (msg) {
  try{

    var db = this.getFirestore();
    db.collection("notification")
      .doc(this.customerId)
      .collection("chat")
      .add(msg);

  }catch(e){
    addlogs(e + "error - addNotificationMsg")
  }
};

RTEService.prototype.operatorActionNotification = function (notification,callback) {
  try{
    var db = this.getFirestore();
    db.collection("notification")
      .doc(this.customerId)
      .collection("operatorAction")
      .doc(notification["operatorId"])
      .set(notification)
      .then(data => {
        callback(data)
      });
  }catch(e){
    addlogs(e + "error - operatorActionNotification")
  }
};


RTEService.prototype.addNotificationInvite = function (config, docId) {
  try{

    var db = this.getFirestore();

    db.collection("notification")
      .doc(this.customerId)
      .collection("invite")
      .doc(docId)
      .set(config);
  }catch(e){
    addlogs(e + "error - addNotificationInvite")
  }
};

RTEService.prototype.removeNotificationInvite = function (docId) {
  try{

    var db = this.getFirestore();

    db.collection("notification")
      .doc(this.customerId)
      .collection("invite")
      .doc(docId)
      .delete();
  }catch(e){
    addlogs(e + "error - removeNotificationInvite")
  }
}

RTEService.prototype.getCurrentVisitor = function (docId, callback) {
  try{
    var db = this.getFirestore();
    db.collection("visitors")
      .doc(this.customerId)
      .collection("list")
      .where("visitor_id","==",docId)
      .get()
      .then(data => {
        callback(data)
      });
  }catch(e){
    addlogs(e + "error - getCurrentVisitor")
  }
};