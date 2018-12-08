var _React = React,Component = _React.Component;var _ReactRedux =
ReactRedux,connect = _ReactRedux.connect,Provider = _ReactRedux.Provider;var _Redux =
Redux,combineReducers = _Redux.combineReducers,createStore = _Redux.createStore;var _ReactRouter =
ReactRouter,Route = _ReactRouter.Route,Router = _ReactRouter.Router,Link = _ReactRouter.Link,browserHistory = _ReactRouter.browserHistory;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var _ReduxThunk = ReduxThunk;






/****************** Dummy Data *******************/






var contacts = [
{ userID: "2", userName: "Academic Chat Bot" }
];


var defaultChat1 = {
  chatID: "13",
  thread: [
  //   {
  //   text: "yo",
  //   from: "1" },
  // {
  //   text: "yo yo yo yo?",
  //   from: "1" },
  // {
  //   text: "yyyyooooooooooo",
  //   from: "2" },
  // {
  //   text: "yo?",
  //   from: "2" }
  ],

  participants: "2" };


// var defaultChat2 = {
//   chatID: "14",
//   thread: [{
//     text: "dude are you ingoring me?",
//     from: "4" }],

//   participants: "4" };


var defaultUser = {
  userID: "1",
  activeChat: defaultChat1,
  userChats: [defaultChat1],
  userName: "Academic Bot",
  location: "CS Department (MAJU)",
  thumbnail: "https://i.imgur.com/knTvGej.jpg",
  contacts: contacts,
  status: "online",
  statusUpdates: [
  "Truth can only be found in one place: the code.",
  "First, solve the problem. Then, write the code.",] };










/****************** Redux Stuff *******************/








// --------- action types --------- 

var SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT",
START_CHAT = "START_CHAT",
END_CHAT = "END_CHAT",
SUBMIT_MESSAGE = "SUBMIT_MESSAGE",
UPDATE_FILTER = "UPDATE_FILTER",
RESPONSE_MESSAGE = "RESPONSE_MESSAGE",
SET_THEME = "SET_THEME";

// --------- reducers --------- 

// user account reducer
var user = function user() {var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultUser;var action = arguments[1];var

  activeChat =



  user.activeChat,userChats = user.userChats,userID = user.userID,contacts = user.contacts;

  switch (action.type) {
    case SET_ACTIVE_CHAT:
      if (action.participants === activeChat.participants) {
        return user;
      } else {
        return Object.assign({}, user, {
          activeChat: userChats.filter(function (c) {return (
              c.participants === action.participants);})[
          0] });

      }
    case SUBMIT_MESSAGE:
      return Object.assign({}, user, {
        userChats: userChats.map(function (c) {
          if (c.chatID === action.chatID) {
            return Object.assign({}, c, {
              thread: c.thread.concat({
                text: action.text,
                from: userID }) });


          } else {return c;}
        }) });

     case RESPONSE_MESSAGE:
        return Object.assign({}, user, {
          userChats: userChats.map(function (c) {
                // console.log(222)
              return Object.assign({}, c, {
                thread: c.thread.concat({
                  text: action.text,
                  from: 2 }) });
  
  
           
          }) });

    case START_CHAT:
      return Object.assign({}, user, {
        userChats: userChats.concat({
          chatID: action.chatID,
          thread: [],
          participants: action.participants }) });


    case END_CHAT:
      var aP = activeChat.participants;

      // if only one chat is open, simply return empty containers
      if (userChats.length === 1) {
        return Object.assign({}, user, {
          activeChat: {},
          userChats: [] });

      }
      // if ending current active chat, re-assign active chat then end target chat
      if (action.participants === aP) {

        var newActive = userChats.filter(function (c) {return (
            c.participants !== aP);})[
        0].participants;

        return Object.assign({}, user, {
          activeChat: userChats.filter(function (c) {return (
              c.participants === newActive);})[
          0],
          userChats: userChats.filter(function (c) {return (
              c.participants !== action.participants);}) });


      }
      // end target chat
      return Object.assign({}, user, {
        userChats: userChats.filter(function (c) {return (
            c.participants !== action.participants);}) });


    default:
      return user;}

};

