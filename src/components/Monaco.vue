<template>
  <div :id="`monaco-${id}`" class="monaco-view"></div>
</template>


<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import Monokai from '../assets/themes/monokai.json'

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
  },

  data() {
    return {
      editor: null,
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
  },

  beforeDestroy() {
    if (this.editor) {
      this.editor.dispose()
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
