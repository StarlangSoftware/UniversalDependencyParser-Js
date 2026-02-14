import { UniversalDependencyTreeBankWord } from "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord";
export declare class StackWord {
    private word;
    private toWord;
    constructor1(): void;
    constructor2(word: UniversalDependencyTreeBankWord, toWord: number): void;
    clone(): StackWord;
    constructor(word?: UniversalDependencyTreeBankWord, toWord?: number);
    getWord(): UniversalDependencyTreeBankWord;
    getToWord(): number;
}
