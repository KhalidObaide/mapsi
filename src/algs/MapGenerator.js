class MapGenerator{

    xdimensions = 20;
    ydimensions = 10;
    maxTunnels = 50;
    maxLength = 8;

    createArray = (num, xdimensions, ydimensions)=>{
        let array = [];
        for (let i = 0; i < ydimensions; i++) {
            array.push([]);
            for (var j = 0; j < xdimensions; j++) {
                array[i].push(num);
            }
        }
        return array;
    }

  // lets create a randomly generated map for our dungeon crawler
  createMap = ()=>{
      const xdimensions = this.xdimensions;
      const ydimensions = this.ydimensions;
      let maxTunnels = this.maxTunnels;
      const maxLength = this.maxLength;

      let map = this.createArray(1, xdimensions, ydimensions);

      let currentRow = Math.floor(Math.random() * ydimensions);
      let currentColumn = Math.floor(Math.random() * xdimensions);

      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      let lastDirection = [];
      let randomDirection;

      while(maxTunnels && xdimensions && ydimensions && maxLength){
          do {
             randomDirection = directions[Math.floor(Math.random() * directions.length)];
          } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

          let randomLength = Math.ceil(Math.random() * maxLength);
          let tunnelLength = 0;

          while (tunnelLength < randomLength) {

            //break the loop if it is going out of the map
            if (((currentRow === 0) && (randomDirection[0] === -1)) ||
                ((currentColumn === 0) && (randomDirection[1] === -1)) ||
                ((currentRow === ydimensions - 1) && (randomDirection[0] === 1)) ||
                ((currentColumn === xdimensions - 1) && (randomDirection[1] === 1))) {
              break;
            } else {
              map[currentRow][currentColumn] = 0;
              currentRow += randomDirection[0];
              currentColumn += randomDirection[1];
              tunnelLength++;
            }
          }

          if (tunnelLength) {
            lastDirection = randomDirection;
            maxTunnels--;
          }
      }
    return map;
  };

}


export default MapGenerator;
