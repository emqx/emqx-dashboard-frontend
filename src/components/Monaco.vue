<template>
  <div :id="`monaco-${id}`" class="monaco-view"></div>
</template>


<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import Monokai from '../assets/themes/monokai.json'
import { createMonacoComplete, createMonacoHover } from '~/common/monacoUtils'

export default {
  name: 'monaco',

  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      editor: null,
      providerDisposeID: null,
      hoverDisposeID: null,
      sqlHints: [
        {
          name: 'SELECT',
          type: 'Keyword',
          detail: 'SQL',
          documentation: 'SQL selector.',
        },
        {
          name: 'FROM',
          type: 'Keyword',
          detail: 'SQL',
          documentation: 'What event.',
        },
        {
          name: 'WHERE',
          type: 'Keyword',
          detail: 'SQL',
          documentation: 'Filters a result set to include only records that fulfill a specified condition. ',
        },
      ],
    }
  },

  computed: {
    theme() {
      return localStorage.getItem('themes') || 'dark-themes'
    },
  },

  watch: {
    value(val) {
      if (this.editor) {
        if (val !== this.editor.getValue()) {
          this.editor.setValue(val)
        }
      }
    },
    lang(val) {
      if (this.editor) {
        this.editor.dispose()
        this.initEditor()
      }
    },
  },

  methods: {
    initEditor() {
      // Create
      const id = `monaco-${this.id}`
      this.editor = monaco.editor.create(document.getElementById(id), {
        value: this.value,
        language: this.lang,
        fontSize: 14,
        automaticLayout: true,
        lineHeight: 25,
        scrollBeyondLastLine: false,
        readOnly: this.disabled,
        lineNumbersMinChars: 2,
        theme: this.getTheme(),
        minimap: {
          enabled: false,
        },
        hover: {
          delay: 500,
          enabled: true,
        },
      })
      // event changed
      this.editor.onDidChangeModelContent((event) => {
        const value = this.editor.getValue()
        if (value !== this.value) {
          this.$emit('input', value, event)
          this.$emit('change', value, event)
        }
      })
      // Qucik save method
      this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
        this.$emit('qucik-save', this.value)
      })
    },
    defineTheme() {
      monaco.editor.defineTheme('monokai', Monokai)
    },
    getTheme() {
      return this.theme === 'dark-themes' ? 'monokai' : 'vs'
    },
    getHints() {
      const $hints = [...this.provider]
      if (this.lang === 'sql') {
        $hints.push(...this.sqlHints)
      }
      return $hints
    },
    registerCustomHintsProvider() {
      this.providerDisposeID = monaco.languages.registerCompletionItemProvider(this.lang, {
        provideCompletionItems: (model, position) => {
          const hints = this.getHints()
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }
          return {
            suggestions: createMonacoComplete(hints, range),
          }
        },
        triggerCharacters: [' '],
      })
    },
    registerCustomHoverProvider() {
      monaco.languages.register({ id: this.lang })
      this.hoverDisposeID = monaco.languages.registerHoverProvider(this.lang, {
        provideHover: (model, position) => {
          if (!model.getWordAtPosition(position)) {
            return {}
          }
          const { word } = model.getWordAtPosition(position)
          return {
            contents: createMonacoHover(word, this.provider)
          }
        },
      })
    },
  },

  mounted() {
    this.initEditor()
  },

  created() {
    this.defineTheme()
    window.onresize = () => {
      if (this.editor) {
        this.editor.layout()
      }
    }
    if (this.provider.length) {
      this.registerCustomHintsProvider()
      this.registerCustomHoverProvider()
    }
  },

  beforeDestroy() {
    if (this.editor) {
      this.editor.getModel().dispose()
      this.editor.dispose()
      this.editor = null
    }
    if (this.providerDisposeID) {
      this.providerDisposeID.dispose()
    }
    if (this.hoverDisposeID) {
      this.hoverDisposeID.dispose()
    }
  },
}
</script>


<style lang="scss">
.monaco-view {
  height: 100%;
  position: relative;
}
</style>
