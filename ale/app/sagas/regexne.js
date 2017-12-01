// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "MAIN", "symbols": ["EXPRESSION"]},
    {"name": "EXPRESSION$string$1", "symbols": [{"literal":"."}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EXPRESSION", "symbols": ["EXPRESSION$string$1", "EXPRESSION", {"literal":","}, "EXPRESSION", {"literal":")"}]},
    {"name": "EXPRESSION$string$2", "symbols": [{"literal":"|"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EXPRESSION", "symbols": ["EXPRESSION$string$2", "EXPRESSION", {"literal":","}, "EXPRESSION", {"literal":")"}]},
    {"name": "EXPRESSION$string$3", "symbols": [{"literal":"*"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EXPRESSION", "symbols": ["EXPRESSION$string$3", "EXPRESSION", {"literal":")"}]},
    {"name": "EXPRESSION", "symbols": ["STATE"]},
    {"name": "STATE", "symbols": [/[A-Z]/]},
    {"name": "STATE", "symbols": [/[a-z]/]},
    {"name": "STATE", "symbols": [{"literal":"_"}]}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
