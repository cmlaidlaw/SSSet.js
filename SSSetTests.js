( function( context ) {
	context.testArraysEqual = function( arr1, arr2 ) {
		if ( arr1.length === arr2.length ) {
			for ( i = 0; i < arr1.length; i++ ) {
				if ( arr1[i] !== arr2[i] ) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
} )( window );
	
( function( context ) {

	var tests = [
		{
			name: 'cardinality with no members',
			test: function() {
				var	a = new SSSet([]);
				return a.cardinality() === 0;
			}
		},
		{
			name: 'cardinality with 1 member',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				return a.cardinality() === 1;
			}
		},
		{
			name: 'cardinality with n members',
			test: function() {
				var	a = new SSSet(),
					i,
					n = Math.floor( Math.random() * 100 );
				for ( i = 0; i < n; i++ ) {
					a.add( i );
				}
				return a.cardinality() === n;
			}
		},
		{
			name: 'build equivalent to repeated add',
			test: function() {
				var a = new SSSet(),
					b = new SSSet(),
					i;
				a.build( [1,2,3,4,5,6,7,8,9] );
				for ( i = 1; i < 10; i++ ) {
					b.add( i );
				}
				return testArraysEqual( a._members, b._members );
			}
		},
		{
			name: 'add, remove leaves no members',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.remove( 1 );
				return testArraysEqual( a.enumerate(), [] );
			}
		},
		{
			name: 'remove member leaves remaining members',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.remove( 2 );
				return testArraysEqual( a.enumerate(), [1] );
			}
		},
		{
			name: 'remove non-member leaves all members',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.remove( 3 );
				return testArraysEqual( a.enumerate(), [1,2] );
			}
		},
		{
			name: 'has identifies correct member',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				return a.has( 1 );
			}
		},
		{
			name: 'has ignores mistyped pseudo-correct member',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				return ! a.has( '1' );
			}
		},
		{
			name: 'clear of empty set leaves no members',
			test: function() {
				var	a = new SSSet();
				a.clear();
				return testArraysEqual( a.enumerate(), [] );
			}
		},
		{
			name: 'clear leaves no members',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.add( 3 );
				a.clear();
				return testArraysEqual( a.enumerate(), [] );
			}
		},
		{
			name: 'enumerate returns correct values',
			test: function() {
				var	a = new SSSet();
				a.add( 3 );
				a.add( 2 );
				a.add( 1 );
				return testArraysEqual( a.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'map returns correct values',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.add( 3 );
				a.map( function( x ) { return x*x; } );
				return testArraysEqual( a.enumerate(), [1,4,9] );
			}
		},
		{
			name: 'filter returns correct values',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.add( 3 );
				a.filter( function( x ) { return x < 3; } );
				return testArraysEqual( a.enumerate(), [1,2] );
			}
		},
		{
			name: 'foldLeft returns correct values',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.add( 3 );
				return a.foldLeft( function( x, acc ) { return x + acc; }, 0 ) === 6;
			}
		},
		{
			name: 'foldRight returns correct values',
			test: function() {
				var	a = new SSSet();
				a.add( 1 );
				a.add( 2 );
				a.add( 3 );
				return a.foldRight( function( x, acc ) { return x + acc; }, 0 ) === 6;
			}
		},
		{
			name: 'union of empty sets is empty',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet(),
					c = a.union( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'union of a and b is correct when a and b are equal',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] ),
					c = a.union( b );
				return testArraysEqual( c.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'union of a and b is correct when b is empty',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet(),
					c = a.union( b );
				return testArraysEqual( c.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'union of a and b is correct when a and b are disjoint',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [4,5,6] ),
					c = a.union( b );
				return testArraysEqual( c.enumerate(), [1,2,3,4,5,6] );
			}
		},
		{
			name: 'intersection of empty sets is empty',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet(),
					c = a.intersection( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'intersection of a and b is correct when a and b are equal',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] ),
					c = a.intersection( b );
				return testArraysEqual( c.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'intersection of a and b is empty when b is empty',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet(),
					c = a.intersection( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'intersection of a and b is empty when a and b are disjoint',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [4,5,6] ),
					c = a.intersection( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'complement of empty sets is empty',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet(),
					c = a.complement( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'complement of a and b is empty when a and b are equal',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] ),
					c = a.complement( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'complement of a and b is correct when b is empty',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet( [1,2,3] ),
					c = a.complement( b );
				return testArraysEqual( c.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'complement of a and b is correct when a and b are disjoint',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [4,5,6] ),
					c = a.complement( b );
				return testArraysEqual( c.enumerate(), [4,5,6] );
			}
		},
		{
			name: 'complement of a and b is correct when a and b are left-imbalanced',
			test: function() {
				var	a = new SSSet( [1,2,3,4,5,6] ),
					b = new SSSet( [5,6,7] ),
					c = a.complement( b );
				return testArraysEqual( c.enumerate(), [7] );
			}
		},
		{
			name: 'complement of a and b is correct when a and b are right-imbalanced',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [2,3,4,5,6,7] ),
					c = a.complement( b );
				return testArraysEqual( c.enumerate(), [4,5,6,7] );
			}
		},
		{
			name: 'difference of empty sets is empty',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet(),
					c = a.difference( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'difference of a and b is empty when a and b are equal',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] ),
					c = a.difference( b );
				return testArraysEqual( c.enumerate(), [] );
			}
		},
		{
			name: 'difference of a and b is correct when b is empty',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet(),
					c = a.difference( b );
				return testArraysEqual( c.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'difference of a and b is correct when a and b are disjoint',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [4,5,6] ),
					c = a.difference( b );
				return testArraysEqual( c.enumerate(), [1,2,3] );
			}
		},
		{
			name: 'difference of a and b is correct when a and b are left-imbalanced',
			test: function() {
				var	a = new SSSet( [1,2,3,4,5,6] ),
					b = new SSSet( [5,6,7] ),
					c = a.difference( b );
				return testArraysEqual( c.enumerate(), [1,2,3,4] );
			}
		},
		{
			name: 'difference of a and b is correct when a and b are right-imbalanced',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [2,3,4,5,6,7] ),
					c = a.difference( b );
				return testArraysEqual( c.enumerate(), [1] );
			}
		},
		{
			name: 'empty set is a subset of non-empty set',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet( [1] );
				return a.isSubset( b );
			}
		},
		{
			name: 'empty set is a proper subset of non-empty set',
			test: function() {
				var	a = new SSSet(),
					b = new SSSet( [1] );
				return a.isProperSubset( b );
			}
		},
		{
			name: 'a is a subset of b when a equals b',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] );
				return a.isSubset( b );
			}
		},
		{
			name: 'a is a proper subset of b when b contains a member not in a',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3,4] );
				return a.isProperSubset( b );
			}
		},		
		{
			name: 'a is not a proper subset of b when a equals b',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] );
				return ( ! a.isProperSubset( b ) );
			}
		},
		{
			name: 'non-empty set is a superset of empty set',
			test: function() {
				var	a = new SSSet( [1] ),
					b = new SSSet();
				return a.isSuperset( b );
			}
		},
		{
			name: 'non-empty set is a proper superset of empty set',
			test: function() {
				var	a = new SSSet( [1]),
					b = new SSSet();
				return a.isProperSuperset( b );
			}
		},
		{
			name: 'a is a superset of b when a equals b',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] );
				return a.isSuperset( b );
			}
		},
		{
			name: 'a is a proper superset of b when a contains a member not in b',
			test: function() {
				var	a = new SSSet( [1,2,3,4] ),
					b = new SSSet( [1,2,3] );
				return a.isProperSuperset( b );
			}
		},		
		{
			name: 'a is not a proper superset of b when a equals b',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [1,2,3] );
				return ( ! a.isProperSuperset( b ) );
			}
		},
		{
			name: 'a is disjoint with b',
			test: function() {
				var	a = new SSSet( [1,2,3] ),
					b = new SSSet( [4,5,6] );
				return a.isDisjoint( b );
			}
		},		
		{
			name: 'a is disjoint with b when b has identical value of different type',
			test: function() {
				var	a = new SSSet( [1] ),
					b = new SSSet( ['1'] );
				return a.isDisjoint( b );
			}
		}
	],
	i,
	passed = 0,
	num,
	report = '\nRunning tests...\n----------------\n\n';

	for ( i = 0; i < tests.length; i++ ) {
		num = ( i < 9 ) ? '0' + ( i + 1 ) : ( i + 1 );
		if ( tests[i].test() ) {
			report += num + ' of ' + tests.length
					  + ': Passed ("' + tests[i].name + '")\n';
			passed++;
		} else {
			report += num + ' of ' + tests.length
					  + ': FAILED ("' + tests[i].name + '")\n';
		}
	}

	report += '\n----------------\nPassed ' + passed.toString()
			  + ' of ' + tests.length.toString() + ' tests ('
			  + ( Math.round( ( passed / tests.length * 100 ) * 100 ) / 100 ) + '%)';

	return report;

} )( window );
