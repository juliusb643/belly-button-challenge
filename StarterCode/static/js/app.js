const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
let samples = [];
let metadata = [];

d3.json(url).then(function (data) {
    console.log(data)
    samples = data.samples;
    metadata = data.metadata;

    const dropdownMenu = d3.select("#selDataset");
    samples.forEach((sample, index) => {
        dropdownMenu.append("option")
            .attr("value", index)
            .text(sample.id);
    });

    init(0);

    dropdownMenu.on("change", function () {
        const selectedIndex = dropdownMenu.property("value");
        updatePlotly(selectedIndex);
    });
});

function init(index) {
    createBarChart(index);
    createBubbleChart(index);
    displayMetadata(index);
}

function createBarChart(index) {
    console.log(createBarChart)
    const sample = samples[index];
    const otuIds = sample.otu_ids.slice(0, 10);
    const sampleValues = sample.sample_values.slice(0, 10);
    const otuLabels = sample.otu_labels.slice(0, 10);

    const data = [{
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h",
    }];

    Plotly.newPlot("bar", data);
}

function createBubbleChart(index) {
    console.log(createBubbleChart)
    const sample = samples[index];
    const otuIds = sample.otu_ids;
    const sampleValues = sample.sample_values;
    const otuLabels = sample.otu_labels;

    const data = [{
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Earth',
        },
        text: otuLabels,
    }];

    Plotly.newPlot("bubble", data);
}

function displayMetadata(index) {
    console.log(displayMetadata)
    const selectedMetadata = metadata[index];
    const metadataContainer = d3.select("#sample-metadata");

    metadataContainer.html("");

    for (const [key, value] of Object.entries(selectedMetadata)) {
        metadataContainer.append("p")
            .text(`${key}: ${value}`);
    }
}

function updatePlotly(index) {
    createBarChart(index);
    createBubbleChart(index);
    displayMetadata(index);
}