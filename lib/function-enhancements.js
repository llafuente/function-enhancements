(function () {
    "use strict";

    var defineProperty = Object.defineProperty || function (obj, name, prop) {
            if (prop.get || prop.set) {
                throw new Error("this is not supported in your js.engine");
            }
            obj[name] = prop.value;
        },
        slice = Array.prototype.slice;


    //
    // Function
    //

    // Function.prototype.pass
    defineProperty(Function.prototype, "pass", {
        /**
         * create a function with given args,
         * every time you call the function with any arguments you allways get the same.
         *
         * credits - mootools (Returns a closure with arguments and bind)
         *
         * @note: If you want to send null as arguments use: .pass([null], ?)
         * @param {Mixed} args, should be an array
         * @param {Mixed} bind
         * @return {Function} closure
         */
        value: function (args, bind) {
            var self = this;

            if (args !== null && args !== undefined) {
                args = slice.call(args);
            }

            return function () {
                return self.apply(bind || self, args || arguments);
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    // Function.prototype.args
    defineProperty(Function.prototype, "prepend", {
        /**
         * Returns a closure with the given arguments before the ones you send at the call
         * @param {Mixed} args, should be an array
         * @param {Mixed} bind
         * @return {Function} closure
         */
        value: function (args, bind) {
            var self = this,
                i,
                max = args.length,
                cloned;

            if (args !== null) {
                args = slice.call(args);
            } else {
                args = [];
            }


            return function () {
                cloned = [];
                for (i = 0; i < max; ++i) {
                    cloned.push(args[i]);
                }
                for (i = 0; i < arguments.length; ++i) {
                    cloned.push(arguments[i]);
                }

                return self.apply(bind || self, cloned);
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    // Function.prototype.args
    defineProperty(Function.prototype, "append", {
        /**
         * Returns a closure with the given arguments before the ones you send at the call
         * @param {Mixed} args, should be an array
         * @param {Mixed} bind
         * @return {Function} closure
         */
        value: function (args, bind) {
            var self = this,
                i,
                max = args.length,
                cloned;

            if (args !== null) {
                args = slice.call(args);
            } else {
                args = [];
            }


            return function () {
                cloned = [];
                for (i = 0; i < arguments.length; ++i) {
                    cloned.push(arguments[i]);
                }
                for (i = 0; i < max; ++i) {
                    cloned.push(args[i]);
                }

                return self.apply(bind || self, cloned);
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    // Function.prototype.delay
    defineProperty(Function.prototype, "delay", {
        /**
         * Execute a function in <delay_ms> miliseconds
         *
         * credits - mootools (Delays the execution of a function by a specified duration.)
         *
         * @note use: clearTimeout to stop the scheduled execution
         * @param {Number} delay_ms
         * @param {Mixed} bind
         * @param {Mixed} args
         * @return {Number} the interval so you can clearTimeout
         */
        value: function (delay_ms, bind, args) {
            return setTimeout(this.pass((args == null ? [] : args), bind || this), delay_ms);
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    // Function.prototype.periodical
    defineProperty(Function.prototype, "periodical", {
        /**
         * execute a function every <periodical_ms> miliseconds
         *
         * credits - mootools (Executes a function in the specified intervals of time. Periodic execution can be stopped using the clearInterval function.)
         *
         * @param {Number} periodical_ms
         * @param {Mixed} bind
         * @param {Mixed} args
         * @return {Number} the interval so you can clearInterval
         */
        value: function (periodical_ms, bind, args) {
            return setInterval(this.pass((args == null ? [] : args), bind || this), periodical_ms);
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    // Function.prototype.debounce
    defineProperty(Function.prototype, "debounce", {
        /**
         * Returns a function, that, as long as it continues to be invoked, will not
         * be triggered. The function will be called after it stops being called for
         * N milliseconds.
         *
         * credits - underscore
         *
         * @param {Number} wait_ms
         */
        value: function (wait_ms) {
            var timeout,
                self = this;
            return function () {
                var context = this,
                    args = arguments,
                    later = function () {
                        timeout = null;
                        self.apply(context, args);
                    };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait_ms);
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    // Function.prototype.throttle
    defineProperty(Function.prototype, "throttle", {
        /**
         * return a closure that execute a the given function is wait_ms passed from the last time.
         *
         * credits - underscore (Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly, will only actually call the original function at most once per every wait milliseconds. Useful for rate-limiting events that occur faster than you can keep up with.)
         *
         * @param {Number} wait
         */
        value: function (wait_ms) {
            var context,
                args,
                timeout,
                throttling,
                more,
                whenDone = function () { more = throttling = false; }.debounce(wait_ms),
                self = this;

            return function () {
                context = this;
                args = arguments;
                var later = function () {
                    timeout = null;

                    if (more) {
                        self.apply(context, args);
                    }

                    whenDone();
                };
                if (!timeout) {
                    timeout = setTimeout(later, wait_ms);
                }
                if (throttling) {
                    more = true;
                } else {
                    self.apply(context, args);
                }
                whenDone();
                throttling = true;
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    //Function.prototype.once
    defineProperty(Function.prototype, "once", {
        /**
         * Returns a function that will be executed at most one time, no matter how
         * often you call it. Useful for lazy initialization.
         */
        value: function () {
            var ran = false,
                memo,
                self = this;

            return function () {
                if (ran) {
                    return memo;
                }

                ran = true;
                return (memo = self.apply(this, arguments));
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });

    //Function.prototype.once
    defineProperty(Function.prototype, "every", {
        /**
         * Returns a function that will be executed at most one time, no matter how
         * often you call it. Useful for lazy initialization.
         */
        value: function (ntimes) {
            var calls = 0,
                self = this;

            return function () {
                if (++calls < ntimes) {
                    return;
                }
                calls = 0;

                return self.apply(this, arguments);
            };
        },
        writable : false,
        enumerable : false,
        configurable : false
    });
}());