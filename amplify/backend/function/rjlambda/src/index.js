/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	AUTH_RANDOMJOURNALS78312FA1_USERPOOLID
	API_RANDOMJOURNALS_GRAPHQLAPIIDOUTPUT
	API_RANDOMJOURNALS_GRAPHQLAPIENDPOINTOUTPUT
	API_RANDOMJOURNALS_GRAPHQLAPIKEYOUTPUT
	API_RANDOMJOURNALS_ENTRYTABLE_NAME
	API_RANDOMJOURNALS_ENTRYTABLE_ARN
	SES_SENDER
	SENDGRID_API_KEY
Amplify Params - DO NOT EDIT */

// @ts-check
const { Request, default: fetch } = require("node-fetch");

const GRAPHQL_ENDPOINT =
  process.env.API_RANDOMJOURNALS_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_RANDOMJOURNALS_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
  query LIST_ENTRIES {
    listEntries {
      items {
        id
        author
        content
        createdAt
      }
    }
  }
`;

// Date.now() - 24hrs should be >= createdAt of the entry
// fetch all entries created in the last 24 hours
const variables = {
  filter: {
    createdAt: {
      ge: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  },
};

/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  /** @type {import('node-fetch').RequestInit} */
  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack,
        },
      ],
    };
  }

  const entries = body.data.listEntries.items;
  const emails = entries.map((entry) => entry.author);

  emails.forEach((e) => {
    // shuffle entries to guarantee randomness
    const shuffledEntries = entries.sort(() => 0.5 - Math.random());
    // find entry not created by current email
    const entry = shuffledEntries.find((entry) => entry.author !== e);
    // send email
    const subject = "Today's Random Journal";
    const text = `Greetings! Here's your Random Journal for today: ${entry.content}`;
    const html = `<p>Greetings!</p><p>Here's your Random Journal for today:</p><p>${entry.content}</p>`;
    sendMail(e, subject, text, html);
  });

  console.log(`RESPONSE: ${body}`);

  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

function sendMail(to, subject, text, html) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to, // Change to your recipient
    from: process.env.SES_SENDER,
    subject,
    text,
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
