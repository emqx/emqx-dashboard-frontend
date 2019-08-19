function setThemes(themes) {
  themes = ['dark-themes', 'light-themes'].includes(themes) ? themes : 'dark-themes'
  document.querySelector('html').setAttribute('class', themes)
}

function initThemes() {
  const themes = localStorage.getItem('themes') || 'dark-themes'
  setThemes(themes)
}

export { initThemes, setThemes }
