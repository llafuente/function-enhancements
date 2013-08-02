# function-enhancements [![Build Status](https://secure.travis-ci.org/llafuente/function-enhancements.png?branch=master)](http://travis-ci.org/llafuente/function-enhancements)
==========

## Introduction
============

Some javascript function enhacements. Arguments:pass, prepend, append. Timing: delay, periodical, debounce, throttle, once

``` js
Function.prototype.pass // use the given args for every call
Function.prototype.prepend // prepend given arguments
Function.prototype.append // append given arguments
Function.prototype.delay // delay the execution x ms
Function.prototype.periodical // execute every x ms
Function.prototype.debounce // execute once every x ms regardless the call count
Function.prototype.throttle // limit the execution time, one time every x ms
Function.prototype.once // execute once
Function.prototype.every // call the function every x times
Function.prototype.after // really call the function after x calls
Function.prototype.nth // call the function n times with given delay
Function.prototype.funnel // Create a function that can be call x times in parallel, the fellowings is queued
Function.prototype.single // alias of funnel(1)
```


Examples

Check the test/test.js for more examples.

``` js

var test = function() {
    console.log(arguments);
    console.log(this);
}

// Function.args: prepend given arguments

var t2 = test.args(["say", "hello"], {iamthis: true});

t2();
// { '0': 'say', '1': 'hello' }
// { iamthis: true }

t2("thidparam!");
// { '0': 'say', '1': 'hello', '2': 'thidparam!' }
// { iamthis: true }


// Function.pass: create a function with given args and any call you will have the same arguments

var t3 = test.pass(["dont mind your args"], {whoami: "root"});

t3();
// { '0': 'dont mind your args' }
// { whoami: 'root' }
t3("second - is not displayed!");
// { '0': 'dont mind your args' }
// { whoami: 'root' }


// Function.delay execute the funtion in X miliseconds

var del = t2.delay(500);
setTimeout(del);

// Function.periodical execute the funtion every X miliseconds

var inter = t2.periodical(500);
clearInterval(inter);

// Function.throttle execute a function once every X miliseconds, dont mind how many time you call it.

var t4 = test.throttle(1000);
var inter = t4.periodical(50);


```

## Install
==========

With [npm](http://npmjs.org) do:

```

npm install function-enhancements

```

## test (travis-ci ready!)
==========================

```

npm test
// or
cd /test
node test.js

```

## license
==========

MIT.
