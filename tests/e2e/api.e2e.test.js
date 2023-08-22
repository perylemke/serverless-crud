const { default: axios } = require('axios')
const path = require('path');
const dotenv = require('dotenv');
const chai = require('chai');
const expect = chai.expect;

const envPath = path.resolve(__dirname, '../../.awsenv');
dotenv.config({ path: envPath });

axios.defaults.baseURL = `https://${process.env.httpApiGatewayEndpointId}.execute-api.${process.env.region}.amazonaws.com`

describe('Test a happy path', () => {
    it('create a contact, returns a 200 and validate fields', async () => {
        const payload = {
            name: "e2e Test",
            email: "e2e@test.com"
        };

        const res = await axios.post('/api/v1/contacts', payload);

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property('id')
        expect(res.data).to.have.property('email')
        expect(res.data.email).to.equal("e2e@test.com")
        expect(res.data).to.have.property('name')
        expect(res.data.name).to.equal("e2e Test")
    })

    it('get all contacts and returns a 200', async () => {
        const res = await axios.get('/api/v1/contacts');

        expect(res.status).to.equal(200);
    })


    it('get one contact and returns a 200', async () => {
        const contacts = await axios.get('/api/v1/contacts');
        const id = contacts.data[0].id
        const res = await axios.get('/api/v1/contacts' + '/' + id)

        expect(res.status).to.equal(200);
    })

    it('update a name and email, returns 200 and validate fields', async () => {
        const payload = {
            name: "Old e2e Test",
            email: "old_e2e@test.com"
        };

        const contacts = await axios.get('/api/v1/contacts');
        const id = contacts.data[0].id
        const res = await axios.put('/api/v1/contacts' + '/' + id, payload)

        expect(res.status).to.equal(200);
        expect(res.data).to.have.property('id')
        expect(res.data).to.have.property('email')
        expect(res.data.email).to.equal("old_e2e@test.com")
        expect(res.data).to.have.property('name')
        expect(res.data.name).to.equal("Old e2e Test")
    })

    it('delete a user and returns 200', async () => {      
        const contacts = await axios.get('/api/v1/contacts');
        const id = contacts.data[0].id
        const res = await axios.delete('/api/v1/contacts' + '/' + id)

        expect(res.status).to.equal(200);
    })
})