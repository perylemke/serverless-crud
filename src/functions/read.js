'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({ region: 'us-east-1' });

const getAllContacts = async (event) => {
    try {
        const res = await dynamoDb.scan({
            TableName: 'contacts'
        }).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(res.Items)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching contracts'
            })
        }
    }
}

const getContactById = async (event) => {
    const id = event.pathParameters.id;
    try {
        const res = await dynamoDb.get({
            TableName: 'contacts',
            Key: {
                id
            }
        }).promise();

        if (!res.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Contact not found'
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(res.Item)
        };
    } catch (error) {
        console.log('error', error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching contact:'
            })
        }
    }
}

module.exports = {
    getAllContacts,
    getContactById
}