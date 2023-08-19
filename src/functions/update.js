'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateContact = async (event) => {
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
                message: 'Couldn\'t update the contact. Any field with type invalid.'
            })
        });
        return;
    }

    const id = event.pathParameters.id;
    const params = {
        TableName: 'contacts',
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

    try {
        const res = await dynamoDb.update(params).promise();
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