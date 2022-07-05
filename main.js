const columns = [];
let editingColumn;
class Column {
  constructor(name) {
    this.name = name;
    this.cards = [];
  }
}
class Card {
  constructor(name, text, tag) {
    this.name = name;
    this.text = text;
    this.tag = tag;
  }
}

function fillData() {
  let first = new Column("First");
  first.cards.push(new Card("First card", "first text"));
  first.cards.push(new Card("Second card", "Second text"));
  columns.push(first);
  let second = new Column("Second");
  columns.push(second);
}

function addColumn() {
  const dialog = document.getElementById("column-block");
  let name = dialog.getElementsByTagName("input")[0].value;
  columns.push(new Column(name));
  paint();
}

function changeViewCardDialog(number, state) {
  editingColumn = number;
  const dialog = document.getElementById("card-block");
  if (state) dialog.style.display = "block";
  else dialog.style.display = "none";
}

function changeViewColumnDialog(state) {
  const dialog = document.getElementById("column-block");
  if (state) dialog.style.display = "block";
  else dialog.style.display = "none";
}

function addCard() {
  let inputs = document
    .getElementById("card-block")
    .getElementsByTagName("input");
  let nameValue = inputs[0].value;
  inputs[0].value = "";
  let textValue = inputs[1].value;
  inputs[1].value = "";
  columns[editingColumn].cards.push(new Card(nameValue, textValue));
  paint();
}

fillData();

function paintColumn(name, index) {
  let main = document.getElementById("main");
  let column = document.createElement("div");
  column.classList.add("column");
  let head = document.createElement("div");
  head.classList.add("head");

  let indexBlock = document.createElement("div");
  indexBlock.style.display = "none";
  indexBlock.classList.add("index");
  indexBlock.innerText = index;
  let nameBlock = document.createElement("div");
  nameBlock.classList.add("name");
  nameBlock.innerHTML = name;

  let addButton = document.createElement("div");
  addButton.innerHTML = "+";
  addButton.classList.add("adding");

  head.appendChild(nameBlock);
  head.appendChild(addButton);
  head.appendChild(indexBlock);
  column.appendChild(head);

  let list = document.createElement("div");
  list.classList.add("list");
  column.appendChild(list);
  main.appendChild(column);
  addButton.onclick = function () {
    changeViewCardDialog(index, true);
  };
  return column;
}

function paintCard(columnIndex, cardInfo, cardIndex) {
  let card = document.createElement("div");
  let name = document.createElement("div");
  name.classList.add("name");
  name.innerHTML = cardInfo.name;
  let text = document.createElement("div");
  text.classList.add("text");
  text.innerHTML = cardInfo.text;
  card.appendChild(name);
  card.appendChild(text);
  card.classList.add("card");
  setDragAndDrop(columnIndex, cardIndex, card);
  document
    .getElementsByClassName("column")
    [columnIndex].getElementsByClassName("list")[0]
    .appendChild(card);
}

function setDragAndDrop(columnIndex, cardIndex, card) {
  card.onmousedown = function (e) {
    let copyCard = JSON.parse(
      JSON.stringify(columns[columnIndex].cards[cardIndex])
    );
    function moveAt(e) {
      card.style.left = e.pageX - card.offsetWidth / 2 + "px";
      card.style.top = e.pageY - card.offsetHeight / 2 + "px";
    }

    card.style.position = "absolute";
    moveAt(e);
    document.body.appendChild(card);
    card.style.zIndex = 1000;

    document.onmousemove = function (e) {
      moveAt(e);
    };
    
    card.onmouseup = function (e) {
      document.onmousemove = null;
      card.onmouseup = null;
      let column = document.elementFromPoint(e.screenX, e.screenY);
      let newColumnIndex = column.getElementsByClassName("index")[0].innerText;
      columns[columnIndex].cards.splice(cardIndex, 1);
      columns[newColumnIndex].cards.push(copyCard);
      deleteContent();
      paint();
    };
  };
}

function deleteContent() {
  for (let absoluteCard of document.getElementsByClassName("card")) {
    if (absoluteCard.style.position == "absolute");
      absoluteCard.remove();
  }
  document.getElementById("main").innerHTML = "";
}

function paint() {
  deleteContent();
  columns.forEach((column, columnIndex) => {
    paintColumn(column.name, columnIndex);
    column.cards.forEach((card, cardIndex) => {
      paintCard(columnIndex, card, cardIndex);
    });
  });
}
paint();
