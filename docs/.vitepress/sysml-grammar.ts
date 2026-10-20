// コードブロックの ```sysml に色を付けるための、SysML v2 の簡単な文法（Shiki・TextMate 形式）。
// キーワード・コメント・文字列・引用名・数・メタデータの印だけを見分ける。解析には使わない。

const KEYWORDS = [
  "about", "abstract", "accept", "action", "actor", "after", "alias", "all", "allocate", "allocation", "analysis", "and", "as", "assert",
  "assign", "assume", "at", "attribute", "bind", "binding", "by", "calc", "case", "comment", "concern", "connect", "connection",
  "constant", "constraint", "decide", "def", "default", "defined", "dependency", "derived", "do", "doc", "else", "end", "entry",
  "enum", "event", "exhibit", "exit", "expose", "filter", "first", "flow", "for", "fork", "frame", "from", "hastype", "if",
  "import", "in", "include", "individual", "inout", "interface", "istype", "item", "join", "language", "library", "locale", "loop",
  "merge", "message", "metadata", "nonunique", "not", "objective", "occurrence", "of", "or", "ordered", "out", "package",
  "parallel", "part", "perform", "port", "private", "protected", "public", "redefines", "ref", "references", "render",
  "rendering", "rep", "require", "requirement", "return", "satisfy", "send", "snapshot", "specializes", "stakeholder",
  "standard", "start", "state", "subject", "subsets", "succession", "terminate", "then", "timeslice", "to", "transition",
  "typed", "until", "use", "variant", "variation", "verification", "verify", "via", "view", "viewpoint", "when", "while", "xor",
  "done",
];

export const sysmlGrammar = {
  name: "sysml",
  scopeName: "source.sysml",
  aliases: ["kerml"],
  patterns: [
    { include: "#comments" },
    { name: "string.quoted.double.sysml", begin: '"', end: '"', patterns: [{ match: "\\\\.", name: "constant.character.escape.sysml" }] },
    { name: "string.quoted.single.sysml", match: "'[^']*'" },
    { name: "keyword.control.sysml", match: `\\b(?:${KEYWORDS.join("|")})\\b` },
    { name: "entity.name.tag.sysml", match: "[#@][A-Za-z_][\\w:]*" },
    { name: "constant.numeric.sysml", match: "\\b\\d+(?:\\.\\d+)?\\b" },
    { name: "keyword.operator.sysml", match: ":>>|::>|:>|::|:=|~|=>|\\.\\." },
  ],
  repository: {
    comments: {
      patterns: [
        { name: "comment.block.sysml", begin: "/\\*", end: "\\*/" },
        { name: "comment.line.double-slash.sysml", match: "//.*$" },
      ],
    },
  },
};
