class GeoCity {
    constructor(cityName, options='{}', wdata, parent, collector) {
        this.options = JSON.parse(options)
        this.cityName = this.options.name
        this.cityCode = this.options.code
        this.cityGeojson = this.options.geojson_file
        this.parent = parent;
        this.wawwod_data = wdata['districts']
        this.wawwod_poi = wdata['hotspots']
        this.wawwod_settings = wdata['settings']
        this.wawwod_fonts = wdata['fontset']
        if (options.includes("storyteller")){
            this.player_safe = false;
        }else{
            this.player_safe = true;
        }
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
        me.dataUrl = "/static/storytelling/geojson/" + me.cityGeojson+".geojson";
        me.poi_legend_data = []
        me.poi_legend_size = 0;
        me.lineColor = '#101010'
        me.strokeColor = '#404040'
        me.fillColor = '#000000'
    }

    createPDF() {
        let me = this
        me.svg.selectAll('.do_not_print').attr('opacity', 0)
        let base_svg = d3.select("#d3area svg").html()
        let flist = '<style>'
        for (let f of me.wawwod_fonts) {

            flist += '@import url("https://fonts.googleapis.com/css2?family=' + f + '");';
        }
        flist += '</style>';
        let lpage = "";
        let exportable_svg = '<?xml version="1.0" encoding="UTF-8" ?> \
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \
<svg class="geocities" \
xmlns="http://www.w3.org/2000/svg" version="1.1" \
xmlns:xlink="http://www.w3.org/1999/xlink" width="' + me.width + '" height="' + me.height + '"> \
' + flist + base_svg + '</svg>';
        lpage = "_p" + (me.page);
        let svg_name = "city_" + me.cityCode + lpage + ".svg"
        let pdf_name = "city_" + me.cityCode + lpage + ".pdf"
        let rid = me.cityCode
        let sheet_data = {
            'pdf_name': pdf_name,
            'svg_name': svg_name,
            'rid': rid,
            'svg': exportable_svg,
            'creature': "ADV_CREATURE",
        }
        me.svg.selectAll('.do_not_print').attr('opacity', 1);
        $.ajax({
            url: 'ajax/character/svg2pdf/' + me.cityCode + '/',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: sheet_data,
            dataType: 'json',
            success: function (answer) {
                console.log("PDF generated for [" + rid + "]...")
                console.error(answer);
            },
            error: function (answer) {
                console.error('Error generating the PDF...');
                console.error(answer);
            }
        });
    }



    buildPatterns() {
        let me = this;
        let defs = me.svg.append('defs')
        let neutral_color = "#F0F0F0" //"#615349"
        let sabbat_color = "#F0B0B0"
        let camarilla_color = "#D0D0F0"

        if (!me.player_safe) {
            neutral_color = "#615349" //"#615349"
            sabbat_color = "#d5816f"
            camarilla_color = "#8b1aff"
            me.lineColor = '#D0D0D0'
            me.strokeColor = '#C0C0C0'
            me.fillColor = '#F0F0F0'
        }

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
            .attr("transform",`translate(${0.5*me.width/80},${me.height/80})`)
        me.map_legend.append("rect")
            .attr("x", 0.25 + me.width / 64)
            .attr("y", 0)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr('height', 220)
            .attr('width', 250)
            .style('fill', "#E0E0E0")
            .style('stroke', "#808080")
            .style('stroke-width', '0.5pt')
            .attr("opacity", 0.75)
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
            .style('stroke', me.lineColor)
            .style('stroke-width', '0.5pt')
        ;
        me.map_legend_in.append("text")
            .attr("x", 10 + me.width / 64 + 50)
            .attr("y", function (d, i) {
                return i * 30 + 10;
            })
            .attr("dy", 15)
            .style('fill', me.fillColor)
            .style('stroke', me.strokeColor)
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
            .attr("x", 1 * me.width / 80)
            .attr("y",  me.height - me.height/64 * (me.poi_legend_size+1))
            .attr('height', me.height / 64 * me.poi_legend_size)
            .attr('width', 250)
            .style('fill', me.fillColor)
            .style('stroke', me.strokeColor)
            .style('stroke-width', '0.5pt')
            .style("opacity",0.5)
        ;
        me.updatePoiLegend();
    }

