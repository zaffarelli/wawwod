class GeoCity {
    constructor(cityName, wdata, parent, collector) {
        this.cityName = cityName;
        this.parent = parent;
        this.wawwod_data = wdata['districts'];
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
        if (me.cityName == "munich") {
            me.dataUrl = "https://gist.githubusercontent.com/p3t3r67x0/f8c1ea64b2862c6eda8771daba4f297b/raw/f35cc5e3994ee4862e5101de107f2aba33e7d658/muenchen_city_districts.geojson";
        }
    }

    buildPatterns(){
        let me = this;
        let defs = me.svg.append('defs');
        defs.append("pattern")
            .attr('id',"neutral")
            .attr('patternUnits',"userSpaceOnUse")
            .attr('width',10)
            .attr('height',10)
            .attr('patternTransform',"rotate(-45)")
            .style("fill","#666")
            .append("rect")
		        .attr("width",10)
                .attr("height",10)
                // .attr("transform","translate(0,0)")
                .style("fill","#888")
        ;
        defs.append("pattern")
            .attr('id',"pure-camarilla")
            .attr('patternUnits',"userSpaceOnUse")
            .attr('width',10)
            .attr('height',10)
            .attr('patternTransform',"rotate(-45)")
            .style("fill","#666")
            .append("rect")
		        .attr("width",10)
                .attr("height",10)
                // .attr("transform","translate(0,0)")
                .style("fill","#A22")
        ;
        defs.append("pattern")
            .attr('id',"camarilla-contested-giovanni")
            .attr('patternUnits',"userSpaceOnUse")
            .attr('width',10)
            .attr('height',10)
            .attr('patternTransform',"rotate(-45)")
            .style("fill","#111")
            .append("rect")
		        .attr("width",5)
                .attr("height",10)
                // .attr("transform","translate(0,0)")
                .style("fill","#A22")
        ;
    }


    perform() {
        let me = this;
        me.buildPatterns();
        d3.json(me.dataUrl).then(function (data) {
            _.each(data.features, function (e, i) {
                e.id = i + 1;
                e.status = me.wawwod_data["d"+String(i+1).padStart(2,'0')]['s']['s01'].status
            });
            console.log(me.wawwod_data)
            me.projection = d3.geoAlbers()
                .rotate([0, 0]);
            me.projection.fitSize([me.width, me.height], data)
            let districts = me.svg.append("g")
                .selectAll("path")
                .data(data.features)
            ;
            let district_in = districts.enter()
            let item = district_in.append("g");
            item.append("path")
                .attr("id", function (e,i) {
                    return "path_" + e.id;
                })
                .attr("d", d3.geoPath().projection(me.projection))
                .style("fill", function(e,i){
                    return "url(#"+e.status+")"
                })
                .style("stroke", "#ddd")

                .on('mouseover', function (h, e) {
                    let label = "District " + e.id + ": " + e.properties.name;
                    d3.select("#infotext").text(label);
                    d3.select("#path_" + e.id).style("fill", "#a88");
                })
                .on('mouseout', function (h, e) {
                    d3.select("#path_" + e.id).style("fill", "url(#"+e.status+")");
                })
            ;
            let mastertext = me.svg.append('text')
                .attr("id", "mastertext")
                .attr("x", function (e, i) {
                    return me.width / 16;
                })
                .attr("y", function (e, i) {
                    return 9*me.height/10 - 4;
                })
                .attr("dy", -24)

                .style("font-family", "Roboto")
                .style("text-anchor", "start")
                .style("font-size", "20pt")
                .style("stroke", "#888")
                .style("stroke-width", "0.25")
                .style("fill", "#fff")
                .text(function (e, i) {
                    return "Munich by Night";
                })
            ;
            let infotext = me.svg.append('text')
                .attr("id", "infotext")
                .attr("x", function (e, i) {
                    return me.width / 16;
                })
                .attr("y", function (e, i) {
                    return 9*me.height/10 - 4;
                })
                .style("font-family", "Roboto")
                .style("text-anchor", "start")
                .style("font-size", "12pt")
                .style("stroke", "#888")
                .style("stroke-width", "0.25")
                .style("fill", "#fff")
                .text(function (e, i) {
                    return "";
                })
            ;
        })
    }
}