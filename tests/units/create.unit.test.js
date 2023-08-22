const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const AWS = require('aws-sdk');

const create = require('../../src/functions/create'); // Substitua pelo caminho correto para o seu arquivo

chai.use(sinonChai);
const expect = chai.expect;

describe('createContact', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create a new contact', async () => {
        const putStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'put').returns({
            promise: sandbox.stub().resolves()
        });

        const event = {
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com'
            }),
        };

        const result = await create.createContact(event);
        expect(result.statusCode).to.equal(200);
        expect(putStub).to.have.been.calledOnce;
    });

    it('should handle validation failure', async () => {
        const event = {
            body: null // Simulating missing body
        };

        const result = await create.createContact(event);

        expect(result.statusCode).to.equal(400);
        expect(result.body).to.deep.equal(JSON.stringify({
            message: 'Validation failed'
        }));
    });

    it('should handle validation type', async () => {
        const event = {
            body: JSON.stringify({
                name: 1,
                email: 'john@example.com'
            }),
        };

        const result = await create.createContact(event);
        expect(result.statusCode).to.equal(400);
        expect(result.body).to.deep.equal(JSON.stringify({
            message: 'Couldn\'t create the contact.'
        }));
    });
});
