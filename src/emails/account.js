const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to:email,
        from:'zlai005@e.ntu.edu.sg',
        subject:"thanks for joining in",
        text:`Welcome to the app, ${name}`
    })
}
const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from :"zlai005@e.ntu.edu.sg",
        subject: `take care, ${name}`,
        text:`your account has been successfully removed.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}