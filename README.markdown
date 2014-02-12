# function-enhancements [![Build Status](https://secure.travis-ci.org/llafuente/js-function-enhancements.png?branch=master)](http://travis-ci.org/llafuente/js-function-enhancements)

## Introduction

Some javascript function enhacements. Arguments:pass, prepend, append. Timing: delay, periodical, debounce, throttle, once

``` js
var Fun = require("function-enhancements");
// Returns a closure with arguments and bind
Fun.pass(fun, args[, bind])

// Returns a closure with the given arguments before the ones you send at the call
Fun.prepend(fun, args[, bind])

// Returns a closure with the given arguments after the ones you send at the call
Fun.append(fun, args[, bind])

// Delays the execution of a function by a specified duration.
Fun.delay(fun, delay_ms[, bind[, args]])

// Executes a function in the specified intervals of time.
// Periodic execution can be stopped using the clearInterval function.
Fun.periodical(fun, periodical_ms[, bind[, args]])

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
Fun.debounce(fun, wait_ms[, args[, bind]])

// Creates and returns a new, throttled version of the passed function,
// that, when invoked repeatedly, will only actually call the original
// function at most once per every wait milliseconds. Useful for
// rate-limiting events that occur faster than you can keep up with.
Fun.throttle(fun, wait_ms[, args[, bind]])

// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
Fun.once(fun, [bind[, args]])

// Returns a function that will be executed every <ntimes> times at most of <max_executions>
Fun.every(fun, ntimes, max_executions[, bind[, args]])

// Returns a function that will be executed after being called n times
Fun.after(fun, ntimes[, bind[, args]])

// Returns a function that will be executed ntimes with a given delay between them
// If delay is false is cero will be executed right now
// If first_delay is false is cero will be executed right now
Fun.nth(fun, ntimes[, delay[, first_delay[, last_func[, bind[, args]]]]])

// Create a function, when called invoke this.
// If you called again and it's in execution, the execution is queued. So only (max) execution at time
// A new argument is sent to your function, a callback no notify the execution ended
Fun.funnel(fun, max[, bind[, args[, where]]])

// Create a function that can only be call once in parallel, the followings will be queued
// A new argument is sent to your function, a callback no notify the execution ended
Fun.single(fun, [, bind[, args[, where]]])

// Creates a function that memoizes the result of func for a given time.
// If hash_function is provided it will be used to determine the cache
// key for storing the result based on the arguments provided to the memoized function.
Fun.cache(fun, cache_time_ms[, bind[, hash_function]])

// execute a function many times, when finished call the callback
// if delay is provided, the function will be executed given that delay
// otherwise a callback will be provided as first argument
Fun.times(fun, callback, times[, delay])

// for compatibility with old browsers @lib/functions-compat.js
Fun.bind
```


## In action!

Check the test/test.js for more examples.

``` js

var test = function() {
    console.log("arguments:", arguments);
    console.log("this:", this);
}

test.toString = function() { return "[test Function]";};

// Function.args: prepend given arguments

var t2 = test.prepend(["say", "hello"], {iamthis: true});

t2();
// > arguments: { '0': 'say', '1': 'hello' }
// > this: { iamthis: true }

t2("thidparam!");
// > arguments: { '0': 'say', '1': 'hello', '2': 'thidparam!' }
// > this: { iamthis: true }


// Function.pass: create a function with given args and any call you will have the same arguments

var t3 = test.pass(["dont mind your args"], {whoami: "root"});

t3();
// arguments: { '0': 'dont mind your args' }
// this: { whoami: 'root' }
t3("second - is not displayed!");
// arguments: { '0': 'dont mind your args' }
// this: { whoami: 'root' }


// Function.delay execute the funtion in X miliseconds

var del = t2.delay(500);
setTimeout(del);

// Function.periodical execute the funtion every X miliseconds

var inter = t2.periodical(500);
clearInterval(inter);

// Function.throttle execute a function once every X miliseconds, dont mind how many time you call it.

var t4 = test.throttle(1000);
var inter = t4.periodical(50);

setTimeout(function() {
    clearInterval(inter);
}, 10000);

// 10 times
// > this: [test Function]
// > arguments: {}

```

this gives you an idea :)
check the test/test.js for more examples


## Install

With [npm](http://npmjs.org) do:

```

npm install function-enhancements

```

## test (travis-ci ready!)

```

npm test
// or
cd /test
node test.js

```

## license

MIT.
