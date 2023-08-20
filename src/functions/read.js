'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAllContacts = async () => {
    try {
        const res = await dynamoDb.scan({
            TableName: 'contacts'
        }).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(res.Items)
        };
    } catch (error) {
        console.error('Error fetching contact:', error)
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
            console.error('Contact not found')
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
        console.error('Error fetching contact:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching contact'
            })
        }
    }
}

module.exports = {
    getAllContacts,
    getContactById
}