//contacts page reducer
var contactsPage = function contactsPage()




{var contactsPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { filterString: "" };var action = arguments[1];
  switch (action.type) {
    case UPDATE_FILTER:
      return Object.assign({}, contactsPage, {
        filterString: action.filterString });

    default:
      return contactsPage;}

};

//settings reducer
var settings = function settings() {var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { theme: "green" };var action = arguments[1];
  switch (action.type) {
    case SET_THEME:
      return Object.assign({}, settings, {
        theme: action.theme });

    default:
      return settings;}

};

var appReducer = combineReducers({
  user: user,
  contactsPage: contactsPage,
  settings: settings });


// --------- store --------- 

var store = createStore(appReducer,_Redux.applyMiddleware(_ReduxThunk));

// --------- action creators --------- 

var setActiveChat = function setActiveChat(contactID) {return {
    type: SET_ACTIVE_CHAT,
    participants: contactID };};


var submitMessage = function submitMessage(text, chatID) {
  store.dispatch(sp(
    text,
    chatID));
  store.dispatch(responseMessage(
    text,
              chatID));
 
  
  };

  function sp(text,chatID){
    return {
      type: SUBMIT_MESSAGE,
      text: text,
      chatID: chatID };
  }
	
	

  var responseMessage = function responseMessage(text) {
   
    var accessToken = "a80089bdbf4e468180984f342866711c";
	  var baseUrl = "https://api.api.ai/v1/";	
    // return (dispatch, getState) => {
      

	// $.ajax({
	// 	type: "POST",
	// 	url: baseUrl + "query?v=20150910",
	// 	contentType: "application/json; charset=utf-8",
	// 	dataType: "json",
	// 	headers: {
	// 		"Authorization": "Bearer " + accessToken
	// 	},
	// 	data: JSON.stringify({ query: text, lang: "en", sessionId :Math.random() }),
	// 	success: function(data) {
	// 		setResponse(JSON.stringify(data, undefined, 2));
	// 	},
	// 	error: function() {
	// 		setResponse("Internal Server Error");
	// 	}
	// });
    store.dispatch(fetch(baseUrl + "query?v=20150910", {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: text, lang: "en", sessionId :Math.random() })
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
         
            // const state = getState();
            // use some data from state
           
            store.dispatch(mapResponse(json));
            
            // $(".active-chat").animate({ scrollTop: $(".user-message").last().offset().top}, 1000);
           
        
          
        });
      }
    }));;

  
  // };
    
    };


var mapResponse = function mapResponse(val){
  
    //$("#response").text(val);
    // console.log(val['result']);
	// val = JSON.parse(response);
	//insertChat("you", val);	
	//insertChat("you", val['result']['fulfillment']['messages'][0]['speech']);	
	
	if(val['result']['fulfillment']['messages'][0]['speech'])
		{
    // insertChat("you", val['result']['fulfillment']['messages'][0]['speech']); 
    return {
      type: RESPONSE_MESSAGE,
      text: val['result']['fulfillment']['messages'][0]['speech']
    };	
    // console.log(23)
		
		}
	if(val['result']['fulfillment']['speech'])
		{
    // insertChat("you", val.result.fulfillment.speech); 
    // console.log(24)
    return {
      type: RESPONSE_MESSAGE,
      text: val.result.fulfillment.speech};
		}
  
}

var startChat = function startChat(participants) {
  var id = "" + new Date().getTime();
  return {
    type: START_CHAT,
    participants: participants,
    chatID: id };

};

var endChat = function endChat(participants) {return {
    type: END_CHAT,
    participants: participants };};


var updateFilter = function updateFilter(filterString) {return {
    type: UPDATE_FILTER,
    filterString: filterString };};


var setTheme = function setTheme(theme) {
  console.log(theme);
  return {
    type: SET_THEME,
    theme: theme };

};




/****************** presentational components *******************/







// --------- contacts page --------- 

var Contacts = function Contacts(_ref)





