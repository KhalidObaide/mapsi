class AStar{
    nodes = [];
    walls = [];
    start = null; end = null;

    setNodes = nodes=> {this.nodes = nodes;}
    setWalls = walls=> {this.walls = walls;}
    setStart = start=> {this.start = (start != -1) ? start : this.start;}
    setEnd = end=> {this.end = (end != -1) ? end : this.end;}

    /* Helpers */
    removeFromList = (arr, element)=>{
        let newArr = [];
        arr.forEach(el => {
            if(el.idx != element.idx){
                newArr.push(el);
            }
        });
        return newArr;
    };

    arrayContains = (arr, element)=>{
        return arr.some(el => el.idx == element.idx);
    };

    getNeighbours = node=>{
        let neighbours = [];
        let nNode = this.nodes[node.idx];

        const tn = this.nodes.find(n=> n.x == nNode.x && n.y == nNode.y-1);
        if(tn){neighbours.push(this.findCosts(this.nodes.indexOf(tn)))}

        const bn = this.nodes.find(n=> n.x == nNode.x && n.y == nNode.y+1);
        if(bn){neighbours.push(this.findCosts(this.nodes.indexOf(bn)))}

        const rn = this.nodes.find(n=> n.x == nNode.x+1 && n.y == nNode.y);
        if(rn){neighbours.push(this.findCosts(this.nodes.indexOf(rn)))}

        const ln = this.nodes.find(n=> n.x == nNode.x-1 && n.y == nNode.y);
        if(ln){neighbours.push(this.findCosts(this.nodes.indexOf(ln)))}

        const trn = this.nodes.find(n=> n.x == nNode.x+1 && n.y == nNode.y-1);
        if(trn){neighbours.push(this.findCosts(this.nodes.indexOf(trn)))}

        const tln = this.nodes.find(n=> n.x == nNode.x-1 && n.y == nNode.y-1);
        if(tln){neighbours.push(this.findCosts(this.nodes.indexOf(tln)))}

        const brn = this.nodes.find(n=> n.x == nNode.x+1 && n.y == nNode.y+1);
        if(brn){neighbours.push(this.findCosts(this.nodes.indexOf(brn)))}

        const bln = this.nodes.find(n=> n.x == nNode.x-1 && n.y == nNode.y+1);
        if(bln){neighbours.push(this.findCosts(this.nodes.indexOf(bln)))}

        return neighbours;
    };

    filterTraversables = arr=>{
        return arr.filter(obj => obj.isTraversable);
    };

    getDistance = (a, b)=>{
        let y = b.x - a.x;
        let x = b.y - a.y;
        return Math.abs(Math.sqrt(x*x + y*y));
    };

    findCosts = (idx)=>{
        let obj = {
            idx: idx,
            gCost : this.getDistance(this.nodes[idx], this.nodes[this.start]),
            hCost : this.getDistance(this.nodes[idx], this.nodes[this.end]),
            isTraversable: !this.walls.some(i => i == idx)
        };
        obj.fCost = obj.gCost + obj.hCost;
        return obj;
    }


    findPath = ()=>{
        if(this.start == null || this.end == null || this.nodes.length < 2){
            throw new Error("Either start/end node is null or nodes contains less then 2 elements");
        }

        /* ########################
         * The Actual Alg goes here
         * ######################## */

        let opens = [];
        let closed = [];
        opens.push(this.findCosts(this.start));

        let latestNode = null;

        while(opens.length > 0){
            let current = opens.reduce((prev, curr) => prev.fCost < curr.fCost ? prev : curr);


            /* We found the path */
            if(current.idx == this.end){
                break;
            }

            // console.table(opens.map(i => {return {x:this.nodes[i.idx].x, y:this.nodes[i.idx].y}}));
            opens = this.removeFromList(opens, current);
            closed.push(current);

            this.filterTraversables(this.getNeighbours(current)).forEach(neighbour=>{
                if(!this.arrayContains(opens, neighbour) && !this.arrayContains(closed, neighbour)){
                    neighbour.parentNode = current;
                    latestNode = neighbour;
                    opens.push(neighbour);
                }

                if(this.arrayContains(opens, neighbour) && neighbour.hCost < current.hCost){
                    neighbour.parentNode = current;
                    latestNode = neighbour;
                }
            });
        }

        /* Reverse the latest node */
        let prev = null;
        while(latestNode){
            let next = latestNode.parentNode;
            latestNode.parentNode = prev;
            prev = latestNode;
            latestNode = next;
        }
        return prev;
    };

}

export default AStar;
