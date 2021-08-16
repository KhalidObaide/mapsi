<template>

    <div :class="(!nodeType) ? 'node' : (nodeType == 'wall') ? 'node wall' : 'node'"
    v-on:mousedown="startBuilding"
    v-on:mouseover="build"
    v-on:click="build(false)"
    v-on:mouseup="stopBuilding"></div>

</template>

<script>
export default{
    name: "Node",
    props:{
        isBuilding: {required: false, type: Boolean, default:false},
        destroyActive: {required: false, type: Boolean, default:false}
    },

    data(){return{
        nodeType: null, /* No value for simple/empty node */
    }},

    methods: {
        startBuilding(){this.$emit("startBuilding");},
        stopBuilding(){this.$emit("stopBuilding");},

        build(checkForBuilder=true){
            if(checkForBuilder){
                if(this.destroyActive){
                    this.nodeType = null;
                }else if(this.isBuilding){
                    this.nodeType = "wall";
                }
            }else{
                if(this.destroyActive){
                    this.nodeType = null;
                }else{this.nodeType = "wall";}
            }
        }, /* End of build Function */


    }
}
</script>
