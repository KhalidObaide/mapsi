<template>
    <div class="map">
        <div class="node-container">
            <Node
            v-for="node in nodes"
            :key="node.x+'-'+node.y"
            :isBuilding="isBuilding"
            :destroyActive="destroyActive"
            @startBuilding="startBuilding"
            @stopBuilding="stopBuilding"/>
        </div>
    </div>
</template>

<script>
import Node from '@/components/Node.vue';

export default{
    name: "Map",
    components:{
        Node
    },

    data(){return{
        nodes: [],
        isBuilding: false,
        destroyActive: false

    }},

    created(){
        // Generate the Nodes
        this.generateNodes();

        // Destroying the walls by holding Shift
        document.addEventListener("keydown", e=>{
            if(e.key == "Shift"){this.destroyActive = true;}
        });
        document.addEventListener("keyup", e=>{
            if(e.key == "Shift"){this.destroyActive = false;}
        });


    },

    methods:{
        generateNodes(){
            for(let y=0; y<30; y++){
                for(let x=0; x<36; x++){
                    this.nodes.push({x:x, y:y});
                }
            }
        },

        startBuilding(){this.isBuilding = true;},
        stopBuilding(){this.isBuilding = false;},
    }
}
</script>


<style scoped>
.map{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 30px;
    user-select: none;
}
.node-container{
    display: flex;
    flex-wrap : wrap;
    width: 802px; /* 2 px for the border */
    border: 1px solid gray;
}
</style>
