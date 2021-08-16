<template>

    <div :class="className" :id="'N'+x.toString()+'-'+y.toString()"
    v-on:mousedown="startBuilding"
    v-on:mouseover="build"
    v-on:click="build(false)"
    v-on:mouseup="stopBuilding"></div>

</template>

<script>
export default{
    name: "Node",
    props:{
        x: { requried: true, type: Number},
        y: { requried: true, type: Number},
        className: {requried: false, type: String, default:"node"}
    },

    methods: {
        startBuilding(){this.$emit("startBuilding");},
        stopBuilding(){this.$emit("stopBuilding");},
        build(checkForBuilder=true){this.$emit("build", {x:this.x, y:this.y, checkForBuilder:checkForBuilder})}
    }
}
</script>
