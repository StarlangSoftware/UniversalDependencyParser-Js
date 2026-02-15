"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decision = void 0;
const Candidate_1 = require("./Candidate");
class Decision extends Candidate_1.Candidate {
    point;
    constructor(command, universalDependencyType, point) {
        super(command, universalDependencyType);
        this.point = point;
    }
    getPoint() {
        return this.point;
    }
}
exports.Decision = Decision;
//# sourceMappingURL=Decision.js.map