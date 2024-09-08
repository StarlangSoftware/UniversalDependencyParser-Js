import { State } from "./State";
import { ScoringOracle } from "./ScoringOracle";
export declare class Agenda {
    private agenda;
    private beamSize;
    constructor(beamSize: number);
    /**
     * Retrieves the set of states currently in the agenda.
     * @return A set of states that are currently in the agenda.
     */
    getKeySet(): IterableIterator<State>;
    /**
     * Updates the agenda with a new state if it is better than the worst state
     * currently in the agenda or if there is room in the agenda.
     * @param oracle The ScoringOracle used to score the state.
     * @param current The state to be added to the agenda.
     */
    updateAgenda(oracle: ScoringOracle, current: State): void;
    /**
     * Retrieves the best state from the agenda based on the highest score.
     * @return The state with the highest score in the agenda.
     */
    best(): State;
}
