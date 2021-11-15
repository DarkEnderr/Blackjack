const mod = ['creeper', 'zombie', 'skeleton', 'enderman', 'slime', 'witch'];
const health = Number;


class Card {
        constructor(mod, value, health) {
                if(!mod.includes(mod)){
                        throw new Error('No monster');
                }

                if(health < 5 || health > 12) {

                }
        }
}