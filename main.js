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
  Backspace: "delete",
};

const screenElement = document.querySelector(".text-area");
const resultElement = document.querySelector(".result");
const accElement = document.querySelector(".acc");
const wpmElement = document.querySelector(".wpm");
const resetButton = document.querySelector(".icon");
const keyboardElement = document.querySelector(".keyboard");
const sampleText = "the quick brown fox jumped over the lazy dogs";
let validatedArray = new Array(sampleText.length).fill(0);
let cursorPosition = 0;
let isCompleted = false;
let correctCount = 0;
let wrongCount = 0;
let timeStart = 0;
let duration = 0;

const showResult = () => {
  accElement.innerText = Math.ceil((correctCount * 100) / (correctCount + wrongCount)) + "%";
  wpmElement.innerText = Math.ceil((correctCount / 5) * (60 / duration));
  resultElement.style.opacity = 1;
};

const validate = (key) => {
  if (isCompleted) return;
  if (key === "delete") {
    if (cursorPosition > 0) {
      wrongCount++;
      cursorPosition -= 1;
      validatedArray[cursorPosition] = 0;
    }
  } else {
    if (timeStart === 0) timeStart = new Date();
    if (key === sampleText[cursorPosition] || (key === "space" && sampleText[cursorPosition] === " ")) {
      validatedArray[cursorPosition] = 1;
      correctCount++;
    } else {
      validatedArray[cursorPosition] = 2;
      wrongCount++;
    }
    if (cursorPosition < sampleText.length - 1) cursorPosition++;
    else {
      duration = (new Date() - timeStart) / 1000;
      isCompleted = true;
      resultElement.style.opacity = 1;
      showResult();
    }
  }
  screenElement.innerText = "";
  render();
};

const newElement = (value, className = null) => {
  const span = document.createElement("span");
  span.className = `text${className ? className : ""}`;
  span.innerText = value;
  screenElement.appendChild(span);
};

const render = () => {
  validatedArray.forEach((status, index) => {
    if (status === 1) newElement(sampleText[index], " correct");
    else if (status === 2) newElement(sampleText[index], ` wrong${sampleText[index] === " " ? " space" : ""}`);
    else if (index === 0 || validatedArray[index - 1] !== 0) newElement(sampleText[index], " current");
    else newElement(sampleText[index]);
  });
  const targetKey = document.querySelector(
    `.key[data-key="${sampleText[cursorPosition] === " " ? "space" : sampleText[cursorPosition]}"]`
  );
  targetKey.classList.add("next");
};

const reset = () => {
  resultElement.style.opacity = 0;
  validatedArray = new Array(sampleText.length).fill(0);
  cursorPosition = 0;
  isCompleted = false;
  correctCount = 0;
  wrongCount = 0;
  timeStart = 0;
  duration = 0;
  screenElement.innerText = "";
  render();
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
  document.querySelector(".key.next").classList.remove("next");
  if (Object.keys(keymap).includes(key)) {
    if (key !== "Backspace") {
      const targetKey = document.querySelector(`.key[data-key="${keymap[key]}"]`);
      targetKey.classList.add("press");
    }
    validate(keymap[key]);
  }
};

document.onkeyup = ({ key }) => {
  if (Object.keys(keymap).includes(key) && key !== "Backspace") {
    const targetKey = document.querySelector(`.key[data-key="${keymap[key]}"]`);
    targetKey.classList.remove("press");
  } else if (key === "Enter" && isCompleted) {
    reset();
  }
};

resetButton.onclick = () => reset();

render();
