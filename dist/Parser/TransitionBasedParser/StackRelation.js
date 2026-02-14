(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StackRelation = void 0;
    class StackRelation {
        constructor(word, relation) {
            this.word = word;
            this.relation = relation;
        }
        clone() {
            return new StackRelation(this.word.clone(), this.relation);
        }
        getWord() {
            return this.word;
        }
        getRelation() {
            return this.relation;
        }
    }
    exports.StackRelation = StackRelation;
});
//# sourceMappingURL=StackRelation.js.map