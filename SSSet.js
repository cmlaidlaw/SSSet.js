/**
 * SSSet
 *
 * Implements mathematical sets and common operations applied to them.
 * Similar to the built-in Set datatypes in other languages. A fast binary
 * search is used to implement add, remove, intersection and a few other
 * operations.
 *
 * @param elements: an array of elements to pass to the build method
 * @param compareFn: the comparison function which will be used to maintain sorted order
 *
 * compareFn return values must follow this convention:
 *   -1: a will be placed before b
 *    0: a is equal to b and will be placed before b
 *    1: a will be placed after b
 **/

SSSet = function( elements, compareFn ) {
	'use strict';
	this._members = [];
	if ( typeof compareFn === 'function' ) {
		this._compareFn = compareFn;
	} else {
		this._compareFn = function( a, b ) {
			if ( a > b ) { return 1; }
			else if ( a < b ) { return -1; }
			else { return 0 }
		};
	}
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
	return 'Set';
};

/**
 * _searchElements
 *
 * @param arr: the array of elements to search
 * @param element: the value for which we are searching
 *
 * Performs a binary search of the elements array, returning an object indicating
 * whether or not the specified element was found and an index.
 *
 * If the value was found, index points to the value's location within the
 * array of elements.
 *
 * If the value was not found, index points to the correct index for insertion
 * using which would preserve the correctly sorted order.
 **/

SSSet.prototype._searchElements = function( arr, element ) {
	'use strict';
	var min = 0,
		max = arr.length - 1,
		current,
		value,
		result,
		compare;
	while ( min <= max ) {
		result = ( min + max ) / 2 | 0;
		current = arr[result];
		try {
			compare = this._compareFn( current, element );
		} catch ( e ) {
			throw 'SSSet Exception: Comparison function failed.';
		}
		if ( compare < 0 ) {
			min = result + 1;
		} else if ( compare > 0 ) {
			max = result - 1;
		} else {
			return { found: true, index: result };
		}
	}
	return { found: false, index: max + 1};
};


/*    'Public' methods    */


/**
 * isEmpty
 *
 * Tests if 'this' set is empty.
 **/

SSSet.prototype.isEmpty = function() {
	'use strict';
	return ( this._members.length > 0 ) ? false: true;
};


/**
 * cardinality
 *
 * Returns the cardinality of 'this' set.
 **/

SSSet.prototype.cardinality = function() {
	'use strict';
	return this._members.length;
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
	var result = this._searchElements( this._members, element );
	if ( ! result.found ) {
		this._members.splice( result.index, 0, element );
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
	var result;
	result = this._searchElements( this._members, element );
	if ( result.found ) {
		this._members.splice( result.index, 1 );
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
	return this._searchElements( this._members, element ).found;
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
		if ( i === 0 || arr[i] !== last ) {
			this.add( arr[i] );
			last = arr[i];
		}
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
	this._members = [];
	return this;
};


/**
 * enumerate
 *
 * Returns an array of 'this' set's members.
 **/

SSSet.prototype.enumerate = function() {
	'use strict';
	return this._members;
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
	this._members = this._members.map( fn );
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
	this._members = this._members.filter( fn );
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
	return this._members.reduce( fn, initial );
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
	if ( typeof initial === 'undefined' ) {
		initial = 0;
	}
	return this._members.reduceRight( fn, initial );
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
	var length,
		i,
		union = new SSSet( this._members, this._compareFn );
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
		length = other._members.length;
		for ( i = 0; i < length; i++ ) {
			union.add( other._members[i] );
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
	var length,
		i,
		intersection = new SSSet( [], this._compareFn ),
		item,
		result;
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
		length = other._members.length;
		for ( i = 0; i < length; i++ ) {
			item = this._members[i];
			result = this._searchElements( other._members, item );
			if ( result.found ) {
				intersection.add( item );
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
	var length,
		i,
		complement = new SSSet( [], this._compareFn ),
		item,
		result;
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
		length = other._members.length;
		for ( i = 0; i < length; i++ ) {
			item = other._members[i];
			result = this._searchElements( this._members, item );
			if ( ! result.found ) {
				complement.add( item );
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
	var length,
		i,
		difference = new SSSet( [], this._compareFn ),
		item,
		result;
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
		length = this._members.length;
		for ( i = 0; i < length; i++ ) {
			item = this._members[i];
			result = this._searchElements( other._members, item );
			if ( ! result.found ) {
				difference.add( item );
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
	var length = this._members.length,
		i,
		compare;
	if ( length === other._members.length ) {
		for ( i = 0; i < length; i++ ) {
			try {
				compare = this._compareFn( this._members[i], other._members[i] );
			} catch ( e ) {
				throw 'SSSet Exception: Comparison function failed.';
			}
			if ( compare !== 0 ) {
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
	var length,
		start,
		end,
		i,
		j;
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
		length = this._members.length;
		if ( length === 0 ) {
			return true;
		} else if ( length <= other._members.length ) {
			start = this._searchElements( other._members, this._members[0] );
			end = this._searchElements( other._members, this._members[length - 1] );
			if ( start.found && end.found ) {
				i = 1; // Don't need to search for the first element
				length--; // Don't need to search for the last element either
				j = start.index;
				end = end.index;
				while ( j < end ) {
					if ( this._members[i] === other._members[j] ) {
						i++;
					}
					j++;
				}
				return i === length;
			}
		}
		return false;
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
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
		return ( this.isSubset( other )
				 && this._members.length < other._members.length );
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
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
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
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
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
	if ( typeof other._type === 'function' && other._type() === 'Set' ) {
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
	return 'SSSet: {' + this._members.toString() + '}';
};
