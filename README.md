# SSSet.js

A featureful implementation of mathematical sets for JavaScript. Optimized for membership tests and the union, intersection, complement and difference operations.

### Constructor


    SSSet( [member1, member2, ...memberN] )

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
