let items = {};
let leftItems = [];
let rightItems = [];

// DEBUG LOAD
fetch("items.json")
.then(r => {
    if(!r.ok){
        throw new Error("items.json introuvable");
    }
    return r.json();
})
.then(data => {
    items = data;
    console.log("ITEMS CHARGÉS:", items);
    renderAll();
})
.catch(err => {
    console.error("ERREUR JSON:", err);
    document.getElementById("result").innerText =
    "❌ ERREUR: items.json ne se charge pas";
});

// SEARCH
document.addEventListener("input", (e)=>{
    if(e.target.id === "search"){
        renderAll(e.target.value.toLowerCase());
    }
});

// ALL ITEMS FLAT
function getAllItems(){
    let list = [];

    for(let cat in items){
        for(let name in items[cat]){
            list.push(name);
        }
    }

    return list;
}

// RENDER
function renderAll(filter=""){

    let left = document.getElementById("left");
    let right = document.getElementById("right");

    left.innerHTML = "";
    right.innerHTML = "";

    let all = getAllItems();

    if(all.length === 0){
        left.innerHTML = "❌ Aucun item chargé";
        right.innerHTML = "❌ Aucun item chargé";
        return;
    }

    for(let name of all){

        if(!name.toLowerCase().includes(filter)) continue;

        createCard(name, "left");
        createCard(name, "right");
    }
}

// PRICE
function getPrice(name){
    for(let cat in items){
        if(items[cat][name]){
            return items[cat][name];
        }
    }
    return 0;
}

// CARD
function createCard(name, side){

    let price = getPrice(name);

    let div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
        <span>${name} — ${price.toLocaleString()} ₽</span>
        <button onclick="addItem('${name}','${side}')">+</button>
    `;

    document.getElementById(side).appendChild(div);
}

// ADD
function addItem(name, side){

    if(side === "left") leftItems.push(name);
    else rightItems.push(name);

    update();
}

// CALC
function calc(list){
    let total = 0;

    for(let item of list){
        total += getPrice(item);
    }

    return total;
}

// UPDATE
function update(){

    let left = calc(leftItems);
    let right = calc(rightItems);

    document.getElementById("leftTotal").innerText = left.toLocaleString();
    document.getElementById("rightTotal").innerText = right.toLocaleString();

    let diff = right - left;

    let result = "⚖️ FAIR";

    if(diff > 5000) result = "🟢 WIN";
    else if(diff < -5000) result = "🔴 LOSS";

    document.getElementById("result").innerText = result;
}