{var activeChat = _ref.activeChat,contacts = _ref.contacts,userChats = _ref.userChats,filterString = _ref.filterString,dispatch = _ref.dispatch;
  var input = void 0;

  // all chats
  var chatters = userChats.reduce(function (prev, next) {
    prev.push(next.participants);
    return prev;
  }, []);

  // check if user is chatting with contact
  var chatting = function chatting(c) {return (
      chatters.indexOf(c.userID) !== -1);};


  // contact sort function
  var compare = function compare(a, b) {
    if (a.userName < b.userName) {return -1;}
    if (a.userName > b.userName) {return 1;}
    return 0;
  };

  // search bar filter cb 
  var searchFilter = function searchFilter(c) {
    if (filterString.length < 1) {return true;}
    return (
      c.userName.
      slice(0, filterString.length).
      toLowerCase() ===
      filterString.toLowerCase());

  };

  return (
    React.createElement("div", { className: "contact-search-wrapper" },
      React.createElement("span", { className: "search-icon" },
        React.createElement("i", {
          className: "fa fa-search",
          "aria-hidden": "true" })),


      React.createElement("textarea", {
        className: "contact-search",
        placeholder: "search...",
        rows: 10,
        cols: 30,
        ref: function ref(node) {input = node;},
        onKeyUp: function onKeyUp(e) {
          dispatch(updateFilter(input.value));
        } }),

      React.createElement("ul", { className: "contact-list" },
        contacts.
        filter(searchFilter).
        sort(compare).
        map(function (c) {return (
            React.createElement("li", null,
              React.createElement("div", { className: chatting(c) ?
                  "contact-thumbnail" :
                  "contact-thumbnail flat" }, " ",
                c.userName.slice(0, 1)),

              React.createElement("i", { className: chatting(c) ?
                "fa fa-spinner fa-spin chatting" :
                "hide",
                "aria-hidden": "true" }),

              React.createElement("button", {
                  className: "contact-name",
                  onClick:
                  chatting(c) ?
                  function () {dispatch(endChat(c.userID));} :
                  function () {dispatch(startChat(c.userID));} }, " ",
                c.userName,
                React.createElement("i", { className: chatting(c) ?
                  "hide" :
                  "fa fa-plus",
                  "aria-hidden": "true" }),

                React.createElement("i", { className: chatting(c) ?
                  "fa fa-minus" :
                  "hide",
                  "aria-hidden": "true" }))));}))));







};
var mapContactsStateToProps = function mapContactsStateToProps(state) {return {
    activeChat: state.user.activeChat,
    contacts: state.user.contacts,
    userChats: state.user.userChats,
    filterString: state.contactsPage.filterString };};

var mapContactsDispatchToProps = function mapContactsDispatchToProps() {return {
    startChat: startChat };};

var connectedContacts = connect(
mapContactsStateToProps)(
Contacts);


// --------- home page --------- 

