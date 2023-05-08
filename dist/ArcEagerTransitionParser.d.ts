import { TransitionParser } from "./TransitionParser";
import { UniversalDependencyTreeBankSentence } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
import { Oracle } from "./Oracle";
export declare class ArcEagerTransitionParser extends TransitionParser {
    constructor();
    dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence;
    simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>;
}
