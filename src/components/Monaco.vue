<template>
  <div id="monaco"></div>
</template>


<script>
import * as monaco from 'monaco-editor'
import Monokai from '../assets/themes/monokai.json'

export default {
  name: 'monaco',

  props: {
    value: {
      required: true,
    },
    lang: {
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
  },

  methods: {
    initEditor() {
      // Defined theme
      monaco.editor.defineTheme('monokai', Monokai)
      // Create
      this.editor = monaco.editor.create(document.getElementById('monaco'), {
        value: this.value,
        language: this.lang,
        fontSize: 14,
        automaticLayout: true,
        readOnly: this.disabled,
        lineNumbersMinChars: 2,
        theme: this.getTheme(),
        colors: {
          'editor.background': '#394555'
        },
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
    getTheme() {
      return this.theme === 'dark-themes' ? 'monokai' : 'vs'
    },
  },

  mounted() {
    this.initEditor()
  },

  created() {
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


<style scoped>
#monaco {
  height: 100%;
  position: relative;
}
</style>
