// let scatter_pred1_yValue = [];
// let scatter_pred2_yValue = [];
// let scatter_pred3_yValue = [];
// let scatter_xValue = [];
let text_list = document.getElementsByClassName("text-result");

const openPage = (pageName, elmnt) => {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tab-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = "#6b6b6b";
};

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

const plotResults = () => {
  let xValue = [];
  let yValue = [];

  predList.forEach((p) => {
    xValue.push(p.className);
    yValue.push(parseFloat(p.prob * 100).toFixed(4) + "%");
  });

  let trace1 = {
    x: xValue,
    y: yValue,
    type: "bar",
    text: yValue.map(String),
    textposition: "auto",
    hoverinfo: "none",
    marker: {
      color: "rgb(158,202,225)",
      opacity: 0.6,
      line: {
        color: "rgb(8,48,107)",
        width: 1.5,
      },
    },
  };

  let data = [trace1];

  let layout = {
    barmode: "stack",
  };

  var config = { responsive: true, staticPlot: true };

  Plotly.newPlot("plot-result", data, layout, config);
};

const plotScatter = () => {
  var pred1 = {
    x: scatter_xValue,
    y: scatter_pred1_yValue,
    mode: "markers",
    type: "scatter",
    name: "Prediction 1",
    text: scatter_pred1_text,
  };

  var pred2 = {
    x: scatter_xValue,
    y: scatter_pred2_yValue,
    mode: "markers",
    type: "scatter",
    name: "Prediction 2",
    text: scatter_pred2_text,
  };

  var pred3 = {
    x: scatter_xValue,
    y: scatter_pred3_yValue,
    mode: "markers",
    type: "scatter",
    name: "Prediction 3",
    text: scatter_pred3_text,
  };

  var layout = {};

  var data = [pred1, pred2, pred3];

  var config = { responsive: true };

  Plotly.newPlot("plot-scatter", data, layout, config);
};

const visualLoad = () => {
  // let predictions = exportPred();
  if (predList.length !== 0) {
    document.getElementById("visual-msg").style.display = "none";
    text_list.forEach((t) => {
      t.style.display = "block";
    });
    plotResults();
    plotScatter();
  }
};
