let bins = {
  compost: { x: 50, y: 350, label: "Compost" },
  recycling: { x: 200, y: 350, label: "Recycling" },
  donation: { x: 350, y: 350, label: "Donation" },
  disposal: { x: 500, y: 350, label: "Disposal" },
};

let boxes = [];
let labels = [];
let currentBoxIndex = 0;
let selectedBox = null;
let score = 0;
let totalBoxes = 19; //idk why but this the number that gets 10 boxes to show
let gameStarted = false;

let compostBinImage;
let recyclingBinImage;
let donationBinImage;
let disposalBinImage;

let startButton; // only for this version

//images moved out images here, organized into image folder on project 1 website
function preload() {
  compostBinImage = loadImage('compostopened.png');
  recyclingBinImage = loadImage('recyclingopened.png');
  donationBinImage = loadImage('donationopened.png');
  disposalBinImage = loadImage('disposalopened.png');
}

function setup() {
  let canvas = createCanvas(650, 400);

  // links to waste.html & binds to container -> not needed for this
  // canvas.elt.id = 'wastegame';
  // document.getElementById('wastegame').appendChild(canvas.elt);

  textSize(20);
  textAlign(CENTER, CENTER);

  createBoxes();
  createLabels();

  //only for this version
  startButton = createButton('');
  startButton.position(width / 2 - 50, height / 2 - 25);
  startButton.size(100, 50);
  startButton.style('background-color', 'rgba(0, 0, 0, 0)');
  startButton.style('border', 'none');
  startButton.mousePressed(startGame);

}

function draw() {
  background(255);

  if (gameStarted) {
    displayBoxes();
    displayScore();

    // endgame
    if (currentBoxIndex >= 10) {
      fill(255);

      // hide bin labels and photos
      labels = [];
      compostBinImage = recyclingBinImage = donationBinImage = disposalBinImage = null;
      
      // hide score in the top left corner
      fill(255);

      fill(0);
      textSize(32);
      text("Game Over", width / 2, height / 2 - 30);

      // only for this version
      textSize(24);
      text(`Your Score: ${score} out of 100`, width / 2, height / 2 + 20);
      const replay = window.confirm("Do you want to try again?");
      if (replay) {
        window.location.reload();
      }
    }
  } else {
    displayStartButton();
    displayInstructions();
  }
  displayBins();
}


//only necessary since this isn't on the wepage
function displayStartButton() {
  fill(156, 179, 128);
  rect(width / 2 - 50, height / 2 - 25, 100, 50, 10);
  fill(42, 96, 65); 
  textSize(24);
  text("Play", width / 2, height / 2);
}

//sets randomize boxes
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoxes() { // items
  const labels = [
    "Plastic Bottle",
    "Cardboard Box",
    "Food Container",
    "Paper Coffee Cup",
    "Mattress",
    "Carrot Tops",
    "Browned Celery",
    "Fabric Couch",
    "Outdated Flyers",
    "Apple Skins",
    "Black Plastic",
    "Old Computer Components",
    "Corn Cobs",
    "Office Chair",
    "Milk Carton",
    "Chip Bag",
    "Styrofoam Packaging",
    "Condiment Cups",
    "Plastic Utensils",
    "Grease & Oil",
    "Aluminium Foil",
    "Pizza Box",
    "Paper Bag",
    "Soda Pop Can",
    "Wooden Desk",
    "Microwave",
    "Wool Rug",
    "Box Fan",
    "Coffee Grounds",
    "Tea Bags",
    "Shellfish",
    "Eggshells",
  ];

  // 10 boxes for each game
  const remainingBoxes = totalBoxes - currentBoxIndex;
  const shuffledLabels = shuffleArray(labels).slice(0, remainingBoxes);
  
  for (let i = 0; i < remainingBoxes; i++) {
    const label = shuffledLabels[i];
    const bin = getBinByLabel(label);
      
    // Move these calculations inside the draw loop
    const textWidthValue = textWidth(label) + 10;
    const textHeightValue = textAscent() + textDescent() + 10;
  
    boxes.push({ x: random(width - textWidthValue), y: random(50, 200), label, bin, width: textWidthValue, height: textHeightValue });
  }
}

//separated to make easier to move
function createLabels() {
  for (let bin of Object.values(bins)) {
    labels.push({ x: bin.x + 50, y: bin.y + 25, label: bin.label });
  }
}

function displayLabels() {
  fill(0);
  textSize(20);

  const xOffset = 25;
  const yOffset = -130

  for (let label of labels) {
    text(label.label, label.x + xOffset, label.y + yOffset);
  }
}

