exports.createEvent = function(options) {
  var addEventBody = {
    'status':'confirmed',
    'summary': request.body.contact.firstName + ' ' + request.body.contact.lastName,
    'description': request.body.contact.phone + '\n' + request.body.contact.details,
    'organizer': {
      'email': googleUserId,
      'self': true
    },
    'start': {
      'dateTime': request.body.startdate,
    },
    'end': {
      'dateTime': request.body.enddate
    },
    'attendees': [
        {
          'email': googleUserId,
          'organizer': true,
          'self': true,
          'responseStatus': 'needsAction'
        },
        {
          'email': request.body.contact.email,
        'organizer': false,
        'responseStatus': 'needsAction'
        }
    ]
  };

  var addGoogleEvent = function(accessToken){
    //instantiate google calendar instance
    var google_calendar = new gcal.GoogleCalendar(accessToken);
    google_calendar.events.insert(googleUserId, addEventBody, function(addEventError, addEventResponse){
      console.log('GOOGLE RESPONSE:', addEventError, addEventResponse);

      if(!addEventError)
        response.send(200, addEventResponse);

      response.send(400, addEventError);
    });
  };

  //retrieve current access token
  getAccessToken().then(function(accessToken){
    addGoogleEvent(accessToken);
  }, function(error){
    //TODO: handle error
  });
}
