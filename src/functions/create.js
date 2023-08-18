'use strict';

const uuid = require('uuid')
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = {
    dynamoDb: dynamoDb,
    createContact: async (event, callback) => {
        const timestamp = new Date().getTime();
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
                createdAt: timestamp,
                updatedAt: timestamp,
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
};