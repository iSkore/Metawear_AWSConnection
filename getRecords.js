'use strict';
console.log('Loading function');

const
    AWS = require( 'aws-sdk' ),
    dynamo = new AWS.DynamoDB();

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = ( event, context, callback ) => {
    const
        operation = 'list';
    
    event.payload = {
                        TableName : 'school_meta',
                        KeyConditionExpression: '#n0 = :v0 AND ts_range BETWEEN :v1 AND :v2',
                        ExpressionAttributeNames : {
                            '#n0' : 'log_hash'
                        },
                        ExpressionAttributeValues : {
                            ':v0': { N : '0' },
                            ':v1': { N : ''+getNow( -5 ) },
                            ':v2': { N : ''+getNow( -4 ) }
                        }
                    };

    switch (operation) {
        case 'create':
            dynamo.putItem(event.payload, callback);
            break;
        case 'read':
            dynamo.getItem(event.payload, callback);
            break;
        case 'update':
            dynamo.updateItem(event.payload, callback);
            break;
        case 'delete':
            dynamo.deleteItem(event.payload, callback);
            break;
        case 'list':
            //dynamo.scan(event.payload, callback);
            dynamo.query(event.payload, callback);
            //callback(null, event.payload);
            break;
        case 'echo':
            callback(null, event.payload);
            break;
        case 'ping':
            callback(null, 'pong');
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};

function getNow ( nh ) {
    let date = new Date(),
        y = date.getFullYear(),
        mo = date.getMonth() + 1,
        d  = date.getDate(),
        h = date.getHours() + nh,
        m  = date.getMinutes(),
        s  = date.getSeconds();

    date.setDate(date.getDate());
    mo = (mo < 10 ? '0' : '') +  mo;
    d = (d < 10 ? '0' : '') + d;
    h = (h < 10 ? '0' : '') + h;
    m = (m < 10 ? '0' : '') + m;
    s = (s < 10 ? '0' : '') + s;

    return y + mo + d + h + m + s;
}
