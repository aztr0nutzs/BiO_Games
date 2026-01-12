const Pet = {
    name: "Bio-Pet",
    hunger: 50,
    happiness: 50,
    hygiene: 50,

    update: function() {
        this.hunger -= 1;
        this.happiness -= 1;
        this.hygiene -= 1;

        if (this.hunger < 0) this.hunger = 0;
        if (this.happiness < 0) this.happiness = 0;
        if (this.hygiene < 0) this.hygiene = 0;

        this.draw();
    },

    feed: function() {
        this.hunger += 10;
        if (this.hunger > 100) this.hunger = 100;
    },

    play: function() {
        this.happiness += 10;
        if (this.happiness > 100) this.happiness = 100;
    },

    clean: function() {
        this.hygiene += 10;
        if (this.hygiene > 100) this.hygiene = 100;
    },

    draw: function() {
        document.getElementById("hunger-stat").textContent = this.hunger;
        document.getElementById("happiness-stat").textContent = this.happiness;
        document.getElementById("hygiene-stat").textContent = this.hygiene;
    }
};

// Game Loop
setInterval(() => {
    Pet.update();
}, 1000);
