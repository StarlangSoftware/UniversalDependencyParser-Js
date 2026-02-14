(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Command = void 0;
    var Command;
    (function (Command) {
        Command[Command["RIGHTARC"] = 0] = "RIGHTARC";
        Command[Command["LEFTARC"] = 1] = "LEFTARC";
        Command[Command["SHIFT"] = 2] = "SHIFT";
        Command[Command["REDUCE"] = 3] = "REDUCE";
    })(Command = exports.Command || (exports.Command = {}));
});
//# sourceMappingURL=Command.js.map