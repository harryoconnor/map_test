
const svg = d3.select('svg')


const g = svg.append('g');

svg.call(d3.zoom().on('zoom', zoomed));


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}


var colorScale = d3.scaleThreshold()
  .domain([100, 110, 120, 130, 140, 150])
  .range(d3.schemeBlues[7]);


colorScale = d3.scaleLinear().domain([100, 180]).range(["#F7FBFF", "#08306B"]);

//colorScale = d3.scaleLinear().domain([100, 180]).range(["#b4c1cf", "#006edb"]);


function zoomed({transform}) {
    g.attr("transform", transform);
  }

width = parseInt(svg.style("width"));
height = parseInt(svg.style("height"));


const projection = d3.geoMercator().scale(2500).center([1.1743,52.3555]).translate([width / 2, height / 2]);
const pathGenerator = d3.geoPath().projection(projection)


const csv_files = ["result2014.csv","result2015.csv","result2016.csv","result2017.csv"]

Promise.all([d3.json("http://martinjc.github.io/UK-GeoJSON/json/eng/topo_eer.json")
,d3.csv('result2014.csv'),
d3.csv('result2015.csv'),
d3.csv('result2016.csv'),
d3.csv('result2017.csv'),
d3.csv('result2018.csv'),
d3.csv('result2019.csv')

]
)
.then(([map_data,data_2014,data_2015,data_2016,data_2017,data_2018,data_2019]) =>{
    const regions = topojson.feature(map_data, map_data.objects.eer);
    console.log(data_2018);
    console.log(colorScale(5))

     g.selectAll('path').data(regions.features)
        .enter().append('path')
        .attr('d', pathGenerator)
        .attr('class', "test")
        .attr("fill", data =>{
          let value = data_2014.filter(obj =>obj.region==data.properties.EER13NM)
          //console.log("test", data.properties.EER13NM)
          return colorScale(value[0].value)
        })
        .append('title')
          .text(data =>{
            //let value = csv_data[data.properties.EER13NM];
            let value = data_2014.filter(obj =>obj.region==data.properties.EER13NM)
            //console.log(data.properties.EER13NM)
            //console.log(value)
            return value[0].value;
            }
            );

    d3.selectAll("input").on("change", function change(){
      var value = this.value;
      console.log(value)
      d3.selectAll("path").style("fill", data =>{
        switch (value) {
          case "2014":
            csv_data=data_2014;
            break;
          case "2015":
            csv_data=data_2015;
            break;
          case "2016":
            csv_data=data_2016;
            break;
          case "2017":
              csv_data=data_2017;
              break;
          case "2018":
            csv_data=data_2018;
            break;
          case "2019":
            csv_data=data_2019;
            break;
        }
        let csv_value = csv_data.filter(obj =>obj.region==data.properties.EER13NM)
        //console.log("test", data.properties.EER13NM)
        return colorScale(csv_value[0].value)
      })
    })
})