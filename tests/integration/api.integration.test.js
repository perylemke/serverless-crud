const { default: axios } = require('axios')
const path = require('path');
const dotenv = require('dotenv');
const chai = require('chai');
const expect = chai.expect;

const envPath = path.resolve(__dirname, '../../.awsenv');
dotenv.config({ path: envPath });

axios.defaults.baseURL = `https://${process.env.httpApiGatewayEndpointId}.execute-api.${process.env.region}.amazonaws.com`

describe('createContact function', () => {
    it('should respond with statusCode 200 to correct request', async () => {
        // GIVEN
        const payload = {
            name: "Integration Test",
            email: "email@test.com"
        }

        // WHEN
        const res = await axios.post('/api/v1/contacts', payload);

        // THEN
        expect(res.status).to.equal(200);
    })

    it('should respond with Bad Request failed 400 to incorrect request', async () => {
        // GIVEN
        const wrongPayload = {}
    
        // WHEN
        let actual
        try {
          await axios.post('/api/v1/contacts', wrongPayload)
        } catch (e) {
          actual = e.response
        }
    
        // THEN
        expect(actual.status).to.equal(400)
        expect(actual.statusText).to.equal('Bad Request')
      })
})