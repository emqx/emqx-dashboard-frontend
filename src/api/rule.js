import http from '../common/api'

let lang = localStorage.getItem('language')

if (!['en', 'zh'].includes(lang)) {
  lang = 'en'
}

export async function loadRuleEvents() {
  const data = await http.get('/rule_events')
  const events = data.data
  return events.map(($) => {
    try {
      $.title = $.title[lang]
      $.description = $.description[lang]
    } catch (e) {
      console.log(e)
      $.title = $.event
      $.description = $.event
    }
    return $
  })
}

export default {}
