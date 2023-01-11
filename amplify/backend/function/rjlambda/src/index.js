/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	AUTH_RANDOMJOURNALS02B1611C_USERPOOLID
	API_RANDOMJOURNALS_GRAPHQLAPIIDOUTPUT
	API_RANDOMJOURNALS_GRAPHQLAPIENDPOINTOUTPUT
	API_RANDOMJOURNALS_GRAPHQLAPIKEYOUTPUT
	API_RANDOMJOURNALS_ENTRYTABLE_NAME
	API_RANDOMJOURNALS_ENTRYTABLE_ARN
	SES_SENDER
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

  // get all emails
  let emails = [];

  // in case where author has multiple entries
  for (const e of entries) {
    if (!emails.includes(e.author)) emails.push(e.author);
  }

  // store sent entries
  const sentEntries = [];

  for (const e of emails) {
    // sort entries to order entries that have not been sent yet first
    const sortedEntries = entries.sort((a, b) => {
      const aSent = sentEntries.find((entry) => entry.id === a.id);
      const bSent = sentEntries.find((entry) => entry.id === b.id);

      if (aSent && bSent) return 0; // both entries have been sent before
      if (aSent) return 1; // a has been sent before, a should be sorted after b
      if (bSent) return -1; // b has been sent before, b should be sorted after a
      return 0;
    });
    // find first entry not created by current email
    const entry = sortedEntries.find((entry) => entry.author !== e);
    // send email
    const subject = "Today's Random Journal";
    const text = `Greetings! Here's your Random Journal for today: ${entry.content}`;
    const html = `<p>Greetings!</p><p>Here's your Random Journal for today:</p><p>${entry.content}</p>`;
    await sendMail(e, subject, text, html);
    // add entry to sent entries
    sentEntries.push(entry);
  }

  console.log(`ENTRIES: ${body.data.listEntries.items}`);

  return {
    statusCode,
    body: "completed successfully",
  };
};

async function sendMail(to, subject, text, html) {
  const Params = {
    Source: `Random Journals <${process.env.SES_SENDER}>`,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
        Text: {
          Charset: "UTF-8",
          Data: text,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };

  const AWS = require("aws-sdk");
  const ses = new AWS.SES({ region: process.env.REGION });

  await ses.sendEmail(Params).promise();
}
