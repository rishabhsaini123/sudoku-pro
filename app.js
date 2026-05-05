import { puzzle } from './sudoku.js';

let difficulty, time;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let lives = 5;
let remainingTime = 0;
let timerInterval;

document.getElementById("coins").innerText = coins;

document.querySelectorAll("[data-level]").forEach(b=>{
  b.onclick=()=>difficulty=b.dataset.level;
});
document.querySelectorAll("[data-time]").forEach(b=>{
  b.onclick=()=>time=b.dataset.time;
});

startBtn.onclick=()=>{
  if(!difficulty || !time) return alert("Select options");

  show("gameScreen");
  createBoard();
  startTimer(time);

  lives=5;
  document.getElementById("lives").innerText=lives;
  coinsGame.innerText=coins;
};

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

window.backMenu=()=>show("menuScreen");

function createBoard(){
  grid.innerHTML="";
  puzzle.flat().forEach((num,i)=>{
    let cell=document.createElement("input");

    if(num){
      cell.value=num;
      cell.disabled=true;
      cell.classList.add("fixed");
    }

    cell.oninput=()=>handleInput(cell,i);
    grid.appendChild(cell);
  });
}

function handleInput(cell,i){
  let val=cell.value;
  if(!/^[1-9]$/.test(val)){cell.value="";return;}

  if(!isValid(i,val)){
    cell.style.background="red";
    lives--;
    document.getElementById("lives").innerText=lives;
    if(lives<=0){alert("Game Over");location.reload();}
  } else {
    cell.style.background="";
  }

  checkWin();
}

function isValid(index,val){
  let r=Math.floor(index/9),c=index%9;
  let inputs=document.querySelectorAll("#grid input");

  for(let i=0;i<9;i++){
    if(inputs[r*9+i].value==val && i!=c) return false;
    if(inputs[i*9+c].value==val && i!=r) return false;
  }
  return true;
}

function startTimer(min){
  remainingTime=min*60;
  clearInterval(timerInterval);

  timerInterval=setInterval(()=>{
    timer.innerText=Math.floor(remainingTime/60)+":"+("0"+remainingTime%60).slice(-2);
    remainingTime--;

    if(remainingTime<0){
      clearInterval(timerInterval);
      alert("Time Up");
    }
  },1000);
}

exitBtn.onclick=()=>{
  if(confirm("Exit game?")){
    clearInterval(timerInterval);
    show("menuScreen");
  }
};

function checkWin(){
  let inputs=[...document.querySelectorAll("#grid input")];
  if(inputs.every(c=>c.value!="")){
    coins+=50;
    localStorage.setItem("coins",coins);
    winModal.style.display="block";
  }
}

window.closeModal=()=>location.reload();

window.showLeaderboard=()=>{
  show("leaderboardScreen");
};