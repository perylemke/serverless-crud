'use strict';

const uuid = require('uuid')
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// createContact function
const createContact = async (event, callback) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Validation failed'
            })
        }
    }

    const req = JSON.parse(event.body);
    if (typeof req.email !== 'string' || typeof req.name !== 'string') {
        console.error('Validation failed');
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Couldn\'t create the contact.'
            })
        });
        return;
    }

    const params = {
        TableName: 'contacts',
        Item: {
            id: uuid.v4(),
            name: req.name,
            email: req.email,
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        }
    } catch (error) {
        return {
            error: error
        }
    }
}

module.exports = {
    dynamoDb: dynamoDb,
    createContact
};