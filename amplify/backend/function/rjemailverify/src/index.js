/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require("aws-sdk");
const SES = new AWS.SES();

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const email = event.queryStringParameters.email;

  const identities = await SES.listIdentities().promise();
  const data = await SES.listVerifiedEmailAddresses().promise();

  const requestSent = identities.Identities.includes(email);
  const verifiedEmails = data.VerifiedEmailAddresses;
  const isVerified = verifiedEmails.includes(email);

  if (!(isVerified || requestSent)) {
    await SES.verifyEmailIdentity({ EmailAddress: email }).promise();
    console.log(`Verification email sent to ${email}`);
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify({ isVerified, requestSent }),
  };
};
