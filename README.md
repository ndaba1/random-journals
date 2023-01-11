## Random Journals

A simple app that sends users anonymous Random Journal entries from other registered users.

> Live demo: https://random-journals.vndaba.rocks

## Architecture

The app is built using the following technologies:

- [React](https://reactjs.org/)
- [AWS AppSync](https://aws.amazon.com/appsync/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS Cognito](https://aws.amazon.com/cognito/)
- [AWS S3](https://aws.amazon.com/s3/)
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)
- [AWS SES](https://aws.amazon.com/ses/)
- [Amplify](https://aws.amazon.com/amplify/)

Amplify is used to abstract and manage the AWS resources and to deploy the app.

## User flow

Users are required to register an account before proceeding. Once an account is registered, you will also receive an email from AWS on first login asking you for "Email Address Verification". By clicking on the provided link, user are essentially allowing the Random Journals app to send emails into the account. This is required since Amazon SES cannot send emails to unverified identities whilst in a Sandbox environment.

Once logged in, a user can then create a new entry which will be stored in DynamoDB and accessed via AppSync, all which are managed by Amplify. After creating an entry, the user is guaranteed to receive a random entry in their Inbox, daily at 12PM. This is achieved via the lambda function that can be found [here](amplify/backend/function/rjlambda/src/index.js). It is scheduled to run daily at 12PM via CloudWatch with the help of Amplify and custom cron expressions. The lambda function will then send an email to the user via SES.
