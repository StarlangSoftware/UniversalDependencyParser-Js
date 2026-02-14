(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Oracle", "./Decision", "./SimpleInstanceGenerator", "./Command"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ArcEagerOracle = void 0;
    const Oracle_1 = require("./Oracle");
    const Decision_1 = require("./Decision");
    const SimpleInstanceGenerator_1 = require("./SimpleInstanceGenerator");
    const Command_1 = require("./Command");
    class ArcEagerOracle extends Oracle_1.Oracle {
        constructor(model, windowSize) {
            super(model, windowSize);
        }
        makeDecision(state) {
            let instanceGenerator = new SimpleInstanceGenerator_1.SimpleInstanceGenerator();
            let instance = instanceGenerator.generate(state, this.windowSize, "");
            let best = this.findBestValidEagerClassInfo(this.commandModel.predictProbability(instance), state);
            let decisionCandidate = this.getDecisionCandidate(best);
            if (decisionCandidate.getCommand() == Command_1.Command.SHIFT) {
                return new Decision_1.Decision(Command_1.Command.SHIFT, null, 0.0);
            }
            else if (decisionCandidate.getCommand() == Command_1.Command.REDUCE) {
                return new Decision_1.Decision(Command_1.Command.REDUCE, null, 0.0);
            }
            return new Decision_1.Decision(decisionCandidate.getCommand(), decisionCandidate.getUniversalDependencyType(), 0.0);
        }
        scoreDecisions(state, transitionSystem) {
            return null;
        }
    }
    exports.ArcEagerOracle = ArcEagerOracle;
});
//# sourceMappingURL=ArcEagerOracle.js.map