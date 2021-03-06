var buster = typeof window !== 'undefined' ? window.buster : require('buster');
var assert = buster.assert;
var refute = buster.refute;
var fail = buster.referee.fail;

var when = require('../when');
var resolved = when.resolve;
var rejected = when.reject;

function contains(array, item) {
	for(var i=array.length - 1; i >= 0; --i) {
		if(array[i] === item) {
			return true;
		}
	}

	return false;
}

buster.testCase('when.any', {

	'should resolve to undefined with empty input array': function(done) {
		when.any([]).then(
			function(result) {
				refute.defined(result);
			},
			fail
		).ensure(done);
	},

	'should resolve with an input value': function() {
		var input = [1, 2, 3];
		return when.any(input).then(
			function(result) {
				assert(contains(input, result));
			},
			fail
		);
	},

	'should resolve with a promised input value': function(done) {
		var input = [resolved(1), resolved(2), resolved(3)];
		when.any(input).then(
			function(result) {
				assert(contains([1, 2, 3], result));
			},
			fail
		).ensure(done);
	},

	'should reject with all rejected input values if all inputs are rejected': function(done) {
		var input = [rejected(1), rejected(2), rejected(3)];
		when.any(input).then(
			fail,
			function(result) {
				assert.equals(result, [1, 2, 3]);
			}
		).ensure(done);
	},

	'should accept a promise for an array': function(done) {
		var expected, input;

		expected = [1, 2, 3];
		input = resolved(expected);

		when.any(input).then(
			function(result) {
				refute.equals(expected.indexOf(result), -1);
			},
			fail
		).ensure(done);
	},

	'should resolve to undefined when input promise does not resolve to array': function(done) {
		when.any(resolved(1)).then(
			function(result) {
				refute.defined(result);
			},
			fail
		).ensure(done);
	}

});
