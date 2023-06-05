class GeoCity {
    constructor(cityName, wdata, parent, collector) {
        this.cityName = cityName;
        if (this.cityName == "munich") {
            this.cityCode = "MU";
        } else if (this.cityName == "hamburg") {
            this.cityCode = "HH";
        } else {
            this.cityCode = "XX";
        }
        this.parent = parent;
        this.wawwod_data = wdata['districts'];
        this.wawwod_poi = wdata['hotspots'];
        this.co = collector;
        this.init()
    }

    init() {
        let me = this;
        d3.select(me.parent).selectAll("svg").remove();
        me.width = parseInt(d3.select(me.parent).style("width"));
        me.height = parseInt(d3.select(me.parent).style("height"));
        me.svg = d3.select(me.parent).append('svg')
            .attr("id", "geocity")
            .attr("width", me.width)
            .attr("height", me.height)
        ;
        me.g = me.svg.append('g');
        me.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip hidden")
        ;
        me.dataUrl = "/static/storytelling/geojson/" + me.cityName + ".geojson";
    }

    buildPatterns() {
        let me = this;
        let defs = me.svg.append('defs');


        let neutral_color = "#505050";
        let sabbat_color = "#c3d584";
        let camarilla_color = "#fc0000";

        defs.append("pattern")
            .attr('id', "neutral")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", neutral_color)
        ;
        defs.append("pattern")
            .attr('id', "full")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", camarilla_color)
        ;
        defs.append("pattern")
            .attr('id', "controlled")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("stroke", neutral_color)
            .style("fill", camarilla_color)
            .style("stroke-width", 3)
        ;

        defs.append("pattern")
            .attr('id', "presence")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("stroke", neutral_color)
            .style("fill", camarilla_color)
            .style("stroke-width", 6)
        ;


        defs.append("pattern")
            .attr('id', "incursions")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("stroke", neutral_color)
            .style("fill", sabbat_color)
            .style("stroke-width", 8)
        ;


        defs.append("pattern")
            .attr('id', "contested")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("stroke", neutral_color)
            .style("fill", sabbat_color)
            .style("stroke-width", 6)
        ;

        defs.append("pattern")
            .attr('id', "lost")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("stroke", neutral_color)
            .style("fill", sabbat_color)
            .style("stroke-width", 4)
        ;


    }

    drawLegend() {
        let me = this;
        let legend_data = [
            {'pattern': 'full', 'text': 'Main Domain'},
            {'pattern': 'controlled', 'text': 'Under control'},
            {'pattern': 'presence', 'text': 'Noticeable Presence'},
            {'pattern': 'neutral', 'text': 'Neutral'},
            {'pattern': 'incursions', 'text': 'Incursions'},
            {'pattern': 'contested', 'text': "Contested"},
            {'pattern': 'lost', 'text': "Lost"}
        ]
        let legend = me.svg.append("g")
            .selectAll(".legend_item")
            .data(legend_data)
        ;
        let legend_in = legend.enter()
        let item = legend_in.append("g")
            .attr("class", 'legend_item');
        item.append("rect")
            .attr("x", me.width / 64)
            .attr("y", function (d, i) {
                return i * 30;
            })
            .attr('height', 20)
            .attr('width', 30)
            .style('fill', function (d, i) {
                return 'url(#' + d.pattern + ')'
            })
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
        ;
        item.append("text")
            .attr("x", me.width / 64 + 50)
            .attr("y", function (d, i) {
                return i * 30;
            })
            .attr("dy", 15)
            .style('fill', '#fff')
            .style('stroke', '#888')
            .style('stroke-width', '0.5pt')
            .style('font-family', 'Ruda')
            .text(function (d, i) {
                return d.text;
            })
        ;
    }

    perform() {
        let me = this;
        me.buildPatterns();
        me.drawLegend();
        d3.json(me.dataUrl).then(function (data) {
            _.each(data.features, function (e, i) {
                e.id = i + 1;
                e.population = 0;
                e.status = "neutral";
                let key = me.cityCode + String(i + 1).padStart(3, '0');
                if (me.wawwod_data[key]) {
                    let entry = me.wawwod_data[key];
                    e.population = entry.population;
                    e.status = entry.status;
                    e.code = key
                    //console.log(entry)
                    e.name = entry.name;
                    e.sector_name = entry.sector_name;
                    e.district_name = entry.district_name;
                    e.population_details = entry.population_details;
                    e.category = "DISTRICT"
                }
                if (e.properties['Stadtteil']) {
                    e.name = e.properties['Stadtteil'];
                    delete e.properties['Stadtteil'];
                }
            });
            // console.log("A")
            // console.log(me.wawwod_poi.length)
            _.each(me.wawwod_poi, function (poi) {
                let poi_data = {
                    "type": "Feature",
                    "category": "POI",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [poi['longitude'], poi['latitude']]
                    },
                    "properties": {"name": poi['name'], "color":poi["color"]}
                }
                console.log(poi_data)
                // data.features.push(poi_data);
            });

            console.log(data);
            me.projection = d3.geoMercator()
                .rotate([0, 0])
                .fitSize([me.width, me.height], data)
            ;
            me.geoPath = d3.geoPath(me.projection)
            let districts = me.g.append("g")
                .attr('class', 'districts')
                .selectAll("path")
                .data(data.features)
            ;
            let district_in = districts.enter()
            let item = district_in.append("g")
                .attr('class', 'district_item');
            item.append("path")
                .attr("id", function (e) {
                    // console.log(e.properties.name)
                    return "path_" + e.id;
                })
                .attr("d", me.geoPath)
                .style("fill", function (e, i) {
                    return "url(#" + e.status + ")"
                })
                .style("stroke", "#111")
                .style("stroke-width", 0.125)
                .style("fill-opacity", 0.5)
                .style("stroke-opacity", 0.1)

                .on('mouseover', function (h, e) {
                    let str = '';
                    str += "<p>";
                    str += "<strong>" + e.code + " :: " + e.sector_name + "</strong>";
                    str += "<br/><b>District:</b> " + e.district_name;
                    str += "<br/><b>Code:</b> " + e.code;
                    str += "<br/><b>Population:</b> " + e.population;
                    str += "<br/><b>Details:</b> <ul>" + e.population_details + "</ul>";
                    str += "</p>";
                    d3.select("#path_" + e.id).style("fill-opacity", 1);
                    d3.select("#path_" + e.id).style("stroke-opacity", 0.8);
                    $(".tooltip").removeClass("hidden");
                    me.tooltip.transition()
                        .duration(100)
                        .style("opacity", 1.0);
                    me.tooltip.html(str);
                })
                .on('mouseout', function (h, e) {

                    d3.select("#path_" + e.id).style("fill-opacity", 0.5);
                    d3.select("#path_" + e.id).style("stroke-opacity", 0.1);
                    me.tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                    $(".tooltip").removeClass("hidden");
                })
            ;

            item.append('text')
                .attr("x", function (e, i) {
                    return me.geoPath.centroid(e)[0];
                })
                .attr("y", function (e, i) {
                    return me.geoPath.centroid(e)[1];
                })
                .attr('dx', 0)
                .attr('dy', 6)
                .style("font-family", "Roboto")
                .style("text-anchor", "middle")
                .style("font-size", "3pt")
                .style("font-weight", "bold")
                .style("stroke", "#ccc")
                .style("stroke-width", "0.15pt")
                .style("fill", "#eee")
                .text(function (e, i) {
                    return e.sector_name;

                })
            ;


            let mastertext = me.svg.append('text')
                .attr("id", "mastertext")
                .attr("x", function (e, i) {
                    return me.width / 9;
                })
                .attr("y", function (e, i) {
                    return 49 * me.height / 50 - 4;
                })
                // .attr("dy", -72)

                .style("font-family", "Ruda")
                .style("text-anchor", "middle")
                .style("font-size", "20pt")
                .style("stroke", "#888")
                .style("stroke-width", "0.25")
                .style("fill", "#fff")
                .text(function (e, i) {
                    return "World of Darkness :: " + me.cityName.charAt(0).toUpperCase() + me.cityName.slice(1);
                })
            ;
            me.draw_poi();
        })
        me.zoomActivate();
    }

    draw_poi() {
        let me = this;
        console.log("POI");
        let pois = me.g.append("g")
            .attr('class', 'poi')
            .selectAll(".poi")
            .data(me.wawwod_poi)
        ;
        console.log("POIs");
        let poi_in = pois.enter()
            .append("g")
            .attr('class', 'poi_item')
            .attr("transform", function (d) {
                console.log(d)
                return "translate(" + me.projection(d.geometry.coordinates) + ")";
            });
        ;
        poi_in.append('circle')
            .attr('x', 0)
            .attr('y', 0)
            .attr('r', 3)
            .style("stroke", "#ccccccc")
            .style("stroke-width", "0.1pt")
            .style("fill", function(d){
                return d.properties.color;
            })
            .style("opacity", 1)
        ;
        poi_in.append('text')
            .attr('dy', -3)
            .style("font-family", "Roboto")
            .style("text-anchor", "middle")
            .style("font-size", "3pt")
            .style("stroke", "#666666")
            .style("stroke-width", "0.1pt")
            .style("fill", "#ffffff")
            .text(function (d) {
                return d.properties.name;
            })
        ;

    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.25, 32])
            .on('zoom', function (event) {
                me.g.attr('transform', event.transform);
            });
        me.g.call(zoom);
    }

}