var Home = function Home(_ref2) {var user = _ref2.user;var

  activeChat =



  user.activeChat,userChats = user.userChats,userID = user.userID,contacts = user.contacts;

  var input = void 0;

  // chat header name
  var activeName = contacts.filter(function (c) {return (
      c.userID === activeChat.participants);})[
  0];

  // message if no active chat
  activeName = activeName === undefined ?
  "You're not chatting with anyone!" :
  activeName.userName;

  // chat thread
  var thread = userChats.filter(function (c) {return (
      c.chatID === activeChat.chatID);})[
  0];

  // empty thread if no active chat
  thread = thread === undefined ? [] : thread.thread;

  // all chats
  var chatters = userChats.reduce(function (prev, next) {
    prev.push(next.participants);
    return prev;
  }, []);

  return (
    React.createElement("div", null,
      React.createElement("div", { className: "user-chats" },
        React.createElement("ul", null,
          contacts.filter(function (c) {return (
              chatters.indexOf(c.userID) !== -1);}).
          map(function (c) {return (
              React.createElement("li", { onClick: function onClick() {return (
                      store.dispatch(setActiveChat(c.userID)));} }, " ",

                React.createElement("div", {
                    className:
                    activeChat.participants === c.userID ?
                    "active-thumb contact-thumbnail" :
                    "contact-thumbnail not-active-thumb" }, " ",
                  c.userName.slice(0, 1))));}))),





      React.createElement("div", { className: "active-chat" },
        React.createElement("div", { className: "active-name" }, activeName),
        React.createElement("ul", null,
          thread.map(function (message, i) {return (
              React.createElement("div", {
                  className: message.from === userID ?
                  "user-message" :
                  "contact-message" },

                React.createElement("div", { className: "thread-thumbnail" },
                  React.createElement("span", null,
                    contacts.filter(function (c) {return (
                        c.userID === message.from);}).
                    map(function (c) {return c.userName.slice(0, 1);}))),


                React.createElement("li", { className: i > 0 ?
                    thread[i - 1].from === message.from ?
                    "group" :
                    "" :
                    "" }, " ",
                  message.text)));}))),





      React.createElement("form", {
          onSubmit: function onSubmit(e) {
            e.preventDefault();
            if (!input.value.trim()) {return;}
            var text = input.value;
            input.value = '';
            store.dispatch(submitMessage(
              text,
            activeChat.chatID));
            // store.dispatch(responseMessage(
            //   input.value,
            //   activeChat.chatID));

            
          } },

        React.createElement("textarea", {
          className: "message-input",
          onKeyPress:this._handleKeyPress,
          placeholder: "message",
          rows: 10,
          cols: 30,
          ref: function ref(node) {input = node;} }),

        React.createElement("button", {
            className: "send-button",
            type: "submit" },

          React.createElement("i", { className: "fa fa-chevron-right",
            "aria-hidden": "true" })))));





};

var _handleKeyPress = function _handleKeyPress(){
  if (event.charCode == 13) {
    event.preventDefault();
    event.stopPropagation();
    $('.send-button').trigger('click');
    $(".active-chat").animate({ scrollTop: $(".user-message").last().position().top+($(".user-message").length*300)}, 1000);
   
    // $(".active-chat").animate({ scrollTop: $(".active-chat").height() }, 1000);
  }
}
var mapHomeStateToProps = function mapHomeStateToProps(state) {return {
    user: state.user };};

var connectedHome = connect(
mapHomeStateToProps)(
Home);


// --------- profile page --------- 

var Profile = function Profile(_ref3) {var user = _ref3.user;return (
    React.createElement("div", null,
      React.createElement(ContactCard, {
        thumbnail: user.thumbnail,
        userName: user.userName,
        location: user.location,
        status: user.status }),

      React.createElement(StatusFeed, {
        statusUpdates: user.statusUpdates })));};



var mapProfileStateToProps = function mapProfileStateToProps(state) {return {
    user: state.user };};

var connectedProfile = connect(
mapProfileStateToProps)(
Profile);

var ContactCard = function ContactCard(_ref4) {var
  thumbnail = _ref4.thumbnail,
  userName = _ref4.userName,
  location = _ref4.location,
  status = _ref4.status;return (

    React.createElement("div", { className: "contact-card" },
      React.createElement("div", { className: "profile-pic" },
        React.createElement("img", { src: thumbnail })),

      React.createElement("div", { className: "name-location" },
        React.createElement("h1", null, userName),
        React.createElement("hr", null),
        React.createElement("p", null, location)),

      // React.createElement(CardButtons, null),
      React.createElement(Status, { status: status })));};



var Status = function Status(_ref5) {var status = _ref5.status;return (
    React.createElement("div", { className: "online-status" },
      React.createElement("span", null,
        React.createElement("i", { className: "fa fa-lightbulb-o",
          "aria-hidden": "true" })),


      React.createElement("span", null, status)));};



var CardButtons = function CardButtons() {return (
    React.createElement("div", { className: "card-buttons" },
      React.createElement("button", null,
        React.createElement("i", { className: "fa fa-user-plus",
          "aria-hidden": "true" })),


      React.createElement("button", null,
        React.createElement("i", { className: "fa fa-comments",
          "aria-hidden": "true" })),


      React.createElement("button", null,
        React.createElement("i", { className: "fa fa-thumbs-up",
          "aria-hidden": "true" }))));};





