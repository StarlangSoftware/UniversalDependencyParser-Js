import {ScoringOracle} from "./ScoringOracle";
import {State} from "./State";

export class RandomScoringOracle extends ScoringOracle{

    score(state: State): number {
        return Math.random()
    }

}