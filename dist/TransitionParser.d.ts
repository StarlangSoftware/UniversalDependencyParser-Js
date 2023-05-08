import { UniversalDependencyTreeBankSentence } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import { UniversalDependencyTreeBankCorpus } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankCorpus";
import { DataSet } from "nlptoolkit-classification/dist/DataSet/DataSet";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
import { Oracle } from "./Oracle";
import { State } from "./State";
import { ScoringOracle } from "./ScoringOracle";
export declare abstract class TransitionParser {
    abstract simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>;
    abstract dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence;
    protected constructor();
    protected createResultSentence(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence): UniversalDependencyTreeBankSentence;
    simulateParseOnCorpus(corpus: UniversalDependencyTreeBankCorpus, windowSize: number): DataSet;
    private checkStates;
    protected initialState(sentence: UniversalDependencyTreeBankSentence): State;
    private constructCandidates;
    dependencyParseWithBeamSearch(oracle: ScoringOracle, beamSize: number, universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, transitionSystem: TransitionSystem): State;
    dependencyParseCorpus(universalDependencyTreeBankCorpus: UniversalDependencyTreeBankCorpus, oracle: Oracle): UniversalDependencyTreeBankCorpus;
}