var StatusFeed = function StatusFeed(_ref6) {var statusUpdates = _ref6.statusUpdates;return (
    React.createElement("div", { className: "status-feed" },
      React.createElement("h1", null, "Currently"),
      React.createElement("ul", null,
        statusUpdates.map(function (c) {return (
            React.createElement(Update, { updateContent: c }));}))));};





var Update = function Update(_ref7) {var updateContent = _ref7.updateContent;return (
    React.createElement("li", null,
      React.createElement("hr", null),
      React.createElement("p", null, "\"", updateContent, "\""),
      React.createElement("br", null),
      React.createElement("span", { className: "date" }, new Date().toString())));};



// --------- settings page --------- 

var Settings = function Settings() {return (
    React.createElement("div", { className: "settings" },
      React.createElement("div", { className: "settings-header" }, "Display Settings"),
      React.createElement("div", { className: "themes-header" },
        React.createElement("span", null, "Choose a theme:")),

      React.createElement("div", { className: "themes-wrapper" },
        React.createElement(ThemeButton, { color: "red" }),
        React.createElement(ThemeButton, { color: "orange" }),
        React.createElement(ThemeButton, { color: "black" }),
        React.createElement(ThemeButton, { color: "yellow" }),
        React.createElement(ThemeButton, { color: "green" }),
        React.createElement(ThemeButton, { color: "blue" }),
        React.createElement(ThemeButton, { color: "purple" }))));};




// --------- Theme Selector Button ---------

var ThemeButton = function ThemeButton(_ref8) {var color = _ref8.color;return (
    React.createElement("button", {
      className: "theme-button " + color,
      onClick: function onClick() {store.dispatch(setTheme(color));} }));};



// --------- menu bar --------- 

var Menu = function Menu() {return (
    React.createElement("div", { className: "menu" },
      React.createElement("ul", { className: "menu-items" },
        // React.createElement("li", null,
        //   React.createElement(Link, {
        //       to: "/contacts",
        //       className: "link",
        //       activeClassName: "active-link" },

        //     React.createElement("i", { className: "fa fa-users",
        //       "aria-hidden": "true" }))),



        // React.createElement("li", null,
        //   React.createElement(Link, {
        //       to: "/chats",
        //       className: "link",
        //       activeClassName: "active-link" },

        //     React.createElement("i", { className: "fa fa-home",
        //       "aria-hidden": "true" }))),



  



        React.createElement("li", null,
          React.createElement(Link, {
              to: "/profile",
              className: "link",
              activeClassName: "active-link" },

            React.createElement("i", { className: "fa fa-eye",
              "aria-hidden": "true" }))),

              React.createElement("li", null,
              React.createElement("button", null,
            React.createElement(Link, {
              to: "/chats",
              className: "link",
              activeClassName: "active-link" },
                React.createElement("i", { className: "fa fa-home",
                  "aria-hidden": "true" })))),

        React.createElement("li", null,
          React.createElement(Link, {
              to: "/settings",
              className: "link",
              activeClassName: "active-link" },

            React.createElement("i", { className: "fa fa-sliders",
              "aria-hidden": "true" }))))));};








//  --------- index.js --------- 

var App = React.createClass({ displayName: "App",
  render: function render() {
    // set home to default route initially
    var content = this.props.children ?
    this.props.children :
    React.createElement(Home, { user: this.props.user });

    return (
      React.createElement("div", { className: "app-wrapper " + this.props.theme },
        content,
        React.createElement(Menu, null)));


  } });

var mapAppStateToProps = function mapAppStateToProps(state) {return {
    user: state.user,
    theme: state.settings.theme };};

var connectedApp = connect(
mapAppStateToProps)(
App);







/****************** Router, Redux Provider, And Render *******************/






var Root = function Root() {return (
    React.createElement(Provider, { store: store },
      React.createElement(Router, null,
        React.createElement(Route, { path: "/", component: connectedApp },
          React.createElement(Route, { path: "chats", component: connectedHome }),
          React.createElement(Route, { path: "profile", component: connectedProfile }),
          React.createElement(Route, { path: "settings", component: Settings }),
          React.createElement(Route, { path: "contacts", component: connectedContacts })))));};





ReactDOM.render(
React.createElement(Root, null),
document.getElementById("root"));