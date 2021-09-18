<template>
  <div class="container" >
     <div class="card" @click.stop="opened = !opened" v-for="topic in topics" :key="topic.topicId">
       <div class="content">
          <span class="span">{{ topic.name}}</span> <i @click="wantToDelete(topic.topicId)" class="icon fa fa-trash-o" style="font-size:24px"></i>
       </div>
       
    </div>
  </div>

</template>

<script>
import { ref } from 'vue'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import GetTopics from './graphql/GetTopics.gql'
import deleteTopicsMutation from './graphql/deleteTopics.mutation.gql'
import NProgress from 'nprogress'

export default {
  name: 'App',
  data(){
    return {
      opened: false,
      result2: {}
    }
  },
  setup() {
    const { result } = useQuery(GetTopics)
    const topics = useResult(result, null, data => data.Course[0].topics)


    const { mutate: deleteTopics } = useMutation(deleteTopicsMutation)

    function deleteAndUpdateCache(id) {
      NProgress.start()
      deleteTopics({ id }, {
      update: (store, {}) => {
        const data = store.readQuery({query: GetTopics})
        const updatedData = data.Course[0].topics.filter(w => w.id !== id)
        store.writeQuery({query: GetTopics, data: { Course: updatedData}})
      }
    }).finally(() => {
      NProgress.done()
    })
    }

    function wantToDelete(id){
      var result = confirm("Tem certeza que quer deletar?");
      if (result) {
       deleteAndUpdateCache(id);
    }
    }



    return {  topics, deleteAndUpdateCache, wantToDelete }
  },
}
</script>

<style>
#app {
  display: grid;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
	border: 1px solid #ffffff;
	box-sizing: border-box;
	border-radius: 8px;
  transition: 0.3s;
  height: 40px;
  width: 50vw;
  background-color: #fff;
  margin: 10px 25%;
}
.icon{
    text-align: right;
}

.content {
  padding: 0 0;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
  background-color: #e4e5e5;
  height: 500px;
  text-align: center;
}

.opened {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
