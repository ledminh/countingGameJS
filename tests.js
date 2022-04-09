

const checkCollided = (value, arr, space) => arr.reduce((collided, currentValue) => {              
    if(collided || Math.abs(currentValue - value) < space){
        return true;
    }
    else {
        return false;
    }
}, false);

const randomNumBetween = (to, from) => Math.floor(Math.random()*to + from); 


function generatePositionArr(from, to, space, length) {
    const arr = [];

    
    for(let i = 0; i < length; i++) {
        let value = randomNumBetween(to, from);


        let isAccepted = checkCollided(value, arr, space);

        while(!isAccepted){
            value = randomNumBetween(to, from);
            
            isAccepted = !checkCollided(value, arr, space);
            //false

        }
        


        arr.push(value);
    }

    return arr;
}
