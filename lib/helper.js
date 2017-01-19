var nodemailer = require('nodemailer');

exports.sendEmailTo = function(recipientEmail, mailSubject, mailContent) {

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: process.env.CI_NOTIFIER_EMAIL, // sender address
        to: recipientEmail, // list of receivers
        subject: mailSubject, // Subject line
        text: mailContent
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};
