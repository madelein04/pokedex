const body = document.querySelector("body"),
    modeToogleSwitch = body.querySelector(".toogle-switch");

modeToogleSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
});


document.addEventListener("DOMContentLoaded", function () {
    const imgOptions = {};
    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            let dataImage = img.getAttribute("data-image");
            img.src = dataImage;
            imgObserver.unobserve(img);
        });
    }, imgOptions);
    const fetchPokemons = async (endpoint) => {
        let data;
        try {
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            data = await response.json();
        } catch (error) {
            console.log(error);
        }
        return data.pokemon_species
    }
    function orderNumber(str) {
        let mySubstring = str.substring(
            str.lastIndexOf("s/") + 2,
            str.lastIndexOf("/")
        );
        return mySubstring;
    }
    async function getPokemons(numero, toggle) {
        let endpoint = `https://pokeapi.co/api/v2/generation/${numero}/`;
        const container = document.getElementById("container");
        container.innerHTML = "";
        let pokemons = [];
        pokemons = await fetchPokemons(endpoint);
        console.log(pokemons)
        for (let i = 0; i < pokemons.length; i++) {
            pokemons[i].nr = orderNumber(pokemons[i].url);
        }
        pokemons.sort((a, b) => a.nr - b.nr)
        pokemons.forEach((item) => {
            let numero3decimales = orderNumber(item.url);
            if (numero3decimales < 10) {
                numero3decimales = "0" + numero3decimales;
            }
            if (numero3decimales < 100) {
                numero3decimales = "0" + numero3decimales;
            }
            let divitem = document.createElement("li");
            divitem.classList.add("item");

            let img = new Image()
            const toggleurl = toggle ? "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" : "https://www.serebii.net/pokemongo/pokemon/";

            img.src = "https://i.gifer.com/origin/28/2860d2d8c3a1e402e0fc8913cd92cd7a_w200.gif";
            const urlImage = `${toggleurl}${numero3decimales}.png`;

            img.setAttribute("data-image", urlImage);
            img.setAttribute("class", "pokeimage");
            img.setAttribute("alt", item.name);
            divitem.innerHTML = `<div>${orderNumber(item.url)}-${item.name}</div>`;
            divitem.appendChild(img);
            container.appendChild(divitem);
            imgObserver.observe(img);

        });
    }


    let numero = 1;
    getPokemons(numero);
    let toggle = false;

    let geners = [
        "Generation-1",
        "Generation-2",
        "Generation-3",
        "Generation-4",
        "Generation-5",
        "Generation-6",
        "Generation-7",
    ]
    let filters = document.getElementById("filters");
    let gen = ""
    for (let i = 0; i < geners.length; i++) {
        gen += `<input type="radio" class="radio-gens" id=${geners[i]} name="generation"  value=${i + 1} >
            <label for=${geners[i]}  class="label-gens spa " >${geners[i]} </label>`
    }
    filters.innerHTML = gen;
    filters.addEventListener("click", function (e) {
        let targ = e.target.type;
        if (targ == "radio") {
            getPokemons(e.target.value, toggle);
            title.innerHTML = "Pokemon " + e.target.id;
        }
    });
})
