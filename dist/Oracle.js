(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Candidate", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Oracle = void 0;
    const Candidate_1 = require("./Candidate");
    const UniversalDependencyRelation_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation");
    const UniversalDependencyType_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType");
    class Oracle {
        constructor(model, windowSize) {
            this.commandModel = model;
            this.windowSize = windowSize;
        }
        findBestValidEagerClassInfo(probabilities, state) {
            let bestValue = 0.0;
            let best = "";
            for (let key in probabilities) {
                if (probabilities.get(key) > bestValue) {
                    if (key == "SHIFT" || key == "RIGHTARC") {
                        if (state.wordListSize() > 0) {
                            best = key;
                            bestValue = probabilities.get(key);
                        }
                    }
                    else {
                        if (state.stackSize() > 1) {
                            if (!(key == "REDUCE" && state.getPeek().getRelation() == null)) {
                                best = key;
                                bestValue = probabilities.get(key);
                            }
                        }
                    }
                }
            }
            return best;
        }
        findBestValidStandardClassInfo(probabilities, state) {
            let bestValue = 0.0;
            let best = "";
            for (let key in probabilities) {
                if (probabilities.get(key) > bestValue) {
                    if (key == "SHIFT") {
                        if (state.wordListSize() > 0) {
                            best = key;
                            bestValue = probabilities.get(key);
                        }
                    }
                    else {
                        if (state.stackSize() > 1) {
                            best = key;
                            bestValue = probabilities.get(key);
                        }
                    }
                }
            }
            return best;
        }
        getDecisionCandidate(best) {
            let command, type;
            if (best.includes("(")) {
                command = best.substring(0, best.indexOf('('));
                let relation = best.substring(best.indexOf('(') + 1, best.indexOf(')'));
                type = UniversalDependencyRelation_1.UniversalDependencyRelation.getDependencyTag(relation);
            }
            else {
                command = best;
                type = UniversalDependencyType_1.UniversalDependencyType.DEP;
            }
            switch (command) {
                case "SHIFT":
                    return new Candidate_1.Candidate(Command.SHIFT, type);
                case "REDUCE":
                    return new Candidate_1.Candidate(Command.REDUCE, type);
                case "LEFTARC":
                    return new Candidate_1.Candidate(Command.LEFTARC, type);
                case "RIGHTARC":
                    return new Candidate_1.Candidate(Command.RIGHTARC, type);
            }
            return null;
        }
    }
    exports.Oracle = Oracle;
});
//# sourceMappingURL=Oracle.js.map