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
    getAccessToken(user_id, function(accesstoken,email){
      var google_calendar = new gcal.GoogleCalendar(accesstoken);
      var eow = new Date();
      eow.setDate(eow.getDate() + 7);
      google_calendar.events.list(email, {'timeMin': new Date().toISOString(), 'timeMax': eow.toISOString()}, function(err, eventList){
        var events = [];
        eventList = JSONParse(eventList);
        for (var i = 0; i < eventList.items.length; i++) {
          var item = eventList.items[i];
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
        res.view({events: events,user_id: user_id, username: email});
      });
    });
  },
  create: function(req,res) {
    //
  }
};

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


module.exports = AppointmentController;
