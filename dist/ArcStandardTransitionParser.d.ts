import { TransitionParser } from "./TransitionParser";
import { UniversalDependencyTreeBankSentence } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import { Oracle } from "./Oracle";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare class ArcStandardTransitionParser extends TransitionParser {
    constructor();
    /**
     * Checks if there are more relations with a specified ID in the list of words.
     * @param wordList The list of words to check.
     * @param id The ID to check for.
     * @return True if no more relations with the specified ID are found; false otherwise.
     */
    private checkForMoreRelation;
    /**
     * Performs dependency parsing on the given sentence using the provided oracle.
     * @param universalDependencyTreeBankSentence The sentence to be parsed.
     * @param oracle The oracle used to make parsing decisions.
     * @return The parsed sentence with dependency relations established.
     */
    dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence;
    /**
     * Simulates the parsing process for a given sentence using the Arc Standard parsing algorithm.
     * @param sentence The sentence to be parsed.
     * @param windowSize The size of the window used for feature generation.
     * @return An ArrayList of {@link Instance} objects representing the parsed actions.
     */
    simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>;
}
