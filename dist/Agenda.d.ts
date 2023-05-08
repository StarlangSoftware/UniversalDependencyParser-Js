import { State } from "./State";
import { ScoringOracle } from "./ScoringOracle";
export declare class Agenda {
    private agenda;
    private beamSize;
    constructor(beamSize: number);
    getKeySet(): IterableIterator<State>;
    updateAgenda(oracle: ScoringOracle, current: State): void;
    best(): State;
}
