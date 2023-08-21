const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const AWS = require('aws-sdk');

const update = require('../src/functions/update'); // Substitua pelo caminho correto

chai.use(sinonChai);
const expect = chai.expect;

describe('updateContact', () => {
    let sandbox;
    let updateStub;
    let getStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        updateStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'update');
        getStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should update a contact', async () => {
        const event = {
            pathParameters: { id: '1' },
            body: JSON.stringify({ name: 'New Name', email: 'new@example.com' })
        };

        getStub.returns({
            promise: sandbox.stub().resolves({
                Item: { id: '1', name: 'Old Name', email: 'old@example.com' }
            })
        });

        updateStub.returns({
            promise: sandbox.stub().resolves({
                Attributes: { id: '1', name: 'New Name', email: 'new@example.com' }
            })
        });

        const result = await update.updateContact(event);

        expect(result.statusCode).to.equal(200);
        expect(updateStub).to.have.been.calledOnce;
        expect(getStub).to.have.been.calledOnce;
    });

    it('should handle invalid request', async () => {
        const event = {
            pathParameters: { id: '1' },
            body: null // Simulate invalid request
        };

        const result = await update.updateContact(event);

        expect(result.statusCode).to.equal(400);
    });
});
