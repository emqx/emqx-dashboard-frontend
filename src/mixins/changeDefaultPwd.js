export default {
  methods: {
    preventLeaveWithoutChangeDefaultPwd(to, from, next) {
      const { name = '', params = {} } = to
      if (
        this.$store.state.user.isUsingDefaultPwd &&
        // For stop infinite loop
        !(name === 'users' && params.isForChangeDefaultPwd === true)
      ) {
        next({
          name: 'users',
          params: { isForChangeDefaultPwd: true },
          // just for vue route can update params, if don't add this, the params will not update
          // i think maybe this is a bug
          query: { _t: Date.now() },
        })
      } else {
        next()
      }
    },
  },
}
