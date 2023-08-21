'use strict';

const uuid = require('uuid')
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.tableName;

// createContact function
const createContact = async (event) => {
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
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Couldn\'t create the contact.'
            })
        };
    }
    const params = {
        TableName: TABLE_NAME,
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
        console.error(error)
        return {
            error: error
        }
    }
}

module.exports = {
    dynamoDb: dynamoDb,
    createContact
};