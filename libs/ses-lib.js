var AWS = require('aws-sdk');

export function call(item) {
    const ses = new AWS.SES({apiVersion: '2010-12-01', region: 'us-west-2'});

    const message = `
        <h1> Hello ${item.firstName} </h1>
        <p> BAPS is glad to present you with an invitation to the 2019 kids diwali festivel <p>
        <p> Please see the attached qr code below </p>

        <p> Jai Swaminarayan </p>
    `

    const mailOptions = {
        from: "anmoldesai4@gmail.com",
        subject: "BAPS Kids Diwali Festival 2019!",
        html: message,
        to: "adpilot10@gmail.com",
    };

    // create Nodemailer SES transporter
    var transporter = nodemailer.createTransport({
        SES: ses
    });

    // send email
    return transporter.sendMail(mailOptions);
  }
  