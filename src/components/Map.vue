<template>
    <div class="map">

        <div class="modal-wrapper" v-if="this.modalDisplay">
            <div class="modal">
                <div class="modal-header">
                    <h4>Help Menu</h4>
                    <img src="../assets/cross.svg" v-on:click="()=>{modalDisplay = false}"/>
                </div>
                <div class="modal-content">
                    <ul>
                        <li>Press `w` to enable building walls & Click on any tile to place walls</li>
                        <li>Press `s` to be able to place Starting Point</li>
                        <li>Press `e` to be able to place Ending Point</li>
                    </ul>
                </div>
            </div>
        </div>

        <div style="display: flex; column-gap: 10px;">
            <button class="btn reset" v-on:click="resetGrid">Reset Map</button>
            <button class="btn action" v-on:click="visualize">Visualize</button>
            <button class="btn generate" v-on:click='generateRandomMap("city")'>City Mode</button>
            <button class="btn generate" v-on:click='generateRandomMap("desert")'>Desert Mode</button>
            <button class="btn generate" v-on:click='generateRandomMap("cave")'>Cave Mode</button>
            <button class="btn generate" v-on:click='generateRandomMap("random")'>Random Map</button>
            <button class="btn primary" v-on:click="help">Help?</button>
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
import MapGenerator from '@/algs/MapGenerator.js';

export default{
    name: "Map",
    components:{
        Node
    },

    data(){return{
        modalDisplay: false,

        mapWidth: 40,
        mapHeight: 30,

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
            for(let y=0; y<this.mapHeight; y++){
                for(let x=0; x<this.mapWidth; x++){
                    this.nodes.push({
                        x:x, y:y,
                        className: "node"
                    });
                }
            }
        },


        generateRandomMap(mode="city"){
            /* Initialize the map */
            const mapGenerator = new MapGenerator();
            mapGenerator.xdimensions = this.mapWidth;
            mapGenerator.ydimensions = this.mapHeight;

            /* Set the map generate mode */
            if(mode=="desert"){
                mapGenerator.maxTunnels = 600;
                mapGenerator.maxLength = 8;
            }else if(mode=="city"){
                mapGenerator.maxTunnels = 50;
                mapGenerator.maxLength = 40;
            }else if(mode=="cave"){
                mapGenerator.maxTunnels = 420;
                mapGenerator.maxLength = 1;
            }else{
                mapGenerator.maxTunnels = Math.floor(Math.random()*400);
                mapGenerator.maxLength = Math.floor(Math.random()*28);
            }

            /* Generate the map */
            const map = mapGenerator.createMap();
            this.resetGrid();
            for(let y=0; y<map.length; y++){
                setTimeout(()=>{
                    for(let x=0; x<map[y].length; x++){
                        const node = this.nodes.find(n => n.x == x && n.y == y);
                        if(map[y][x]){
                            node.className = "node wall";
                        }
                    }
                }, y*50);
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


        help(){
            this.modalDisplay = true;
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
                    }, i*50);
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

.map .btn.primary{
    border: 1px solid lightblue;
    background-color: lightblue;
    color: blue;
}

.map .btn.generate{
    border: 1px solid orange;
    background-color: orange;
    color: white;
}



.modal-wrapper{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
}
.modal{
    min-width: 400px;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px gray;
}

.modal .modal-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid gray;
    padding-bottom: 15px;
}
.modal .modal-header img{
    height: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.modal .modal-header img:hover{
    transform: rotate(360deg);
}

.modal .modal-content{
    padding: 20px;
}

</style>
