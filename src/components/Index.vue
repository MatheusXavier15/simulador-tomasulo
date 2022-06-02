<template>
  <div class="hello">
    <div class="options-content">
      <register-insert v-for="n in 10" :key="n"/>
    </div>
  </div>
</template>

<script>
import registerInsert from './register-insert.vue'
export default {
  components: { registerInsert },
  name: 'IndexApp',
  props: {
    msg: String
  }
}
</script>

<style scoped>
  .options-content{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
