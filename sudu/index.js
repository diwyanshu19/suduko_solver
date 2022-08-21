const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");
const ge = document.getElementsByClassName("grid")[0];
const suduin = document.getElementsByClassName("sudoku-input");
let prev;
document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
  prev = textArea.value;
  fillpuzzle(textArea.value);
});

textArea.addEventListener("input", () => {
  fillpuzzle(textArea.value);
});

function fillpuzzle(data) {
  let len = data.length < 81 ? data.length : 81;
  for (let i = 0; i < len; i++) {
    let rowLetter = String.fromCharCode("A".charCodeAt(0) + Math.floor(i / 9));
    let col = (i % 9) + 1;
    if (!data[i] || data[i] === ".") {
      document.getElementsByClassName(rowLetter + col)[0].innerText = "";
      document.getElementsByClassName(rowLetter + col)[0].classList.add("lala");
      document
        .getElementsByClassName(rowLetter + col)[0]
        .classList.remove("bala");

      document
        .getElementsByClassName(rowLetter + col)[0]
        .classList.remove("wh");

      continue;
    }
    document.getElementsByClassName(rowLetter + col)[0].innerText = data[i];
    document.getElementsByClassName(rowLetter + col)[0].classList.add("bala");
  }
  return;
}

let bord = new Array(9);
let row = new Array(9);
let col = new Array(9);
let block = new Array(9);
function backtrack() {
  //utility function to initialise above arrays
  for (let i = 0; i < 9; i++) {
    bord[i] = new Array(9);
  }
  let ar = textArea.value.split("");
  // console.log(ar);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      bord[i][j] = ar[i * 9 + j];
    }
  }
  // next ......
  for (let i = 0; i < 9; i++) {
    row[i] = new Array(9);
    col[i] = new Array(9);
    block[i] = new Array(9);
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (bord[i][j] != ".") {
        let c = Number(bord[i][j]) - 1;
        row[i][c] = true;
        col[j][c] = true;
        let b = Math.floor(i / 3) * 3 + Math.floor(j / 3);

        block[b][c] = true;
      }
    }
  }
  console.table(bord);
  console.table(row);
  console.table(col);
}
function textstri() {
  //2d array to grid in dom
  let as = "";
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      as += bord[i][j];
    }
  }
  textArea.value = as;
  fillpuzzle(textArea.value); // text area input to grid dom
}
async function getSolved() {
  backtrack();
  // next part....
  let tellme = await doDfs(bord, row, col, block, 0, 0); //if dodfs return true mean ans is possible
  if (tellme) {
    await sleep(400);
    alert("your SOL.. ");
  } else {
    alert("Wrong input..");
  }
}
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
async function doDfs(board, row, col, box, x, y) {
  //backtracking algo
  if (x === 8 && y === 9) {
    return true;
  } else if (y === 9) {
    y = 0;
    x += 1;
  }
  if (board[x][y] === ".") {
    for (let i = 1; i <= 9; i++) {
      if (isValid(row, col, box, i, x, y)) {
        row[x][i - 1] = true;
        col[y][i - 1] = true;
        let b = Math.floor(x / 3) * 3 + Math.floor(y / 3);
        box[b][i - 1] = true;
        board[x][y] = `${i}`;
        textstri();
        await sleep(170);
        if (await doDfs(board, row, col, box, x, y + 1)) {
          return true;
        }
        textstri();
        await sleep(170);

        board[x][y] = ".";

        row[x][i - 1] = false;
        col[y][i - 1] = false;
        box[b][i - 1] = false;
      }
    }
  } else {
    return await doDfs(board, row, col, box, x, y + 1);
  }
  return false;
}
function getAnswer() {
  backtrack();
  for (let i = 0; i < 9; i++) {
    if (
      row[i].includes(undefined) ||
      col[i].includes(undefined) ||
      block[i].includes(undefined)
    ) {
      alert("sorry wrong Answer...");
      return;
    }
  }
  alert("correct answer..");
}
function isValid2(e) {
  backtrack();
  let cood = coordInput.value;
  let x = cood.charCodeAt(0) - 65;
  let y = cood[1] - 1;
  let i = Number(valInput.value);
  let b = Math.floor(x / 3) * 3 + Math.floor(y / 3);
  if (row[x][i - 1] || col[y][i - 1] || block[b][i - 1]) {
    alert("you cant place...");
    return;
  }

  alert("you can place..");
}
function isValid(row, col, box, i, x, y) {
  if (row[x][i - 1]) {
    return false;
  }
  if (col[y][i - 1]) {
    return false;
  }
  let b = Math.floor(x / 3) * 3 + Math.floor(y / 3); // formula to get the 3x3 box and all 9 elements in it.
  if (box[b][i - 1]) {
    return false;
  }
  return true;
}

function inputgrid(e) {
  // console.log(e.target.textContent);
  if (e.target.tagName === "TD" && e.target.textContent === "") {
    let numb = prompt("enter");
    e.target.innerText = "";
    e.target.innerText = numb === (null || " ") ? "" : numb;
    if (numb != null && numb != "") {
      e.target.classList.add("wh");
    }
    let arr = [...suduin];
    textArea.value = "";
    arr.forEach((ele) => {
      textArea.value += ele.textContent === "" ? "." : ele.textContent;
    });
  }
}

ge.addEventListener("click", inputgrid);
document
  .getElementById("solve-button")
  .addEventListener(
    "click",
    getSolved
  ); /****call when click on solution button */
document.getElementById("check-button").addEventListener("click", isValid2);
document.getElementById("sol-button").addEventListener("click", getAnswer);
document.getElementById("retry-button").addEventListener("click", (e) => {
  // console.log(prev);
  textArea.value = prev;
  fillpuzzle(prev);
});
