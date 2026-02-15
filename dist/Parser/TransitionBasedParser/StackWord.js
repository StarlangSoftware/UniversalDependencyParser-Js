"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackWord = void 0;
const UniversalDependencyTreeBankWord_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord");
class StackWord {
    word;
    toWord;
    constructor1() {
        this.word = new UniversalDependencyTreeBankWord_1.UniversalDependencyTreeBankWord();
    }
    constructor2(word, toWord) {
        this.word = word;
        this.toWord = toWord;
    }
    clone() {
        return new StackWord(this.word.clone(), this.toWord);
    }
    constructor(word, toWord) {
        if (word == undefined) {
            this.constructor1();
        }
        else {
            this.constructor2(word, toWord);
        }
    }
    getWord() {
        return this.word;
    }
    getToWord() {
        return this.toWord;
    }
}
exports.StackWord = StackWord;
//# sourceMappingURL=StackWord.js.map