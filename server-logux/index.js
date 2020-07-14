"use strict";
exports.__esModule = true;
var server_1 = require("@logux/server");
var path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
var server = new server_1.Server(server_1.Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
}));
server.auth(function (auth) {
    // Allow only local users until we will have a proper authentication
    return process.env.NODE_ENV === 'development';
});
server.type('ADD_TODO', {
    access: function (ctx, action, meta) {
        return true;
    },
    resend: function (ctx, action, meta) {
        // Resend this action to everyone who subscribed to this user
        return { channel: "GLOBAL_TEST" };
    },
    process: function (ctx, action, meta) {
        console.log("PROCESS ADD_TODO");
    },
    "finally": function (ctx, action, meta) {
        console.log("FINALLY ADD_TODO");
    }
});
server.otherType({
    access: function (ctx, action, meta) {
        return true;
    },
    resend: function (ctx, action, meta) {
        // Resend this action to everyone who subscribed to this channel
        return { channel: "GLOBAL_TEST" };
    },
    process: function (ctx, action, meta) {
        // do some processing for all expicitly unhandled action
    },
    "finally": function (ctx, action, meta) {
        // finalization logic for all explictly unhandled actions
    }
});
server.listen();
