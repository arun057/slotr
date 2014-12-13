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
      google_calendar.events.list(email, {'timeMin': new Date().toISOString()}, function(err, eventList){
        console.log(eventList);
        res.render('appointment/index',{events: eventList,user_id: user_id, username: email});
      });
    });
  }
};

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
