let sources = [
  {
      name: 'ელექტრონული რესურსების პორტალი EL.ge',
      addr: 'el.ge',
      imgsrc: 'parts/logos/el.ge.png',
      imgbg: '#042a3d',
      selected: false
  },
  {
      name: 'საქართველოს პარლამენტის ეროვნული ბიბლიოთეკა',
      addr: 'dspace.nplg.gov.ge',
      imgsrc: 'parts/logos/dspace.nplg.gov.ge.png',
      imgbg: '#7f8f74',
      selected: false
  },
  {
    name: 'ელექტრონული რესურსების პორტალი Eon.ge',
    addr: 'eon.ge',
    imgsrc: 'parts/logos/eon.ge.png',
    imgbg: '#33363b',
    singlePage: true,
    selected: false
  }
]
let selectedSources;

function search(keyword){
  let main = document.getElementById('main').style;

  main.top = '7%';
  document.getElementById('sources').style.display = 'none';

  if(keyword.length < 1){
    document.getElementById('results').innerHTML = "საძიებო ველი ვერ იქნება ცარიელი!";
    return;
  }

  if(allSelected){
    selectedSources = sources;
  }else{
    selectedSources = sources.filter(x => x.selected);
  }
  
  addResultTabs();
  fetchStats(keyword);
}