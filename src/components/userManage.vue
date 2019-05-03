<template>
  <div class="container">
    <tableInfo></tableInfo>
    <updatePerson></updatePerson>
    <editInfo></editInfo>
    <addUser></addUser>
  </div>
</template>

<script>
  import editInfo from './editInfo.vue'
  import tableInfo from './tableInfo.vue'
  import addUser from './addUser.vue'
  import updatePerson from './updatePerson'

  export default {
    data(){
      return {

      }
    },
    components:{
      updatePerson,
      editInfo,
      tableInfo,
      addUser
    },
    methods:{

    },
    mounted(){

    }
  }
</script>

<style scoped>
  .container{
    overflow-y: auto;
    width:100%;
    height:100%;
    float:left;
  }
</style>
