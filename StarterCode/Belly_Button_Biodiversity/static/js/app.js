function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  url = `/metadata/${sample}`;
  d3.json(url).then(function(sample)  {
  
    keys = Object.keys(sample);
    values = Object.values(sample);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    var table = PANEL.append("table");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    for (var i = 0; i< keys.length; i++){
      var row = table.append("tr")
        .attr("id", "rowData")
        .text(keys[i] + ": "+ values[i]);      
    }
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = `/samples/${sample}`;
  d3.json(url).then(function(sample)  {

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: "markers",
      type: "scatter",
      text: sample.otu_labels,
      marker: {
        color: sample.otu_ids,
        size: sample.sample_values
      }
    };

    var data1 = [trace1];
    Plotly.newPlot("bubble", data1)
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var otu_id = sample.otu_ids;
    var otu_labels = sample.otu_labels;
    var sample_values = sample.sample_values;

    sorted_otu_id = otu_id.sort((a, b) => b - a);
    sorted_sample_values = sample_values.sort((a, b) => b - a);
    sorted_otu_labels = otu_labels.sort((a,b)=>b-1);
    
    var trace2 = {
      labels: sorted_otu_id.slice(0,9),
      values: sorted_sample_values.slice(0,9),
      hoverinfo: sorted_otu_labels.slice(0,9),
      type: 'pie'
     };
     
    var data2 = [trace2]; 
    Plotly.newPlot("pie", data2);
    
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
