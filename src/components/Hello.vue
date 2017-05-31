<template>
  <div class="hello">
    <pre>
      {{list}}
    </pre>
    <div class="option">
      <button @click="insert()">insert</button>
      <button @click="update()">update</button>
      <button @click="remove()">remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      list: null
    }
  },
  methods: {
    getList () {
      this.axios.get('/list')
      .then(res => {
        this.list = res.data
      })
      .catch(function (err) {
        console.error(err)
      })
    },
    insert(){
      this.axios.get('/insert')
      .then(res => {
        this.list = res.data
      })
      .catch(function (err) {
        console.error(err)
      })
    },
    update(){
      this.axios.get('/update')
      .then(res => {
        this.list = res.data
      })
      .catch(function (err) {
        console.error(err)
      })
    },
    remove(){
      this.axios.get('/remove')
      .then(res => {
        this.list = res.data
      })
      .catch(function (err) {
        console.error(err)
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
pre{
  text-align: left;
}
</style>
