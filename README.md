# nestjs-typescript-challenge

> This challenge-project uses Nest.js to implement three resources (agents, customers and orders) with their respective CRUD endpoints. It also includes pagination when we need to list orders and three special endpoints of orders when we only need the total amount of money grouped by customers, agents, or by countries. This endpoints are protected, so, to consume them, you need to register yourself to get a valid JWT. 

**Your task** is to build an [RBAC system](https://en.wikipedia.org/wiki/Role-based_access_control) adding the following roles: 
1. `admin` - has access to all endpoints
2. `agent` - has access to all endpoints except the ones related to customers
3. `customer` - has access to all endpoints except the ones related to agents
4. `guest` - has access only to the endpoints to register and login

**Additionally**:
1. Create a method to assign roles to users and protect the endpoints according to the roles.
2. Update the documentation to include the new endpoints and the new roles.
3. Add unit and integration tests to cover the new features.
4. Add a CI/CD pipeline to run the tests and deploy the application in AWS Lambda. [Example article](https://mayankgupta1338.medium.com/automate-aws-lambda-deployment-using-github-actions-for-nodejs-typescript-applications-4b75c7c17e02).
5. Add CloudWatch event metrics to monitor the application usage. [Example article](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph_a_metric.html).
---

The already implemented endpoints of the resources are:

-  /api/agents
-  /api/customers
-  /api/orders

To register or to login:

-  /api/auth/register
-  /api/auth/login

The documentation (swagger) can be found at:

-  /api/docs

## Table of Contents

- [nestjs-typescript-challenge](#nestjs-typescript-challenge)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Tests](#running-tests)
  - [Serverless](#serverless)

## Prerequisites

- [nodejs version 18](https://nodejs.org/en/)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`JWT_SECRET`

`DB_HOST`
`DB_PORT`
`DB_USER`
`DB_PASS`
`DB_DATABASE`

And if we want to use docker-compose we have to add:

`MYSQL_ROOT_PASSWORD`
`MYSQL_USER`
`MYSQL_PASSWORD`
`MYSQL_DATABASE`

## Installation

Clone the project

```bash
git clone https://github.com/CaioF/nestjs-typescript-challenge
```

Go to the project directory

```bash
cd nestjs-typescript-challenge
npm install
```

To start the server

```bash
npm run start
```

And if we use docker-compose, instead of the last command, we use

```bash
docker-compose up
```

## Running Tests

To run tests, run the following command

```bash
npm run test     		// Unit Tests
npm run test:e2e 		// Integration Tests
```

## Serverless

To deploy, run the following commands:

```bash
npm run build
```

