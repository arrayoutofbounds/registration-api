import AWS from "aws-sdk";
import nodemailer from 'nodemailer';

export function call(item) {
    const ses = new AWS.SES({apiVersion: '2010-12-01', region: 'us-west-2'});

    const message = `
        <h1> Jai Swaminarayan </h1>

        <p> BAPS is glad to present ${item.firstName} ${item.lastName} with an invitation to the 2019 kids diwali festival <p>
        <p> Please see the attached qr code belo. Each attendee is given a unique code. Please bring it with you child to ensure entry.</p>
        <p> Your time slot is ${item.timeSlot === "10-1" ? "10am - 1pm" : "1pm - 4pm"} </p>
        <p> Jai Swaminarayan </p>`;

    const mailOptions = {
        from: "anmoldesai4@gmail.com",
        subject: "BAPS Kids Diwali Festival 2019!",
        html: message,
        to: item.email,
        attachments: [
            {   // encoded string as an attachment
              filename: 'qr.png',
              content: item.dataUrl.split("base64,")[1],
              encoding: 'base64'
            }
          ]
    };

    // create Nodemailer SES transporter
    var transporter = nodemailer.createTransport({
        SES: ses
    });

    // send email
    return transporter.sendMail(mailOptions);
  }