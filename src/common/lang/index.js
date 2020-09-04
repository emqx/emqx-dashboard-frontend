import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
import jaLocale from 'element-ui/lib/locale/lang/ja'

import { en as ruleEngineEn, zh as ruleEngineZh, ja as ruleEngineJa } from '~/views/RuleEngine/i18n'

import enLan from './en'
import zhLan from './zh_CN'
import jaLan from './ja'

export default {
  en: {
    ...enLan,
    ...enLocale,
    rule: ruleEngineEn,
  },
  zh: {
    ...zhLan,
    ...zhLocale,
    rule: ruleEngineZh,
  },
  ja: {
    ...jaLan,
    ...jaLocale,
    rule: ruleEngineJa,
  },
}
