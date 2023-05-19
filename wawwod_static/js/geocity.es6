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

        }else if (me.cityName == "hamburg") {
            me.dataUrl = "https://gist.githubusercontent.com/p3t3r67x0/935759ba975ffd9f6df6d1059fe5ad82/raw/191f44e01e8d5f71451170b9d6746eefddb5c8da/hamburg_city_districts.geojson";
        }else if (me.cityName == "new york") {
            me.dataUrl = "https://github.com/dwillis/nyc-maps/blob/master/police_precincts.geojson";
        }

        console.log(me.cityName)
    }

    buildPatterns() {
        let me = this;
        let defs = me.svg.append('defs');
        defs.append("pattern")
            .attr('id', "neutral")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(-45)")
            .style("fill", "#666")
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            // .attr("transform","translate(0,0)")
            .style("fill", "#888")
        ;
        defs.append("pattern")
            .attr('id', "pure-camarilla")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(-45)")
            .style("fill", "#666")
            .append("rect")
            .attr("width", 10)
            .attr("height", 10)
            // .attr("transform","translate(0,0)")
            .style("fill", "#A22")
        ;
        defs.append("pattern")
            .attr('id', "camarilla-controlled")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(45)")
            .append("rect")
            .attr("width", 14)
            .attr("height", 10)
            .attr("transform", "translate(-2,0)")
            .style("fill", "#a22")
            .style("stroke", "#888")
            .style("stroke-width", "2")
        ;

        defs.append("pattern")
            .attr('id', "camarilla-presence")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(45)")
            .append("rect")
            .attr("width", 26)
            .attr("height", 10)
            .attr("transform", "translate(-8,0)")
            .style("fill", "#a22")
            .style("stroke", "#888")
            .style("stroke-width", "8")
        ;
        defs.append("pattern")
            .attr('id', "camarilla-contested-giovanni")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(-45)")
            .append("rect")
            .attr("width", 14)
            .attr("height", 10)
            .attr("transform", "translate(-2,0)")
            .style("fill", "#a22")
            .style("stroke", "#111")
            .style("stroke-width", "2")
        ;
        defs.append("pattern")
            .attr('id', "sparse-intrusions")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(-45)")
            .append("rect")
            .attr("width", 10)
            .attr("height", 14)
            .attr("transform", "translate(0,-2)")
            .style("fill", "#888")
            .style("stroke", "#666")
            .style("stroke-width", 2)
        ;

        defs.append("pattern")
            .attr('id', "gangrel-territory")
            .attr('patternUnits', "userSpaceOnUse")
            .attr('width', 10)
            .attr('height', 10)
            .attr('patternTransform', "rotate(45)")
            .append("rect")
            .attr("width", 22)
            .attr("height", 10)
            .attr("transform", "translate(-6,0)")
            .style("fill", "#141")
            .style("stroke", "#a22")
            .style("stroke-width", "6")
        ;

    }

    drawLegend(){
        let me = this;
        let legend_data = [
            {'pattern':'pure-camarilla', 'text': 'Camarilla'},
            {'pattern':'camarilla-controlled', 'text': 'Camarilla controlled'},
            {'pattern':'camarilla-presence', 'text': 'Camarilla presence'},
            {'pattern':'neutral', 'text': 'Uncontested'},
            {'pattern':'gangrel-territory', 'text': 'Gangrel clan territory'},
            {'pattern':'camarilla-contested-giovanni', 'text': "Highly contested"},
            {'pattern':'sparse-intrusions', 'text': "Sparse intrusions"}
        ]
        let legend = me.svg.append("g")
                .selectAll(".legend_item")
                .data(legend_data)
            ;
            let legend_in = legend.enter()
            let item = legend_in.append("g")
                .attr("class",'legend_item');
            item.append("rect")
                .attr("x", me.width/64)
                .attr("y", function(d,i){
                    return i*30;
                })
                .attr('height', 20)
                .attr('width', 30)
                .style('fill',function(d,i){
                    return 'url(#'+d.pattern+')'
                })
                .style('stroke', '#ccc')
                .style('stroke-width', '0.5pt')
            ;
            item.append("text")
                .attr("x", me.width/64+50)
                .attr("y", function(d,i){
                    return i*30;
                })
                .attr("dy", 15)
                .style('fill', '#fff')
                .style('stroke', '#888')
                .style('stroke-width', '0.5pt')
                .style('font-family', 'Roboto')
                .text(function(d,i){
                    return d.text;
                })
            ;
    }


    perform() {
        let me = this;
        me.buildPatterns();
        me.drawLegend();
        d3.json(me.dataUrl).then(function (data) {
            if (me.cityName == 'munich') {
                _.each(data.features, function (e, i) {
                    e.id = i + 1;
                    let entry = me.wawwod_data["d" + String(i + 1).padStart(2, '0')]['s']['s01'];
                    e.population = entry.population;
                    e.status = entry.status
                });
            }
            me.projection = d3.geoAlbers()
                .rotate([0, 0]);
            me.projection.fitSize([me.width, me.height], data)
            let districts = me.svg.append("g")
                .attr('class','districts')
                .selectAll("path")
                .data(data.features)
            ;
            let district_in = districts.enter()
            let item = district_in.append("g")
                .attr('class','district_item');
            item.append("path")
                .attr("id", function (e, i) {
                    return "path_" + e.id;
                })
                .attr("d", d3.geoPath().projection(me.projection))
                .style("fill", function (e, i) {
                    return "url(#" + e.status + ")"
                })
                .style("stroke", "#ddd")

                .on('mouseover', function (h, e) {
                    let label = "District " + e.id + ": " + e.properties.name;
                    d3.select("#infotext").text(label);
                    d3.select("#path_" + e.id).style("fill", "#863");
                })
                .on('mouseout', function (h, e) {
                      d3.select("#infotext").text("");
                    d3.select("#path_" + e.id).style("fill", "url(#" + e.status + ")");
                })
            ;
            item.append('rect')
                .attr("x", function (e, i) {
                    return d3.geoPath().projection(me.projection).centroid(e)[0]-20;
                })
                .attr("y", function (e, i) {
                    return d3.geoPath().projection(me.projection).centroid(e)[1];
                })
                .attr('width',40)
                .attr('height',30)
                .attr('rx',3)
                .attr('ry',3)
                .style("stroke", "#ccc")
                .style("stroke-width", "1pt")
                .style("fill", "#311")

            ;
            item.append('text')
                .attr("x", function (e, i) {
                    return d3.geoPath().projection(me.projection).centroid(e)[0];
                })
                .attr("y", function (e, i) {
                    return d3.geoPath().projection(me.projection).centroid(e)[1];
                })
                .attr('dx',0)
                .attr('dy',-14)
                .style("font-family", "Roboto")
                .style("text-anchor", "middle")
                .style("font-size", "10pt")
                .style("font-weight", "bold")
                .style("stroke", "#000")
                .style("stroke-width", "0.25pt")
                .style("fill", "#111")
                .text(function (e, i) {
                    return e.population;

                })
            ;
            item.append('text')
                .attr("x", function (e, i) {
                    return d3.geoPath().projection(me.projection).centroid(e)[0];
                })
                .attr("y", function (e, i) {
                    return d3.geoPath().projection(me.projection).centroid(e)[1];
                })
                .attr('dx',0)
                .attr('dy',20)
                .style("font-family", "Roboto")
                .style("text-anchor", "middle")
                .style("font-size", "10pt")
                .style("font-weight", "bold")
                .style("stroke", "#888")
                .style("stroke-width", "0.25pt")
                .style("fill", "#fff")
                .text(function (e, i) {
                    return e.id;

                })
            ;


            let mastertext = me.svg.append('text')
                .attr("id", "mastertext")
                .attr("x", function (e, i) {
                    return me.width / 8;
                })
                .attr("y", function (e, i) {
                    return 9 * me.height / 10 - 4;
                })
                .attr("dy", -48)

                .style("font-family", "Roboto")
                .style("text-anchor", "middle")
                .style("font-size", "20pt")
                .style("stroke", "#888")
                .style("stroke-width", "0.25")
                .style("fill", "#fff")
                .text(function (e, i) {
                    return me.cityName+" by Night";
                })
            ;
            let subtext = me.svg.append('text')
                .attr("id", "mastertext")
                .attr("x", function (e, i) {
                    return me.width / 8;
                })
                .attr("y", function (e, i) {
                    return 9 * me.height / 10 - 4;
                })
                .attr("dy", -24)

                .style("font-family", "Roboto")
                .style("text-anchor", "middle")
                .style("font-size", "16pt")
                .style("stroke", "#888")
                .style("stroke-width", "0.25")
                .style("fill", "#fff")
                .text(function (e, i) {
                    return "Camarilla Territories";
                })
            ;
            let infotext = me.svg.append('text')
                .attr("id", "infotext")
                .attr("x", function (e, i) {
                    return me.width / 8;
                })
                .attr("y", function (e, i) {
                    return 9 * me.height / 10 - 4;
                })
                .style("font-family", "Roboto")
                .style("text-anchor", "middle")
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