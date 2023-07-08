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
        me.focusedDistrict = undefined;
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
        me.poi_legend_data = []
        me.poi_legend_size = 0;
    }

    buildPatterns() {
        let me = this;
        let defs = me.svg.append('defs');
        let neutral_color = "#615349";
        let sabbat_color = "#034370";
        let camarilla_color = "#430370";

        let p1 = defs.append("pattern")
            .attr('id', "neutral")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8);
        p1.append("rect")
            .attr("width", 8)
            .attr("height", 8)
            .style("fill", neutral_color)
        ;
        let p2 = defs.append("pattern")
            .attr('id', "full")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8);
        p2.append("rect")
            .attr("width", 8)
            .attr("height", 8)
            .style("fill", camarilla_color)
        ;
        let p3 = defs.append("pattern")
            .attr('id', "controlled")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)
        p3.append("rect")
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", neutral_color);
        p3.append("path")
            .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2")
            .attr("stroke", camarilla_color)
            .attr("fill", neutral_color)
            .attr("stroke-width", 4);
        let p4 = defs.append("pattern")
            .attr('id', "presence")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)
        p4.append('rect')
            .attr('width', 8)
            .attr('height', 8)
            .attr("fill", neutral_color)
            .attr("stroke-width", 0);
        p4.append("path")
            .attr("d", "M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2")
            .attr("stroke", camarilla_color)
            .attr("fill", neutral_color)
            .attr("stroke-width", 2);
        let p5 = defs.append("pattern")
            .attr('id', "incursions")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)
        p5.append('rect')
            .attr('width', 8)
            .attr('height', 8)
            .attr("fill", neutral_color)
            .attr("stroke-width", 0);
        p5.append("path")
            .attr("d", "M7,-1 l2,2 M-1,-1 L9,9 M-1,7 l2,2")
            .attr("stroke", sabbat_color)
            .attr("fill", neutral_color)
            .attr("stroke-width", 2);
        let p6 = defs.append("pattern")
            .attr('id', "contested")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)
        p6.append('rect')
            .attr('width', 8)
            .attr('height', 8)
            .attr("fill", sabbat_color)
            .attr("stroke-width", 4);
        p6.append("path")
            .attr("d", "M7,-1 l2,2 M-1,-1 L9,9 M-1,7 l2,2")
            .attr("stroke", neutral_color)
            .attr("fill", sabbat_color)
            .attr("stroke-width", 2);
        let p7 = defs.append("pattern")
            .attr('id', "lost")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 8)
            .attr('height', 8)
        p7.append("rect")
            .attr("width", 8)
            .attr("height", 8)
            .style("fill", sabbat_color);
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
        me.map_legend = me.svg.append("g")
        me.map_legend.append("rect")
            .attr("x", 0.25 + me.width / 64)
            .attr("y", 0)
            .attr('height', 220)
            .attr('width', 250)
            .style('fill', "#101010")
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
            .attr("opacity", 0.5)
        ;
        me.map_legend_in = me.map_legend.selectAll(".map_legend_item")
            .data(legend_data)
            .enter()
        ;

        me.map_legend_out = me.map_legend.exit()
            .remove()
        ;

        me.map_legend_in.append("g")
            .attr("class", 'map_legend_item');
        me.map_legend_in.append("rect")
            .attr("x", 10 + me.width / 64)
            .attr("y", function (d, i) {
                return i * 30 + 10;
            })
            .attr('height', 20)
            .attr('width', 30)
            .style('fill', function (d, i) {
                return 'url(#' + d.pattern + ')'
            })
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
        ;
        me.map_legend_in.append("text")
            .attr("x", 10 + me.width / 64 + 50)
            .attr("y", function (d, i) {
                return i * 30 + 10;
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

    drawPoiLegend() {
        let me = this;
        me.poi_legend_base = me.svg.append("g")
        me.poi_basey = me.height / 64 * 5
        me.legend_back = me.poi_legend_base.append("rect")
            .attr("x", 0.25 + me.width / 64)
            .attr("y",  me.height - me.height/64 * (me.poi_legend_size+1))
            .attr('height', me.height / 64 * me.poi_legend_size)
            .attr('width', 250)
            .style('fill', "#101010")
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
            .style("opacity",0.5)
        ;
        me.updatePoiLegend();
    }

    setupTextBasics(x){
        x.attr("dy", 15)
            .style('fill', '#000')
            .style('stroke', '#111')
            .style('stroke-width', '0.5pt')
            .style('font-family', 'Ruda')
            .style('font-size', '9pt')
        return x
    }

    find_poi_legend_y(d){
        let me = this;
        return me.height - d.properties.pos_visible * 25 - me.poi_basey;
    }

    updatePoiLegend() {
        let me = this;
        me.poi_legends = me.poi_legend_base
            .attr("class", 'all_poi_legend')
            .selectAll(".legend_item")
            .data(me.poi_legend_data)
        ;
        me.legend_in = me.poi_legends
            .enter()
            .append("g")
            .attr("class", 'legend_item')

            .attr('id', function(d){
                return 'legend_item_'+d.properties.code;
            })
            .merge(me.poi_legends)
            .style("opacity", function(d){
                return me.hotspotvisible(d);
            })
        ;
        me.legend_out = me.poi_legends.exit();
        me.legend_out
            .remove();
        me.legend_in.append("rect")
            .attr("x", 10 + me.width / 64)
            .attr("y", function (d) {
                return me.find_poi_legend_y(d);
            })
            .attr('height', 20)
            .attr('width', 30)
            .style('fill', function (d) {
                return d.properties.color;
            })
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
        ;
        me.legend_in.append("rect")
            .attr("x", 50 + me.width / 64)
            .attr("y", function (d) {
                return me.find_poi_legend_y(d);
            })
            .attr('height', 20)
            .attr('width', 300)
            .style('fill', function (d) {
                return "#888";
            })
            .style('stroke', '#ccc')
            .style('stroke-width', '0.5pt')
        ;
        let txt1 = me.legend_in.append("text")
            .attr("x", 20 + me.width / 64)
            .attr("y", function (d) {
                return me.find_poi_legend_y(d);
            })
            .style('text-anchor', 'middle')
            .text(function (d) {
                return d.properties.code;
            })
        ;
        me.setupTextBasics(txt1);
        let txt2 = me.legend_in.append("text")
            .attr("x", 55 + me.width / 64)
            .attr("y", function (d) {
                return me.height - d.properties.pos_visible * 25 -  me.poi_basey;
            })
            .style('text-anchor', 'start')
            .text(function (d) {
                return d.properties.name + " (Episode:"+d.properties.episode+")";
            })
        ;
        me.setupTextBasics(txt2);

    }

    drawDistricts(data) {
        let me = this;
        let districts = me.g.append("g")
            .attr('class', 'districts')
            .selectAll("path")
            .data(data.features)
        ;
        let district_in = districts.enter();
        let district_out = districts.exit();
        district_out.remove();
        let item = district_in.append("g")
            .attr('class', 'district_item');
        item.append("path")
            .attr("id", function (e) {
                return "path_" + e.id;
            })
            .attr("class", "district_path")
            .attr("d", me.geoPath)
            .style("fill", function (e) {
                return "url(#" + e.status + ")"
            })
            .style("stroke", "#ccc")
            .style("stroke-width", 0.125)
            .style("fill-opacity", 0.5)
            .style("stroke-opacity", 0.5)
            .on('click', function (e, d) {
                let coords = me.geoPath.centroid(d);
                let str = '';
                str += "<p>";
                str += "<strong>" + d.code + " :: " + d.sector_name + "</strong>";
                str += "<br/><b>District:</b> " + d.district_name;
                str += "<br/><b>Population:</b> " + d.population;
                str += "<br/><b>Details:</b> <ul>" + d.population_details + "</ul>";
                str += "</p>";

                me.focusedDistrict = d;
                console.log("FOUND DISTRICT: " + me.focusedDistrict.name)
                let pos_visible = 0;
                me.poi_legend_data = []
                _.each(me.wawwod_poi,function (v) {
                    v.properties.visible = d3.geoContains(d, v.geometry.coordinates)
                    if (v.properties.visible == true){
                        v.properties.pos_visible = pos_visible;
                        pos_visible += 1;
                        let x = _.cloneDeep(v);
                        me.poi_legend_data.push(x);
                    }else{
                        console.log("---: "+v.properties.name)
                        v.properties.pos_visible = 500;
                    }
                    // return v
                })
                me.poi_legend_size = pos_visible;
                me.centerNode(coords[0], coords[1]);
                me.updateHotSpots();
                me.updatePoiLegend();
                $(".tooltip").toggleClass("hidden");
                me.tooltip.transition()
                    .duration(100)
                    .style("opacity", 1.0);
                me.tooltip.html(str);
            });

        ;

        item.append('text')
            .attr('class', 'district_text')
            .attr('id', function (d) {
                return 'district_text_' + d.code;
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
            .style("font-size", '2pt')
            .style("font-weight", "bold")
            .style("stroke", "#999999")
            .style("stroke-width", "0.15pt")
            .style("fill", "#CCCCCC")
            .text(function (e, i) {
                if (e.sector_name != e.properties["stadtteil_name"]) {
                    return e.code + ":" + e.properties["stadtteil_name"];
                }
                return e.sector_name;


            })
            .attr("opacity", 1.0)
        ;
    }

    drawHotSpots() {
        let me = this;
        me.hotspots = me.g.append("g")
            .attr('class', 'poi')
            .selectAll(".poi_item")
            .data(me.wawwod_poi)
        ;
        me.updateHotSpots();
    }

    updateHotSpots() {
        let me = this;
        me.poi_in = me.hotspots.enter().append("g")
            .attr('class', 'poi_item')
            .attr('id', function (d) {
                return 'poi_item_' + d.properties.code;
            })
            .attr("transform", function (d) {
                return "translate(" + me.projection(d.geometry.coordinates) + ")";
            })
            .attr("opacity", function (d) {
                return me.hotspotvisible(d);
            })
        ;
        me.poi_in.append('path')
            .attr('class', 'poi_circle')
            .attr('id', function (d) {
                return "poi_label_" + d.properties.code;
            })
            .attr('x', 0)
            .attr('y', 0)
            .attr('d', function(d){
                let str = "M -2,0 L0,2 2,0 0,-2 -2,0 z";
                if (d.properties.type == "poi"){
                    str = "M -2,-2 L-2,2 2,2 2,-2 -2,-2 z";
                }else if (d.properties.type == "n/a"){
                    str = "M -2,-2 L-2,2 2,2 2,-2 -2,-2 z";
                }else if (d.properties.type == "ely"){
                    str = "M -2,-1 L0,3 2,-1 z";
                }
                return str;
            })
            .style("stroke", "#606060")
            .style("stroke-width", "0.25pt")
            .style("fill", function (d) {
                return d.properties.color;
            })
            .on('click', function (e, d) {
                let coords = me.projection(d.geometry.coordinates);
                if (e.ctrlKey) {
                    let nuke = document.createElement("a");
                    nuke.href = d.properties.hyperlink;
                    nuke.target = "hyperlink";
                    nuke.click();
                }
            });

        me.poi_in.append('text')
            .attr('class', 'poi_text_mark')
            .attr('id', function (d) {
                return "poi_text_mark_" + d.properties.code;
            })
            .attr('dx', 0)
            .attr('dy', 0.5)
            .style("font-family", "Ruda")
            .style("text-anchor", "middle")
            .style("font-size", "1pt")
            .style("stroke", "#111")
            .style("stroke-width", "0.1pt")
            .style("fill", "#000")
            .text(function (d) {
                return d.properties.code;
            })
        ;
        me.poi_out = me.hotspots.exit();
        me.poi_out.remove();
    }

    drawMasterText() {
        let me = this;
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
                let moretxt = " :: Storyteller Map";
                if (me.player_safe){
                    moretxt = " :: Players Map";
                }
                return "World of Darkness :: " + me.cityName.charAt(0).toUpperCase() + me.cityName.slice(1) + moretxt;
            })
        ;
    }

    centerNode(x, y) {
        let me = this;
        me.g
            .transition()
            .duration(350)
            .call(me.zoom.translateTo, x, y)

            .transition()
            .duration(350)
            .call(me.zoom.scaleTo, 8)
        ;
    }

    hotspotvisible(d) {
        let me = this;
        //if (d.properties.visible) {
            if (d.properties.is_public) {
                return 1;
            }else{
                if (me.player_safe){
                    return 0;
                }else{
                    return 1;
                }
            }
        //}
        return 0;
    }

    zoomActivate() {
        let me = this;
        me.zoom = d3.zoom()
            .scaleExtent([1, 128])
            .on('zoom', function (event) {
                me.g.attr('transform', event.transform);
            });
        me.g.call(me.zoom);
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
                    e.name = e.properties["stadtteil_name"];
                    e.sector_name = entry.sector_name;
                    e.district_name = entry.district_name;
                    e.population_details = entry.population_details;
                    e.category = "DISTRICT"
                    if (e.properties['Stadtteil']) {
                        e.name = e.properties["stadtteil_name"] + " (" + e.properties['Stadtteil'] + ")";
                        delete e.properties['Stadtteil'];
                    }
                }
            });
            let poi_idx = 0;
            _.each(me.wawwod_poi, function (poi) {
                poi['properties']['idx'] = poi_idx
                poi_idx += 1;
            });
            me.projection = d3.geoMercator()
                .rotate([0, 0])
                .fitSize([me.width, me.height], data)
            ;
            me.geoPath = d3.geoPath(me.projection)
            me.drawDistricts(data);
            me.drawMasterText();
            me.drawHotSpots();
            me.drawPoiLegend();
        })

        me.zoomActivate();
    }


}