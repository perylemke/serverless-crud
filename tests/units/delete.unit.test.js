const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const AWS = require('aws-sdk');

const deleteFunc = require('../../src/functions/delete'); // Substitua pelo caminho correto

chai.use(sinonChai);
const expect = chai.expect;

describe('deleteContact', () => {
    let sandbox;
    let deleteStub;
    let getStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        deleteStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete');
        getStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should delete a contact', async () => {
        const event = {
            pathParameters: { id: '1' }
        };

        getStub.returns({
            promise: sandbox.stub().resolves({
                Item: { id: '1', name: 'John Doe', email: 'john@example.com' }
            })
        });

        deleteStub.returns({
            promise: sandbox.stub().resolves({})
        });

        const result = await deleteFunc.deleteContact(event)

        expect(result.statusCode).to.equal(200);
        expect(deleteStub).to.have.been.calledOnce;
        expect(getStub).to.have.been.calledOnce;
    });

    it('should handle contact not found', async () => {
        const event = {
            pathParameters: { id: '123' }
        };

        getStub.returns({
            promise: sandbox.stub().resolves({})
        });

        const result = await deleteFunc.deleteContact(event);

        expect(result.statusCode).to.equal(404);
        expect(getStub).to.have.been.calledOnce;
    });
});
