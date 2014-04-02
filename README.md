co-crypto-saltedhash
====================

DESCRIPTION
-----------

A simple module to generate salted hashes.

Configure it with a constructor or run it with static defaults.

SYNOPSIS
--------

```javascript

	// most basic syntax
	var auth = require('co-crypto-saltedhash');
	var m = auth.generatedSaltedHash('password');
	console.log(
		m.get('salt')
		, m.get('hash')
	);
	
	auth.validatePassword(
		'password'
		, m.get('salt') // just strings
		, m.get('hash') // can come from anywhere
	);

	// here we override a default configuration item: 'iterations'
	var auth = require('co-crypto-saltedhash')({
		iterations: 5000
	});

```

GENERATOR FUNCTIONS
-------------------

* `generateSaltedHash( password, [salt] )`

Generates a salted hash of length 'output_length' using the optionally provided
'salt'. If no salt is provided it generates a salt of the byte size set in
'salt_length'. Iterations are configurable in the constructor.

* `validatePassword( password, salt, salted_hash )`

Generates a new salted hash using provided password and salt. Compares result
to salted_hash and returns true or false.

DEFAULTS
--------

If porting to another language, the defaults used in this module are,

| NAME          | DEFAULT  | TYPE   |
| ------------- |--------- |--------|
| encoding      | 'base64' | String |
| iterations    | 1000     | Int    |
| output_length | 20       | Int    |
| salt_length   | 20       | Int    |

AUTHOR
------

* [Evan Carroll](http://www.evancarroll.com) <me@evancarroll.com>
