/*
 1) Install Courier SDK: npm install @trycourier/courier
 2) Make sure you allow ES module imports: Add "type": "module" to package.json file 
 */
const {CourierClient} = require("@trycourier/courier");

const sendEmail = async (inputEmail, subject, inputText)=>{

  const courier = CourierClient(
    { authorizationToken: process.env.CourierClient_TOKEN});

  const { requestId } = await courier.send({
    message: {
      content: {
        title: subject,
        body: "{{text}}"
      },
      data: {
        text: inputText
      },
      to: {
        email: inputEmail
      }
    }
  });
};
  
module.exports = sendEmail;
