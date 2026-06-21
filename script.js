let items = {};
let leftItems = [];
let rightItems = [];

// LOAD JSON
fetch("items.json")
.then(r => r.json())
.then(data => {
    items = data;
    renderAll();
});

// SEARCH EVENT
document.addEventListener("input", (e)=>{
    if(e.target.id === "search"){
        renderAll(e.target.value.toLowerCase());
    }
});

// GET ALL ITEMS
function getAllItems(){
    let list = [];

    for(let cat in items){
        for(let name in items[cat]){
            list.push(name);
        }
    }

    return list;
}

// RENDER ITEMS (IMPORTANT FIX)
function renderAll(filter=""){

    let left = document.getElementById("left");
    let right = document.getElementById("right");

    left.innerHTML = "";
    right.innerHTML = "";

    let all = getAllItems();

    for(let name of all){

        if(!name.toLowerCase().includes(filter)) continue;

        createCard(name, "left");
        createCard(name, "right");
    }
}

// GET PRICE
function getPrice(name){
    for(let cat in items){
        if(items[cat][name]){
            return items[cat][name];
        }
    }
    return 0;
}

// CREATE CARD (FIX BUTTON)
function createCard(name, side){

    let price = getPrice(name);

    let div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
        <span>${name} — ${price.toLocaleString()} ₽</span>
        <button onclick="addItem('${name}','${side}')">Ajouter</button>
    `;

    document.getElementById(side).appendChild(div);
}

// ADD ITEM
function addItem(name, side){

    if(side === "left"){
        leftItems.push(name);
    } else {
        rightItems.push(name);
    }

    update();
}

// CALC TOTAL
function calc(list){
    let total = 0;

    for(let item of list){
        total += getPrice(item);
    }

    return total;
}

// UPDATE UI
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
