"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candidate = void 0;
class Candidate {
    command;
    universalDependencyType;
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
//# sourceMappingURL=Candidate.js.map