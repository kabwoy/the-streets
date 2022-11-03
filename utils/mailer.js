const nodemailer = require("nodemailer")
async function mailer(msg , sender){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'davidmugwe19@gmail.com',
          pass: 'mhcggzrntatbwjny'
        }
      });

      var mailOptions = {
        from: sender,
        to: 'davidmugwe19@gmail.com',
        subject: 'Contact Shoot',
        text: msg
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}

module.exports = mailer