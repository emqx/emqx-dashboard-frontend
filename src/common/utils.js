import Vue from 'vue'
import Clipboard from 'clipboard'
import parser from 'js-sql-parser'
import { pluginsZh, pluginsEn } from './urls_links'

const lang = window.localStorage.language || window.EMQX_DASHBOARD_CONFIG.lang || 'en'
const dictMap = {
  is_required: {
    en: 'is required',
    zh: '必填',
  },
}
const validateType = [
  'string',
  'number',
  'boolean',
  'method',
  'regexp',
  'integer',
  'float',
  'array',
  'object',
  'enum',
  'date',
  'url',
  'hex',
  'email',
]

function getRule(item) {
  const [key, value] = item
  const { type, format, required, enum: enumValue } = value
  let { title } = value
  if (typeof title === 'object') {
    title = title[lang]
  }
  const rule = {}
  if (required) {
    rule.required = true
    rule.message = `${title || key} ${dictMap.is_required[lang]}`
  }
  if (type === 'array' || 'boolean') {
    return
  }
  rule.type = type
  // format first
  // Can't create resources when deploy using docker cause host is service name, not IP if using url type rules
  if (validateType.includes(format) && format !== 'url') {
    rule.type = format
  }
  rule.enum = type === 'enum' ? enumValue : undefined

  return Object.keys(rule).length > 0 ? rule : undefined
}

export function params2Form(params = {}, deepKey = '') {
  let model = []
  let resource = ''
  const rules = {
    [deepKey]: {},
  }
  // 数组中的一个对象
  let oneObjOfArray = {}

  Object.entries(params).forEach(item => {
    const [key, value] = item

    if (key === '$resource') {
      resource = 'string'
      return
    }

    const { format, enum: enumValue, input, order, items } = value
    let { title, type, description, default: defaultValue } = value
    if (typeof title === 'object') {
      title = title[lang]
    }
    if (typeof description === 'object') {
      description = description[lang]
    }

    let placeholder = defaultValue || ''
    const placeholderMap = {
      url: 'http://',
    }
    if (validateType.includes(format)) {
      placeholder = placeholderMap[format]
    }
    placeholder = placeholder.toString()
    const $attrs = {
      placeholder,
    }

    if (enumValue || type === 'boolean') {
      type = 'emq-select'
      if (enumValue) {
        $attrs.field = { options: enumValue.map($ => ({ value: $, label: $ })) }
      } else {
        $attrs.field = {
          options: [{ label: true, value: true }, { label: false, value: false }],
        }
      }
    }
    if (type === 'object' && !defaultValue) {
      defaultValue = {}
    }

    if (type === 'array' && items.type === 'object') {
      const { schema } = items
      oneObjOfArray = params2Form(schema, 'config')
      if (!defaultValue.length) {
        defaultValue = []
      }
    }

    if (input === 'textarea') {
      $attrs.type = 'textarea'
      $attrs.rows = 5
    }
    model.push({
      key,
      type,
      label: title || key,
      prop: key,
      defaultValue,
      $attrs,
      description: (description || '').replace(/\n/g, '<br/>'),
      order,
      oneObjOfArray,
    })
    if (deepKey) {
      rules[deepKey][key] = getRule(item)
    } else {
      rules[key] = getRule(item)
    }
  })

  model = model.sort((prev, next) => prev.order - next.order)
  return { model, rules, resource }
}

export function getPluginLink(pluginName) {
  if (lang === 'zh') {
    return pluginsZh[pluginName]
  }
  return pluginsEn[pluginName]
}

export function matchSearch(data, searchKey, searchValue) {
  return new Promise((resolve, reject) => {
    try {
      const filterData = data.filter($ => {
        if ($[searchKey]) {
          const key = $[searchKey].toLowerCase().replace(/\s+/g, '')
          const value = searchValue.toLocaleLowerCase().replace(/\s+/g, '')
          return key.match(value)
        }
        return null
      })
      return resolve(filterData)
    } catch (error) {
      return reject(error)
    }
  })
}

export function ruleOldSqlCheck(sql) {
  // eslint-disable-next-line no-useless-escape
  const $sql = sql.replace(/\"/g, '')
  const oldEvent = [
    'message.publish',
    'message.deliver',
    'message.acked',
    'message.dropped',
    'client.connected',
    'client.disconnected',
    'client.subscribe',
    'client.unsubscribe',
  ]
  let matchRes = null
  oldEvent.forEach(e => {
    const [eventType, eventValue] = e.split('.')
    const eventReg = new RegExp(`${eventType}\\.${eventValue}`, 'gim')
    if ($sql.match(eventReg)) {
      matchRes = $sql.match(eventReg)
    }
  })
  return matchRes
}

export function ruleNewSqlParser(sql, e) {
  const oldEventDict = {
    'message.publish': '',
    'message.deliver': '$events/message_delivered',
    'message.acked': '$events/message_acked',
    'message.dropped': '$events/message_dropped',
    'client.connected': '$events/client_connected',
    'client.disconnected': '$events/client_disconnected',
    'client.subscribe': '$events/session_subscribed',
    'client.unsubscribe': '$events/session_unsubscribed',
  }
  let newEvent = oldEventDict[e]
  // eslint-disable-next-line no-useless-escape
  const $sql = sql.replace(/\"/g, '')
  const ast = parser.parse($sql)
  if (newEvent === '') {
    ast.value.where = null
    newEvent = '#'
  }
  ast.value.from.value[0].value.value.value = `"${newEvent}"`
  return parser.stringify(ast)
}

function clipboardSuccess() {
  Vue.prototype.$message({
    message: Vue.prototype.$t('oper.copySuccess'),
    type: 'success',
    duration: 1500,
  })
}
function clipboardError() {
  Vue.prototype.$message({
    message: Vue.prototype.$t('oper.copyFailed'),
    type: 'error',
  })
}
export function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}

/**
 * @param duration (ms)
 * @return dd:hh:mm:ss
 */
export function getDateDiff(duration) {
  // get total seconds value (s)
  const dateDiff = Math.floor(duration / 1000)
  const days = Math.floor(dateDiff / (3600 * 24))

  const daysRemainder = dateDiff % (3600 * 24)
  const hours = Math.floor(daysRemainder / 3600)

  const minutes = Math.floor((dateDiff % 3600) / 60)
  const seconds = dateDiff % 60

  return [days, hours, minutes, seconds]
    .map((n) => n > 10 ? n : `0${n}`)
    .join(':')
}

export const verifyID = (rule, value, callback) => {
  const reg = /^[0-9a-zA-Z_:]{1,64}$/
  if (!value) {
    callback(new Error(`ID ${Vue.prototype.$t('rule.is_required')}`))
  } else if (value.length > 64) {
    callback(new Error(Vue.prototype.$t('rule.id_len_tip')))
  } else if (!reg.test(value)) {
    callback(new Error(Vue.prototype.$t('rule.id_char_tip')))
  } else {
    callback()
  }
}

export const intercept = (text, len) => {
  if (text && text.length > len) {
    return `${text.substring(0, len)}...`
  }
  return text
}

export default {}
