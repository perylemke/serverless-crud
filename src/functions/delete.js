'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const deleteContact = async (event) => {
    const id = event.pathParameters.id;
    const params = {
        TableName: 'contacts',
        Key: {
            id
        },
    };

    try {
        const existingContact = await dynamoDb.get(params).promise();
        if (!existingContact.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'Contact not found'
                })
            };
        }

        const result = await dynamoDb.delete(params).promise();
        console.log('Item deleted sucessefully:', result)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Item deleted sucessefully'
            })
        };
    } catch (error) {
        console.error('Error deleting item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error deleting item'
            })
        };
    }
};

module.exports = {
    deleteContact
}