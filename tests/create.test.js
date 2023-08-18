const chai = require('chai');
const expect = chai.expect;
const createContactHandler = require('../src/functions/create');

describe('createContact', () => {
  it('must be create a new contact', async () => {
    const mockPutPromise = (params) => {
      expect(params.Item.name).to.equal('New Contact');
      expect(params.Item.email).to.equal('new@email.com');
      return {
        promise: () => Promise.resolve({})
      };
    };

    const event = {
      body: JSON.stringify({
        name: 'New Contact',
        email: 'new@email.com'
      })
    };

    const context = {};

    createContactHandler.dynamoDb.put = mockPutPromise;

    const result = await createContactHandler.createContact(event, context);

    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.a('string');
  });

  it('must be returns a error for a body missing', async () => {
    const event = {};
    const context = {};

    const result = await createContactHandler.createContact(event, context);

    expect(result.statusCode).to.equal(400);
    expect(result.body).to.be.a('string');
  });
});
