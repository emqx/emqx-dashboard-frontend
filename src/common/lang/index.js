import { en as ruleEngineEn } from '~/views/RuleEngine/i18n'
import { zh as ruleEngineZh } from '~/views/RuleEngine/i18n'

import enLan from './en'
import zhLan from './zh_CN'

export default {
  en: { ...enLan, rule: ruleEngineEn },
  zh: { ...zhLan, rule: ruleEngineZh },
}
