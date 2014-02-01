/**
 * SSSet
 *
 * Implements mathematical sets and common operations applied to them.
 * Similar to the built-in Set datatypes in other languages. A fast binary
 * search is used to implement add, remove, intersection and a few other
 * operations.
 *
 * @param elements: an array of elements to pass to the build method
 **/

SSSet = function( elements ) {
	'use strict';
	this._members = {};
	if ( typeof elements !== 'undefined' ) {
		this.build( elements );
	}
	return this;
};


/*    'Private' methods    */


/**
 * _type
 *
 * Used to check for the compatibility by methods which take another set as
 * san argument (i.e. union and intersection ).
 **/

SSSet.prototype._type = function() {
	return 'SSSet';
};

/**
 * _hash
 *
 * @param element: the element for which to calculate a hashed value
 *
 * Returns a hash key representing the specified element.
 **/

SSSet.prototype._hash = function( element ) {
	'use strict';
	return JSON.stringify( element );
};

/**
 * _searchMembers
 *
 * @param members: the set to search
 * @param element: the element for which we are searching
 *
 * Tests for an element's membership in the specified set.
 **/

SSSet.prototype._searchMembers = function( members, element ) {
	'use strict';
	return members.hasOwnProperty( this._hash( element ) );
};


/*    'Public' methods    */


/**
 * isEmpty
 *
 * Tests if 'this' set is empty.
 **/

SSSet.prototype.isEmpty = function() {
	'use strict';
	return ( Object.keys( this._members ).length > 0 ) ? false: true;
};


/**
 * cardinality
 *
 * Returns the cardinality of 'this' set.
 **/

SSSet.prototype.cardinality = function() {
	'use strict';
	return Object.keys( this._members ).length;
};


/**
 * add
 *
 * @param element
 *
 * Adds an element to 'this' set. Does nothing if the specified element is already a
 * member of 'this' set.
 **/

SSSet.prototype.add = function( element ) {
	'use strict';
	var key = this._hash( element );
	if ( ! this._members.hasOwnProperty( key ) ) {
		this._members[key] = element;
	}
	return this;
};


/**
 * remove
 *
 * @param element
 *
 * Removes an element from 'this' set. Does nothing if the specified element is not a
 * member of 'this' set.
 **/

SSSet.prototype.remove = function( element ) {
	'use strict';
	var key = this._hash( element );
	if ( this._members.hasOwnProperty( key ) ) {
		delete this._members[key];
	}
	return this;
};


/**
 * has
 *
 * @param element
 *
 * Tests for the specified element's membership in 'this' set.
 **/

SSSet.prototype.has = function( element ) {
	'use strict';
	var key = this._hash( element );
	return this._members.hasOwnProperty( key );
};


/**
 * build
 *
 * @param arr
 *
 * Adds every element of the specified array to 'this' set.
 **/

SSSet.prototype.build = function( arr ) {
	'use strict';
	var length = arr.length,
		i,
		last;
	for ( i = 0; i < length; i++ ) {
		this.add( arr[i] );
	}
	return this;
};


/**
 * clear
 *
 * Removes all members of 'this' set.
 **/

SSSet.prototype.clear = function() {
	'use strict';
	this._members = {};
	return this;
};


/**
 * enumerate
 *
 * Returns an array of 'this' set's members.
 **/

SSSet.prototype.enumerate = function() {
	'use strict';
	var members = [],
		key;
	for ( key in this._members ) {
		if ( this._members.hasOwnProperty( key ) ) {
			members.push( this._members[key] );
		}
	}
	return members;
};


/**
 * map
 *
 * @param fn
 *
 * Maps a function to each of 'this' set's members.
 *
 * This is just a convenience method to help users avoid accessing 'this' set's
 * elements array directly.
 **/

SSSet.prototype.map = function( fn ) {
	'use strict';
	var members = this.enumerate().map( fn ),
		i,
		length = members.length,
		s = new SSSet();
	for ( i = 0; i < length; i++ ) {
		s.add( members[i] );
	}
	this._members = s._members;
	return this;
};


