let allSelected = true;
let sourcesfield = document.getElementById('sources');
function displaySources(){
    let selectedCSS = `
        background-color:var(--ancyan);
        color: white;
    `;
    let unselectedCSS = `
        background-color: white;
        color: black;
    `;

    sourcesfield.innerHTML = "";

    let css = allSelected ? selectedCSS : unselectedCSS;
    let html = `
        <div class="source" id="allSelected" onclick="updateSources(null, 1)" style="display:flex;justify-content:center;align-items:center; font-size: 18px;${css}">
            <p>ყველა საცავში ძებნა</p>
        </div>
        `;
    sourcesfield.innerHTML += html;

    sources.map((source, index) => {
        let css = source.selected ? selectedCSS : unselectedCSS;
        let logobackground = source.imgbg ? ("style='background-color:"+source.imgbg+"'") : "";
        let html = `
        <div class='source' id="source${index}" onclick="updateSources(this.id)" style="${css}">
        <div class='logowrap' ${logobackground}">
            <img class='logo' src='parts/logos/${source.addr}.png'>
        </div>
        <div class='namewrap'>
            <p class='name'>${source.name}</p>
        </div>
        </div>
        `;
        sourcesfield.innerHTML += html;
    });
}
function updateSources(id, all = false){
    if(all){
        sources.map(x => x.selected = false);
        allSelected = true;
    }else{
        let index = parseInt(id.split("source")[1]);
        sources[index].selected = !sources[index].selected;
        allSelected = false;
    }
    displaySources();
}
displaySources();