    setupTextBasics(x){
        x.attr("dy", 15)
            .style('fill', this.fillColor)
            .style('stroke', this.strokeColor)
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
            .style('stroke', me.lineColor)
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
        let me = this
        let districts = me.g.append("g")
            .attr('class', 'districts')
            .selectAll("path")
            .data(data.features)
        let titles = me.g.append("g")
            .attr('class', 'titles')
            .selectAll("title")
            .data(data.features)
        let title_in = titles.enter()
        let title_out = titles.exit()
        title_out.remove()
        let district_in = districts.enter()
        let district_out = districts.exit()
        district_out.remove()

        let item = district_in.append("g")
            .attr('class', 'district_item')
            .on('mouseover', function(e, d){
                d3.selectAll(".district_path").style("stroke-width", 0.125)
                d3.select("#path_" + e.id).style("stroke-width", 1)
             })
            .on('click', function (e, d) {
                let coords = me.geoPath.centroid(d);
                $(".tooltip").addClass("hidden");
                let str = '';
                str += "<p>";
                str += "<strong>" + d.properties[me.options["sector_property"]] +" "+ d.properties[me.options["name_property"]] +"</strong>";
                str += "<br/><b>Code:</b> " + d.properties[me.options["code_property"]]
                str += "<br/><b>Population:</b> " + d.population;
                str += "<br/><b>Details:</b> <ul>" + d.population_details + "</ul>";
                str += "</p>";

                me.focusedDistrict = d;
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
                        v.properties.pos_visible = 500;
                    }
                })
                me.poi_legend_size = pos_visible;
                me.centerNode(coords[0], coords[1]);
                me.updateHotSpots();
                me.updatePoiLegend();
                $(".tooltip").removeClass("hidden");
                me.tooltip.transition()
                    .duration(100)
                    .style("opacity", 1.0);
                me.tooltip.html(str);
            });

        item.append("path")
            .attr("id", function (e) {
                return "path_" + e.id;
            })
            .attr("class", "district_path")
            .attr("d", me.geoPath)
            .style("fill", function (e) {
                return "url(#" + e.status + ")"
                if (e.properties.hasOwnProperty("STATEFP")){
                    let x = e.properties["STATEFP"]
                    if (x == "27"){// Minnesota
                        return "#c0c0c07f"
                    }else if (x == "38"){// North Dakota
                        return "#b3c7db"
                    }else if (x == "55"){// Wisconsin
                        return "#dbb3d8"
                    }else if (x == "19"){// Iowa
                        return "#dbb6b3"
                    }else if (x == "46"){// South Dakota
                        return "#d2dbb3"
                    }else{
                        return "#606060"
                    }
                }else{
                    return "url(#" + e.status + ")"
                }

            })
            .style("stroke", me.lineColor)
            .style("stroke-width", 0.25)
            .style("fill-opacity", 0.95)
            .style("stroke-opacity", 0.95)

        ;
        let scaled_size = 2*me.options.font_scale;
        let itemt = title_in.append("g")
        itemt.append('text')
            .attr('class', 'district_text')
            .attr('id', function (d) {
                return 'district_text_' + d.code;
            })
            .attr("x", (e,i) => me.geoPath.centroid(e)[0])
            .attr("y", (e,i) => me.geoPath.centroid(e)[1])
            .attr('dx', 0)
            .attr('dy', -2.5*scaled_size)
            .style("font-family", "Ruda")
            .style("text-anchor", "middle")
            .style("font-size", scaled_size+'pt')
            .style("font-weight", "bold")
            .style("stroke", me.strokeColor)
            .style("stroke-width", (scaled_size/2*0.15)+"pt")
            .style("fill", me.fillColor)
            .attr("opacity", 1.0)
            .text((e,i) =>  e.properties[me.options["sector_property"]])
            .append("tspan")
                .attr("x", (e,i) => me.geoPath.centroid(e)[0])
                .attr("y", (e,i) => me.geoPath.centroid(e)[1])
                .attr('dx', 0)
                .attr('dy', 0)
                .style("font-family", "Ruda")
                .style("text-anchor", "middle")
                .style("font-size", (2*scaled_size)+'pt')
                .style("font-weight", "bold")
                .style("stroke", me.strokeColor)
//                 .style("stroke-width", "0.15pt")
                .style("fill", me.fillColor)
                .text((e,i) => e.properties[me.options["name_property"]])
            .append("tspan")
                .attr("x", (e,i) => me.geoPath.centroid(e)[0])
                .attr("y", (e,i) => me.geoPath.centroid(e)[1])
                .attr('dx', 0)
                .attr('dy', 2*scaled_size)
                .style("font-family", "Ruda")
                .style("text-anchor", "middle")
                .style("font-size", scaled_size+'pt')
                .style("font-weight", "bold")
                .style("stroke", me.strokeColor)
