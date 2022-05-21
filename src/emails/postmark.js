var postmark = require("postmark");
var client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);

const welcomeEmail = (email, name, token) => {
    client.sendEmail({
        "From": "bsem-f18-136@superior.edu.pk",
        "To": email,
        "Subject": "Welcome toCipher",
        "HtmlBody": "Hello from zeros! <br/> this is your token: " +token+ " <br/> Also check Docs. <br/> Thank you",
        "MessageStream": "welcome-tocipher"
      })
}

const lastEmail = (email, name) => {
    client.sendEmail({
        "From": "bsem-f18-136@superior.edu.pk",
        "To": email,
        "Subject": "Bye from us",
        "HtmlBody": `<strong>Hello</strong> dear ${name}!`,
        "TextBody": "goodbye from us!",
        "MessageStream": "last-email"
      })
}

module.exports = {
    welcomeEmail,
    lastEmail
}