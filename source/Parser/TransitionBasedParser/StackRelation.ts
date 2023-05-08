import {
    UniversalDependencyTreeBankWord
} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
import {UniversalDependencyRelation} from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyRelation";

export class StackRelation {

    private readonly word: UniversalDependencyTreeBankWord
    private readonly relation: UniversalDependencyRelation

    constructor(word: UniversalDependencyTreeBankWord, relation: UniversalDependencyRelation) {
        this.word = word
        this.relation = relation
    }

    clone(): StackRelation{
        return new StackRelation(this.word.clone(), this.relation)
    }

    getWord(): UniversalDependencyTreeBankWord{
        return this.word
    }

    getRelation(): UniversalDependencyRelation{
        return this.relation
    }
}