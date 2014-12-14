/**
* Appointment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Appointment = {
  attributes: {
    user: { model: 'User', required: true },
    start: { type: 'datetime' },
    end: { type: 'datetime' },
    title: { type: 'string' },
    status: { type: 'string', required: true, defaultsTo: 'suggested' },
    // status : suggested, accepted, confirmed
    attendees: { collection: 'Attendee', via: 'attendees'}
  }
};


module.exports = Appointment;
