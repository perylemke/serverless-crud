'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.tableName;

const updateContact = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Request invalid.'
            })
        }
    }
    const req = JSON.parse(event.body);
    if (typeof req.email !== 'string' || typeof req.name !== 'string') {
        console.error('Validation failed');
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Couldn\'t update the contact. Any field with type invalid.'
            })
        };
    }

    const id = event.pathParameters.id;
    const getContactParams = {
        TableName: TABLE_NAME,
        Key: {
            id
        },
    };

    try {
        const existingContact = await dynamoDb.get(getContactParams).promise();
        if (!existingContact.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Contact not found'
                })
            };
        }

        const updateParams = {
            TableName: TABLE_NAME,
            Key: {
                id
            },
            UpdateExpression: 'set #name = :name, #email = :email',
            ExpressionAttributeValues: {
                ':name': req.name,
                ':email': req.email,
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#email': 'email',
            },
            ReturnValues: 'ALL_NEW',
        };

        const res = await dynamoDb.update(updateParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(res.Attributes),
        };
    } catch (error) {
        console.error('Error updating item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error updating item'
            }),
        };
    }
};

module.exports = {
    updateContact
}