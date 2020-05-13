export default [
  {
    path: '/auth',
    name: 'auth_user',
    method: 'POST',
    descr: 'Authenticate an user',
  },
  {
    path: '/users/',
    name: 'create_user',
    method: 'POST',
    descr: 'Create an user',
  },
  {
    path: '/users/',
    name: 'list_users',
    method: 'GET',
    descr: 'List users',
  },
  {
    path: '/users/:name',
    name: 'update_user',
    method: 'PUT',
    descr: 'Update an user',
  },
  {
    path: '/users/:name',
    name: 'delete_user',
    method: 'DELETE',
    descr: 'Delete an user',
  },
  {
    path: '/change_pwd/:username',
    name: 'change_pwd',
    method: 'PUT',
    descr: 'Change password for an user',
  },
  {
    path: '/apps/',
    name: 'add_app',
    method: 'POST',
    descr: 'Add Application',
  },
  {
    path: '/apps/:appid',
    name: 'del_app',
    method: 'DELETE',
    descr: 'Delete Application',
  },
  {
    path: '/apps/',
    name: 'list_apps',
    method: 'GET',
    descr: 'List Applications',
  },
  {
    path: '/apps/:appid',
    name: 'lookup_app',
    method: 'GET',
    descr: 'Lookup Application',
  },
  {
    path: '/apps/:appid',
    name: 'update_app',
    method: 'PUT',
    descr: 'Update Application',
  },
]
