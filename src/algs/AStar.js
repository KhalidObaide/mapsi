class AStar{
    nodes = [];
    walls = [];
    start = null; end = null;

    setNodes = nodes=> {this.nodes = nodes;}
    setWalls = walls=> {this.walls = walls;}
    setStart = start=> {this.start = start;}
    setEnd = end=> {this.end = end;}


    findPath = ()=>{
        if(!this.start || !this.end || this.nodes.length < 2){
            throw new Error("Either start/end node is null or nodes contains less then 2 elements");
        }

        /* The Actual Alg goes here */
        return [41, 42, 43, 44, 45, 46];
    }

}

export default AStar;
