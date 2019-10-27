(function main() {
  const buttons = document.getElementById("file_options__list");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const canvasWidth = (canvas.width = 512);
  const canvasHeight = (canvas.height = 512);

  buttons.addEventListener("click", event => {
    const key = event.target.value;
    switch (key) {
      case "4x4.json":
        setJSON4x4(ctx, canvasWidth, canvasHeight);
        break;

      case "32x32.json":
        setJSON32x32(ctx, canvasWidth, canvasHeight);
        break;

      case "image.png":
        setImage(ctx, canvasWidth, canvasHeight);
        break;

      default:
        break;
    }
  });
})();

function setImage(ctx, canvasWidth, canvasHeight) {
  const img = new Image();
  img.src = "data/image.png";
  img.onload = function() {
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  };
}

async function setJSON4x4(ctx, canvasWidth, canvasHeight) {
  const url = "data/4x4.json";
  const arr = await getArrFromJSON(url);
  const typeColor = "hex";

  const arrForCanvas = getArrayOfObjectsForCanvas(
    arr,
    canvasWidth,
    canvasHeight,
    typeColor
  );

  arrForCanvas.forEach(element => {
    createRectangle(ctx, element);
  });
}

async function setJSON32x32(ctx, canvasWidth, canvasHeight) {
  const url = "data/32x32.json";
  const arr = await getArrFromJSON(url);
  const typeColor = "rgba";

  const arrForCanvas = getArrayOfObjectsForCanvas(
    arr,
    canvasWidth,
    canvasHeight,
    typeColor
  );

  arrForCanvas.forEach(element => {
    createRectangle(ctx, element);
  });
}

function createRectangle(ctx, element) {
  ctx.beginPath();
  ctx.fillStyle = element.fillStyle;
  ctx.fillRect(element.sx, element.sy, element.swidth, element.sheight);
  ctx.stroke();
}

function getArrayOfObjectsForCanvas(arr, canvasWidth, canvasHeight, typeColor) {
  const rows = arr.length;
  const cols = arr[0].length;

  const elementWidth = canvasWidth / cols;
  const elementHeight = canvasHeight / rows;

  const arrayOfObjects = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const color = getElementWithStyle(arr[row][col], typeColor);
      const obj = {
        sx: col * elementWidth,
        sy: row * elementHeight,
        swidth: elementWidth,
        sheight: elementHeight,
        fillStyle: color
      };
      arrayOfObjects.push(obj);
    }
  }

  function getElementWithStyle(element, typeColor) {
    let newElement = "";
    switch (typeColor) {
      case "hex":
        newElement = `#${element}`;
        break;
      case "rgba":
        newElement = `rgba(${element})`;
        break;
      default:
        break;
    }
    return newElement;
  }

  return arrayOfObjects;
}

async function getArrFromJSON(url = "data/4x4.json") {
  try {
    const response = await fetch(url);
    const arr = await response.json();
    return arr;
  } catch (err) {
    alert(err);
  }
}
