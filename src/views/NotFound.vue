<template>
  <div class="not-found">
    <p>404 Not Found</p>
    <router-link to="/">Homepage</router-link>
    <router-link to="#" @click="$router.go(-2)">Back up</router-link>
  </div>
</template>


<script>
export default{
  name: 'NotFound',
}
</script>


<style lang="scss">
.not-found {
  text-align: center;
  padding: 50px;
  p {
    margin-top: 30px;
    font-size: 20px;
  }
  a {
    margin-right: 20px;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
