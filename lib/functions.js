(function () {
    "use strict";

    // http://jsperf.com/apply-usages

    var defineProperty = Object.defineProperty || function (obj, name, prop) {
            if (prop.get || prop.set) {
                throw new Error("this is not supported in your js.engine");
            }
            obj[name] = prop.value;
        },
        slice = Array.prototype.slice;


    // for old browsers
    // from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                                      ? this
                                      : oThis,
                                      aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    //
    // Function
    //

    // Function.prototype.pass
    if (!Function.prototype.pass) {
        defineProperty(Function.prototype, "pass", {
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
            value: function (args, bind) {
                var self = this;

                if (args !== null && args !== undefined) {
                    args = slice.call(args);
                }

                return function () {
                    var fargs = args || arguments,
                        fbind = bind || self;

                    if (fargs.length) {
                        return self.apply(fbind, fargs);
                    }
                    return self.call(fbind);
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    // Function.prototype.prepend
    if (!Function.prototype.prepend) {
        defineProperty(Function.prototype, "prepend", {
            /**
             * Returns a closure with the given arguments before the ones you send at the call
             *
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @return {Function} closure
             */
            value: function (args, bind) {
                var self = this,
                    max = args.length;

                args = args ? slice.call(args) : [];

                return function () {
                    var fbind = bind || self,
                        cloned = [],
                        i;

                    for (i = 0; i < max; ++i) {
                        cloned.push(args[i]);
                    }
                    for (i = 0; i < arguments.length; ++i) {
                        cloned.push(arguments[i]);
                    }

                    return self.apply(fbind, cloned);
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    // Function.prototype.append
    if (!Function.prototype.append) {
        defineProperty(Function.prototype, "append", {
            /**
             * Returns a closure with the given arguments before the ones you send at the call
             *
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @return {Function} closure
             */
            value: function (args, bind) {
                var self = this,
                    max = args.length;

                args = args ? slice.call(args) : [];

                return function () {
                    var fbind = bind || self,
                        cloned = [],
                        i;

                    for (i = 0; i < arguments.length; ++i) {
                        cloned.push(arguments[i]);
                    }
                    for (i = 0; i < max; ++i) {
                        cloned.push(args[i]);
                    }

                    return self.apply(fbind, cloned);
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    // Function.prototype.delay
    if (!Function.prototype.delay) {
        defineProperty(Function.prototype, "delay", {
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
            value: function (delay_ms, bind, args) {
                return setTimeout(this.pass(args, bind || this), delay_ms);
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    // Function.prototype.periodical
    if (!Function.prototype.periodical) {
        defineProperty(Function.prototype, "periodical", {
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
            value: function (periodical_ms, bind, args) {
                return setInterval(this.pass(args, bind || this), periodical_ms);
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    // Function.prototype.debounce
    if (!Function.prototype.debounce) {
        defineProperty(Function.prototype, "debounce", {
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
            value: function (wait_ms, args, bind) {
                var timeout,
                    self = this;

                return function () {
                    var later = self.pass(args || arguments, bind || self);

                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait_ms);
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    // Function.prototype.throttle
    if (!Function.prototype.throttle) {
        defineProperty(Function.prototype, "throttle", {
            /**
             * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly, will only actually call the original function at most once per every wait milliseconds. Useful for rate-limiting events that occur faster than you can keep up with.
             *
             * credits to underscore
             *
             * @param {Number} wait_ms
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             */
            value: function (wait_ms, bind, args) {
                var timeout,
                    throttling,
                    more,
                    whenDone = function () { more = throttling = false; }.debounce(wait_ms),
                    self = this;

                return function () {
                    var fargs = args || arguments,
                        fbind = bind || self,
                        later = function () {
                            timeout = null;

                            if (more) {
                                self.apply(fbind, fargs);
                            }

                            whenDone();
                        };

                    if (!timeout) {
                        timeout = setTimeout(later, wait_ms);
                    }

                    if (throttling) {
                        more = true;
                    } else {
                        self.apply(fbind, fargs);
                    }

                    whenDone();
                    throttling = true;
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    //Function.prototype.once
    if (!Function.prototype.once) {
        defineProperty(Function.prototype, "once", {
            /**
             * Returns a function that will be executed at most one time, no matter how
             * often you call it. Useful for lazy initialization.
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @returns the value of the first execution
             */
            value: function (bind, args) {
                var first = false,
                    memo,
                    self = this;

                return function () {
                    var fargs = args || arguments,
                        fbind = bind || self;

                    if (first) {
                        return memo;
                    }

                    first = true;
                    return (memo = self.apply(fbind, fargs));
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    //Function.prototype.every
    if (!Function.prototype.every) {
        defineProperty(Function.prototype, "every", {
            /**
             * Returns a function that will be executed every <ntimes> times at most of <max_executions>
             * @param {Number} ntimes every n times
             * @param {Number} max_executions maximum number of executions
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @returns the value returned by given function or undefined if it's not executed.
             */
            value: function (ntimes, max_executions, bind, args) {
                var attempts = 0,
                    calls = 0,
                    self = this;

                return function () {
                    var fargs = args || arguments,
                        fbind = bind || self;

                    if (++attempts < ntimes || calls >= max_executions) {
                        return;
                    }
                    attempts = 0;
                    ++calls;

                    return self.apply(fbind, fargs);
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    //Function.prototype.after
    if (!Function.prototype.after) {
        defineProperty(Function.prototype, "after", {
            /**
             * Returns a function that will be really executed after you call it n times
             * @param {Number} ntimes
             */
            value: function (ntimes, bind, args) {
                return this.every(ntimes, 1, bind, args);
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    //Function.prototype.nth
    if (!Function.prototype.nth) {
        defineProperty(Function.prototype, "nth", {
            /**
             * Returns a function that will be executed ntimes with a given delay between them
             * If delay is false is cero will be executed right now
             * If first_delay is false is cero will be executed right now
             *
             * @note for delay setInterval is used to be sure that each function execution has the given delay
             *
             * @param {Number} ntimes how many times will be executed
             * @param {Number} delay dealy between first and the next execution
             * @param {Number} first_delay delay between call and first execution
             * @param {Function} last_func function to call when all is done with one arguments, an array of the returned
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             */
            value: function (ntimes, delay, first_delay, last_func, bind, args) {
                var self = this,
                    outputs = [],
                    interval;

                delay = delay === undefined ? false : delay;
                first_delay = first_delay === undefined ? false : first_delay;


                return function () {
                    var times = 1,
                        fargs = args || arguments,
                        fbind = bind || self;

                    // allow 0
                    if (first_delay === false) {
                        outputs.push(self.apply(fbind, fargs));

                        if (delay === false) {
                            for (times = 1; times < ntimes; ++times) {
                                outputs.push(self.apply(fbind, fargs));
                            }

                            last_func && last_func(outputs);
                        } else {
                            interval = setInterval(function () {
                                outputs.push(self.apply(fbind, fargs));
                                if (++times === ntimes) {
                                    clearInterval(interval);

                                    last_func && last_func(outputs);
                                }
                            }, delay);
                        }

                    } else {
                        setTimeout(function () {
                            outputs.push(self.apply(fbind, fargs));

                            if (delay === false) {
                                for (times = 1; times < ntimes; ++times) {
                                    outputs.push(self.apply(fbind, fargs));
                                }
                                last_func && last_func(outputs);
                            } else {
                                interval = setInterval(function () {
                                    outputs.push(self.apply(fbind, fargs));
                                    if (++times === ntimes) {
                                        clearInterval(interval);

                                        last_func && last_func(outputs);
                                    }
                                }, delay);
                            }
                        }, first_delay);
                    }
                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }


    //Function.prototype.funnel
    if (!Function.prototype.funnel) {
        defineProperty(Function.prototype, "funnel", {
            /**
             * Create a function that can be call x times in parallel, the followings is queued
             *
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @param {String} where append or prepend, where the callback will be.
             */
            value: function (max, bind, args, where) {
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

                self = this[where]([check]);

                return function () {
                    var fargs = args || (arguments.length ? slice.call(arguments) : []),
                        fbind = bind || self;

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
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    //Function.prototype.single
    if (!Function.prototype.single) {
        defineProperty(Function.prototype, "single", {
            /**
             * Create a function that can only be call once in parallel, the followings will be queued
             *
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @param {String} where append or prepend, where the callback will be.
             */
            value: function (bind, args, where) {
                return this.funnel(1, bind, args, where);
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

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
    if (!Function.prototype.cache) {
        defineProperty(Function.prototype, "cache", {
            /**
             * Get/create a function that will cache the return value with given the same arguments
             *
             * @throws so becareful
             *
             * @param {Mixed} bind Changes the scope of this within the returned function
             * @param {Array} args The arguments passed
             * @param {String} where append or prepend, where the callback will be.
             */
            value: function (cache_time_ms, bind, hash_function) {
                var cache = {
                    },
                    self = this;

                hash_function = hash_function || hash;

                return function () {
                    var hash_code = hash_function(slice.call(arguments)),
                        ts = +(new Date()),
                        fbind = bind || self;

                    if (cache[hash_code] !== undefined) {
                        if (cache[hash_code].expire > ts) {
                            return cache[hash_code];
                        } else {
                            delete cache[hash_code];
                        }
                    }

                    cache[hash_code] = self.apply(fbind, arguments);
                    cache[hash_code].expire = ts + cache_time_ms;

                    return cache[hash_code];

                };
            },
            writable : false,
            enumerable : false,
            configurable : false
        });
    }

    if (!Function.compose) {
        /**
         * Returns a function that is the composition of a list of functions, each
         * consuming the return value of the function that follows.
         *
         * credits - almost underscore
         *
         * @param {Function} any number of functions
         * @returns {Array} all returned values
         */
        Function.compose = function () {
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
    }

    if (!Function.sequencial) {
        /**
         * Returns a function that is the composition of a list of functions,
         * returns an array with all returned values by each function
         *
         * @param {Function} any number of functions
         * @returns {Array} all returned values
         */
        Function.sequencial = function () {
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
    }

}());