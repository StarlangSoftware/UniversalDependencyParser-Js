import { UniversalDependencyTreeBankWord } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import { UniversalDependencyRelation } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";
export declare class StackRelation {
    private readonly word;
    private readonly relation;
    constructor(word: UniversalDependencyTreeBankWord, relation: UniversalDependencyRelation);
    clone(): StackRelation;
    getWord(): UniversalDependencyTreeBankWord;
    getRelation(): UniversalDependencyRelation;
}
