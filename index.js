var thunkify = require('thunkify');
var crypto = require('crypto');

var randomBytes = thunkify(crypto.randomBytes);
var pbkdf2      = thunkify(crypto.pbkdf2);

module.exports = auth;

var _MODULE_DEFAULTS = {
	encoding:        'base64'
	, iterations:    100000
	, output_length: 20
	, salt_length:   20
};
Object.freeze(_MODULE_DEFAULTS);

function auth (config) {
	if ( !(this instanceof auth) ) {
	//if ( this === global ) {
		//throw new Error('Constructor called without new');
		return new auth(config);
	}

	if ( config && config.constructor == Object ) {
		Object.setPrototypeOf(config, _MODULE_DEFAULTS);
		this.config = config;
	}
	else {
		this.config = Object.create(_MODULE_DEFAULTS);
	}

	return this;
}

auth.prototype.config = _MODULE_DEFAULTS;

auth.prototype.generateSaltedHash = auth.generateSaltedHash = function * (password, salt) {
	var config;
	if ( !(config=this.config) ) {
		config = _MODULE_DEFAULTS
	}

	if ( password === undefined || password.constructor !== String ) {
		throw new Error("Function must invoked without a string 'password'");
	}

	if ( salt === undefined ) {
		salt = yield randomBytes(config.salt_length);
	}
	var hash = yield pbkdf2(
		password
		, salt
		, config.iterations
		, config.output_length
	);

	var m = new Map();
	m.set('hash',       hash.toString(config.encoding) );
	m.set('salt',       salt.toString(config.encoding) );
	m.set('iterations', config.iterations );

	return m;
};

auth.prototype.validatePassword = auth.validatePassword = function * (password, salt, hash_provided) {
	var config;
	if ( !(config=this.config) ) {
		config = _MODULE_DEFAULTS
	}

	if (
		( password === undefined || password.constructor !== String )
		|| salt === undefined
		|| hash_provided == undefined
	) {
		throw new Error("Function requires three arguments: string 'password', buffer 'salt', and buffer 'hash_provided'");
	}

	var _buffer_salt = new Buffer( salt, config.encoding );

	var m = yield this.generateSaltedHash( password, _buffer_salt );
	return constantEquals( m.get('hash'), hash_provided );
};


//
// Helper Functions
//

function constantEquals(x, y) {
	"use strict";
	var result = true,
	length = (x.length > y.length) ? x.length : y.length;

	for (let i=0; i<length; i++) {
		if (x.charCodeAt(i) !== y.charCodeAt(i)) {
			result = false;
		}
	}
	return result;
};
