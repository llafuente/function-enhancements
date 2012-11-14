(function () {
    "use strict";

    require("../index.js");
    var tap = require("tap"),
        test = tap.test,
        counter = 0,
        test_fn = function () {
            ++counter;

            return {
                "arguments": Array.prototype.slice.call(arguments)
            };
        };

    test("function.prepend", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "say", "hello" ], "args error");
            t.deepEqual(this, {key: "value"}, "args error");
            t.end();

        }.prepend(["say", "hello"], {key: "value"});

        t2();
    });

    test("function.prepend 2", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "say", "hello", "thidparam!" ], "args error");
            t.deepEqual(this, {key: "value"}, "args error");

            t.end();
        }.prepend(["say", "hello"], {key: "value"});

        t2("thidparam!");
    });

    test("function.append", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "say", "hello" ], "args error");
            t.deepEqual(this, {key: "value"}, "args error");
            t.end();

        }.append(["say", "hello"], {key: "value"});

        t2();
    });

    test("function.append 2", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "thidparam!", "say", "hello" ], "args error");
            t.deepEqual(this, {key: "value"}, "args error");

            t.end();
        }.append(["say", "hello"], {key: "value"});

        t2("thidparam!");
    });

    test("function.pass", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "dont mind your args" ], "args error");
            t.deepEqual(this, {key: "value"}, "args error");
        }.pass(["dont mind your args"], {key: "value"});

        t2();
        t2("second - is not displayed!");
        t.end();
    });


    test("function.throttle & function.periodical", function (t) {

        counter = 0;

        var t4 = test_fn.throttle(1000),
            inter = t4.periodical(50);

        setTimeout(function () {
            t.equal(counter, 2, "sequence_1 error [" + counter + "] ");
            clearInterval(inter);
            t.end();
        }, 1500);

    });

}());