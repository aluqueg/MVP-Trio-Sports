const nodemailer = require("nodemailer");
require ('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "alexmakigo@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (email, name,token) => {
  let mensajeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>BIENVENIDO ${name}</h1>
  http://localhost:5173/validation/${token}
</body>
</html>`;
  
  const info = transporter.sendMail({
    from: '"trio" <alexmakigo@gmail.com>',
    to: email,
    subject: "bienvenido a trio",
    html: mensajeHtml
  })
  info
      .then(res=>console.log(res))
      .catch(err=>console.log(err))

};

module.exports = sendMail