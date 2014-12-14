var Attendee = {
  attributes: {
    appointment: { model: 'Appointment', required: true},
    user: { model: 'User', required: true },
    confirmed: { type: 'boolean', defaultsTo: false }
  }
}

module.exports = Attendee;
