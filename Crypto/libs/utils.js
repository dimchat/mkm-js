;

log = function () {
    console.log.apply(console, arguments);
};

assert = function (condition, message) {
    if (!condition) {
        throw Error(message);
    }
};