//                 .style("stroke-width", "0.15pt")
                .style("fill", me.fillColor)
                .text((e,i) => e.properties[me.options["code_property"]]   )

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
                return me.hotspotvisible(d)
            })
        ;
        me.poi_in.append('path')
            .attr('class', 'poi_circle  zoom_immunity')
            .attr('id', function (d) {
                return "poi_label_" + d.properties.code;
            })
            .attr('d', function(d){
                let str = "M -2,0 L0,2 2,0 0,-2 -2,0 z";
                if (d.properties.type == "poi"){
                    str = "M -2,-2 L-2,2 2,2 2,-2 -2,-2 z";
                }else if (d.properties.type == "n/a"){
                    str = "M -2,-2 L-2,2 2,2 2,-2 -2,-2 z";
                }else if (d.properties.type == "ely"){
                    str = "M -2,-1 L0,3 2,-1 z";
                }else if (d.properties.type == "gac"){
                    //str = "M-3-6-6-3-3 0-6 3-3 6 0 3 3 6 6 3 3 0 6-3 3-6 0-3z"
                    str = "M0 0C-.0688-.0128-.188-.0764-.2648-.141-.3416-.2056-.5356-.3074-.696-.367c-.4142-.154-.513-.2306-.6208-.482-.1162-.271-.4106-.4964-.8034-.6152-.156-.0472-.322-.1178-.369-.157-.047-.0392-.1094-.0562-.139-.038-.0296.0184-.0538.0044-.0538-.0314 0-.0356-.1156-.1816-.2568-.3246l-.2566-.26.0018-.3778c.0008-.2078.0372-.647.0804-.976.0754-.575.0652-.97-.0316-1.2312-.0514-.1384.0742-.6246.1916-.742.0418-.0418.1608-.0758.2644-.0758.2762 0 .5652-.2128.952-.7008.3352-.423.3354-.423.5366-.3962.1528.0204.2636.087.4596.2764.3966.3828.4644.4158.8532.4158.3934 0 .6308.097.8718.3562.2532.2722.5762.453.8096.453.172 0 .2274-.026.3188-.1496.0608-.0824.1106-.1804.1106-.2182 0-.0376.0662-.1318.1472-.2094.1198-.1148.1754-.1348.3-.1074.084.0184.18.0662.2132.1062.0952.1148.1654.0846.2966-.1282.0672-.109.2782-.3378.469-.5086.1906-.1708.395-.4052.454-.5208.1004-.1968.1038-.24.0512-.666-.031-.2506-.0696-.6354-.086-.8554-.0356-.4776-.0876-.588-.4804-1.0214-.2982-.329-.3002-.3332-.2248-.4788.0446-.086.133-.1606.2142-.1798.2034-.0486.2196-.066.1616-.1742-.038-.071-.0856-.0902-.171-.0688-.0798.02-.2086-.0212-.3956-.1268-.2032-.1146-.3908-.1712-.7016-.2112-.746-.0962-1.1808-.192-1.2404-.2734-.038-.0518-.0432-.142-.016-.2662.0234-.1032.025-.205.004-.2262-.0212-.0212-.1282.0294-.2378.1124-.1902.144-.2226.1508-.7096.1522-.2808.0008-1.0546-.0464-1.7196-.1046-2.5132-.2204-5.3244.0026-7.0658.5604-.2618.0838-.5534.1532-.6478.154-.2124.0018-1.173.3216-1.1988.399-.0104.031.0914.1048.226.164.1346.0592.338.1712.452.2492.114.0778.2726.158.3526.1782.08.02.294.1322.4756.2494.1816.117.478.2866.6588.3768.4082.2036.9464.5328 1.551.9484.255.1752.5672.3646.6938.4206s.248.133.2698.1712c.0218.038.2198.191.44.3398.4868.3286.621.4892.5384.6434-.08.1494-.2542.1358-.5438-.0424-.134-.0824-.494-.2396-.8-.349-.306-.1096-.7726-.312-1.0368-.4498-.2642-.138-.5374-.268-.607-.2892s-.4678-.2058-.885-.4104c-.7056-.346-.8028-.3792-1.3908-.4762-.3478-.0572-.8256-.1604-1.0622-.229-.2364-.0686-.8096-.1816-1.2738-.251s-.9566-.1504-1.0942-.18c-.3426-.0734-.6572.0136-1.8804.5208-.5424.2248-1.1172.4502-1.2774.5004-.2828.089-.6358.247-1.6814.7524-.2782.1346-.7448.3586-1.0368.4982-1.332.6362-2.4668 1.3298-3.3284 2.0338-.2868.2344-.6282.499-.7586.588-.1306.0892-.3284.2328-.4396.3192-.1112.0864-.412.2866-.6684.4448-.5616.3468-1.143.8056-1.7708 1.3976-.3432.3236-.496.4358-.5776.4238-.061-.009-.12-.0436-.131-.0772-.011-.0334.1598-.2496.3794-.4804s.5268-.5936.6826-.8064c.1558-.2126.369-.4516.4738-.531s.3738-.3352.5978-.5686c.5952-.62 1.4726-1.3312 3.0528-2.4746.7702-.5572 1.6266-1.1956 1.903-1.4182s.743-.5344 1.0368-.6928c.6426-.346.9594-.5668.8584-.5984-.2786-.087-.6082-.1356-.8594-.1266-.1928.007-.324-.014-.3804-.0608-.1632-.1354-4.3234-.0308-4.5034.1134-.0318.0256-.0724.1238-.0902.2182-.0416.2218-.1726.2634-.9394.2972-.389.0172-.9248.0944-1.6184.2332-1.2318.2464-1.667.3604-2.146.562-.3004.1264-.3842.1898-.5244.3968-.1468.2166-.1942.2506-.3924.2802-.4134.062-.952.2786-1.5648.6294-.3338.1912-.7462.4172-.9164.5024-.534.2672-1.3772.864-1.7436 1.234-.3482.3516-.3558.356-.68.3896-.292.0302-.3444.0532-.477.2082-.1894.2214-.2604.4294-.271.7944l-.0086.2902-.2644.0322c-.1454.0178-.3388.077-.43.1316-.5996.3602-.9988.6134-1.154.732-.0986.0754-.4906.2846-.8712.465-.3806.1804-.7756.3848-.878.4544-.1716.1166-.197.1208-.326.0542-.077-.0398-.2708-.1212-.4306-.1812-.3498-.1308-.622-.3726-1.1114-.9862-.2622-.329-.4314-.4922-.5902-.569-.1224-.0592-.247-.1078-.277-.1078-.0816 0-.119-.1332-.1672-.5946-.0246-.2354-.0866-.5002-.142-.607-.091-.1752-.2618-.9684-.2618-1.2156 0-.2828.2368-.4994 1.6438-1.5034.306-.2184.6558-.4776.7776-.576.2974-.2406.556-.33.6664-.2304.0448.0406.0972.0738.1166.0738s.182-.1366.3614-.3034c.266-.2476.358-.3034.4982-.3034.0946 0 .2004.0342.235.0758.1188.1432.2348.087.3396-.1644.16-.384.3372-.5574.6638-.6496.1576-.0444.3664-.1324.4642-.1954.0978-.063.553-.2686 1.0116-.4572.4586-.1884 1.2526-.5444 1.7644-.791.651-.3136.9866-.4484 1.1164-.4484.1166 0 .3568-.0832.6452-.2238.2528-.123.604-.2636.7802-.3122.1764-.0486.6848-.2236 1.1298-.3886.9618-.3566 1.3952-.4708 2.0736-.5466.872-.0974.998-.091 1.071.0546.0404.0806.0456.1434.0146.1744-.0268.0268-.0486.0896-.0486.1396 0 .1226.1798.1188.4804-.0102.1298-.0556.2856-.1012.346-.1012.0606 0 .1384-.0456.1732-.1012.0838-.1342.3114-.1312.5828.0082.285.1464.81.1416.9968-.009.1426-.115.2314-.156.5564-.2578.1864-.0584.2826-.0602.531-.0104.4726.095 1.0822.1584 2.099.2188.5146.0306 1.095.075 1.2898.099.843.1038 2.7082.3674 3.0822.4356.2242.041.6202.0976.88.126.527.0574 1.0958.2218 1.6646.4812.2084.095.4224.1728.4756.1728.053 0 .2102.0576.349.128l.2526.128.2186-.1504c.2468-.1698.3744-.3404.4182-.5586.027-.135.0568-.1542.3148-.2034.286-.0546.4458-.1072 1.1954-.3938.2226-.085.7688-.2566 1.2138-.3812.925-.2588 1.7654-.5614 1.9406-.6988.066-.0516.3504-.1636.6322-.2486.2818-.0852.831-.2548 1.2204-.377.7344-.2306.8702-.2654 1.5998-.4086.462-.0906.8154-.0722.9844.0514.0802.0586.116.0578.2376-.005l.1432-.074.108.2558c.1048.2482.1142.2558.3156.2558.1142 0 .3202-.0534.4578-.1186.315-.1494.7722-.286.9568-.286.0778 0 .2122.0432.299.096.0932.0568.5916.181 1.2198.3038 1.4656.2868 1.8336.3804 1.9626.499.1074.0988 2.3968 1.023 2.5344 1.023.0374 0 .0982.0366.1354.0812.037.0446.1848.1332.3284.1966.1436.0636.2768.1408.2958.1716.02.031.0714.0562.1162.0562s.2312.143.4142.318c.183.1748.3938.3646.4684.4218.0982.0752.14.1582.1518.3016.016.1928.0218.1984.2364.223.2184.025.2224.0292.4714.4804.18.3262.2558.5228.2676.694.012.1638.0834.3612.2302.6284.1762.3212.2174.448.2338.722.01.1828.0536.526.0948.7624.1068.6126.0964.803-.1006 1.8654-.219 1.1806-.3732 1.7256-.6526 2.3072-.5188 1.08-1.1218 1.5132-3.0658 2.2024-.4868.1726-1.1014.422-1.3656.5544C2.5296-.116 1.7754.042.7146.0296.3898.026.0678.0122-.001-.0006Z"
                }else if (d.properties.type == "gdc"){
                    str = "M -2,-2 -1,2 1,2 2,-2 0,-1 z";
                }
                return str;
            })
            .style("stroke", "#606060")
            .style("stroke-width", "0.30pt")
            .style("fill", function (d) {
                //return "#244f70"
                return d.properties.color;
            })
            .attr("transform", "scale(1)")
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
            .attr('class', 'poi_text_mark  zoom_immunity')
            .attr('id', function (d) {
                return "poi_text_mark_" + d.properties.code;
            })
            .attr('dx', 0)
            .attr('dy', 8)
            .style("font-family", "Ruda")
            .style("text-anchor", "middle")
            .style("font-size", "3pt")
            .style("stroke", "#7070703f")
            .style("stroke-width", "0.45pt")
            .style("fill", "#000")
            .text(function (d) {
                return d.properties.name;
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
                return 1 * me.width / 80;
            })
            .attr("y", function (e, i) {
                return 59 * me.height / 60 ;
            })
            // .attr("dy", -72)

            .style("font-family", "Ruda")
            .style("text-anchor", "start")
            .style("font-size", "20pt")
            .style("stroke", "#303030")
            .style("stroke-width", "0.25")
            .style("fill", "#101010")
            .text(function (e, i) {
                let moretxt = " [Storyteller Map]";
                if (me.player_safe){
                    moretxt = " [Players Map]";
                }
                return "World of Darkness - " + me.cityName + moretxt
            })
            .on("click", (e) => {
                me.createPDF()
            })
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
        let me = this
        let o = d.is_public ? 1 : 0
        //if (d.properties.is_public) o = 1
        return o
    }

    zoomActivate() {
        let me = this;
        me.zoom = d3.zoom()
            //.scaleExtent([1, 128])
            .scaleExtent([1, 8])
            .on('zoom', function (event) {
                me.g.attr('transform', event.transform)
                if (event.transform.k > 3){
                    me.g.selectAll(".zoom_immunity")
                        .attr('transform', "scale(" + (4 / event.transform.k) + ")")
                }

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
                let key = me.cityCode + "_"+e.properties[me.options["code_property"]];
                if (me.wawwod_data[key]) {
                    let entry = me.wawwod_data[key];
                    e.population = entry.population;
                    e.status = entry.status;
//                     console.log(key,e.status)
                    e.code = key
                    e.name = e.properties[me.options["sector_property"]];
                    e.sector_name = entry.sector_name;
                    e.district_name = entry.district_name;
                    e.population_details = entry.population_details;
                    e.category = "DISTRICT"
//                     if (e.properties['Stadtteil']) {
//                         e.name = e.properties[me.options["sector_property"]] + " (" + e.properties['Stadtteil'] + ")";
//                         delete e.properties['Stadtteil'];
//                     }
                }
            });
            let poi_idx = 0;
            _.each(me.wawwod_poi, function (poi) {
                poi['properties']['idx'] = poi_idx
                poi["is_public"] = poi['properties']['is_public']
                poi_idx += 1;
                console.log(poi)
            });
            me.projection = d3.geoMercator()
                .rotate([120, 0])
                //.center([0, 20])
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