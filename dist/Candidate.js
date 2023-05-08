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
    exports.Candidate = void 0;
    class Candidate {
        constructor(command, universalDependencyType) {
            this.command = command;
            this.universalDependencyType = universalDependencyType;
        }
        getCommand() {
            return this.command;
        }
        getUniversalDependencyType() {
            return this.universalDependencyType;
        }
    }
    exports.Candidate = Candidate;
});
//# sourceMappingURL=Candidate.js.map