function displayBins() {
  if (gameStarted) {
    const scaleFactor = 0.15;

    push(); 
    scale(scaleFactor); 

    // draw the scaled bin images
    const binWidth = compostBinImage.width;
    const binHeight = compostBinImage.height;

    image(compostBinImage, bins.compost.x / scaleFactor, height / scaleFactor - binHeight, binWidth, binHeight);
    image(recyclingBinImage, bins.recycling.x / scaleFactor, height / scaleFactor - binHeight, binWidth, binHeight);
    image(donationBinImage, bins.donation.x / scaleFactor, height / scaleFactor - binHeight, binWidth, binHeight);
    image(disposalBinImage, bins.disposal.x / scaleFactor, height / scaleFactor - binHeight, binWidth, binHeight);

    pop(); 

    displayLabels();

  }
}

function displayBoxes() {
  const currentBox = boxes[currentBoxIndex];
  if (currentBox) {
    if (selectedBox === currentBox) {
      fill(152, 199, 143); // selected box color
      textColor = color(0); // selected text color
    } else {
      fill(79, 120, 71); // default box color
      textColor = color(255, 255, 255); // default text color
    }

    rect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
    fill(textColor);
    text(currentBox.label, currentBox.x + currentBox.width / 2, currentBox.y + currentBox.height / 2);
  }
}

function displayScore() {
  fill(0);
  text(`Score: ${score}`, 50, 50);
}

function displayInstructions() {
  fill(0);
  textSize(24);
  text("How well do you know your waste?", width / 2, height / 2.5);
  textSize(18);
  text("Drag and drop items into the correct bins.", width / 2, height / 2 + 40);
}

function startGame() {
  gameStarted = true;
  startButton.remove();
}

function restartGame() {
  boxes = [];
  score = 0;
  gameStarted = false;
  selectedBox = null;
  currentBoxIndex = 0;
  createBoxes();
  createLabels();
  startButton.show();
}

function getBinByLabel(label) { // boxes -> correct bins
  switch (label) {
    case "Plastic Bottle":
    case "Cardboard Box":
    case "Outdated Flyers":
    case "Milk Carton":
    case "Aluminium Foil":
    case "Pizza Box":
    case "Paper Bag":
    case "Soda Pop Can":
      return bins.recycling;
    case "Food Container":
    case "Paper Coffee Cup":
    case "Black Plastic":
    case "Chip Bag":
    case "Styrofoam Packaging":
    case "Condiment Cups":
    case "Plastic Utensils":
    case "Grease & Oil":
      return bins.disposal;
    case "Carrot Tops":
    case "Browned Celery":
    case "Apple Skins":
    case "Corn Cobs":
    case "Coffee Grounds":
    case "Tea Bags":
    case "Shellfish":
    case "Eggshells":
      return bins.compost;
    case "Mattress":
    case "Fabric Couch":
    case "Old Computer Components":
    case "Office Chair":
    case "Wooden Desk":
    case "Microwave":
    case "Wool Rug":
    case "Box Fan":
      return bins.donation;
    default:
      return null;
  }
}

function mousePressed() {
  if (gameStarted) {
    for (let box of boxes) {
      if (
        mouseX > box.x &&
        mouseX < box.x + box.width &&
        mouseY > box.y &&
        mouseY < box.y + box.height
      ) {
        selectedBox = box;
        return;
      }
    }
  }
}

function mouseDragged() {
  if (selectedBox) {
    selectedBox.x = mouseX - selectedBox.width / 2;
    selectedBox.y = mouseY - selectedBox.height / 2;
  }
}

function mouseReleased() {
  if (selectedBox) {
    const correctBin = getBinByLabel(selectedBox.label);

    // Increase the size of the correct box area
    const placedInCorrectBin =
      mouseX > correctBin.x &&
      mouseX < correctBin.x + 100 &&
      mouseY > correctBin.y &&
      mouseY < correctBin.y + 3000;

    // Increase the size of the any box area
    const placedInAnyBin =
      mouseX > bins.compost.x &&
      mouseX < bins.disposal.x + 100 && 
      mouseY > bins.compost.y &&
      mouseY < bins.disposal.y + 3000; 

    if (placedInCorrectBin) {
      if (selectedBox.bin === correctBin) {
        score += 10; // correct bin
      }
    } else if (placedInAnyBin) {
      // wrong bin
      score -= 10;
    } else {
      // if not placed in any bin, do not increase currentBoxIndex
      selectedBox = null;
      return;
    }

    // prevent duplicate boxes
    boxes = boxes.filter((b) => b !== selectedBox);
    selectedBox = null;

    // increase currentBoxIndex only when placed in any bin
    if (placedInAnyBin) {
      currentBoxIndex++;
    }
  } else {
    for (let box of boxes) {
      if (
        mouseX > box.x &&
        mouseX < box.x + box.width &&
        mouseY > box.y &&
        mouseY < box.y + box.height
      ) {
        selectedBox = box;
      }
    }
  }
}
