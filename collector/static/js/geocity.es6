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
        this.wawwod_settings = wdata['settings'];
        this.player_safe = this.wawwod_settings['player_safe'];
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


        let neutral_color = "#686262";
        let sabbat_color = "#cb367f";
        let camarilla_color = "#744406";

        let p1 = defs.append("pattern")
            .attr('id', "neutral")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
        ;
        p1.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", neutral_color)
        ;
        let p2 = defs.append("pattern")
            .attr('id', "full")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
        p2.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", camarilla_color)
        ;
        let p3 = defs.append("pattern")
            .attr('id', "controlled")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)
        p3.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", neutral_color)
        ;
        p3.append("path")
            .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2")
            .attr("stroke", camarilla_color)
            .attr("fill", neutral_color)
            .attr("stroke-width", 3)
        ;


        let p4 = defs.append("pattern")
            .attr('id', "presence")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)

        p4.append('rect')
            .attr('width', 8)
            .attr('height', 8)
            .attr("fill", neutral_color)
            .attr("stroke-width", 0)
        ;

        p4.append("path")
            .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2")
            .attr("stroke", camarilla_color)
            .attr("fill", neutral_color)
            .attr("stroke-width", 2)
        ;


        let p5 = defs.append("pattern")
            .attr('id', "incursions")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)

        p5.append('rect')
            .attr('width', 8)
            .attr('height', 8)
            .attr("fill", neutral_color)
            .attr("stroke-width", 0)
        ;

        p5.append("path")
            .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2")
            .attr("stroke", sabbat_color)
            .attr("fill", neutral_color)
            .attr("stroke-width", 2)
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
        let legend_pack = legend.append("rect")
            .attr("x", 0.25 + me.width / 64)
            .attr("y", 0)
            .attr('height', 220)
            .attr('width', 250)
            .style('fill', "#101010")
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
            .attr("opacity",0.5)
        ;
        let legend_in = legend.selectAll(".legend_item")
            .data(legend_data)
            .enter()
        ;

        let item = legend_in.append("g")
            .attr("class", 'legend_item');
        item.append("rect")
            .attr("x", 10+me.width / 64)
            .attr("y", function (d, i) {
                return i * 30+10;
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
            .attr("x", 10+me.width / 64 + 50)
            .attr("y", function (d, i) {
                return i * 30+10;
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
                    e.name = e.properties["stadtteil_name"];


                    e.sector_name = entry.sector_name;
                    e.district_name = entry.district_name;
                    e.population_details = entry.population_details;
                    e.category = "DISTRICT"
                    if (e.properties['Stadtteil']) {
                        e.name = e.properties["stadtteil_name"] + " ("+e.properties['Stadtteil'] +")" ;
                        delete e.properties['Stadtteil'] ;
                    }
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
                    "properties": {"name": poi['name'], "color": poi["color"], "hyperlink": poi['hyperlink']}
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
                    return "path_" + e.id;
                })
                .attr("class", "district_path")
                .attr("d", me.geoPath)
                .style("fill", function (e, i) {
                    return "url(#" + e.status + ")"
                })
                .style("stroke", "#ccc")
                .style("stroke-width", 0.125)
                .style("fill-opacity", 0.5)
                .style("stroke-opacity", 0.5)
                .on('click',function(e,d) {
                    let coords = me.geoPath.centroid(d);
                    $(".district_text").attr("opacity", 0.0);
                    $(".district_path").attr("fill-opacity", 0.5);
                    $(".district_path").attr("stroke-opacity", 0.5);
                    d3.select("#path_" + e.id).style("fill-opacity", 1);
                    d3.select("#path_" + e.id).style("stroke-opacity", 1);
                    $("#district_text_"+d.code ).attr("opacity", 1.0);
                    let str = '';
                    str += "<p>";
                    str += "<strong>" + d.code + " :: " + d.sector_name + "</strong>";
                    str += "<br/><b>District:</b> " + d.district_name;
                    str += "<br/><b>Population:</b> " + d.population;
                    str += "<br/><b>Details:</b> <ul>" + d.population_details + "</ul>";
                    str += "</p>";
                    if (e.ctrlKey){
                        me.centerNode(coords[0],coords[1]);
                        $(".tooltip").addClass("hidden");
                    }else {
                        $(".tooltip").removeClass("hidden");
                    }
                    me.tooltip.transition()
                        .duration(100)
                        .style("opacity", 1.0);
                    me.tooltip.html(str);
                });

            ;

            item.append('text')
                .attr('class', 'district_text')
                .attr('id', function(d){
                    return 'district_text_'+d.code;
                })
                .attr("x", function (e, i) {
                    return me.geoPath.centroid(e)[0];
                })
                .attr("y", function (e, i) {
                    return me.geoPath.centroid(e)[1];
                })
                .attr('dx', 0)
                .attr('dy', -6)
                .style("font-family", "Ruda")
                .style("text-anchor", "middle")
                .style("font-size", '5pt')
                .style("font-weight", "bold")
                .style("stroke", "#999999")
                .style("stroke-width", "0.15pt")
                .style("fill", "#CCCCCC")
                .text(function (e, i) {
                    if (e.sector_name != e.properties["stadtteil_name"]){
                         return e.code + ":"+ e.properties["stadtteil_name"];
                    }
                    return e.sector_name;


                })
                .attr("opacity",0)
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

    centerNode(x, y) {
        let me = this;
        me.g
            .transition()
            .duration(750)
            .call(me.zoom.scaleTo, 1)

            .transition()
            .duration(750)
            .call(me.zoom.translateTo, x , y )

            .transition()
            .duration(750)
            .call(me.zoom.scaleTo, 8)
        ;
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
            .attr('class','poi_circle')
            .attr('id',function(d){
              return "poi_label_"+d.properties.code;
            })
            .attr('x', 0)
            .attr('y', 0)
            .attr('r', 1.5)
            .style("stroke", "#606060")
            .style("stroke-width", "0.25pt")
            .style("fill", function (d) {
                return d.properties.color;
            })
            .style("opacity", function(d){
                if (d.properties.is_public == false){
                    if (me.player_safe){
                        return 0;
                    }
                }
                return 1;
            })
            .on('mouseover',function(e,d){
                $('#poi_path_'+d.properties.code).attr("opacity",1.0);
                $('#poi_text_'+d.properties.code).attr("opacity",1.0);
                $('.poi_path').attr("opacity",0.0);
                $('.poi_text').attr("opacity",0.0);
            })
             .on('mouseout',function(e,d){
                 // $('.poi_path').attr("opacity",0.1);
                 // $('.poi_text').attr("opacity",0.1);
            })
            .on('click',function(e,d) {
                let coords = me.projection(d.geometry.coordinates);
                console.log(coords);
                // me.centerNode(coords[0],coords[1]);
                if (e.ctrlKey) {
                    console.log("yo")
                    let nuke = document.createElement("a");
                    nuke.href = d.properties.hyperlink;
                    nuke.target = "hyperlink";
                    nuke.click();
                }else{
                    $('#poi_path_'+d.properties.code).attr("opacity",1.0);
                    $('#poi_text_'+d.properties.code).attr("opacity",1.0);
                }

            });



        poi_in.append('path')
            .attr('class','poi_path')
            .attr('id',function(d){
              return "poi_path_"+d.properties.code;
            })
            //.attr('d', "M1,-3 l10,-23 l6,0 l0,0.5 l-6,0")
            .attr('d', "M0,0 l10,-20 m0,-5 l50,0 l0,5 l-50,0 l0,-5 z")
            .style("fill", function (d) {
                return "#111111";//d.properties.color;
            })
            .style("stroke", "#F0F0F0")
            //.style("fill", "transparent")
            .style("stroke-width", "0.1pt")
            .attr("opacity",0)

        ;

        poi_in.append('text')
            .attr('class','poi_text')
            .attr('id',function(d){
              return "poi_text_"+d.properties.code;
            })
            .attr('dx', 12)
            .attr('dy', -22)
            .style("font-family", "Ruda")
            .style("text-anchor", "start")
            .style("font-size", "2pt")
            .style("stroke", "#C0C0C0")
            .style("stroke-width", "0.1pt")
            .style("fill", "#F0F0F0")
            .text(function (d) {
                return d.properties.name+" ";
            })
            .attr("opacity",0)
        ;

    }

    zoomActivate() {
        let me = this;
        me.zoom = d3.zoom()
            .scaleExtent([1, 32])
            .on('zoom', function (event) {
                me.g.attr('transform', event.transform);
            });
        me.g.call(me.zoom);
    }



}