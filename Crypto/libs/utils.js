;

log = function () {
    console.log.apply(console, arguments);
};

assert = function (condition, message) {
    console.assert(condition, message);
    if (!condition) {
        throw new Error(message);
    }
};
