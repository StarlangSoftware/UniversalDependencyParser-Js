import { TransitionParser } from "./TransitionParser";
import { UniversalDependencyTreeBankSentence } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankSentence";
import { Oracle } from "./Oracle";
import { Instance } from "nlptoolkit-classification/dist/Instance/Instance";
export declare class ArcStandardTransitionParser extends TransitionParser {
    constructor();
    private checkForMoreRelation;
    dependencyParse(universalDependencyTreeBankSentence: UniversalDependencyTreeBankSentence, oracle: Oracle): UniversalDependencyTreeBankSentence;
    simulateParse(sentence: UniversalDependencyTreeBankSentence, windowSize: number): Array<Instance>;
}
