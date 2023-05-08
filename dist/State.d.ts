import { StackWord } from "./StackWord";
import { StackRelation } from "./StackRelation";
import { UniversalDependencyType } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyType";
import { UniversalDependencyTreeBankWord } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
export declare class State {
    private stack;
    private wordList;
    private relations;
    constructor(stack: Array<StackWord>, wordList: Array<StackWord>, relations: Array<StackRelation>);
    applyShift(): void;
    applyLeftArc(type: UniversalDependencyType): void;
    applyRightArc(type: UniversalDependencyType): void;
    applyArcEagerLeftArc(type: UniversalDependencyType): void;
    applyArcEagerRightArc(type: UniversalDependencyType): void;
    applyReduce(): void;
    apply(command: Command, type: UniversalDependencyType, transitionSystem: TransitionSystem): void;
    relationSize(): number;
    wordListSize(): number;
    stackSize(): number;
    getStackWord(index: number): UniversalDependencyTreeBankWord;
    getPeek(): UniversalDependencyTreeBankWord;
    getWordListWord(index: number): UniversalDependencyTreeBankWord;
    getRelation(index: number): StackRelation;
    clone(): State;
}
