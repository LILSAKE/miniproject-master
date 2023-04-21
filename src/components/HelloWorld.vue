<template>
  <div class="main">
    <div class="main-window">

      <div class="left-block">

        <div class="allTasksButton">Все задачи</div>

        <div class="middleMenu">

          <div v-if="folders.length === 0">
            папок нет
          </div>
          
          <div 
            v-for="(folder, index) in folders"
            :key="index"
            class="task"
            
          >
            <div @click="folderSelection(index)"  class="folderTask">
              <div 
                class="folderColorTasksСircle" 
               :style="{ backgroundColor: folder.color }"
              ></div>
              <div class="folderNameTasks">  
                {{ folder.title }}
              </div>
            </div>
          </div>
          
          
        </div>

        <div class="addFolderTasks">
          <button class="addFolderTasksButton">Добаить папку</button>
        </div>

      </div>

      <div class="main-menu">
        
        <div class="main-name"></div>
        <div class="main-body"></div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    folders: {
        type: Array,
        default() {
          return []
        },
        required: true,
    },
  },
  // methods: {
  //   folderSelection(index) {
  //     const mainName = document.querySelector(".main-name")
  //     mainName.innerHTML = this.folders[index].title
  //   }
  // },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-window {
  width: 90wh;
  height: 90vh;
  background-color: #ffffff;
  border: 1px solid;
  border-color: grey;
  display: flex;
}
.left-block {
  border: 1px solid;
  border-color: rgb(192, 205, 250);
  background-color: rgb(225, 245, 253);
  width: 25%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.main-name{
  border: 1px solid;
  border-color: gray;
  width: 100%;
  height: 20vh;
  display: flex;
  align-items: center;
  font-size: xx-large;
}
.main-menu {
  border: 1px solid;
  border-color: teal;
  width: 100%;
}
* {
  color: teal;
}
.addFolderTasksButton {
  background-color: #ffffff;
  border: 1px solid;
  border-color: teal;
  padding: 10px;
  margin: 10px;
}

.folderColorTasksСircle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 5px;
}
.folderTask {
  display: flex;
  align-items: center;
  margin-left: 52px;
}


</style>
