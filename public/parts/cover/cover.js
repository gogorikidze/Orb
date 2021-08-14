displaybook();
function displaybook() {
  let coverholders = document.querySelectorAll('.awaitcover');
  for (let i = 0; i < coverholders.length; i++) {
    coverholders[i].className = 'cover';
    let src = coverholders[i].innerText.split('altNameOrb')[0];
    let name = coverholders[i].innerText.split('altNameOrb')[1];

    //load blank
    let htmlblank ="<div style='background-color: var(--ancyan)' class='topbook'><div class='notch'></div><div class='notchtriangle' style='border-bottom: "+(coverholders[i].clientHeight/100*5/100*90)+"px solid white;'></div></div><div class='lowercover'><div style='background-color: var(--ancyan)' class='leftbook'></div><div style='background-color: var(--ancyan);display: flex;justify-content: center;align-content: center;flex-direction: column;' class='frontbook'><text style='margin:10px 5px 10px 5px;font-size:"+(coverholders[i].clientHeight/18)+"px;text-align: center;overflow:hidden; color: white'>"+name+"</text></div>";
    coverholders[i].innerHTML = htmlblank;
    //done

    let html ="<div style='background-image: url("+src+"); display:none' class='topbook'><div class='notch'></div><div class='notchtriangle' style='border-bottom: "+(coverholders[i].clientHeight/100*5/100*90)+"px solid white;'></div></div><div class='lowercover' style='display:none'><div style='background-image: url("+src+")' class='leftbook'></div><img alt='"+name+"' class='frontbook' src='"+src+"'></div>";
    coverholders[i].innerHTML += html;
    let coverimage = coverholders[i].getElementsByClassName('frontbook')[1];
    if (coverimage.complete) { loadedEvent(coverimage.parentNode.parentNode) } else { coverimage.addEventListener('load', loadEvent) }
  }
}
function loadEvent(img) {
  div = img.path[2];
  div.children[2].style.display = 'block';
  div.children[3].style.display = 'block';
  div.removeChild(div.children[0]);
  div.removeChild(div.children[0]);
}
function loadedEvent(div) {
  div.children[2].style.display = 'block';
  div.children[3].style.display = 'block';
  div.removeChild(div.children[0]);
  div.removeChild(div.children[0]);
}
