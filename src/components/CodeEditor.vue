<template>
  <div class="code-editor">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
/* eslint-disable */
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
// import 'codemirror/addon/hint/show-hint'
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/sql-hint'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/lesser-dark.css'
import 'codemirror/theme/dracula.css'

require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/sql/sql'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'code-editor',

  props: {
    primaryKey: {
      type: Array,
      default: () => [],
    },
    value: {
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '200px',
    },
    lineNumbers: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      codeEditor: false,
    }
  },

  computed: {
    currentTheme() {
      return localStorage.getItem('themes') || 'dark-themes'
    },
  },

  watch: {
    value(value) {
      const editorValue = this.codeEditor.getValue()
      if (value !== editorValue) {
        this.codeEditor.setValue(this.value)
      }
    },
    disabled() {
      this.codeEditor.setOption('readOnly', this.disabled)
    },
    primaryKey() {
      this.codeEditor.setOption('hintOptions', this.getHitOptions())
    },
    currentTheme() {
      const newTheme = this.getTheme()
      this.codeEditor.setOption('theme', newTheme)
    },
  },

  methods: {
    getHitOptions() {
      const hintOptions = {
        tables: {},
      }
      this.primaryKey.forEach(key => {
        hintOptions.tables[key] = []
      })
      return hintOptions
    },
    initEditorption() {
      const hintOptions = this.getHitOptions()
      this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: this.lineNumbers,
        mode: this.lang,
        gutters: ['CodeMirror-lint-markers'],
        theme: this.theme || this.getTheme(),
        lint: true,
        readOnly: this.disabled,
        hintOptions,
      })
      this.codeEditor.setSize('auto', this.height)
      this.codeEditor.setValue(this.value)
      const editor = this.codeEditor
      this.codeEditor.on('change', (cm, change) => {
        if (change.origin === '+input delete after+++') {
          const { text } = change
          if (text && (text[0] === ' ' || text[0] === ',')) {
            setTimeout(function() {
              editor.execCommand('autocomplete')
            }, 20)
          }
        }
        this.$emit('changed', cm.getValue())
        this.$emit('input', cm.getValue())
      })
    },

    getValue() {
      return this.codeEditor.getValue()
    },

    getTheme() {
      let theme = 'default'
      const langTheme = {
        python: 'dracula',
        'text/x-sql': 'dracula',
        'application/json': 'lesser-dark',
      }
      if (this.currentTheme === 'dark-themes' && langTheme[this.lang]) {
        return langTheme[this.lang]
      }
      return theme
    },
  },

  mounted() {
    this.initEditorption()
  },
}
</script>

<style scoped>
.code-editor {
  height: 100%;
  position: relative;
}

.code-editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
