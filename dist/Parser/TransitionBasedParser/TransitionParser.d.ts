import { UniversalDependencyTreeBankSentence } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import { UniversalDependencyTreeBankCorpus } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankCorpus";
import { DataSet } from "nlptoolkit-classification/dist/DataSet/DataSet";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
import { Oracle } from "./Oracle";
import { State } from "./State";
import { ScoringOracle } from "./ScoringOracle";
import { TransitionSystem } from "./TransitionSystem";
export declare abstract class TransitionParser {
    /**
     * Parses a single sentence and returns a list of instances that represent the parsing process.
     * @param sentence the sentence to be parsed
     * @param windowSize the size of the window used in parsing
     * @return a list of {@link Instance} objects representing the parsing process
     */
    abstract simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>;
    /**
     * Parses a single sentence using a specified oracle and returns the parsed sentence with dependencies.
     * @param universalDependencyTreeBankSentence the sentence to be parsed
     * @param oracle the oracle used for guiding the parsing process
     * @return a {@link UniversalDependencyTreeBankSentence} with dependencies parsed
     */
    abstract dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence;
    protected constructor();
    /**
     * Creates a new {@link UniversalDependencyTreeBankSentence} with the same words as the input sentence,
     * but with null heads, effectively cloning the sentence structure without dependencies.
     * @param universalDependencyTreeBankSentence the sentence to be cloned
     * @return a new {@link UniversalDependencyTreeBankSentence} with copied words but no dependencies
     */
    protected createResultSentence(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence): UniversalDependencyTreeBankSentence;
    /**
     * Simulates parsing a corpus of sentences, returning a dataset of instances created by parsing each sentence.
     * @param corpus the corpus to be parsed
     * @param windowSize the size of the window used in parsing
     * @return a {@link DataSet} containing instances from parsing each sentence in the corpus
     */
    simulateParseOnCorpus(corpus: UniversalDependencyTreeBankCorpus, windowSize: number): DataSet;
    /**
     * Checks if there are any states in the agenda that still have words to process or have more than one item in the stack.
     * @param agenda the agenda containing the states
     * @return true if there are states to process, false otherwise
     */
    private checkStates;
    /**
     * Initializes the parsing state with a stack containing one empty {@link StackWord} and a word list containing all words in the sentence.
     * @param sentence the sentence to initialize the state with
     * @return a {@link State} representing the starting point for parsing
     */
    protected initialState(sentence: UniversalDependencyTreeBankSentence): State;
    /**
     * Constructs possible parsing candidates based on the current state and transition system.
     * @param transitionSystem the transition system used (ARC_STANDARD or ARC_EAGER)
     * @param state the current parsing state
     * @return a list of possible {@link Candidate} actions to be applied
     */
    private constructCandidates;
    /**
     * Performs dependency parsing with beam search to find the best parse for a given sentence.
     * @param oracle the scoring oracle used for guiding the search
     * @param beamSize the size of the beam for beam search
     * @param universalDependencyTreeBankSentence the sentence to be parsed
     * @param transitionSystem the transition system used (ARC_STANDARD or ARC_EAGER)
     * @return the best parsing state from the beam search
     */
    dependencyParseWithBeamSearch(oracle: ScoringOracle, beamSize: number, universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, transitionSystem: TransitionSystem): State;
    /**
     * Parses a corpus of sentences using the given oracle and returns a new corpus with the parsed sentences.
     * @param universalDependencyTreeBankCorpus the corpus to be parsed
     * @param oracle the oracle used for guiding the parsing process
     * @return a {@link UniversalDependencyTreeBankCorpus} containing the parsed sentences
     */
    dependencyParseCorpus(universalDependencyTreeBankCorpus: UniversalDependencyTreeBankCorpus, oracle: Oracle): UniversalDependencyTreeBankCorpus;
}
