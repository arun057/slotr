/**
 * AppointmentController
 *
 * @description :: Server-side logic for managing appointments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var gcal = require('google-calendar');
var AppointmentController = {
  index: function(req,res) {
    // get access token
    var user_id = req.session.passport.user;
    getUser(user_id, function(error, user){
      res.view({user_id: user_id, username: user.email});
    });
  },
  events: function(req,res) {
    var user_id = req.session.passport.user;
    getAccessToken(user_id, function(accesstoken, email){
      var start = req.query.start;
      var end = req.query.end;
      var options = {
        'timeMin' : new Date(start).toISOString(),
        'timeMax' : new Date(end).toISOString()
      };
      getEvents(accesstoken, email, options, function(error, eventList){
        eventList = JSONParse(eventList);
        events = parseEvents(eventList.items);
        res.json(events);
      });
    });
  },
  create: function(req,res) {
    var user_id = req.session.passport.user;
    getUser(user_id, function(error, user){
      res.view({user_id: user_id, username: user.email});
    });
  },
  show: function(req,res) {
    var data = {};
    // show the appointment
    // check user type, render the view.
    var user_id = req.session.passport.user;
    getUser(user_id, function(err, user){
      // set view based on type of user
      var email = user.email;
      var type = user.role;
      data.username = email;
      data.user_id = user_id;
      switch(type) {
        case 'applicant':
          res.view('appointment/applicant',data)
          break;
        case 'employee':
          res.view('appointment/employee',data)
          break;
        case 'admin':
          res.view('appointment/admin',data)
          break;
      }
    });
  }
};

function getEvents(accesstoken, email, options, callback) {
  var google_calendar = new gcal.GoogleCalendar(accesstoken);
  google_calendar.events.list(email, options, callback);
}

function parseEvents(items) {
  var events = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    item = JSONParse(item);
    if (item.status == 'confirmed') {
      var event_item = {};
      event_item.title = item.summary;
      item.start = JSONParse(item.start);
      if (item.start.date) {
        // all day event
        event_item.allDay = true;
        event_item.start = item.start.date;
        event_item.end = JSONParse(item.end).date;
      } else {
        // timed event
        event_item.start = item.start.dateTime;
        event_item.end = JSONParse(item.end).dateTime;
      }
      // console.log(item.start);
      events.push(event_item);
    }
  }
  return events;
}

function JSONParse(data) {
  if (typeof(data) == 'string') return JSON.parse(data);
  return data;
}

function getAccessToken(user_id, callback) {
  User.findById(user_id).populate('passports').exec(function(err,r){
    var accessToken = false;
    if (r) {
      var user = r[0];
      var passports = user["passports"];
      for (var index in passports) {
        var passport = passports[index];
        if (passport.provider == "google") {
          accessToken = passport.tokens.accessToken;
          break;
        }
      }
    }
    callback(accessToken, user.email);
  });
}

function getUser(user_id, callback) {
  User.findById(user_id).exec(function(err,r){
    callback(err, r[0]);
  });
}


module.exports = AppointmentController;
