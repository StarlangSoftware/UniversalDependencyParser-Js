(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Candidate"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Decision = void 0;
    const Candidate_1 = require("./Candidate");
    class Decision extends Candidate_1.Candidate {
        constructor(command, universalDependencyType, point) {
            super(command, universalDependencyType);
            this.point = point;
        }
        getPoint() {
            return this.point;
        }
    }
    exports.Decision = Decision;
});
//# sourceMappingURL=Decision.js.map