"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomScoringOracle = void 0;
const ScoringOracle_1 = require("./ScoringOracle");
class RandomScoringOracle extends ScoringOracle_1.ScoringOracle {
    score(state) {
        return Math.random();
    }
}
exports.RandomScoringOracle = RandomScoringOracle;
//# sourceMappingURL=RandomScoringOracle.js.map