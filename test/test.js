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
            t.deepEqual(Array.prototype.slice.call(arguments), [ "say", "hello" ], "arguments missmatch");
            t.deepEqual(this, {key: "value"}, "this missmatch");
            t.end();

        }.prepend(["say", "hello"], {key: "value"});

        t2();
    });

    test("function.prepend 2", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "say", "hello", "thidparam!" ], "arguments missmatch");
            t.deepEqual(this, {key: "value"}, "this missmatch");

            t.end();
        }.prepend(["say", "hello"], {key: "value"});

        t2("thidparam!");
    });

    test("function.append", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), [ "say", "hello" ], "arguments missmatch");
            t.deepEqual(this, {key: "value"}, "this missmatch");
            t.end();

        }.append(["say", "hello"], {key: "value"});

        t2();
    });

    test("function.append 2", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), ["thidparam!", "say", "hello"], "arguments missmatch");
            t.deepEqual(this, {key: "value"}, "this missmatch");

            t.end();
        }.append(["say", "hello"], {key: "value"});

        t2("thidparam!");
    });

    test("function.pass", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), ["dont mind your args"], "arguments missmatch");
            t.deepEqual(this, {key: "value"}, "this missmatch");
        }.pass(["dont mind your args"], {key: "value"});

        t2();
        t2("second - is not displayed!");
        t.end();
    });

    test("function.pass2", function (t) {
        var t2 = function () {
            t.deepEqual(Array.prototype.slice.call(arguments), ["dont mind your args", "xxx"], "arguments missmatch");
        }.pass(["dont mind your args", "xxx"]);

        t2();
        t2("second - is not displayed!");
        t.end();
    });

    test("function.debounce", function (t) {
        var count = 0,
            t2 = function () {
                t.deepEqual(Array.prototype.slice.call(arguments), [ "dont mind your args" ], "arguments missmatch");
                t.deepEqual(this, {key: "value"}, "this missmatch");
                t.deepEqual(++count, 1, "count only one");

            }.debounce(250, ["dont mind your args"], {key: "value"});

        setTimeout(function () {
            t2();
        }, 100);
        t2();
        t2();
        t2();

        setTimeout(function () {
            t.end();
        }, 500);
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

    test("function.every", function (t) {

        counter = 0;

        var t4 = test_fn.every(2),
            i;

        for (i = 0; i < 10; ++i) {
            t4();
        }
        t.equal(counter, 5, "function.every error [" + counter + "] ");
        t.end();
    });

    test("function.every2", function (t) {

        counter = 0;

        var t4 = test_fn.every(2, 3),
            i;

        for (i = 0; i < 10; ++i) {
            t4();
        }
        t.equal(counter, 3, "function.every error [" + counter + "] ");
        t.end();
    });


    test("function.nth", function (t) {

        counter = 0;

        var t4 = test_fn.nth(5),
            i;

        t4();

        t.equal(counter, 5, "function.nth error [" + counter + "] ");
        t.end();
    });

    test("function.nth2", function (t) {

        counter = 0;

        var t4 = test_fn.nth(5, 100),
            i;

        t4();
        setTimeout(function () {
            t.equal(counter, 5, "function.nth error [" + counter + "] ");
            t.end();
        }, 1000);
    });

    test("function.nth3", function (t) {

        counter = 0;

        var t4 = test_fn.nth(5, 200, 500),
            i;

        t4();
        t.equal(counter, 0, "function.nth error [" + counter + "] ");

        setTimeout(function () {
            t.equal(counter, 1, "function.nth error [" + counter + "] ");
            t.end();
        }, 600);

        setTimeout(function () {
            t.equal(counter, 5, "function.nth error [" + counter + "] ");
            t.end();
        }, 1500);
    });

    test("function.single", function (t) {

        counter = 0;

        var tsingle = function (done) {
                console.log("tsingle", arguments);

                ++counter;
                setTimeout(function () {
                    done();
                }, 500);
            }.single();

        tsingle();
        tsingle();
        t.equal(counter, 1, "function.single error [" + counter + "] ");

        setTimeout(function () {
            t.equal(counter, 1, "function.single error [" + counter + "] ");
        }, 250);

        setTimeout(function () {
            t.equal(counter, 2, "function.single error [" + counter + "] ");
            t.end();
        }, 750);
    });

    test("function.funnel", function (t) {

        counter = 0;

        var tfunnel = function (done) {
                console.log("tsingle", arguments);

                ++counter;
                setTimeout(function () {
                    --counter;
                    done();
                }, 600);
            }.funnel(3);

        tfunnel();
        t.equal(counter, 1, "function.funnel error [" + counter + "] ");
        tfunnel();
        t.equal(counter, 2, "function.funnel error [" + counter + "] ");
        tfunnel();
        t.equal(counter, 3, "function.funnel error [" + counter + "] ");

        tfunnel();
        t.equal(counter, 3, "function.funnel error [" + counter + "] ");
        tfunnel();
        t.equal(counter, 3, "function.funnel error [" + counter + "] ");
        tfunnel();
        t.equal(counter, 3, "function.funnel error [" + counter + "] ");

        tfunnel();
        t.equal(counter, 3, "function.funnel error [" + counter + "] ");


        setTimeout(function () {
            t.equal(counter, 3, "function.funnel error [" + counter + "] ");
        }, 250);
        setTimeout(function () {
            t.equal(counter, 3, "function.funnel error [" + counter + "] ");
        }, 500);
        setTimeout(function () {
            t.equal(counter, 3, "function.funnel error [" + counter + "] ");
        }, 750);
        setTimeout(function () {
            t.equal(counter, 3, "function.funnel error [" + counter + "] ");
        }, 1000);

        setTimeout(function () {
            t.equal(counter, 0, "function.funnel error [" + counter + "] ");
            t.end();
        }, 2000);
    });




}());