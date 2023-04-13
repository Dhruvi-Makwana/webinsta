function widgetInit(session) {
  var widget = {};
  var countryName = session.country_long;
  var countryCode = session.country_short;
  var isPageLoad = true;

  function detectBrowser() {
    if (
      (navigator.userAgent.indexOf("Opera") ||
        navigator.userAgent.indexOf("OPR")) != -1
    ) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    } else if (
      navigator.userAgent.indexOf("MSIE") != -1 ||
      !!document.documentMode == true
    ) {
      //IF IE > 10
      return "IE";
    } else {
      return "unknown";
    }
  }

  function getOS() {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "Windows";
    } else if (/Android/.test(userAgent)) {
      os = "Android";
    } else if (!os && /Linux/.test(platform)) {
      os = "Linux";
    }
    return os;
  }

  function visitorLastConnTime(key, value) {
    var bodyFormData = new FormData();
    bodyFormData.append("key", key);
    bodyFormData.append("update_entity", value);

    axios({
      method: "post",
      url: "/set_redis_cache_view/",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(function (response) {});
  }

  var app = angular.module("widget", []);
  app.config(function ($interpolateProvider, $locationProvider) {
    $interpolateProvider.startSymbol("{[{").endSymbol("}]}");
    $locationProvider.hashPrefix("");
  });

  angular.module("widget").filter("to_trusted", [
    "$sce",
    function ($sce) {
      return function (text) {
        return $sce.trustAsHtml(text);
      };
    },
  ]);

  app.controller("widgetCtrl", function ($scope) {
    $scope.n_select_department = "Select department";
    $scope.n_msg_type = "Type your message here...";
    $scope.n_messages_offline = "Message";
    $scope.n_chatBtnName = "Start chat";
    $scope.n_contact_support = "Contact support";
    $scope.n_maximize_window = "Maximize the chat widget";
    $scope.n_restore_window = "Restore the chat widget";
    $scope.n_minimize_window = "Minimize the chat widget";
    $scope.n_name = "Name";
    $scope.n_email = "Email";
    $scope.n_leave_messages = "Leave a message";
    $scope.n_leave_msg_contact =
      "Please leave your message and details for us to contact you.";
    $scope.n_phone_no = "Phone No.";
    $scope.n_choose_file = "Choose File";
    $scope.n_no_choose_file = "No file chosen";
    $scope.n_submit_btn = "Submit";
    $scope.n_live_chat = "Live chat";
    $scope.n_live_customer_support = "Live customer support";
    $scope.n_end_chat = "End chat";
    $scope.n_attach_file = "Attach file";
    $scope.n_sure_end_chat = "Are you sure you want to end this chat?";
    $scope.n_cancel = "Cancel";

    $scope.department_en_to_hu = {
      "Engineering support": "Gyártáselőkészítés",
      Sales: "Értékesítés",
      Logistics: "Logisztika",
      Financial: "Pénzügy",
      Production: "Gyártás",
      "Software support": "Szoftvertámogatás",
      "R&D": "R&D",
      "Quality assurance": "Minőségbiztosítás",
      "Production planning": "Gyártástervezés",
      Purchase: "Beszerzés",
      eCvelo: "eCvelo",
      test: "teszt",
      test1: "teszt 1",
    };

    $scope.department_hu_to_en = {
      Gyártáselőkészítés: "Engineering support",
      Értékesítés: "Sales",
      Logisztika: "Logistics",
      Pénzügy: "Financial",
      Gyártás: "Production",
      Szoftvertámogatás: "Software support",
      "R&D": "R&D",
      Minőségbiztosítás: "Quality assurance",
      Gyártástervezés: "Production planning",
      Beszerzés: "Purchase",
      eCvelo: "eCvelo",
      teszt: "test",
      "teszt 1": "test1",
    };

    if (session.load_widget == "False") {
      window.xprops.unload();
      return;
    }
    $scope.userAgent = window.navigator.userAgent;

    function setStorage(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
    }

    document
      .querySelector(".navbar-minimize-btn")
      .addEventListener("click", function (event) {
        setStorage("minimizeChatNotCount", 0);
        setStorage("notifyWidget", true);
      });

    var customerId = window.xprops.key;
    var urlInLangCode = window.xprops.lang;
    var config = window.xprops.sess;
    var rteService = new RTEService(customerId);

    // $scope.chatDisplay = config.chatStatus;
    // $scope.chat_title = "chat started";
    // $scope.operator_name = "Please wait an operator will join to help";

    $scope.unreadChatCount = 0;

    $scope.visitor = {};
    $scope.visitor.name = config.customerData.customerName;
    $scope.visitor.email = config.customerData.customerEmail;
    $scope.visitor.phoneNum = config.customerData.phoneNum;
    $scope.orderNum = config.customerData.orderNum;

    if (urlInLangCode === "") {
      $scope.countryCode = config.customerData.langCode;
    } else {
      $scope.countryCode = urlInLangCode;
    }

    if ($scope.countryCode == "hu") {
      $scope.n_chatBtnName = "Chat indítása";
      $scope.n_select_department = "Terület kiválasztása";
      $scope.n_msg_type = "Írja be üzenetét ide...";
      $scope.n_messages_offline = "Üzenet";
      $scope.n_contact_support = "Ügyfélszolgálat";
      $scope.n_maximize_window = "Maximalizálja a chat widgetet";
      $scope.n_restore_window = "Állítsa vissza a chat widgetet";
      $scope.n_minimize_window = "Minimalizálja a chat widgetet";
      $scope.n_name = "Név";
      $scope.n_email = "E-mail";
      $scope.n_leave_messages = "Hagyjon üzenetet";
      $scope.n_leave_msg_contact =
        "Hagyjon üzenetet és felvesszük Önnel a kapcsolatot!";
      $scope.n_phone_no = "Telefonszám";
      $scope.n_choose_file = "Fájl csatolása";
      $scope.n_no_choose_file = "Nincs fájl csatolva";
      $scope.n_submit_btn = "Küldés";
      $scope.n_live_chat = "Azonnali üzenetküldés";
      $scope.n_live_customer_support = "Élő ügyfélszolgálat";
      $scope.n_end_chat = "Vége";
      $scope.n_attach_file = "Fájl csatolása";
      $scope.n_sure_end_chat = "Biztosan befejezi ezt a csevegést?";
      $scope.n_cancel = "Megszünteti";

      var inputElements = document.getElementsByTagName("INPUT");
      for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].oninvalid = function (e) {
          e.target.setCustomValidity("");
          if (e.target.id == "name" || e.target.id == "usr") {
            if (!e.target.validity.valid) {
              e.target.setCustomValidity("Kérjük  töltse ki ezt a mezőt!");
            }
          }
          if (e.target.id == "email" || e.target.id == "visitoremail") {
            if (!e.target.validity.valid) {
              if (e.target.id == "email") {
                var email_validate = $("#email").val();
              }
              if (e.target.id == "visitoremail") {
                var email_validate = $("#visitoremail").val();
              }
              var email_in_a = parseInt(email_validate.indexOf("@"));
              var email_in_a_lenght = 0;
              if (email_in_a != -1) {
                var email_in_a_lenght = email_validate.match(/@/g).length;
              }
              var email_length = parseInt(email_validate.length);

              if (email_length === 0) {
                e.target.setCustomValidity("Kérjük  töltse ki ezt a mezőt!");
              } else if (email_in_a === 0) {
                e.target.setCustomValidity(
                  "Az e-mail cím formátuma nem megfelelő. Előtag hiányzik a @ előtt."
                );
              } else if (email_in_a_lenght > 1) {
                e.target.setCustomValidity(
                  "Az e-mail cím formátuma nem megfelelő. A @ szimbólum rossz pozícióban."
                );
              } else if (
                email_validate.includes(".") &&
                email_validate.includes("@") &&
                email_in_a + 1 === parseInt(email_validate.indexOf("."))
              ) {
                e.target.setCustomValidity(
                  "Az e-mail cím formátuma nem megfelelő. Domainnév helytelen."
                );
              } else if (
                email_validate.includes(".") &&
                email_length == parseInt(email_validate.indexOf(".")) + 1
              ) {
                e.target.setCustomValidity(
                  "Az e-mail cím formátuma nem megfelelő. Domainnév helytelen."
                );
              } else if (
                email_validate.includes("@") &&
                email_in_a + 1 === email_length
              ) {
                e.target.setCustomValidity(
                  "Az e-mail cím formátuma nem megfelelő. Előtag hiányzik a @ előtt."
                );
              } else if (!email_validate.includes("@")) {
                e.target.setCustomValidity(
                  "Az e-mail cím formátuma nem megfelelő. A @ szimbólum hiányzik a címből."
                );
              }
            }
          }
          if (e.target.id == "cont") {
            var cont_validate = $("#cont").val();
            var phone_pattern =
              /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;
            if (!e.target.validity.valid) {
              if (!phone_pattern.test(cont_validate)) {
                e.target.setCustomValidity(
                  "Adja meg az érvényes telefonszámot"
                );
              }
            }
          }
        };
        inputElements[i].oninput = function (e) {
          e.target.setCustomValidity("");
        };
      }

      $(":input").on("propertychange input", function (e) {
        e.target.setCustomValidity("");
        if (e.target.id == "name" || e.target.id == "usr") {
          if (!e.target.validity.valid) {
            e.target.setCustomValidity("Kérjük  töltse ki ezt a mezőt!");
          }
        }
        if (e.target.id == "email" || e.target.id == "visitoremail") {
          if (!e.target.validity.valid) {
            if (e.target.id == "email") {
              var email_validate = $("#email").val();
            }
            if (e.target.id == "visitoremail") {
              var email_validate = $("#visitoremail").val();
            }
            var email_in_a = parseInt(email_validate.indexOf("@"));
            var email_in_a_lenght = 0;
            if (email_in_a != -1) {
              var email_in_a_lenght = email_validate.match(/@/g).length;
            }
            var email_length = parseInt(email_validate.length);

            if (email_length === 0) {
              e.target.setCustomValidity("Kérjük  töltse ki ezt a mezőt!");
            } else if (email_in_a === 0) {
              e.target.setCustomValidity(
                "Az e-mail cím formátuma nem megfelelő. Előtag hiányzik a @ előtt."
              );
            } else if (email_in_a_lenght > 1) {
              e.target.setCustomValidity(
                "Az e-mail cím formátuma nem megfelelő. A @ szimbólum rossz pozícióban."
              );
            } else if (
              email_validate.includes(".") &&
              email_validate.includes("@") &&
              email_in_a + 1 === parseInt(email_validate.indexOf("."))
            ) {
              e.target.setCustomValidity(
                "Az e-mail cím formátuma nem megfelelő. Domainnév helytelen."
              );
            } else if (
              email_validate.includes(".") &&
              email_length == parseInt(email_validate.indexOf(".")) + 1
            ) {
              e.target.setCustomValidity(
                "Az e-mail cím formátuma nem megfelelő. Domainnév helytelen."
              );
            } else if (
              email_validate.includes("@") &&
              email_in_a + 1 === email_length
            ) {
              e.target.setCustomValidity(
                "Az e-mail cím formátuma nem megfelelő. Előtag hiányzik a @ előtt."
              );
            } else if (!email_validate.includes("@")) {
              e.target.setCustomValidity(
                "Az e-mail cím formátuma nem megfelelő. A @ szimbólum hiányzik a címből."
              );
            }
          }
        }
        if (e.target.id == "cont") {
          var cont_validate = $("#cont").val();
          var phone_pattern = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;
          if (!e.target.validity.valid) {
            if (!phone_pattern.test(cont_validate)) {
              e.target.setCustomValidity("Kérjük, adja meg a kérés formátumát");
            }
          }
        }
      });

      var selectElements = document.getElementsByTagName("SELECT");
      for (var i = 0; i < selectElements.length; i++) {
        selectElements[i].oninvalid = function (e) {
          e.target.setCustomValidity("");
          var selectDepart = $("#selectdept").find(":selected").text();
          if (e.target.id == "selectdept") {
            if (!e.target.validity.valid) {
              if (selectDepart == "Terület kiválasztása") {
                e.target.setCustomValidity(
                  "Kérjük  válasszon egy területet a listából"
                );
              }
            }
          }
        };
        selectElements[i].oninput = function (e) {
          e.target.setCustomValidity("");
        };
      }

      var textareaElements = document.getElementsByTagName("TEXTAREA");
      for (var i = 0; i < textareaElements.length; i++) {
        textareaElements[i].oninvalid = function (e) {
          e.target.setCustomValidity("");
          var levae_msg = $("#msg").val();
          if (e.target.id == "msg") {
            if (!e.target.validity.valid) {
              if (levae_msg == "") {
                e.target.setCustomValidity("Kérjük  töltse ki ezt a mezőt!");
              }
            }
          }
        };
        textareaElements[i].oninput = function (e) {
          e.target.setCustomValidity("");
        };
      }
    }

    if ($scope.countryCode == "hu") {
      for (data in session.depList) {
        session.depList[data].name =
          $scope.department_en_to_hu[session.depList[data].name];
      }
    }
    $scope.allDepList = session.depList;

    setInterval(function () {
      if ($scope.chatDisplay && $scope.chatDisplay != "notStarted") {
        visitorLastConnTime(config.visitorId, "visitor");
      }
    }, 15000);

    updateVisTimeOnReconnect = function () {
      var bodyFormData = new FormData();
      bodyFormData.append("key", $scope.currentVisitor.visitor_id);
      axios({
        method: "post",
        url: "/chat/get_active_visitor/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (data) {
        if (data.data.code == 1) {
          return false;
        }
        // if($scope.currentVisitor.operator.length > 0){
        //   return;
        // }

        // updateInfo = {
        //   "updatedOn" : moment.utc().format(),
        //   "operator" : [],
        //   "operator_id" : [],
        // }
        updateInfo = {
          updatedOn: Date.now(),
          operator: [],
          operator_id: [],
          chatStatus: "Waiting",
          invited_operatorId: [],
          invited_operator: [],
        };
        var msg = {
          sender: "operator",
          message_type: "notifyVisitor",
          nameOp: "visitor",
          notifyMsg: " left the chat.",
          text: "",
          message_at: moment(data.data.data.last_connected).local().format(),
        };
        rteService.sendChatMsg(msg, {
          visitorMsgDocId: config.visitorId,
        });
        saveNotificationMsgToDb(
          "Visitor left the chat.",
          moment(data.data.data.last_connected).local().format(),
          moment(data.data.data.last_connected).local().format("hh:mm A")
        );

        msg["notifyMsg"] = " joined the chat.";
        msg["message_at"] = moment.utc().format();

        rteService.sendChatMsg(msg, {
          visitorMsgDocId: config.visitorId,
        });
        rteService.changeOperatorStatus($scope.currentVisitor.id, updateInfo);
        visitorLastConnTime(config.visitorId, "visitor");
        saveNotificationMsgToDb(
          "Visitor joined the chat.",
          moment.utc().format(),
          moment.utc().format("hh:mm A")
        );
      });
    };

    function saveNotificationMsgToDb(client_msg, message_at, utcTime) {
      let msg = {
        name: $scope.currentVisitor.name,
        text: client_msg,
        sender: "client",
        message_at: message_at,
        message_type: "text",
        entityType: 6, //this is static for operator this is 5 and for visitor this is 6 constant.cs
        customerId: "",
        utcTime: utcTime,
        currentPage: config.currentPage,
      };
      msg["visitorId"] = $scope.currentVisitor.visitorId;
      msg["conversationId"] = $scope.currentVisitor.conversationId;
      msg["fullName"] = $scope.currentVisitor.name;

      var bodyFormData = new FormData();
      bodyFormData.append("msgData", JSON.stringify(msg));

      axios({
        method: "post",
        url: "/chat/save_msg_to_db/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {});
    }

    $scope.setVisitorData = function (visitorData) {
      if (visitorData != undefined) {
        $scope.currentVisitor = visitorData;
        return $scope.currentVisitor;
      }
      if ($scope.currentVisitor != undefined) {
        return $scope.currentVisitor;
      }
      rteService.getCurrentVisitor(config.visitorId, function (visitors) {
        if (visitors.docs.length == 0) {
          setStorage("notifyWidget", false);
          setStorage("minimizeChatNotCount", 0);
        }
        visitors.forEach((visitor) => {
          $scope.currentVisitor = visitor.data();
          $scope.currentVisitor.id = visitor.id;
          updateVisTimeOnReconnect();
          // setCurrentPage();
          return $scope.currentVisitor;
        });
      });
    };
    $scope.setVisitorData();

    setCurrentPage = function () {
      var msg = {
        sender: "client",
        message_type: "currentPageChanged",
        text: "",
        message_at: moment.utc().format(),
        currentPage: config.currentPage,
      };
      rteService.sendChatMsg(msg, {
        visitorMsgDocId: config.visitorId,
      });
    };

    var pageReload = true;
    rteService.onUpdateVisitorWidget(config.visitorId, function (visitors) {
      visitors.forEach((visitor) => {
        if (pageReload) {
          pageReload = false;
          return;
        }
        visitor = visitor.data();
        if (visitor.visitor_id == config.visitorId) {
          $scope.currentVisitor = visitor;
          $scope.$apply(function () {
            $scope.opFullName = $scope.currentVisitor["operator"].join(", ");
          });

          $scope.unreadChatCount = 0;
          $scope.newVis = false;
        }
      });
    });

    function filesScrollCss() {
      if ($scope.fullscreen) {
        if ($scope.attachFiles.length !== 0) {
          $(".directionButton").css(
            "padding-top",
            "calc(1vw + " + 13 + "px" + ")"
          );
        }
      } else {
        if ($scope.attachFiles.length !== 0) {
          $(".directionButton").css(
            "padding-top",
            "calc(1vw + " + 18 + "px" + ")"
          );
        }
      }
    }

    function setCssMaxMinScrn() {
      if ($scope.fullscreen) {
        if ($scope.attachFiles.length !== 0) {
          $(".chat-height").css("height", "calc(100vh - " + 250 + "px" + ")");
          $(".previewDiv").css("width", "calc(100vh - " + 68 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        } else {
          $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        }
      } else {
        if ($scope.attachFiles.length !== 0) {
          $(".chat-height").css("height", "calc(100vh - " + 250 + "px" + ")");
          $(".previewDiv").css("width", "calc(100vh - " + 303 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        } else {
          $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        }
      }
      scrollToBottom();
    }

    $scope.onMinimize = function () {
      window.xprops.onMinimize();
    };
    $scope.fullscreen = false;
    $scope.expandScreen = function () {
      $scope.showFilesScroll = false;
      if ($scope.fullscreen) {
        $scope.fullscreen = false;
        $(".liveChatTagline").css("overflow", "hidden");
        if ($scope.attachFiles.length !== 0) {
          $(".directionButton").css(
            "padding-top",
            "calc(1vw + " + 13 + "px" + ")"
          );
          $(".chat-height").css("height", "calc(100vh - " + 250 + "px" + ")");
          $(".previewDiv").css("width", "calc(100vh - " + 303 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        } else {
          $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        }
        filesScrollCss();
      } else {
        $scope.fullscreen = true;
        $(".liveChatTagline").css("overflow", "visible");
        if ($scope.attachFiles.length !== 0) {
          $(".directionButton").css(
            "padding-top",
            "calc(1vw + " + 9 + "px" + ")"
          );
          $(".chat-height").css("height", "calc(100vh - " + 250 + "px" + ")");
          $(".previewDiv").css("width", "calc(100vh - " + 68 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        } else {
          $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
          var input = document.getElementById("idMsgText");
          input.focus();
        }
        filesScrollCss();
      }
      setTimeout(function () {
        if ($("#imgPrevDiv").width() > $("#idMsgText").width()) {
          $scope.$apply(function () {
            $scope.showFilesScroll = true;
          });
        }
      }, 200);
      scrollToBottom();
      window.xprops.expandScreen($scope.fullscreen);
    };

    $scope.onAttachmentClick = function () {
      document.getElementById("chatFile").click();
    };

    $scope.getFileExtension = function (fileName) {
      var extensionIndex = fileName.lastIndexOf(".") + 1;
      var extension =
        parseInt(extensionIndex) > 0
          ? fileName.substr(extensionIndex).toLowerCase()
          : "";
      return extension;
    };

    document.addEventListener("mouseup", function (e) {
      var filter_name = document.getElementById("idMsgText");
      if (filter_name.contains(e.target)) {
        $("#textDocBox").css("border", "2px solid");
      } else {
        $("#textDocBox").css("border", "1px solid #e5e5e5");
      }
    });

    $scope.attachFiles = [];
    $scope.allFiles = { files: [] };
    $scope.allFilesData = [];
    attachFileTextBox = function (e) {
      $scope.allFiles = { files: [] };
      $("#textDocBox").css("height", "110px");
      //   $(".chat-height").css("height", "calc(100vh - " + 250 + "px" + ")");
      for (i = 0; i < e.files.length; i++) {
        var fileName = e.files[i].name;
        $scope.$apply(function () {
          var fileNameExtension = $scope
            .getFileExtension(fileName)
            .toLowerCase();
          if (
            fileNameExtension == "png" ||
            fileNameExtension == "jpg" ||
            fileNameExtension == "jpeg" ||
            fileNameExtension == "gif"
          ) {
            $scope.attachFiles.push({
              fileName: fileName,
              src: URL.createObjectURL(e.files[i]),
            });
          } else {
            $scope.attachFiles.push({
              isPrev: true,
              fileName: fileName,
              src:
                "https://carecollstorage.blob.core.windows.net/media/" +
                getPrevImgUrl(fileNameExtension),
            });
          }
        });
        $scope.allFiles["files"].push(e.files[i]);
      }
      $scope.allFilesData.push($scope.allFiles);
      document.getElementById("chatFile").value = null;
      var input = document.getElementById("idMsgText");
      input.focus();
      input.click();
      setCssMaxMinScrn();
      filesScrollCss();
      setTimeout(function () {
        if ($("#imgPrevDiv").width() + 10 > $("#idMsgText").width()) {
          $scope.$apply(function () {
            $scope.showFilesScroll = true;
          });
        }
      }, 200);
      scrollToBottom();
    };

    initFilePaste = function (e) {
      if (e.clipboardData.files.length == 0) {
        return;
      }
      var input = document.getElementById("idMsgText");
      input.focus();
      input.click();
      $scope.allFiles = { files: [] };
      $scope.allFiles["files"].push(e.clipboardData.files[0]);
      $scope.allFilesData.push($scope.allFiles);
      attachFileTextBoxForDragDrop(e.clipboardData.files[0]);
      if ($scope.fullscreen) {
        $(".previewDiv").css("width", "calc(100vh - " + 68 + "px" + ")");
      } else {
        $(".previewDiv").css("width", "calc(100vh - " + 303 + "px" + ")");
      }
      setTimeout(function () {
        if ($("#imgPrevDiv").width() > $("#idMsgText").width()) {
          $scope.$apply(function () {
            $scope.showFilesScroll = true;
          });
        }
      }, 200);
      return;
    };

    attachFileTextBoxForDragDrop = function (e) {
      $("#textDocBox").css("height", "110px");
      filesScrollCss();
      $(".chat-height").css("height", "calc(100vh - " + 250 + "px" + ")");

      var input = document.getElementById("idMsgText");
      input.focus();

      setTimeout(function () {
        if ($("#imgPrevDiv").width() > $("#idMsgText").width()) {
          $scope.$apply(function () {
            $scope.showFilesScroll = true;
          });
        }
      }, 200);
      var reader = new FileReader();
      var fileName = e.name;
      reader.readAsDataURL(e);
      reader.onload = function (e) {
        $scope.$apply(function () {
          var fileNameExtension = $scope
            .getFileExtension(fileName)
            .toLowerCase();
          if (
            fileNameExtension == "png" ||
            fileNameExtension == "jpg" ||
            fileNameExtension == "jpeg" ||
            fileNameExtension == "gif"
          ) {
            $scope.attachFiles.push({
              fileName: fileName,
              src: reader.result,
            });
          } else {
            $scope.attachFiles.push({
              isPrev: true,
              fileName: fileName,
              src:
                "https://carecollstorage.blob.core.windows.net/media/" +
                getPrevImgUrl(fileNameExtension),
            });
          }
        });
      };
    };

    $scope.removeFilesFromInpuBox = function (index) {
      var fName = $scope.attachFiles[index].fileName;
      // var fObj = $scope.allFilesData.find(
      //   (fobj) => $scope.allFiles["files"][0].name === fName
      // );
      var allFilesData_length = $scope.allFilesData.length;
      for (let i = 0; i < allFilesData_length; i++) {
        var all_files_length = $scope.allFilesData[i]["files"].length;
        if (all_files_length > 1) {
          for (let j = 0; j < all_files_length; j++) {
            if ($scope.allFilesData[i]["files"][j]["name"] === fName) {
              $scope.allFilesData[i]["files"].splice(j, 1);
              break;
            }
          }
        } else {
          $scope.allFilesData.splice(index, 1);
          break;
        }
      }
      // $scope.allFilesData.splice(indx, 1);
      $scope.attachFiles.splice(index, 1);
      if ($scope.attachFiles.length == 0) {
        $("#textDocBox").css("height", "61px");
        $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
        var input = document.getElementById("idMsgText");
        input.focus();
      }

      setTimeout(function () {
        if ($("#imgPrevDiv").width() + 10 < $("#idMsgText").width()) {
          $scope.$apply(function () {
            $scope.showFilesScroll = false;
          });
        }
      }, 200);
    };

    function getPrevImgUrl(extension) {
      switch (extension) {
        case "doc":
          return "64word.png";
        case "docx":
          return "64word.png";
        case "pdf":
          return "64pdf.png";
        case "ppt":
          return "64powerpoint.png";
        case "pptx":
          return "64powerpoint.png";
        case "xlsx":
          return "64excel.png";
        case "xls":
          return "64excel.png";
        case "csv":
          return "64excel.png";
        case "xml":
          return "64xml.png";
        case "txt":
          return "64txt.png";
        case "zip":
          return "64zip.png";
        case "rar":
          return "64rar.png";
        default:
          return "64unknown.png";
      }
    }

    InitFilDragDrop = function () {
      $scope.idCurrentChatClicked = document.getElementById(
        "idCurrentChatClicked"
      );
      onDropFile = function (event) {
        event.preventDefault();
        var input = document.getElementById("idMsgText");
        input.focus();
        input.click();
        $scope.attachLength = event.dataTransfer.items.length;

        for (v = 0; v < $scope.attachLength; v++) {
          $scope.allFiles = { files: [] };
          $scope.allFiles["files"].push(
            event.dataTransfer.items[v].getAsFile()
          );
          $scope.allFilesData.push($scope.allFiles);
          attachFileTextBoxForDragDrop(event.dataTransfer.items[v].getAsFile());
        }

        setTimeout(function () {
          if ($scope.fullscreen) {
            $(".previewDiv").css("width", "calc(100vh - " + 68 + "px" + ")");
          } else {
            $(".previewDiv").css("width", "calc(100vh - " + 303 + "px" + ")");
          }
          if ($("#imgPrevDiv").width() > $("#idMsgText").width()) {
            $scope.$apply(function () {
              $scope.showFilesScroll = true;
            });
          }
        }, 200);
        return;
      };

      $scope.idCurrentChatClicked.ondragover = function (event) {
        event.preventDefault();
      };
      $scope.idCurrentChatClicked.addEventListener(
        "drop",
        function (event) {
          event.preventDefault();
          onDropFile(event);
        },
        false
      );
    };
    InitFilDragDrop();

    showErrorMsg = function (msg) {
      $scope.$apply(function () {
        $scope.liveChatCallbackMsg = msg;
        $scope.liveChatCallbackCode = 0;
      });
      document.getElementById("chatFile").value = null;
      setTimeout(function () {
        $scope.$apply(function () {
          $scope.liveChatCallbackMsg = null;
          $scope.liveChatCallbackCode = null;
        });
      }, 3000);
    };

    uploadFile = function (allFiles, counter) {
      if (counter < allFiles.length) {
        $scope.isUploading = true;
        $(".previewDiv").css("background", "rgba(239, 239, 239, 0.3)");
        setTimeout(function () {
          counter++;
          if (counter == allFiles.length) {
            $scope.allUploaded = true;
          }
          uploadFile(allFiles, counter);
          $scope.onUploadFileLive(allFiles[counter - 1]);
          $scope.allFiles = { files: [] };
          $scope.allFilesData = [];
        }, 0);
      }
    };

    afterFileSendRelatedAction = function () {
      $scope.$apply(function () {
        $scope.attachFiles = [];
        $scope.allFilesData = [];
        $scope.showFilesScroll = false;
        $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
        $("#textDocBox").css("height", "61px");
        $("#attachFileIcon").show();
        $scope.fileAttachMsg = "";
        $scope.allUploaded = undefined;
        $scope.attachLength = undefined;
        $scope.isUploading = undefined;
        $("#idMsgText").show();
        $("#idMsgText").val("");
        var input = document.getElementById("idMsgText");
        input.focus();
      });
    };

    $scope.messages = [];
    $scope.onUploadFileLive = function (e) {
      $("#textDocBox").css("height", "61px");
      if (e.files.length === 0) {
        $("#idMsgText").show();
        $("#idMsgText").prop("disabled", false);
        $scope.isUploading = false;
      }
      var bodyFormData = new FormData();
      for (i = 0; i < e.files.length; i++) {
        if (e.files[i].size / (1000 * 1024) > 10) {
          showErrorMsg("Maximum 10MB file size allowed.");
          if ($scope.allUploaded) {
            afterFileSendRelatedAction();
          }
          return false;
        }

        fileNameExt = $scope.getFileExtension(e.files[i].name).toLowerCase();
        if ($scope.invalidExtensions.includes(fileNameExt) == true) {
          var invalid_file_hu_en = "Invalid file.";
          if ($scope.countryCode == "hu") {
            var invalid_file_hu_en = "Érvénytelen fájl.";
          }
          showErrorMsg(invalid_file_hu_en);
          if ($scope.allUploaded) {
            afterFileSendRelatedAction();
          }
          return false;
        }
        $scope.$apply(function () {
          $(".chat-height").css("height", "calc(100vh - " + 200 + "px" + ")");
          $("#textDocBox").css("height", "61px");
          scrollToBottom();
          $scope.isFileSending = true;
          $("#previewDiv").hide();
          $scope.showFilesScroll = false;
        });

        utcTime = moment.utc().format("hh:mm A");

        prvImgUrl = getPrevImgUrl(fileNameExt);

        bodyFormData.append("userFile", e.files[i]);
        bodyFormData.append("is_operator", true);
        bodyFormData.append(
          "msgData",
          JSON.stringify({
            visitorId: $scope.currentVisitor.visitorId,
            conversationId: $scope.currentVisitor.conversationId,
            fullName: $scope.currentVisitor.name,
            utcTime: utcTime,
            entityType: 6,
            filePrev: prvImgUrl,
            extension: fileNameExt,
          })
        );
      }

      axios({
        method: "post",
        url: "/chat/upload_file/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {
        if (response.data.code == 1) {
          for (i = 0; i < response.data.data.length; i++) {
            data = response.data.data[i];
            var attachment = {
              name: $scope.currentVisitor.name,
              sender: "client",
              message_at: moment.utc().format(),
              message_at_local_time: moment(moment.utc().format())
                .local()
                .format("hh:mm A"),
              message_type: "attachment",
              attachment_url: data.azure_url,
              attachment_name: data.file_name,
              utcTime: moment.utc().format("hh:mm A"),
              size: data.file_size,
              orgImgUrl:
                data.public_url +
                data.container_name +
                "/" +
                data.new_file_name,
              prvImgUrl: data.prev_icon,
              currentPage: config.currentPage,
              message_sent: Date.now(),
            };
            if ($scope.allUploaded == true) {
              $scope.$apply(function () {
                $scope.isFileSending = false;
                // $("#idMsgText").prop("disabled", false);
              });
              afterFileSendRelatedAction();
            }

            $scope.messages.push(attachment);
            $scope.$apply(function () {
              $scope.messages;
            });
            scrollToBottom();

            rteService.sendChatMsg(attachment, {
              visitorMsgDocId: config.visitorId,
            });
          }
        }
      });
      document.getElementById("chatFile").value = null;
      setChatCount("Attachment");
    };
    $scope.chatStatus = "Waiting";
    $scope.visitorId = config.visitorId;

    $scope.onSendChatClick = function (client_msg) {
      if (
        (client_msg.trim() == "" && $scope.allFilesData.length === 0) ||
        (event.key == "Enter" && event.shiftKey)
      ) {
        return false;
      }
      if ($scope.countryCode == "hu") {
        if (
          $scope.selectedDep != undefined &&
          $scope.selectedDep.name != undefined &&
          $scope.department_hu_to_en[$scope.selectedDep.name] != undefined
        ) {
          $scope.selectedDep.name =
            $scope.department_hu_to_en[$scope.selectedDep.name];
        }
      }

      uploadFile($scope.allFilesData, 0);
      rteService.getCurrentVisitor(config.visitorId, function (visitors) {
        if (visitors.docs.length == 0) {
          let visitorData = {
            name: $scope.visitor.name,
            email: $scope.visitor.email,
            department: $scope.selectedDep.id,
            departmentName: $scope.selectedDep.name,
            chatStatus: $scope.chatStatus,
            operator: [],
            operator_id: [],
            viewingPage: "",
            browser: detectBrowser(),
            os: getOS(),
            country: countryName,
            countryCode: countryCode,
            connectedOn: moment.utc().format(),
            visitor_id: config.visitorId, // Visitor id store in cookie need to chat with visitor and operator
            visitorIp: session.visitor_ip,
            conversationId: 0,
            visitorId: 0,
            invited_operatorId: [],
            invited_operator: [],
            updatedOn: Date.now(),
            currentPage: config.currentPage,
          };

          var bodyFormData = new FormData();
          bodyFormData.append("name", visitorData["name"]);
          bodyFormData.append("email", visitorData["email"]);
          bodyFormData.append("department", visitorData["department"]);
          bodyFormData.append("browser", visitorData["browser"]);
          bodyFormData.append("os", visitorData["os"]);
          bodyFormData.append("visitor_ip", visitorData["visitorIp"]);
          bodyFormData.append("user_agent", $scope.userAgent);
          bodyFormData.append("country", visitorData["country"]);
          bodyFormData.append("country_code", visitorData["countryCode"]);
          bodyFormData.append("customer_id", customerId);
          $scope.chatBtnNameDisable = true;
          if ($scope.countryCode == "hu") {
            $scope.n_chatBtnName = "Csevegés indítása";
          } else {
            $scope.n_chatBtnName = "Starting chat";
          }

          axios({
            method: "post",
            url: "/chat/start_conversation/",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          }).then(function (response) {
            if (response.data.code == 1) {
              visitorData.conversationId = response.data.data.conversation_id;
              visitorData.visitorId = response.data.data.visitor_id;
              $scope.setVisitorData(visitorData);
              rteService.addVisitor(visitorData);
              if (client_msg) {
                sentChatMSg(client_msg, config);
              }
              // setCurrentPage();
            }
          });

          visitorLastConnTime(config.visitorId, "visitor");
          setStorage("minimizeChatNotCount", 0);
        } else {
          if (client_msg) {
            sentChatMSg(client_msg, config);
          }
        }
      });
    };

    function sentChatMSg(client_msg, config) {
      let msg = {
        name: $scope.currentVisitor.name,
        text: client_msg,
        sender: "client",
        message_at: moment.utc().format(),
        message_type: "text",
        entityType: 6, //this is static for operator this is 5 and for visitor this is 6 constant.cs
        customerId: "",
        utcTime: moment.utc().format("hh:mm A"),
        currentPage: config.currentPage,
        message_sent: Date.now(),
      };

      $scope.$apply(function () {
        if ($scope.currentVisitor != undefined) {
          $scope.opFullName = $scope.currentVisitor["operator"].join(", ");
        }
      });
      msg.message_at_local_time = moment(moment.utc().format())
        .local()
        .format("hh:mm A");
      var msgFromPrevSender = msgFromPreviousSender(msg);
      if (msgFromPrevSender) {
        msg["isSenderSameAsPrevious"] = true;
      }
      if (msg["message_type"] == "text") {
        var msgIsLink = linkify(msg["text"]);
        if (msgIsLink.includes("_blank")) {
          msg["orgMsg"] = msg["text"];
          msg["text"] = msgIsLink;
          msg["message_type"] = "link";
          if (msg.sender == "client") {
            msg["text"] = msgIsLink.replaceAll(
              'target="_blank"',
              'target="_blank" class="msgClient"'
            );
          }
        }
      }
      $scope.messages.push(msg);
      $scope.$apply(function () {
        $scope.messages;
        $scope.chatNotes = "";
      });
      scrollToBottom();
      if (isOneOnline == true) {
        $scope.chatDisplay = "started";
      }

      rteService.sendChatMsg(msg, {
        visitorMsgDocId: config.visitorId,
      });

      msg["visitorId"] = $scope.currentVisitor.visitorId;
      msg["conversationId"] = $scope.currentVisitor.conversationId;
      msg["fullName"] = $scope.currentVisitor.name;

      var bodyFormData = new FormData();
      bodyFormData.append("msgData", JSON.stringify(msg));
      axios({
        method: "post",
        url: "/chat/save_msg_to_db/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {});

      setChatCount(client_msg);
      if ($scope.currentVisitor.chatStatus != "Attended") {
        // setNotificationToNotifierApp(client_msg)
        sendNotificationToGroup($scope.currentVisitor.name + ": " + client_msg);
        setChatCountRedis();
      }
      $scope.chatNotes = "";
    }

    sendNotificationToGroup = function (client_msg) {
      var bodyFormData = new FormData();
      bodyFormData.append("msg", client_msg);
      bodyFormData.append("email", $scope.currentVisitor.email);
      axios({
        method: "post",
        url: "/chat/send_group_notification/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {
        if (response.data.code == 0) {
          showErrorMsg(response.data.msg);
          return false;
        }
      });
    };

    function setNotificationToNotifierApp(client_msg) {
      let notMsg = {
        name: $scope.currentVisitor.name,
        text: client_msg,
        sender: "client",
        message_at: moment.utc().format(),
        country: session.country_short,
      };
      rteService.addNotificationMsg(notMsg);
    }

    function setChatCount(client_msg) {
      rteService.getMissedChatCount(
        [config.visitorId],
        function (chatsCountData) {
          if (chatsCountData.docs.length == 0) {
            $scope.unreadChatCount = 1;
          }
          chatsCountData.forEach((chatCountData) => {
            chatData = chatCountData.data();
            $scope.unreadChatCount = chatData.unreadChatCount + 1;
          });
          // $scope.unreadChatCount += 1;
          updateInfo = {
            unreadChatCount: $scope.unreadChatCount,
            lastChat: client_msg,
            visitor_id: config.visitorId,
            updatedOn: moment.utc().format(),
            newVis: false,
          };
          if (
            !$scope.newVis &&
            $scope.visitor.name &&
            $scope.unreadChatCount == 1
          ) {
            updateInfo["newVis"] = true;
          }
          rteService.setVisitorChatCount(updateInfo);
        }
      );
    }

    window.addEventListener(
      "message",
      function (e) {
        if (e.data == "scrollWidgetChat") {
          setTimeout(function () {
            scrollToBottom();
          }, 100);
        }
      },
      false
    );

    const scrollToBottom = () => {
      const theElement = document.getElementById("currentChat");
      theElement.scrollTop = theElement.scrollHeight + 100;
    };

    function setChatCountRedis() {
      var bodyFormData = new FormData();
      bodyFormData.append("visitor_id", $scope.currentVisitor.visitor_id);
      bodyFormData.append("missed_count", $scope.unreadChatCount);
      axios({
        method: "post",
        url: "/chat/set_msg_count_redis/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {});
    }

    $(document).ready(function () {
      $("#name").keyup(function (e) {
        if (
          $("#name").val().trim().length === 0 ||
          $("#name").val().trim().length < 2 ||
          $("#name")
            .val()
            .match(/[a-zA-Z\d]/g) === null
        ) {
          if ($scope.countryCode == "hu") {
            $("#errorMsg").html("Kérjük valós nevet adjon meg!").show();
          } else {
            $("#errorMsg").html("Please enter a valid name.").show();
          }
          return false;
        } else {
          $("#errorMsg").hide();
        }
      });
    });

    $scope.onStartChatClick = function (e) {
      if (
        $("#name").val().trim().length === 0 ||
        $("#name").val().trim().length < 2 ||
        $("#name")
          .val()
          .match(/[a-zA-Z\d]/g) === null
      ) {
        return false;
      } else {
        $("#errorMsg").hide();
        $scope.visitor.name = $scope.visitor.name.trim();
        console.log("start chat comment");
        $scope.chatDisplay = "started";
      }
    };

    $scope.onLiveChatClick = function () {
      if ($scope.currentVisitor != undefined) {
        $scope.chatDisplay = "started";
        return;
      }
      $scope.chatDisplay = "notStarted";
    };

    $scope.onOfflineMsgClick = function () {
      $scope.chatDisplay = "offline";
    };

    $scope.chatDisplay = "offline";
    rteService.getOperators(
      // this function will enable disable chat button on the basis of country visitble
      function (operators) {
        isOneOnline = false;
        counter = 0;

        if (operators.docs.length == 0) {
          $scope.chatDisplay = "offline";
        }

        $scope.countries = [];
        var isGlobal = false;
        $scope.$apply(function () {
          $scope.liveChat = false;
        });
        operators.forEach((item) => {
          operator = item.data();
          counter++;

          if (isGlobal == true) {
            return;
          }
          if (operator.login_status == "online") {
            for (country of operator.chat_country.split(",")) {
              country = country.toLowerCase();
              if (country == "" || country == null || country == undefined) {
                isGlobal = true;
                break;
              }
              if ($scope.countries.includes(country) == false) {
                $scope.countries.push(country);
              }
            }
          }

          if (
            operator.login_status == "online" &&
            operator.chat_country != "-1" &&
            $scope.countries.includes(countryCode.toLowerCase()) == true
          ) {
            isOneOnline = true;
          }

          if (
            $scope.countries.includes(countryCode.toLowerCase()) == true ||
            ($scope.countries.length != 0 && countryCode == "-") ||
            isGlobal == true
          ) {
            $scope.$apply(function () {
              $scope.liveChat = true;
              $scope.onLiveChatClick();
            });
          }

          if (
            counter == operators.docs.length &&
            isOneOnline == false &&
            $scope.liveChat != true
          ) {
            $scope.$apply(function () {
              $scope.chatDisplay = "offline";
            });
          }
        });
      }
    );

    msgFromPreviousSender = function (msg) {
      if (msg["message_type"] == "notifyVisitor") {
        $scope.previousSenderName = undefined;
        $scope.previousSender = undefined;
        return;
      }

      if ($scope.previousSender == msg["sender"]) {
        if (
          msg["sender"] == "operator" &&
          $scope.previousSenderName != msg["fullName"]
        ) {
          $scope.previousSender = msg["sender"];
          $scope.previousSenderName = msg["fullName"];
          return false;
        }
        $scope.previousSender = msg["sender"];
        $scope.previousSenderName = msg["fullName"];
        return true;
      }
      $scope.previousSenderName = msg["fullName"];
      $scope.previousSender = msg["sender"];
    };

    $scope.isFileValid = true;
    $scope.isFileSizeValid = true;
    $scope.invalidExtensions = [
      "ade",
      "adp",
      "bat",
      "chm",
      "cmd",
      "com",
      "cpl",
      "exe",
      "hta",
      "ins",
      "isp",
      "jse",
      "lib",
      "lnk",
      "mde",
      "msc",
      "msp",
      "mst",
      "scr",
      "pif",
      "sct",
      "shb",
      "sys",
      "vb",
      "vbe",
      "vbs",
      "vxd",
      "wsc",
      "wsf",
      "wsh",
    ];

    $scope.onUploadFile = function (e) {
      $scope.$apply(function () {
        $scope.callbackMsg = "";
        $scope.callbackCode = 1;
      });
      var file = e.files[0];

      var fileExtension = file.name.split(".");
      fileExtension = fileExtension[fileExtension.length - 1];
      if ($scope.invalidExtensions.includes(fileExtension) == true) {
        var invalid_file_hu_en = "Invalid file.";
        if ($scope.countryCode == "hu") {
          var invalid_file_hu_en = "Érvénytelen fájl.";
        }
        $scope.$apply(function () {
          $scope.callbackMsg = invalid_file_hu_en;
          $scope.callbackCode = 0;
        });
        return false;
      }
      if (file.size / (1000 * 1024) > 10) {
        $scope.$apply(function () {
          $scope.callbackMsg = "Maximum 10MB file size allowed.";
          $scope.callbackCode = 0;
        });
        return false;
      }
      $scope.uploadedFile = e.files[0];
    };

    $scope.saveChatOffline = function (event) {
      if ($scope.callbackCode == 0) {
        return false;
      }
      if ($scope.visitor.phoneNum == undefined) {
        $scope.visitor.phoneNum = "";
      }

      var bodyFormData = new FormData();
      bodyFormData.append("userName", $scope.visitor.name);
      bodyFormData.append("email", $scope.visitor.email);
      bodyFormData.append("contactNumber", $scope.visitor.phoneNum);
      bodyFormData.append("offlineMessage", $scope.offlineMessage);
      bodyFormData.append("userAgent", window.navigator.userAgent);
      bodyFormData.append("customerId", customerId);
      bodyFormData.append("countryCode", countryCode);
      bodyFormData.append("countryName", countryName);
      bodyFormData.append("userFile", $scope.uploadedFile);
      axios({
        method: "post",
        url: "/chat/save_offline_mail/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {
        if (response.data.code == 1) {
          $scope.visitor.name = null;
          $scope.visitor.email = null;
          $scope.visitor.phoneNum = null;
          $scope.offlineMessage = null;
          $("#id_file_upload_name").text("");
          $(".id_no_file_chosen").show();
          document.getElementById("fileUpd").value = null;
          $scope.uploadedFile = null;
        }
        var response_msg = response.data.msg;
        if (response_msg === "Message sent" && $scope.countryCode == "hu") {
          var response_msg = "Üzenet elküldve";
        }
        $scope.$apply(function () {
          $scope.callbackCode = response.data.code;
          $scope.callbackMsg = response_msg;
        });
        $scope.callbackCode = null;
        setTimeout(function () {
          $scope.$apply(function () {
            $scope.callbackMsg = null;
          });
        }, 5000);
      });
    };

    $scope.downloadAttachment = function (e, msg) {
      attachments = [];
      var bodyFormData = new FormData();
      attachments.push({ path: msg.orgImgUrl, filename: msg.attachment_name });
      bodyFormData.append("attachments", JSON.stringify(attachments));
      axios({
        method: "post",
        url: "/chat/download_attachment/",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      }).then(function (response) {
        url = window.URL.createObjectURL(new Blob([response.data]));
        link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", msg.attachment_name);
        document.body.appendChild(link);
        link.click();
      });
    };

    // To read messages of particular visitor
    // $scope.messages = [];

    var inputs = document.querySelectorAll(".upload-file");
    $(".id_no_file_chosen").show();

    Array.prototype.forEach.call(inputs, function (input) {
      input.addEventListener("change", function (e) {
        $(".id_no_file_chosen").hide();
        $("#id_file_upload_name").text(e.target.files[0].name);
      });
    });

    rteService.getMessages(
      function (res_messages) {
        $scope.$apply(function () {
          if ($scope.currentVisitor != undefined) {
            $scope.opFullName = $scope.currentVisitor["operator"].join(", ");
          }
        });
        res_messages.forEach((message) => {
          $scope.$apply(function () {
            msgItem = message.data();
            msgItem.message_at_local = msgItem.message_at;
            msgItem.message_at = moment(msgItem.message_at)
              .local()
              .format("hh:mm A");

            var msgFromPrevSender = msgFromPreviousSender(msgItem);
            if (msgFromPrevSender) {
              msgItem["isSenderSameAsPrevious"] = true;
            }
            if (msgItem["message_type"] == "text") {
              var msgIsLink = linkify(msgItem["text"]);
              if (msgIsLink.includes("_blank")) {
                msgItem["orgMsg"] = msgItem["text"];
                msgItem["text"] = msgIsLink;
                msgItem["message_type"] = "link";
                if (msgItem.sender == "client") {
                  msgItem["text"] = msgIsLink.replaceAll(
                    'target="_blank"',
                    'target="_blank" class="msgClient"'
                  );
                }
              }
            }
            $scope.messages.push(msgItem);
            if (isOneOnline == true) {
              $scope.chatDisplay = "started";
            }
          });
        });
      },
      {
        visitorMsgDocId: config.visitorId,
      }
    );

    rteService.onMessageReceive(
      function (res_messages) {
        res_messages.forEach((message) => {
          msgItem = message.data();
          var is_avila_list = $scope.messages.find(
            (fobj) => fobj.message_sent === msgItem.message_sent
          );

          var msg_avila = $scope.messages.indexOf(is_avila_list);

          if (msg_avila != -1) {
            return;
          }

          if (msgItem.message_type == "ban") {
            window.xprops.unload();
            return;
          }

          if (!isPageLoad) {
            $scope.$apply(function () {
              msgItem.message_at_local = msgItem.message_at;
              msgItem.message_at = moment(msgItem.message_at)
                .local()
                .format("hh:mm A");
              var msgFromPrevSender = msgFromPreviousSender(msgItem);
              if (msgFromPrevSender) {
                msgItem["isSenderSameAsPrevious"] = true;
              }
              if (msgItem["message_type"] == "text") {
                var msgIsLink = linkify(msgItem["text"]);
                if (msgIsLink.includes("_blank")) {
                  msgItem["orgMsg"] = msgItem["text"];
                  msgItem["text"] = msgIsLink;
                  msgItem["message_type"] = "link";
                  if (msgItem.sender == "client") {
                    msgItem["text"] = msgIsLink.replaceAll(
                      'target="_blank"',
                      'target="_blank" class="msgClient"'
                    );
                  }
                }
              }
              $scope.messages.push(msgItem);
              // $scope.chatDisplay = "started";
            });
            scrollToBottom();
          }
        });
        isPageLoad = false;
      },
      {
        visitorMsgDocId: config.visitorId,
      }
    );
  });
  return widget;
}

// widgetInit();
