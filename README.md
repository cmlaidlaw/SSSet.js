# SSSet.js

A featureful implementation of mathematical sets for JavaScript. Insertions and member tests are handled with a fast binary search.

### Constructor


    SSSet( [member1, member2, ...memberN], <optional comparisonFunction> )

*Comparison function must return -1, 0 or 1 for a, b tests in which a falls before, identically or after b*

### Basic Properties

    .cardinality()
    .has( member )
    .enumerate()


### Creating & Modifying

    .add( member )
    .remove( member )
    .build( [member1, member2, ...memberN] )
    .clear()


### Collection Operations

    .map( mapFunction )
    .filter( predicate )
    .foldLeft( reduceFunction, <optional initialValue> )
    .foldRight( reduceFunction, <optional initialValue> )


### Set Operations

    .union( set )
    .intersection( set )
    .complement( set )
    .difference( set )


### Set Properties

    .isEmpty()
    .isEqual()
    .isSubset()
    .isProperSubset()
    .isSuperset()
    .isProperSuperset()
    .isDisjoint()
