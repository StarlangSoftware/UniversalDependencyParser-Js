(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Oracle", "./Decision", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation", "./Command"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RandomOracle = void 0;
    const Oracle_1 = require("./Oracle");
    const Decision_1 = require("./Decision");
    const UniversalDependencyType_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType");
    const UniversalDependencyRelation_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation");
    const Command_1 = require("./Command");
    class RandomOracle extends Oracle_1.Oracle {
        constructor(model, windowSize) {
            super(model, windowSize);
        }
        /**
         * Makes a random decision based on a uniform distribution over possible actions.
         * @param state The current state of the parser.
         * @return A Decision object representing the randomly chosen action.
         */
        makeDecision(state) {
            let command = Math.floor(Math.random() * 3);
            let relation = Math.floor(Math.random() * 58);
            switch (command) {
                case 0:
                    return new Decision_1.Decision(Command_1.Command.LEFTARC, UniversalDependencyRelation_1.UniversalDependencyRelation.universalDependencyTags[relation], 0);
                case 1:
                    return new Decision_1.Decision(Command_1.Command.RIGHTARC, UniversalDependencyRelation_1.UniversalDependencyRelation.universalDependencyTags[relation], 0);
                case 2:
                    return new Decision_1.Decision(Command_1.Command.SHIFT, UniversalDependencyType_1.UniversalDependencyType.DEP, 0);
            }
            return null;
        }
        scoreDecisions(state, transitionSystem) {
            return null;
        }
    }
    exports.RandomOracle = RandomOracle;
});
//# sourceMappingURL=RandomOracle.js.map