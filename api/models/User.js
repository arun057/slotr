var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    role      : { type: 'string', defaultsTo: 'user' } // meh, its okay for now [applicant, employee, admin]
  }
};

module.exports = User;
