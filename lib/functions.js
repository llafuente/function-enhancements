(function () {
    "use strict";

    // http://jsperf.com/apply-usages

    var slice = Array.prototype.slice,
        __pass,
        __debounce,
        __every,
        __funnel;

    //
    // Function
    //

    /**
     * Returns a closure with arguments and bind
     *
     * credits - mootools
     *
     * @note: If you want to send null as arguments use: .pass([null], ?)
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @return {Function} closure
     */
    module.exports.pass = __pass = function (fn, args, bind) {
        if (args !== null && args !== undefined) {
            args = slice.call(args);
        }

        return function () {
            var fargs = args || arguments,
                fbind = bind || fn;

            if (fargs.length) {
                return fn.apply(fbind, fargs);
            }
            return fn.call(fbind);
        };
    };

    /**
     * Returns a closure with the given arguments before the ones you send at the call
     *
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @return {Function} closure
     */
    module.exports.prepend = function (fn, args, bind) {
        var max = args.length;

        args = args ? slice.call(args) : [];

        return function () {
            var fbind = bind || fn,
                cloned = [],
                i;

            for (i = 0; i < max; ++i) {
                cloned.push(args[i]);
            }
            for (i = 0; i < arguments.length; ++i) {
                cloned.push(arguments[i]);
            }

            return fn.apply(fbind, cloned);
        };
    };

    /**
     * Returns a closure with the given arguments after the ones you send at the call
     *
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @return {Function} closure
     */
    module.exports.append =  function (fn, args, bind) {
        var max = args.length;

        args = args ? slice.call(args) : [];

        return function () {
            var fbind = bind || fn,
                cloned = [],
                i;

            for (i = 0; i < arguments.length; ++i) {
                cloned.push(arguments[i]);
            }
            for (i = 0; i < max; ++i) {
                cloned.push(args[i]);
            }

            return fn.apply(fbind, cloned);
        };
    };

    /**
     * Delays the execution of a function by a specified duration.
     *
     * credits - mootools
     *
     * @note use: clearTimeout to stop the scheduled execution
     * @param {Number} delay_ms
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @return {Number} the interval so you can clearTimeout
     */
    module.exports.delay = function (fn, delay_ms, bind, args) {
        return setTimeout(__pass(fn, args, bind || fn), delay_ms);
    };

    /**
     * Executes a function in the specified intervals of time.
     * Periodic execution can be stopped using the clearInterval function.
     *
     * credits - mootools (
     *
     * @param {Number} periodical_ms
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @return {Number} the interval so you can clearInterval
     */
    module.exports.periodical = function (fn, periodical_ms, bind, args) {
        return setInterval(__pass(fn, args, bind || fn), periodical_ms);
    };

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds.
     *
     * credits to underscore
     *
     * @param {Number} wait_ms
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     */
    module.exports.debounce = __debounce = function (fn, wait_ms, args, bind) {
        var timeout;

        return function () {
            var later = __pass(fn, args || arguments, bind || fn);

            clearTimeout(timeout);
            timeout = setTimeout(later, wait_ms);
        };
    };

    /**
     * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly, will only actually call the original function at most once per every wait milliseconds. Useful for rate-limiting events that occur faster than you can keep up with.
     *
     * credits to underscore
     *
     * @param {Number} wait_ms
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     */
    module.exports.throttle = function (fn, wait_ms, bind, args) {
        var timeout,
            throttling,
            more,
            whenDone = __debounce(function () { more = throttling = false; }, wait_ms);

        return function () {
            var fargs = args || arguments,
                fbind = bind || fn,
                later = function () {
                    timeout = null;

                    if (more) {
                        fn.apply(fbind, fargs);
                    }

                    whenDone();
                };

            if (!timeout) {
                timeout = setTimeout(later, wait_ms);
            }

            if (throttling) {
                more = true;
            } else {
                fn.apply(fbind, fargs);
            }

            whenDone();
            throttling = true;
        };
    };

    /**
     * Returns a function that will be executed at most one time, no matter how
     * often you call it. Useful for lazy initialization.
     *
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @returns the value of the first execution
     */
    module.exports.once = function (fn, bind, args) {
        var first = false,
            memo;

        return function () {
            var fargs = args || arguments,
                fbind = bind || fn;

            if (first) {
                return memo;
            }

            first = true;
            return (memo = fn.apply(fbind, fargs));
        };
    };

    /**
     * Returns a function that will be executed every <ntimes> times at most of <max_executions>
     *
     * @param {Number} ntimes every n times
     * @param {Number} max_executions maximum number of executions
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @returns the value returned by given function or undefined if it's not executed.
     */
    module.exports.every = __every = function (fn, ntimes, max_executions, bind, args) {
        var attempts = 0,
            calls = 0;

        return function () {
            var fargs = args || arguments,
                fbind = bind || fn;

            if (++attempts < ntimes || calls >= max_executions) {
                return;
            }
            attempts = 0;
            ++calls;

            return fn.apply(fbind, fargs);
        };
    };

    /**
     * Returns a function that will be executed after being called n times
     *
     * @param {Number} ntimes
     */
    module.exports.after = function (fn, ntimes, bind, args) {
        return __every(fn, ntimes, 1, bind, args);
    };

    /**
     * Returns a function that will be executed ntimes with a given delay between them
     * If delay is false is cero will be executed right now
     * If first_delay is false is cero will be executed right now
     *
     * @note for delay setInterval is used to be sure that each function execution has the given delay
     *
     * @param {Number} ntimes how many times will be executed
     * @param {Number} delay delay between first and the next execution
     * @param {Number} first_delay delay between the call and first execution
     * @param {Function} last_func function to call when all is done with one arguments, an array of the returned
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     */
    module.exports.nth = function (fn, ntimes, delay, first_delay, last_func, bind, args) {
        var outputs = [],
            interval;

        delay = delay === undefined ? false : delay;
        first_delay = first_delay === undefined ? false : first_delay;


        return function () {
            var times = 1,
                fargs = args || arguments,
                fbind = bind || fn;

            // allow 0
            if (first_delay === false) {
                outputs.push(fn.apply(fbind, fargs));

                if (delay === false) {
                    for (times = 1; times < ntimes; ++times) {
                        outputs.push(fn.apply(fbind, fargs));
                    }

                    last_func && last_func(outputs);
                } else {
                    interval = setInterval(function () {
                        outputs.push(fn.apply(fbind, fargs));
                        if (++times === ntimes) {
                            clearInterval(interval);

                            last_func && last_func(outputs);
                        }
                    }, delay);
                }

            } else {
                setTimeout(function () {
                    outputs.push(fn.apply(fbind, fargs));

                    if (delay === false) {
                        for (times = 1; times < ntimes; ++times) {
                            outputs.push(fn.apply(fbind, fargs));
                        }
                        last_func && last_func(outputs);
                    } else {
                        interval = setInterval(function () {
                            outputs.push(fn.apply(fbind, fargs));
                            if (++times === ntimes) {
                                clearInterval(interval);

                                last_func && last_func(outputs);
                            }
                        }, delay);
                    }
                }, first_delay);
            }
        };
    };

    /**
     * Create a function, when called invoke this.
     * If you called again and it's in execution, the execution is queued. So only (max) execution at time
     * A new argument is sent to your function, a callback no notify the execution ended
     *
     * @param {Number} max How many execution are allowed in parallel
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @param {String} where append / prepend, the new callback argument
     */
    module.exports.funnel = __funnel = function (fn, max, bind, args, where) {
        where = where || "append";

        var in_execution = 0,
            fifo = [],
            self,
            check = function () {
                var el;
                if (fifo.length === 0) {
                    --in_execution;
                } else {
                    el = fifo.shift();
                    self.apply(el.bind, el.args);
                }
            };

        self = module.exports[where](fn, [check]);

        return function () {
            var fargs = args || (arguments.length ? slice.call(arguments) : []),
                fbind = bind || fn;

            if (in_execution === max) {
                fifo.push({
                    args: fargs,
                    bind: fbind
                });
                return;
            }

            ++in_execution;
            self.apply(fbind, fargs);

        };
    };


    /**
     * Create a function that can only be call once in parallel, the followings will be queued
     * A new argument is sent to your function, a callback no notify the execution ended
     *
     * @param {Mixed} bind Changes the scope of this within the returned function
     * @param {Array} args The arguments passed
     * @param {String} where append or prepend, where the callback will be.
     */
    module.exports.single = function (fn, bind, args, where) {
        return __funnel(fn, 1, bind, args, where);
    };

    // from: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    function hash(args) {
        var str = JSON.stringify(args),
            ihash = 0,
            chc,
            i;

        if (str.length === 0) {
            return ihash;
        }

        for (i = 0; i < str.length; i++) {
            chc = str.charCodeAt(i);
            ihash = ((ihash << 5) - ihash) + chc;
            ihash = ihash & ihash; // Convert to 32bit integer
        }

        return ihash;
    }

    //Function.prototype.cache
    /**
     * Creates a function that memoizes the result of func for a given time.
     * If hash_function is provided it will be used to determine the cache key for storing the result based on the arguments provided to the memoized function.
     *
     * @param {Number} cache_time_ms Cache expiration microseconds, -1 to infinite
     * @param {Mixed} bind The arguments passed
     * @param {function} hash_function function used to hash the arguments, most simple one: JSON.stringify
     */
    module.exports.cache = function (fn, cache_time_ms, bind, hash_function) {
        var cache = {};

        hash_function = hash_function || hash;

        return function () {
            var args = [],
                hash_code,
                ts = cache_time_ms === -1 ? 0 : +(new Date()),
                fbind = bind || fn,
                i,
                max = arguments.length;

            if (max) {
                for (i = 0, max = arguments.length; i < max; ++i) {
                    args.push(arguments[i]);
                }

            }

            hash_code = hash_function(args);

            if (cache[hash_code] !== undefined) {
                if (cache[hash_code].expire === -1 || cache[hash_code].expire > ts) {
                    return cache[hash_code].ret;
                } else {
                    delete cache[hash_code];
                }
            }

            cache[hash_code] = {
                ret: fn.apply(fbind, args),
                expire: ts + cache_time_ms
            };

            return cache[hash_code];

        };
    };

    /**
     * Returns a function that is the composition of a list of functions, each
     * consuming the return value of the function that follows.
     *
     * credits - almost underscore
     *
     * @param {Function} any number of functions
     * @returns {Array} all returned values
     */
    module.exports.compose = function () {
        var funcs = arguments;

        return function () {
            var i,
                ret = [];

            for (i = 0; i < funcs.length; ++i) {
                if (ret.length === 0) {
                    ret.push(funcs[i]());
                } else {
                    ret.push(funcs[i](ret[ret.length - 1]));
                }
            }

            return ret;
        };
    };

    /**
     * Returns a function that is the composition of a list of functions,
     * returns an array with all returned values by each function
     *
     * @param {Function} any number of functions
     * @returns {Array} all returned values
     */
    module.exports.sequencial = function () {
        var funcs = arguments;

        return function () {
            var i,
                ret = [];

            for (i = 0; i < funcs.length; ++i) {
                ret.push(funcs[i]());
            }

            return ret;
        };
    };


    // times, execute X times the function with given delay or callback
    module.exports.times = function (fun, callback, times, delay) {
        delay = delay || null;
        times = parseInt(times, 10);

        var done = 0,
            next;

        next = function() {
            if (times-- > 0) {
                delay ? (setTimeout(next, delay) && fun()) : fun(next);
            } else {
                callback();
            }
        };

        delay ? setTimeout(next, delay) : next();
    }

    // wait many events to finish, you can create those event in real-time
    // util when you don't know how many callback will need to finish a task
    module.exports.waitEvents = function (fun) {
        var events = 0,
            done = 0,
            first = true;

        return {
            event: function () {
                ++events;
                return function () {
                    ++done;

                    if (done === events) {
                        if (!first) {
                            throw new Error("");
                        }
                        first = true;
                        fun();
                    }
                }
            }
        }
    }

}());