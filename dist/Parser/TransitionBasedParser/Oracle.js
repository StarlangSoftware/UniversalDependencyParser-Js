(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Candidate", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType", "./Command"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Oracle = void 0;
    const Candidate_1 = require("./Candidate");
    const UniversalDependencyRelation_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation");
    const UniversalDependencyType_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType");
    const Command_1 = require("./Command");
    class Oracle {
        /**
         * Constructs an Oracle with the given model and window size.
         * @param model the model used for making predictions
         * @param windowSize the size of the window used in parsing
         */
        constructor(model, windowSize) {
            this.commandModel = model;
            this.windowSize = windowSize;
        }
        /**
         * Finds the best valid parsing action for the ARC_EAGER transition system based on probabilities.
         * Ensures the action is applicable given the current state.
         * @param probabilities a map of actions to their associated probabilities
         * @param state the current parsing state
         * @return the best action as a string, or an empty string if no valid action is found
         */
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
        /**
         * Finds the best valid parsing action for the ARC_STANDARD transition system based on probabilities.
         * Ensures the action is applicable given the current state.
         * @param probabilities a map of actions to their associated probabilities
         * @param state the current parsing state
         * @return the best action as a string, or an empty string if no valid action is found
         */
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
        /**
         * Converts a string representation of the best action into a {@link Candidate} object.
         * @param best the best action represented as a string, possibly with a dependency type in parentheses
         * @return a {@link Candidate} object representing the action, or null if the action is unknown
         */
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
                    return new Candidate_1.Candidate(Command_1.Command.SHIFT, type);
                case "REDUCE":
                    return new Candidate_1.Candidate(Command_1.Command.REDUCE, type);
                case "LEFTARC":
                    return new Candidate_1.Candidate(Command_1.Command.LEFTARC, type);
                case "RIGHTARC":
                    return new Candidate_1.Candidate(Command_1.Command.RIGHTARC, type);
            }
            return null;
        }
    }
    exports.Oracle = Oracle;
});
//# sourceMappingURL=Oracle.js.map