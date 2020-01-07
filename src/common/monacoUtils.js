import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export function createMonacoComplete(hints, range) {
  let customHints = []
  if (hints.length) {
    customHints = hints.map((doc) => ({
      label: doc.name,
      // kind is icon
      kind: doc.type ? monaco.languages.CompletionItemKind[doc.type] : monaco.languages.CompletionItemKind.Function,
      documentation: doc.documentation,
      insertText: doc.name,
      detail: doc.detail || 'EMQX',
      range,
    }))
  }
  return customHints
}


function getValueName(hint) {
  let { name, default: defaultValue, valueType } = hint
  if (valueType) {
    name = `${name}: ${valueType}`
  }
  return defaultValue ? `${name}, value: ${defaultValue}` : name
}
export function createMonacoHover(key, hints) {
  const contents = []
  hints.forEach((hint) => {
    let word = hint.name
    if (hint.name.match(/\$events\//)) {
      word = hint.name.split('/')[1].replace('"', '')
    }
    if (key === word) {
      contents.push({
        value: getValueName(hint)
      }, {
        value: hint.documentation,
      })
    }
  })
  return contents
}

export default {}
