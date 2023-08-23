# Serverless CRUD

A simple CRUD on the Contact List to store name and email for a contacts.

### Considerations

It's my first real project on NodeJS with Serverless Framework and it's a continues improvement it's necessary to get a better application.

### Tech Stack

- NodeJS
- DynamoDB
- Serverless Framework
- aws-sdk
- uuid
- aws-sdk-mock
- mocha
- chai
- axios
- dotenv
- sinon
- sinon-chai
- serverless-iam-roles-per-function
- serverless-export-env
- serverless-prune-plugin

### API endpoints

- `GET /api/v1/contacts`: Get all contacts on the DB;
- `GET /api/v1/contacts/{id}`: Get specific contact on the DB;
- `POST /api/v1/contacts`: Create a contact;
- `PUT /api/v1/contacts/{id}`: Update a contact;
- `DELETE /api/v1/contacts/{id}`: Delete a contact.

### Manual deploy

- Clone our repo
```bash
$ git clone git@github.com:perylemke/serverless-crud.git 
```
- Install Serverless Framework and the dependencies
```bash
$ npm install -g serverless
$ npm install
```
- Export your AWS keys:
```bash
export AWS_ACCESS_KEY_ID=YOURKEYHERE
export AWS_SECRET_ACCESS_KEY=YOURSECRETHERE
```
- Execute deploy command:
```bash
$ sls deploy --stage YOUR_STAGE
```

### Execute requests through cURL
```bash
# createContacts
$ curl -X POST https://{httpApiGatewayEndpointId}.execute-api.us-east-1.amazonaws.com/api/v1/contacts -H "Content-Type: application/json" -d '{"name": "Example cURL", "email": "example@test.com"}'

# readAllContacts
$ curl https://{httpApiGatewayEndpointId}.execute-api.us-east-1.amazonaws.com/api/v1/contacts

# readContactById
$ curl https://{httpApiGatewayEndpointId}.execute-api.us-east-1.amazonaws.com/api/v1/contacts/bb7afab0-9d86-48fb-bc93-132a84416898

# updateContact
$ curl -X POST https://{httpApiGatewayEndpointId}.execute-api.us-east-1.amazonaws.com/api/v1/contacts/bb7afab0-9d86-48fb-bc93-132a84416898 -H "Content-Type: application/json" -d '{"name": "Example cURL", "email": "newemail@test.com"}'

# deleteContact
$ curl -X DELETE https://{httpApiGatewayEndpointId}.execute-api.us-east-1.amazonaws.com/api/v1/contacts/bb7afab0-9d86-48fb-bc93-132a84416898
```

### CI/CD Process

I choose Github Actions to do the process of CI/CD. Above is the pipelines:
```yaml
name: serverless-deploy-dev

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Running Unit tests
        run: |
          chmod +x scripts/unit_tests.sh
          ./scripts/unit_tests.sh

      - name: Deploy on AWS to running integration and e2e tests
        uses: serverless/github-action@v3.2
        with:
          args: deploy --stage test
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Running Integration tests
        run: |
          chmod +x scripts/integrations_tests.sh
          ./scripts/integrations_tests.sh
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Running e2e tests
        run: |
          chmod +x scripts/e2e_tests.sh
          ./scripts/e2e_tests.sh
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Destroy test environment after integration and e2e tests
        uses: serverless/github-action@v3.2
        with:
          args: remove --stage test
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Deploy on AWS in Dev environment
        uses: serverless/github-action@v3.2
        with:
          args: deploy --stage dev
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
```yml
name: serverless-deploy-production

on:
  push:
    tags:
      - '*'

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Instaling dependencies
        run: npm ci

      - name: Deploy on AWS in Production
        uses: serverless/github-action@v3.2
        with:
          args: deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

```

The test suite running on the dev (`main` branch) pipeline and deploy on production is activated a do a push on `git tag`.

### Running local tests

```bash
$ npm test
```