/**
 * filter
 *
 * @param fn
 *
 * Filters 'this' set's members according to the specified predicate.
 *
 * This is just a convenience method to help users avoid accessing 'this' set's
 * elements array directly.
 **/

SSSet.prototype.filter = function( fn ) {
	'use strict';
	var members = this.enumerate().filter( fn ),
		i,
		length = members.length,
		s = new SSSet();
	for ( i = 0; i < length; i++ ) {
		s.add( members[i] );
	}
	this._members = s._members;
	return this;
};


/**
 * foldLeft
 *
 * @param fn: the function to apply to 'this' set's members
 * @param initial: the value with which to initialize the accumulator
 *
 * Leftwise-recursively applies the specified function to the members of 'this' set and
 * returns the accumulated values of each application.
 *
 * This is just a convenience method to help users avoid accessing 'this' set's
 * elements array directly.
 **/

SSSet.prototype.foldLeft = function( fn, initial ) {
	'use strict';
	if ( typeof initial === 'undefined' ) {
		initial = 0;
	}
	return this.enumerate().reduce( fn, initial );
};


/**
 * foldRight
 *
 * @param fn: the function to apply to 'this' set's members
 * @param initial: the value with which to initialize the accumulator
 *
 * Rightwise-recursively applies the specified function to the members of 'this' set and
 * returns the accumulated values of each application.
 *
 * This is just a convenience method to help users avoid accessing 'this' set's
 * elements array directly.
 **/

SSSet.prototype.foldRight = function( fn, initial ) {
	'use strict';
	'use strict';
	if ( typeof initial === 'undefined' ) {
		initial = 0;
	}
	return this.enumerate().reduceRight( fn, initial );
};


/**
 * union
 *
 * @param other: the set against which we will take the union
 *
 * Returns a new SSSet equal to the union of 'this' and the 'other' set.
 **/

SSSet.prototype.union = function( other ) {
	'use strict';
	var keys,
		length,
		i,
		union = new SSSet();
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		keys = Object.keys( this._members );
		length = keys.length;
		for ( i = 0; i < length; i++ ) {
			union._members[keys[i]] = this._members[keys[i]];
		}
		keys = Object.keys( other._members );
		length = keys.length;
		for ( i = 0; i < length; i++ ) {
			union.add( other._members[keys[i]] );
		}
		return union;
	} else {
		throw 'SSSet Exception: Cannot take union: `other` parameter is not a set.';
	}
};


/**
 * intersection
 *
 * @param other: the set against which we will take the intersection
 *
 * Returns a new SSSet equal to the intersection of 'this' and the 'other' set.
 **/

SSSet.prototype.intersection = function( other ) {
	'use strict';
	var thisKeys,
		otherKeys,
		i,
		length,
		thisKey,
		intersection = new SSSet();
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		thisKeys = Object.keys( this._members );
		otherKeys = Object.keys( other._members );
		if ( thisKeys.length <= otherKeys.length ) {
			length = thisKeys.length;
			for ( i = 0; i < length; i++ ) {
				thisKey = thisKeys[i];
				if ( other._members.hasOwnProperty( thisKey ) ) {
					intersection._members[thisKey] = this._members[thisKey];
				}
			}
		} else {
			length = otherKeys.length;
			for ( i = 0; i < length; i++ ) {
				thisKey = otherKeys[i];
				if ( this._members.hasOwnProperty( thisKey ) ) {
					intersection._members[thisKey] = other._members[thisKey];
				}
			}
		}
		return intersection;
	} else {
		throw 'SSSet Exception: Cannot take intersection: `other` parameter is not a set.';
	}
};


/**
 * complement
 *
 * @param other: the set against which we will take the complement
 *
 * Returns a new SSSet equal to the complement of 'this' and the 'other' set.
 **/

SSSet.prototype.complement = function( other ) {
	'use strict';
	var keys,
		length,
		i,
		thisKey,
		complement = new SSSet();
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		keys = Object.keys( other._members );
		length = keys.length;
		for ( i = 0; i < length; i++ ) {
			thisKey = keys[i];
			if ( ! this._members.hasOwnProperty( thisKey ) ) {
				complement._members[thisKey] = other._members[thisKey];
			}
		}
		return complement;
	} else {
		throw 'SSSet Exception: Cannot take complement: `other` parameter is not a set.';
	}
};


