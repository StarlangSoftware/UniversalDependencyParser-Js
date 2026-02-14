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
    exports.TransitionSystem = void 0;
    var TransitionSystem;
    (function (TransitionSystem) {
        TransitionSystem[TransitionSystem["ARC_STANDARD"] = 0] = "ARC_STANDARD";
        TransitionSystem[TransitionSystem["ARC_EAGER"] = 1] = "ARC_EAGER";
    })(TransitionSystem = exports.TransitionSystem || (exports.TransitionSystem = {}));
});
//# sourceMappingURL=TransitionSystem.js.map