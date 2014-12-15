var gcal = require('google-calendar');
exports.createEvent = function(options, callback) {
  var addEventBody = {
    status:'confirmed',
    summary: options.title,
    description: options.description,
    organizer: {
      'email': options.organizer.email,
      'self': true
    },
    start: {
      'dateTime': options.start
    },
    end: {
      'dateTime': options.end
    },
    attendees: [
        {
          'email': options.organizer.email,
          'organizer': true,
          'self': true,
          'responseStatus': 'needsAction'
        }
    ]
  };

  for (var i=0; i < options.attendees; i++) {
    addEventBody.attendees.push({
      'email' : options.attendees[i].email,
      'organizer' : false,
      'responseStatus' : 'needsAction'
    });
  }

  var google_calendar = new gcal.GoogleCalendar(options.accessToken);
  google_calendar.events.insert(options.organizer.email, addEventBody, callback);
}
