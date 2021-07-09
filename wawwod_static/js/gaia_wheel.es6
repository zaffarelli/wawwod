/*
    WaWWoD
*/

/* The Gaia wheel display class */
class GaiaWheel {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.data = data['lists'];
        me.init();
    }

    init() {
        let me = this;
        me.global_rotation = 0;
        me.sector_size = 15;
        me.sector_data = []
        me.starts = []
        _.forEach(me.data, function (v, k) {
            me.sector_data.push(v);
            me.starts.push(v['start']*me.sector_size);
        });
        me.weaver = me.data[0]['collection'];
        me.wyrm = me.data[1]['collection'];
        me.wyld = me.data[2]['collection'];

        me.boxWidth = 7;
        me.boxHeight = 4;
        let re = new RegExp("\d+");
        me.width = parseInt($(me.parent).css("width"));
        me.height = me.width;
        me.radius = 800;
        me.max_gauge = 25;
        me.scales_stroke = "#999";
        me.scales_stroke_special = "#666";
        me.base_dash = "2 10";
        me.radiused = d3.scaleLinear().domain([0, me.max_gauge]).range([me.radius, 200]);
        me.unradiused = d3.scaleLinear().domain([me.radius, 200]).range([0, me.max_gauge]);
    }

    watermark() {
        let me = this;
        d3.select(me.parent).selectAll("svg").remove();
        me.svg = d3.select(me.parent).append("svg")
            //.attr("viewBox", "0 0 " + me.width + " " + me.height)
            .attr("width", me.width)
            .attr("height", me.height)
        ;

        me.back = me.svg
            .append("g")
            .attr("transform", "translate(" + me.width / 2 + "," + me.height / 2 + ") rotate(" + (me.global_rotation) + ")")
        ;

        me.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0.5);
        me.draw_sectors();
        let radial_lines = me.svg.append("g")
            .attr("class", "radiuses")
            .selectAll("g")
            .data(d3.range(0, 360, 5))
        ;
        radial_lines.enter()
            .append("g")
            .attr("transform", function (d) {
                return "translate(" + (me.width / 2) + "," + (me.height / 2) + ") rotate(" + (d-90) + ")";
            })
            .append("line")
            .style("stroke", function (d) {
                let res = "transparent";//me.scales_stroke;
                console.log(me.starts)
                if (me.starts.includes(d)) {
                    res = me.scales_stroke_special;
                }
                if (d ==0){
                    res = "#a99";
                }
                return res;
            })
            .style("stroke-dasharray", function (d) {
                let res = me.base_dash;
                if (me.starts.includes(d)) {
                    res = "20 5";
                }
                return res;
            })
            .style("stroke-width", function (d) {
                let res = "0.25pt";
                if (me.starts.includes(d)) {
                    res = "1pt";
                }
                return res;
            })
            .attr("x1", me.radiused(0))
            .attr("x2", me.radiused(me.max_gauge))
        ;
        radial_lines.exit()
            .remove()
        ;

        me.inner_circles = me.back.append("g")
            .attr("class", "angulars")
            .selectAll("g")
            .data(d3.range(0, me.max_gauge + 1, 1));
        me.inner_circles.enter()
            .append('circle')
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", function (d) {
                return me.radiused(d)
            })
            .style("fill", 'transparent')
            .style("stroke", function (d) {
                let res = me.scales_stroke;
                if (d % 5 == 0) {
                    res = me.scales_stroke_special;
                }
                return res;
            })
            .style("stroke-dasharray", function (d) {
                let res = me.base_dash;
                if (d % 5 == 0) {
                    res = '2 2';
                }
                return res;
            })
            .style("stroke-width", function (d) {
                let res = '0.5pt';
                if (d % 5 == 0) {
                    res = '1pt';
                }
                return res;
            })
        ;
        me.inner_circles.exit()
            .remove()
        ;

        me.cross = me.back.append('path')
            .attr("d", "M 0 10 v -20 M 10 0 h -20 Z")
            .style("fill", 'transparent')
            .style("stroke", me.scales_stroke)
            .style("stroke-width", '5pt')
            .on("click", function (e) {
                let x = 10;
                if (d3.event.ctrlKey) {
                    me.global_rotation += x;
                } else {
                    me.global_rotation -= x;
                }
                me.perform();
            })
        ;
    }


    display_branch(angle, arr, ty, total, span) {
        let me = this;
        let poles = {}
        _.forEach(arr, function (d, idx) {
            d.order = idx;
            d.angular = (((d.order + 1) * span / (total + 1)) + angle)  * me.sector_size -90 ;
            d.radial = me.radiused(d.display_gauge);
            d.x = Math.cos((d.angular) * Math.PI / 180) * d.radial;
            d.y = Math.sin((d.angular) * Math.PI / 180) * d.radial;
            if (d.display_pole != '') {
                if (poles[d.display_pole]) {
                    poles[d.display_pole]['count'] += 1;
                    poles[d.display_pole]['list'].push({
                        'name': d.name,
                        'x': d.x,
                        'y': d.y,
                        'angular': d.angular,
                        'radial': d.radial,
                        'display_gauge': d.display_gauge
                    });
                } else {
                    poles[d.display_pole] = {
                        'count': 1,
                        'list': [{
                            'name': d.name,
                            'x': d.x,
                            'y': d.y,
                            'angular': d.angular,
                            'radial': d.radial,
                            'display_gauge': d.display_gauge
                        }]
                    };
                }
            }
        });
        //console.log(poles);
        let all_poles = []
        let links = [];
        for (let pole in poles) {
            let cx = 0;
            let cy = 0;
            let cnt = poles[pole]['list'].length;
            poles[pole]['list'].forEach(function (v, k) {
                cx += v.x + Math.cos((v.angular) * Math.PI / 180) * 50;
                cy += v.y + Math.sin((v.angular) * Math.PI / 180) * 50;
            });

            poles[pole]['center'] = {'x': Math.round(cx / cnt), 'y': Math.round(cy / cnt)};
            all_poles.push({'name': pole, 'x': Math.round(cx / cnt), 'y': Math.round(cy / cnt)})
        }
        for (let pole in poles) {
            let first = poles[pole]['list'][0];
            let previous = first;
            let center = poles[pole]['center'];
            poles[pole]['list'].forEach(function (v, k) {
                links.push({'x1': v.x, 'y1': v.y, 'x2': center.x, 'y2': center.y})
            });
        }
        let pole_centers = me.back.selectAll(".pole_center_" + ty)
            .data(all_poles)
        ;
        let pole_center = pole_centers.enter()
            .append("rect")
            .attr("class", 'pole_center_' + ty)
            .attr("x", function (d) {
                return d.x - 5;
            })
            .attr("y", function (d) {
                return d.y - 5;
            })
            .attr("width", 10)
            .attr("height", 10)
            .style('stroke', '#111')
            .style('stroke-width', '1pt')
            .style('fill', '#FC8')
            .attr('opacity', 0.75)

        ;


        let links_lines = me.back.selectAll(".link_line_" + ty)
            .data(links)
        ;
        let link = links_lines.enter()
            .append("line")
            .attr("class", "link_line_" + ty)
            .attr("x1", function (d) {
                return d.x1;
            })
            .attr("y1", function (d) {
                return d.y1;
            })
            .attr("x2", function (d) {
                return d.x2;
            })
            .attr("y2", function (d) {
                return d.y2;
            })
            .style('stroke', '#AAA')
            .style('stroke-width', '1pt')
            .style('stroke-dasharray', '7 3')
            .style('fill', 'transparent')
            .attr('opacity', 0.5)
        ;


        let nodes = me.back.selectAll("." + ty)
            .data(arr)
        ;
        let node_cross = nodes.enter()
            .append("g")
            .attr("transform", function (d) {
                let trans = "";
                trans += "translate(" + d.x + "," + d.y + ") ";
                return trans;
            })
            .attr("class", "creature_view " + ty)
            .attr("id", function (e, d) {
                return d.id;
            })
            .attr("character", function (d) {
                return d.name;
            })
            .attr("creature", function (d) {
                return d.creature;
            })
            .on("mouseover", function (e,d) {
                let breeds = ['Homid', 'Metis', 'Lupus'];
                let auspices = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'];
                let str = ''
                str += "<strong>" + d.name + "</strong>";
                if (d.condition != 'OK') {
                    str += "<br/><i>" + d.condition + "</i>";
                }
                if (d.faction) {
                    str += "<br/>" + d.faction + "";
                }
                str += "<br/>" + d.creature + "";
                if (d.position) {
                    str += "<br/>" + d.position + "";
                }

                if (d.creature == 'garou') {
                    str += "<br/><i>Rank " + d.rank;
                    str += " " + breeds[d.breed];
                    str += " " + auspices[d.auspice];
                    str += " " + d.family + "</i>";
                } else if (d.creature == 'kindred') {
                    str += "<br/>" + d.generation + "th generation " + d.family + " ";
                    let arr = d.ghouls.split(',')
                    if (d.ghouls != '') {
                        str += "<br/><u>Ghouls Retainers:</u>";
                        str += "<ol>";
                        _.forEach(arr, function (v) {
                            str += "<li>" + v + "</li>";
                        })
                        str += "</ol>";
                    }

                }
                //str += "<br/> (" + d.display_pole+ ", " + d.display_gauge + ")";

                me.tooltip.transition()
                    .duration(200)
                    .style("opacity", 1.0);
                me.tooltip.html(str)
                    .style("left", Math.round(me.width / 2 - 75) + "px")
                    .style("top", Math.round(me.height / 2 - 30) + "px");
            })
            .on("mouseout", function (e,d) {
                me.tooltip.transition()
                    .duration(1000)
                    .style("opacity", 0);
            })
            .on("click", function (e,d) {
                if (e.ctrlKey) {
                    $.ajax({
                        url: 'ajax/view/creature/' + d.rid + '/',
                        success: function (answer) {
                            $('.details').html(answer)
                            $('li').removeClass('selected');
                            $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.error('View error...' + answer);
                        }
                    });
                }

            })
        ;


        node_cross.append('path')
            .attr("transform", "rotate(" + (-me.global_rotation) + ")")
            .attr("d", function (d) {
                let s = 12;
                return "M 0 " + s + " v -" + (s * 2) + " M " + s + " 0 h -" + (s * 2) + " "
            })
            .style("fill", 'transparent')
            .style("stroke", function (d) {
                let x = (d.condition == "DEAD" ? "#A22" : (d.condition == "MISSING" ? "#FC4" : "#111"))
                return x;
            })
            .style("stroke-width", function (d) {
                let x = (d.condition == "DEAD" ? "1pt" : (d.condition == "MISSING" ? "1pt" : "1pt"))
                return x;
            })
        ;
        node_cross.append('text')
            .attr("transform", "rotate(" + (-me.global_rotation) + ")")
            .attr("dy", '-12px')
            .style("text-anchor", 'middle')
            .style("font-family", 'Ruda')
            .style("font-size", '8pt')
            .style("fill", '#CCC')
            .style("stroke", '#888')
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                let name = '';
                let words = d.name.split(' ');
                words.forEach(function (word, k) {
                    name += word[0];
                })
                let x = (d.condition == "DEAD" ? "(D)" : (d.condition == "MISSING" ? "(M)" : ""))
                return name + x;//+" ("+d.order+" / "+(Math.round(d.angular*100)/100)+")";
            })
        ;
        node_cross.append("circle")
            .attr('class', function (d) {
                let res = 'node_circle ' + ty + ' ' + d.creature;
                if (d.status == 'OK') {
                    res += ' balanced';
                }
                return res;
            })
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', function (d) {
                let res = me.boxWidth;
                return res;
            })

            .style('opacity', '0.8')
        ;
        let node_off = nodes.exit()
            .remove();
    }

    draw_sectors() {
        let me = this;
        // me.position = me.radius * 0.65;
        let sects = me.sector_data; //[{ 'name':'Wyrm','value':3, 'color':"#A22"}, { 'name':'Wyld','value':6, 'color':"#2A2"}, {'name':'Weaver', 'value':3, "color": "#22A"}];
        let color = d3.scaleOrdinal().range(d3.schemeSet2);

        let pie = d3.pie()
            .sort(null)
            .sortValues(null)
            // .startAngle(90*Math.PI/180)
            // .endAngle(-270*Math.PI/180)
            .value(function (d) {
                return d.value;
            })
        ;
        let sector_arc = d3.arc()
            .innerRadius(me.radiused(25))
            .outerRadius(me.radiused(0))
        ;
        let sectors = me.back.append("g")
            .attr("class", 'sectors')
            .selectAll(".sectors")
            .data(pie(sects));
        let sector_in = sectors.enter()
            .append("g")
            .attr("class", "sector")
        ;
        sector_in.append('path')
            .attr("class", "category_arc")
            .attr('d', sector_arc)
            .style("fill", function (d) {
                return d.data.color;
            })
            .attr("opacity", "0.05")
        ;
        sector_in.append("text")
            .attr('transform', function (d) {
                return "translate(" + sector_arc.centroid(d) + ")";
            })
            .attr('text-anchor', "middle")
            .attr('font-size', "30pt")
            .attr('font-family',function(d){ return  d.data.font; })
            .style("fill", "#CCC")
            .style("stroke", "#EEE")
            .text(function (d) {
                return d.data.name.charAt(0).toUpperCase() + d.data.name.slice(1);
            })
            .attr("opacity", "0.3")
        ;
        let sector_out = sectors.exit();
        sector_out.remove();
    }


    update() {
        let me = this;
        // me.display_branch(0, me.weaver, "weaver", me.weaver.length, me.sector_size *4);
        // me.display_branch(4, me.wyrm, "wyrm", me.wyrm.length, me.sector_size *5);
        // me.display_branch(9, me.wyld, "wyld", me.wyld.length, me.sector_size * 3);
        _.forEach(me.sector_data, function (v, k) {
            me.display_branch(v.start, v.collection, v.name, v.collection.length, v.value);
        })
    }

    // zoomActivate() {
    //     let me = this;
    //     let zoom = d3.zoom()
    //         .scaleExtent([0.25, 4]) // I don't want a zoom, i want panning :)
    //         .on('zoom', function (event) {
    //             me.g.selectAll('path')
    //                 .attr('transform', event.transform);
    //             me.g.selectAll('rect')
    //                 .attr('transform', event.transform);
    //             me.g.selectAll('text')
    //                 .attr('transform', event.transform);
    //             me.g.selectAll('circle')
    //                 .attr('transform', event.transform);
    //
    //             me.g.selectAll('image')
    //                 .attr('transform', event.transform);
    //         });
    //     me.svg.call(zoom);
    // }


    perform() {
        let me = this;
        me.watermark()
        me.update();
    }
}
