(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackWord = void 0;
    const UniversalDependencyTreeBankWord_1 = require("nlptoolkit-dependencyparser/dist/Universal/UniversalDependencyTreeBankWord");
    class StackWord {
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
});
//# sourceMappingURL=StackWord.js.map