import AWS from "aws-sdk";
import nodemailer from 'nodemailer';

export function call(item) {
    const ses = new AWS.SES({apiVersion: '2010-12-01', region: 'us-west-2'});

    const message = `
        <p> Jai Swaminarayan!</p>

        <p> BAPS would like to cordially invite ${item.firstName} ${item.lastName} to the 2019 kids diwali festival on 27th October 2019 at the Rosehill race course!<p>
        <p> The day will be packed with fun activities, exhibition, diwali show, rides and food!</p>
        <p> Please see the attached QR code below. You can either show the embedded code or download and print off the attachment. Each attendee has a unique code. Please bring it with your to ensure entry.</p>
        <p> Your time slot is ${item.timeSlot === 1 ? "10am - 1pm" : "1pm - 4pm"}. Please come in designated slot.</p>
        <img src="cid:${item.id}"/>
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
              encoding: 'base64',
              cid: `${item.id}`,
            },
            {   // encoded string as an attachment
                filename: 'qr.png',
                content: item.dataUrl.split("base64,")[1],
                encoding: 'base64',
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