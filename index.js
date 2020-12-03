//asumption:
/*
    Using a weight based system, after each insert/update the value of remaining cache members is decreased
    assumption: 
    1. LRU: least weight
    2. MRU: max weight
    3. Using cache as object, instead of array for ease of checking of existing members, will work on small number of cache elements, will put a strain on space complexity as cache number increase
    4. Classes named pascal case, functions camel case
    5. not using look ahead would make deletions easier but with every insert the look ahead would have to be calculated
*/


const acceptableCacheStratergies = {
    LRU: 'LRU',
    MRU: 'MRU'
}



class CustomCache {
    constructor(cacheStratergy ,size = 5){
        this.MaxKeySize = size;
        this.cacheStratergy = (acceptableCacheStratergies[cacheStratergy])? cacheStratergy : acceptableCacheStratergies.LRU; 
        this.cacheSize = 0;
        this.cache = {}; //stores key value pairings
    }

    insert(key, val){
        if(this.cache[key]){
            //update val and weight
            this.cache[key].updateVal(val); 
            //decrease weight of remaining keys
            Object.keys(this.cache).forEach((k) => {
                if(k === key) return;
                this.cache[k].update();
            });
            return;
        }


        if(this.cacheSize === this.MaxKeySize){
            this.delKey();
        }


        Object.keys(this.cache).forEach((k) => {
            this.cache[k].update();
        });

        this.cache[key] = new CacheElement(key, val);
        this.cacheSize += 1;
    };

    get(key){
        return this.cache[key];
    };

    stateOfCache(){
        return Object.keys(this.cache).map(key => this.cache[key]);
    };

    delKey(){
        let key = null;
        switch(this.cacheStratergy){
            case acceptableCacheStratergies.LRU: {
                let minWeight = null;
                Object.keys(this.cache).forEach(k => {
                    const {weight} = this.cache[k]
                    if(minWeight == undefined){
                        key = k;
                        minWeight = weight;
                        return;
                    };
                    if(weight < minWeight){
                        key = k;
                        minWeight = weight;
                    }
                });
                break;
            }
            case acceptableCacheStratergies.MRU: {
                let maxWeight = null;
                Object.keys(this.cache).forEach(k => {
                    const {weight} = this.cache[k]
                    if(maxWeight == undefined){
                        key = k;
                        maxWeight = weight;
                        return;
                    };
                    if(weight > maxWeight){
                        key = k;
                        maxWeight = weight;
                    }
                });
                break;
            }
            default: {
                // for other classes that inherit this class to impement their own versions of key deletion can call this function first and 
                //listen for this specific error to check wether to proceed with custom deletion logic
                throw {name: 'cacheStratergyNotFoundError', message: 'provided caching stratergy not supported'}; 
            };

        }
        delete this.cache[key];
        this.cacheSize -= 1;
    };
}

class CacheElement {
    constructor(key, val){
        this.key = key; //additional redundant data
        this.val = val;
        this.weight = 1;
    }

    update(){
        this.weight -= 1;
    }

    updateVal(val){
        this.val = val;
        this.weight += 1;
    };
};


/* uncomment below to run code
const cache = new CustomCache(acceptableCacheStratergies.LRU);

const values = [
    {k: 'a', v: 1}, {k: 'b', v: 2} , {k: 'c', v: 3}, {k: 'd', v: 4}, {k: 'e', v: 5}, {k: 'c', v: 6}, {k: 'f', v: 7}
];


values.forEach(val => {
    const {k, v} = val;
    cache.insert(k, v);
    console.log(cache.stateOfCache());
});
*/
