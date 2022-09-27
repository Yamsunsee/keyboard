const keyboard = [
  ["q", "w", "d", "f", "g", "; :", "u", "k", "y", "p", "[ {", "] }"],
  ["a", "s", "e", "r", "l", "h", "n", "o", "i", "t", "/ ?"],
  ["z", "x", "c", "v", "' \"", "b", "j", "m", ", <", ". >"],
  ["space"],
];

const keymap = {
  q: "q",
  w: "w",
  e: "d",
  r: "f",
  t: "g",
  y: ";",
  u: "u",
  i: "k",
  o: "y",
  p: "p",
  "[": "[",
  "]": "]",
  a: "a",
  s: "s",
  d: "e",
  f: "r",
  g: "l",
  h: "h",
  j: "n",
  k: "o",
  l: "i",
  ";": "t",
  "'": "/",
  z: "z",
  x: "x",
  c: "c",
  v: "v",
  b: "'",
  n: "b",
  m: "j",
  ",": "m",
  ".": ",",
  "/": ".",
  " ": "space",
};

const screenElement = document.querySelector(".screen");
const keyboardElement = document.querySelector(".keyboard");

const untypedTextElement = document.createElement("span");
untypedTextElement.className = "text untyped";
untypedTextElement.innerText = "the_quick_brown_fox_jumped_over_the_lazy_dogs";
screenElement.appendChild(untypedTextElement);

const render = (key) => {
  const lastChild = document.querySelector(".screen").lastChild;
  const letter = lastChild.innerText.slice(0, 1);
  if (key === letter || (key === "space" && letter === "_")) {
    const typedTextElement = document.createElement("span");
    typedTextElement.className = "text typed";
    typedTextElement.innerText = key === "space" ? "_" : key;
    screenElement.parentNode.removeChild(lastChild);
    screenElement.appendChild(typedTextElement);
  }
};

keyboard.forEach((row, index) => {
  const rowElement = document.createElement("div");
  rowElement.className = `row row-${index + 1}`;
  row.forEach((key) => {
    const keyElement = document.createElement("div");
    keyElement.className = "key";
    if (key === "space") keyElement.classList.add("space");
    if (key === "r" || key === "n") keyElement.classList.add("home");
    keyElement.innerHTML = key;
    keyElement.setAttribute("data-key", key.split(" ")[0]);
    rowElement.appendChild(keyElement);
  });
  keyboardElement.appendChild(rowElement);
});

document.onkeydown = ({ key }) => {
  const targetKey = document.querySelector(`.key[data-key="${keymap[key]}"]`);
  targetKey.classList.add("press");
  render(keymap[key]);
};

document.onkeyup = ({ key }) => {
  const targetKey = document.querySelector(`.key[data-key="${keymap[key]}"]`);
  targetKey.classList.remove("press");
};
