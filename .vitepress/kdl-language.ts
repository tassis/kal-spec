export const kdlLanguage = {
  name: 'kdl',
  displayName: 'KDL',
  scopeName: 'source.kdl',
  patterns: [
    {
      name: 'comment.line.double-slash.kdl',
      match: '//.*$',
    },
    {
      name: 'string.quoted.double.kdl',
      match: '"(?:[^"\\\\]|\\\\.)*"',
    },
    {
      name: 'entity.name.function.kdl',
      match: '\\bcore\\.(?:use|splice|each|assign|load_vars)\\b',
    },
    {
      name: 'variable.other.member.kdl',
      match: '\\b(?:inputs|locals|outputs|globals|loop)\\.[A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*|\\[\\d+\\])*',
    },
    {
      name: 'keyword.control.kdl',
      match: '\\b(?:plan|recipe|fragment|inputs(?!\\.)|locals(?!\\.)|outputs(?!\\.)|globals(?!\\.)|capture|when|check|local|bind|in|as|do|all|any)\\b',
    },
    {
      name: 'variable.language.kdl',
      match: '\\b(?:type|default|access|to|recipe|fragment|source)=(?=[^\\s}]+)',
    },
    {
      name: 'constant.language.kdl',
      match: '#(?:true|false|null)\\b',
    },
    {
      name: 'constant.numeric.kdl',
      match: '\\b-?(?:0|[1-9]\\d*)(?:\\.\\d+)?\\b',
    },
  ],
} as const