/**
 * difference
 *
 * @param other: the set against which we will take the difference
 *
 * Returns a new SSSet equal to the difference of 'this' and the 'other' set.
 **/

SSSet.prototype.difference = function( other ) {
	'use strict';
	var keys,
		length,
		i,
		thisKey,
		difference = new SSSet( [], this._compareFn );
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		keys = Object.keys( this._members );
		length = keys.length;
		for ( i = 0; i < length; i++ ) {
			thisKey = keys[i];
			if ( ! other._members.hasOwnProperty( thisKey ) ) {
				difference._members[thisKey] = this._members[thisKey];
			}
		}
		return difference;
	} else {
		throw 'SSSet Exception: Cannot take difference: `other` parameter is not a set.';
	}
};


/**
 * isEqual
 *
 * @param other: the 'other' set
 *
 * Tests if 'this' set is equal to the 'other' set.
 **/

SSSet.prototype.isEqual = function( other ) {
	'use strict';
	var keys = Object.keys( this._members ),
		key,
		thisKey;
	if ( length === Object.keys( other._members ).length ) {
		for ( key in keys ) {
			thisKey = keys[key];
			if ( this._members.hasOwnProperty( thisKey )
				 && ! other._members.hasOwnProperty( thisKey ) ) {
				return false;	   
			}
		}
		return true;
	}
	return false;
};


/**
 * isSubset
 *
 * @param other: the set representing the possible superset
 *
 * Tests if 'this' set is a subset of the 'other' set.
 **/

SSSet.prototype.isSubset = function( other ) {
	'use strict';
	var keys = Object.keys( this._members ),
		key,
		thisKey;
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		length = keys.length;
		if ( length === 0 ) {
			return true;
		} else if ( length <= Object.keys( other._members ).length ) {
			for ( key in keys ) {
				thisKey = keys[key];
				if ( this._members.hasOwnProperty( thisKey )
					 && ! other._members.hasOwnProperty( thisKey ) ) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	} else {
		throw 'SSSet Exception: Cannot check subset: `other` parameter is not a set.';
	}
};


/**
 * isProperSubset
 *
 * @param other: the set representing the possible superset
 *
 * Tests if 'this' set is a proper subset of the 'other' set.
 **/

SSSet.prototype.isProperSubset = function( other ) {
	'use strict';
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		return ( this.isSubset( other )
				 && Object.keys( this._members ).length
				 	< Object.keys( other._members ).length );
	} else {
		throw 'SSSet Exception: Cannot check subset: `other` parameter is not a set.';
	}
};


/**
 * isSuperset
 *
 * @param other: the set representing the possible subset
 *
 * Tests if 'this' set is a superset of the 'other' set.
 **/

SSSet.prototype.isSuperset = function( other ) {
	'use strict';
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		return other.isSubset( this );
	} else {
		throw 'SSSet Exception: Cannot check superset: `other` parameter is not a set.';
	}
};


/**
 * isProperSuperset
 *
 * @param other: the set representing the possible subset
 *
 * Tests if 'this' set is a proper superset of the 'other' set.
 **/

SSSet.prototype.isProperSuperset = function( other ) {
	'use strict';
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		return other.isProperSubset( this );
	} else {
		throw 'SSSet Exception: Cannot check superset: `other` parameter is not a set.';
	}
};


/**
 * isDisjoint
 *
 * @param other: the 'other' set
 *
 * Tests if 'this' set and the 'other' set are disjoint.
 **/

SSSet.prototype.isDisjoint = function( other ) {
	'use strict';
	var intersection
	if ( typeof other._type === 'function' && other._type() === 'SSSet' ) {
		return this.intersection( other ).isEmpty();
	} else {
		throw 'SSSet Exception: Cannot check if disjoint: `other` parameter is not a set.';
	}
};


/**
 * toString
 *
 * Returns a rendition of 'this' set as a string.
 **/

SSSet.prototype.toString = function() {
	'use strict';
	return 'SSSet: {' + this.enumerate().toString() + '}';
};
