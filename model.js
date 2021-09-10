let model;
let class_indices;
let fileUpload = document.getElementById("uploadImage");
let img = document.getElementById("image");
let boxResult = document.querySelector(".box-result");
let predResult = document.querySelector(".inner");
let predList = [];
let session_cnt = 0;

let scatter_pred1_yValue = [];
let scatter_pred1_text = [];
let scatter_pred2_yValue = [];
let scatter_pred2_text = [];
let scatter_pred3_yValue = [];
let scatter_pred3_text = [];
let scatter_xValue = [];

let progressBar = new ProgressBar.Circle("#progress", {
  color: "limegreen",
  strokeWidth: 10,
  duration: 2000, // milliseconds
  easing: "easeInOut",
});

// Fetch classes
async function fetchData() {
  let response = await fetch("./class_indices.json");
  let data = await response.json();
  data = JSON.stringify(data);
  data = JSON.parse(data);
  return data;
}

// Initialize/Load model
async function initialize() {
  predResult.innerHTML =
    'Please Wait.... <span class="fa fa-spinner fa-spin"></span>';
  console.log("Loading Model ....");
  model = await tf.loadLayersModel("tensorflowjs-model/model.json", false);
}

async function predict() {
  // Function for invoking prediction
  let img = document.getElementById("image");
  let tensorImg = tf.browser
    .fromPixels(img)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims(0);
  pred = await model.predict(tensorImg).data();

  fetchData().then((data) => {
    session_cnt = ++session_cnt;
    predList = Array.from(pred)
      .map((p, i) => {
        return {
          session: session_cnt,
          prob: p,
          className: data[i], // Get class name for object
        };
      })
      .sort((a, b) => {
        return b.prob - a.prob;
      })
      .slice(0, 3);

    // For use in scatter plot in script.js
    let temp_prob_list = [];
    let temp_name_list = [];
    predList.forEach((p) => {
      if (scatter_xValue.includes(p.session) === false) {
        scatter_xValue.push(p.session);
      }
      temp_prob_list.push(parseFloat(p.prob * 100).toFixed(4));
      temp_name_list.push(p.className);
    });

    scatter_pred1_yValue.push(temp_prob_list[0]);
    scatter_pred2_yValue.push(temp_prob_list[1]);
    scatter_pred3_yValue.push(temp_prob_list[2]);

    scatter_pred1_text.push(temp_name_list[0]);
    scatter_pred2_text.push(temp_name_list[1]);
    scatter_pred3_text.push(temp_name_list[2]);

    // Output predictions to predict tab
    pred_class = tf.argMax(pred);

    class_idx = Array.from(pred_class.dataSync())[0];
    document.querySelector(".pred_class").innerHTML = data[class_idx];
    predResult.innerHTML = `${parseFloat(pred[class_idx] * 100).toFixed(
      2
    )}% Confident`;

    progressBar.animate(pred[class_idx] - 0.005); // percent
    addResult(img, pred, data, class_idx);
  });
}

fileUpload.addEventListener("change", function (e) {
  let file = this.files[0];
  if (file) {
    boxResult.style.display = "block";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", function () {
      img.setAttribute("src", this.result);
    });
  } else {
    img.setAttribute("src", "");
  }

  initialize().then(() => {
    predict();
  });
});

// Create a div element for previous queries
const addResult = (image, pred, data, class_idx) => {
  let newDiv = document.createElement("div");
  let newImg = document.createElement("img");
  let newPred = document.createElement("h3");
  let newConf = document.createElement("p");
  let prevResult = document.getElementById("prev-results");
  let prevh2 = document.getElementById("prev-results-h2");

  newPred.innerHTML = data[class_idx];
  newConf.innerHTML = `Confident Score: ${parseFloat(
    pred[class_idx] * 100
  ).toFixed(2)}%`;

  newDiv.className = "prev-result";
  newImg.className = "prev-img";
  newPred.className = "prev-class-name";
  newConf.className = "prev-conf-score";

  prevh2.style.display = "block";
  newImg.src = image.src;
  newDiv.appendChild(newImg);
  newDiv.appendChild(newPred);
  newDiv.appendChild(newConf);
  prevResult.appendChild(newDiv);
};
