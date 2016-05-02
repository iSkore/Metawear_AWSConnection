'use strict';
console.log('Loading function');

let AWS = require( 'aws-sdk' );
let dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = (event, context, callback) => {
    
    let params = {
        TableName : 'school_meta',
        Item : {
            log_hash : 0,
            ts_range : getNow( -4 ),
            orientation : event.orientation
        }
    };
    
    dynamo.put(event, callback);
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
