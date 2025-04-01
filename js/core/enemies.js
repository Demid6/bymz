// enemies.js
const enemies = {
    beginner: [
        {
            id: 1,
            name: "Гоблин-разбойник",
            image: "goblin",
            level: 3,
            health: 40,
            attack: 8,
            abilities: ["attack", "dodge"],
            quote: "Твои монеты будут моими!"
        },
        {
            id: 2,
            name: "Скелет-воин",
            image: "skeleton",
            level: 5,
            health: 60,
            attack: 10,
            abilities: ["attack", "defense"],
            quote: "Костлявая рука судьбы достанет тебя!"
        }
    ],
    advanced: [
        {
            id: 3,
            name: "Орк-берсерк",
            image: "orc",
            level: 8,
            health: 80,
            attack: 15,
            abilities: ["attack", "critical"],
            quote: "РААААААР! Я сломаю тебя!"
        }
    ]
};

// allies.js
const allies = {
    beginner: [
        {
            id: 1,
            name: "Bobrito bandito",
            image: "bandit",
            level: 4,
            health: 50,
            quote: "Давай покажем этим уродам, где раки зимуют!"
        },
        {
            id: 2,
            name: "Krakodilo banbordino",
            image: "mercenary",
            level: 6,
            health: 70,
            quote: "Деньги вперед - потом помогу!"
        }
    ]
};
