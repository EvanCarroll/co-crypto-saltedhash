var assert = require('assert');
var auth = require('../index');

var co = require('co');

const PASSWORD = "☭p4ssw0rd☭";

co(function * (done) {
	"use strict";

	var salted_length_twenty;

	if (1) {
		let m1 = yield auth.generateSaltedHash( PASSWORD );
		assert.equal( m1.get('hash').length, 28, 'hash length' );
		assert.equal( m1.get('salt').length, 28, 'salt length' );
	
		let _v1 = yield auth.validatePassword(
			PASSWORD
			, m1.get('salt')
			, m1.get('hash')
		);
		assert.equal( _v1, true, 'salted hash validates' );

		salted_length_twenty = m1.get('salt').length;
	
		let _v2 = yield auth.validatePassword(
			"not the right pw"
			, m1.get('salt')
			, m1.get('hash')
		);
		assert.equal( _v2, false, 'salted hash validates' );

		console.log({  hash: m1.get('hash'), salt: m1.get('salt')  });
	}
	
	if (1) {
		let a = auth({'salt_length': 40});
		assert.equal( a.config.salt_length, 40 );
		let m1 = yield a.generateSaltedHash( PASSWORD );
		assert.equal( m1.get('hash').length, 28, 'hash length' );
		assert.equal( m1.get('salt').length, 56, 'salt length' );
	
		let _v1 = yield a.validatePassword(
			PASSWORD
			, m1.get('salt')
			, m1.get('hash')
		);
		assert.equal( _v1, true, 'salted hash validates' );
		assert.notEqual( salted_length_twenty, m1.get('salt').length );

		salted_length_twenty = m1.get('salt');
		
		console.log({  hash: m1.get('hash'), salt: m1.get('salt')  });
	}

	console.log('DONE...');

})();
