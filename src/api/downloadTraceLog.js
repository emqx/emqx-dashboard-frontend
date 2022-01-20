import store from '~/store'

export const createURLWithAuth = (rawURL) => {
  const { protocol, host, pathname } = window.location
  const { password, username } = store.state.user
  const { useRelativeResourcePath } = store.state.config || {}
  return `${protocol}//${username}:${password}@${host}${useRelativeResourcePath ? pathname : ''}${rawURL}`
}

export default function downloadTrace(name) {
  const link = document.createElement('a')
  link.href = createURLWithAuth(`/api/v4/trace/${encodeURIComponent(name)}/download`)
  // link.setAttribute('download', 'emqx.zip')
  document.body.appendChild(link)
  link.click()
  return Promise.resolve()
}
