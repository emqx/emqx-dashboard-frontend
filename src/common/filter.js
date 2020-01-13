import dateformat from 'dateformat'

export default {
  dateFormat(date) {
    if (!date) {
      return ''
    }
    if (date.toString().length === 10) {
      return dateformat(date * 1000, 'yyyy-mm-dd HH:MM:ss')
    }
    return dateformat(date, 'yyyy-mm-dd HH:MM:ss')
  },
}
