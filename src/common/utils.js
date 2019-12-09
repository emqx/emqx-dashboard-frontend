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

function getRule(type) {
  const ruleMap = {
    url: 'url',
  }
  return ruleMap[type] || 'string'
}

function getRule2(item) {
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
  rule.type = type
  // format first
  if (validateType.includes(format)) {
    rule.type = format
  }
  rule.enum = type === 'enum' ? enumValue : undefined

  // if (type === 'object') {
  //   rule = {
  //     required,
  //     validator: (rule, value, callback, source) => {
  //       try {
  //         const data = JSON.parse(value)
  //         source[key] = {}
  //       } catch (e) {
  //
  //       }
  //     },
  //   }
  // }
  return Object.keys(rule).length > 0 ? rule : undefined
}

export function params2Form2(params = {}, deepKey = '') {
  const model = []
  let resource = ''
  const rules = {
    [deepKey]: {},
  }

  Object.entries(params).forEach((item) => {
    const [key, value] = item

    if (key === '$resource') {
      resource = 'string'
      return
    }

    const { format, enum: enumValue, input } = value
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
    const $attrs = {
      placeholder,
    }

    if (enumValue || type === 'boolean') {
      type = 'emq-select'
      if (enumValue) {
        $attrs.field = { options: enumValue.map($ => ({ value: $, label: $ })) }
      } else {
        $attrs.field = { options: [{ label: true, value: true }, { label: false, value: false }] }
      }
    }
    if (type === 'object' && !defaultValue) {
      defaultValue = {}
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
    })
    if (deepKey) {
      rules[deepKey][key] = getRule2(item)
    } else {
      rules[key] = getRule2(item)
    }
  })

  return { model, rules, resource }
}

export function params2Form(params = {}) {
  const model = []
  const rules = {}
  let resource = ''

  Object.entries(params).forEach((item) => {
    const [key, value] = item
    if (key === '$resource') {
      resource = value
      return
    }

    model.push({
      key,
      label: key,
      prop: key,
      rules: { type: getRule(value), required: true, message: `${key} ${dictMap.is_required[lang]}` },
      placeholder: value.toString(),
    })
    rules[`params.${key}`] = { required: true, message: `${key} ${dictMap.is_required[lang]}` }
  })

  return { model, rules, resource }
}

export function getPluginLink(pluginName) {
  if (lang === 'en') {
    return pluginsEn[pluginName]
  }
  return pluginsZh[pluginName]
}

export function matchSearch(data, searchKey, searchValue) {
  return new Promise((resolve, reject) => {
    try {
      const filterData = data.filter(($) => {
        if ($[searchKey]) {
          const key = $[searchKey].toLowerCase().replace(/\s+/g, '')
          const value = searchValue.toLocaleLowerCase().replace(/\s+/g, '')
          return key.match(value)
        } else {
          return null
        }
      })
      return resolve(filterData)
    } catch (error) {
      return reject(error)
    }
  })
}

export default {}
