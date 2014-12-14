// EmailService.js - in api/services
exports.sendInviteEmail = function(options) {

    var opts = {"type":"messages","call":"send","message":
        {
            "subject": "YourIn!",
            "from_email": "info@balderdash.co",
            "from_name": "AmazingStartupApp",
            "to":[
                {"email": options.email, "name": options.name}
            ],
            "text": "Dear "+options.name+",\nYou're in the Beta! Click <insert link> to verify your account"
        }
    };

    myEmailSendingLibrary.send(opts);
};

// Somewhere in a conroller
// EmailService.sendInviteEmail({email: 'test@test.com', name: 'test'});
