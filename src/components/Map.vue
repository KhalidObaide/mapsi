<template>
    <div class="map">
        <div style="display: flex; column-gap: 10px;">
            <button class="btn reset" v-on:click="resetGrid">Reset Map</button>
            <button class="btn action" v-on:click="visualize">Visualize</button>
        </div>
        <div class="node-container">
            <Node
            v-for="node in nodes"
            :key="node.x+'-'+node.y"
            :x="node.x" :y="node.y"
            :className="node.className"

            @startBuilding="startBuilding"
            @build="build"
            @stopBuilding="stopBuilding"/>
        </div>
    </div>
</template>

<script>
import Node from '@/components/Node.vue';
import AStar from '@/algs/AStar.js';

export default{
    name: "Map",
    components:{
        Node
    },

    data(){return{
        nodes: [],
        isBuilding: false,
        destroyActive: false,
        buildingType: 'wall', /* wall, start, end */

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
            else if(e.key == "w"){this.buildingType = "wall"}
            else if(e.key == "s"){
                this.buildingType = "start";
            }
            else if(e.key == "e"){this.buildingType = "end"}
        });


    },

    methods:{
        generateNodes(){
            for(let y=0; y<30; y++){
                for(let x=0; x<40; x++){
                    this.nodes.push({
                        x:x, y:y,
                        className: "node"
                    });
                }
            }
        },

        startBuilding(){this.isBuilding = true;},
        stopBuilding(){this.isBuilding = false;},
        build(attr){
            if(this.isBuilding || !attr.checkForBuilder){
                const node = this.nodes.find(n => n.x==attr.x && n.y==attr.y);
                if(!this.destroyActive){
                    if(this.buildingType == "start" || this.buildingType == "end"){
                        /* Also removeing the old start/end point */
                        const startNode = this.nodes.find(n => n.className == "node "+this.buildingType);
                        if(startNode){startNode.className = "node";}
                    }
                    node.className = 'node ' + this.buildingType;
                }else{
                    node.className = 'node';
                }
            }
        },

        resetGrid(){
            this.nodes = [];
            this.generateNodes();
        },

        visualize(){
            /* Initialize the AStar */
            const aStar = new AStar();
            aStar.setNodes(this.nodes);
            aStar.setWalls(this.nodes.filter(n=> n.className == "node wall").map(n=>this.nodes.indexOf(n)));
            aStar.setStart(this.nodes.indexOf(this.nodes.find(n=> n.className == "node start")));
            aStar.setEnd(this.nodes.indexOf(this.nodes.find(n=> n.className == "node end")));

            /* Getting & Colorize the result */
            try{
                let path = aStar.findPath();
                let i = 0;
                while(path){
                    let idx = path.idx;
                    setTimeout(()=>{
                        this.nodes[idx].className = "node path";
                    }, i*100);
                    path = path.parentNode;
                    i++;
                }
            }catch(e){
                if(e.toString() == "Error: Either start/end node is null or nodes contains less then 2 elements"){
                    alert("Please place a start & end node");
                }else{
                    console.log(e);
                    alert("Uknown Error Occured!");
                }
            }

        }, /* end of visualize function */

    }
}
</script>

<style scoped>
.map{
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 20px 0px;
    user-select: none;
}
.node-container{
    display: flex;
    flex-wrap : wrap;
    width: 802px; /* 2 px for the border */
    border: 1px solid gray;
    border-radius: 5px;
    overflow: hidden;
}
.map .btn{
    padding: 10px 20px;
    cursor: pointer;
    font-weight: bold;
    border-radius: 3px;
    transition: all 0.3s ease;
}

.map .btn:hover{
    transform: scale(0.95);
    opacity: 0.8;
}

.map .btn.reset{
    border: 1px solid red;
    background-color: red;
    color: white;
}
.map .btn.action{
    border: 1px solid lightgreen;
    background-color: lightgreen;
    color: green;
}
</style>
