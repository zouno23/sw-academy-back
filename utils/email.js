const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",

  auth: {
    user: "b6a8f08655fe2e",
    pass: "6fdedf449bfb04",
  },
});

const sendEmail = (email, code) => {
  const mailOptions = {
    from: "sabbaghsaifeddin@gmail.com",
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `
          <h1>Réinitialisation du mot de passe</h1>
          <p>code de verification:</p>
          <h2>${code}</h2>
        `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email envoyé avec succès ", code);
    }
  });
};
module.exports = { sendEmail };
