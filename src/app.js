// DOM Elements
const inputContainer = document.getElementById("input-container");
const removeBtn = document.getElementById("remove-btn");
const addBtn = document.getElementById("add-btn");
const calculateBtn = document.getElementById("calculateBtn");
const resultDisplay = document.getElementById("resultDisplay");

const bodyAnimation = document.getElementById("body");

//body animation

anime({
  targets: bodyAnimation,
  opacity: [0, 1],
  translateY: [-50, 0],
  scale: [0.5, 1],
  duration: 1100,
  easing: "cubicBezier(.5, .05, .1, .3)",
});

// Create new input field function
function createNewInputField() {
  let newElement = document.createElement("div");
  newElement.innerHTML = `
          <label>Value</label>
          <input
            type="number"
            class="text-slate-900 w-24 sm:w-[13rem] bg-slate-50 ml-2 rounded-md px-2 py-1 noise-value focus:outline-[4px] focus:outline-offset-[-1px] focus:outline-sky-400 focus:ring-0 placeholder:text-[0.75rem]"
            placeholder="LAeq"
          />
          <label class="pl-3">Time</label>
          <input
            type="number"
            class="text-slate-900 bg-slate-50 mx-2 rounded-md px-2 min-w-[3rem] w-16 py-1 time-value focus:outline-[4px] focus:outline-offset-[-1px] focus:outline-sky-400 focus:ring-0 placeholder:text-sm"
            placeholder="min"
          />
        `;

  inputContainer.appendChild(newElement);

  anime({
    targets: newElement,
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: 500,
    easing: "easeOutQuad",
  });

  removeBtn.disabled = false;
}

// Remove field function
function removeLastInputField() {
  if (inputContainer.lastElementChild) {
    const elementToRemove = inputContainer.lastElementChild;

    anime({
      targets: elementToRemove,
      opacity: [1, 0],
      translateY: [0, -10],
      duration: 200,
      easing: "easeInQuad",
      complete: function () {
        inputContainer.removeChild(elementToRemove);
        if (!inputContainer.lastElementChild) {
          removeBtn.disabled = true;
        }
      },
    });
  }
}

// Calculation function//////////////////////////////////

function calculateNormalizedNoise() {
  const inputs = inputContainer.children;
  let totalNumerator = 0;
  let hasValidInputs = false;

  for (let input of inputs) {
    const noiseValue = input.querySelector(".noise-value").value;
    const timeValue = input.querySelector(".time-value").value;

    // Check if either field is empty
    if (noiseValue === "" || timeValue === "") {
      continue; // Skip empty fields
    }

    //parsovanie
    const noiseNum = parseFloat(noiseValue);
    const timeNum = parseFloat(timeValue);

    if (!isNaN(noiseNum) && !isNaN(timeNum)) {
      const numerator = (timeNum / 60) * Math.pow(10, noiseNum / 10);
      totalNumerator += numerator;
      hasValidInputs = true;
    }
  }

  if (!hasValidInputs || totalNumerator === 0) {
    throw new Error("No valid inputs");
  }

  const result = 10 * Math.log10(totalNumerator / 8);
  return Math.round(result * 100) / 100;
}

// Event listener for calculate button
calculateBtn.addEventListener("click", () => {
  try {
    const result = calculateNormalizedNoise();
    if (!isNaN(result) && result !== Infinity && result !== -Infinity) {
      resultDisplay.textContent = `Normalized Noise Level: LEX,8h: ${result}dB (without unceranty)`;
      resultDisplay.classList.remove("hidden");

      anime({
        targets: resultDisplay,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 500,
        easing: "easeOutQuad",
      });
    } else {
      throw new Error("Invalid calculation result");
    }
  } catch (error) {
    resultDisplay.textContent = "Please fill in all fields with valid numbers";
    resultDisplay.classList.remove("hidden");

    anime({
      targets: resultDisplay,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 500,
      easing: "easeOutQuad",
    });
  }
});

// Event listener for add button
addBtn.addEventListener("click", createNewInputField);

// Event listener for remove button
removeBtn.addEventListener("click", removeLastInputField);
