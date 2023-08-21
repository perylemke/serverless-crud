const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const AWS = require('aws-sdk');

const read = require('../src/functions/read')

chai.use(sinonChai);
const expect = chai.expect;

describe('Testing all read functions', () => {
    let sandbox;

    sinon.stub(console, "error")

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getAllContracts', () => {
        it('should return all contacts', async () => {
            const scanStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'scan').returns({
                promise: sandbox.stub().resolves({
                    Items: [
                        { id: '1', name: 'John Doe', email: 'john@example.com' },
                        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
                    ]
                })
            });

            const result = await read.getAllContacts();
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.not.be.undefined;
            expect(scanStub).to.have.been.calledOnce;
        });

        it('should handle error', async () => {
            const scanStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'scan').returns({
                promise: sandbox.stub().rejects(new Error('DynamoDB error'))
            });

            const result = await read.getAllContacts();

            expect(result.statusCode).to.equal(500);
            expect(result.body).to.not.be.undefined;
            expect(scanStub).to.have.been.calledOnce;
        });
    });

    describe('getContactById', () => {
        it('should return a contact by ID', async () => {
            const getStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
                promise: sandbox.stub().resolves({
                    Item: { id: '1', name: 'John Doe', email: 'john@example.com' }
                })
            });

            const event = {
                pathParameters: { id: '1' }
            };

            const result = await read.getContactById(event);

            expect(result.statusCode).to.equal(200);
            expect(result.body).to.not.be.undefined;
            expect(getStub).to.have.been.calledOnce;
        });

        it('should handle contact not found', async () => {
            const getStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
                promise: sandbox.stub().resolves({ Item: null })
            });

            const event = {
                pathParameters: { id: '123' }
            };

            const result = await read.getContactById(event);

            expect(result.statusCode).to.equal(404);
            expect(result.body).to.not.be.undefined;
            expect(getStub).to.have.been.calledOnce;
        });

        it('should handle error', async () => {
            const getStub = sandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
                promise: sandbox.stub().rejects(new Error('DynamoDB error'))
            });

            const event = {
                pathParameters: { id: '1' }
            };

            const result = await read.getContactById(event);

            expect(result.statusCode).to.equal(500);
            expect(result.body).to.not.be.undefined;
            expect(getStub).to.have.been.calledOnce;
        });
    });
});