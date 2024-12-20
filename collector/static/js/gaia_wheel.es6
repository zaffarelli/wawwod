class GaiaWheel {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.data = data['lists'];
        me.stats = data['stats'];
        me.init();
    }

    init() {
        let me = this;
        me.global_rotation = 0;
        me.sector_size = 30;
        me.sector_data = []
        me.starts = []
        let total = 0
        _.forEach(me.data, function (v, k) {
            if (v['value'] > 0) { // Only deal with sectors with at least 1 creature
                me.sector_data.push(v);
                me.starts.push(v['start']);
                total += v.value
            }
        });
        _.map(me.sector_data, function(v,k) {
            v.total = total
        })
        //console.log(me.sector_data)
        me.boxWidth = 7;
        me.boxHeight = 4;
        let re = new RegExp("\d+");
        me.width = parseInt($(me.parent).css("width"));
        me.height = me.width;
        me.step_x = me.width / 100;
        me.step_y = me.height / 100;
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
        let pwidth = d3.select(me.parent).style("width");
        let pheight = d3.select(me.parent).style("height");
        me.svg = d3.select(me.parent).append("svg")
            .attr("viewBox", (-me.width / 2) + "  " + (-me.height / 2) + " " + me.width + " " + me.height)
            .attr("class", "gaia_wheel")
            .attr("width", pwidth)
            .attr("height", pheight)
        //.attr("transform","translate(" + (me.width / 2) + "," + (me.height / 2) + ")")
        ;

        me.static_back = me.svg.append("g");

        me.back = me.svg.append("g")
            .attr("transform", "rotate(" + (me.global_rotation) + ")")
        ;
        //me.back = me.g
        me.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip hidden")
        ;

        me.draw_sectors();
        //me.draw_radials();
        me.draw_circles();


        me.cross = me.back.append('path')
            .attr("d", "M 0 10 v -20 M 10 0 h -20 Z")
            .style("fill", 'transparent')
            .style("stroke", me.scales_stroke)
            .style("stroke-width", '5pt')
            .on("click", function (e) {
                let x = 10;
                // console.log("Cross click")
                if (e.ctrlKey) {
                    me.global_rotation += x;
                } else {
                    me.global_rotation -= x;
                }
                me.perform();
            })
        ;
    }


    display_poles(angle, arr, ty, total, span, grandtotal) {
        let me = this;
        let pos = 0
        let coords = []
        let poles = {}
        _.forEach(arr, function (d, idx) {
            if (d.display_pole != '') {
                if (poles[d.display_pole]) { // Cumulate on actual pole
                    d.order = d.index;
                    coords = me.polar_to_orthographic(d.index, d.display_gauge, span, total, angle, grandtotal);

                    // console.log(coords)
                    poles[d.display_pole]['count'] += 1;
                    poles[d.display_pole]['list'].push({
                        'name': d.name,
                        'rid': d.rid,
                        'creature': d.creature,
                        'sire': d.sire,
                        'order': d.order,
                        'index': d.index,
                        'x': coords[0],
                        'y': coords[1],
                        'angular': coords[2],
                        'radial': coords[3],
                        'display_gauge': coords[4]

                    });

                } else { // New pole
                    d.order = d.index;
                    pos = 0
                    coords = me.polar_to_orthographic(d.index, d.display_gauge, span, total, angle, grandtotal);

                    poles[d.display_pole] = {
                        'count': 1,
                        'list': [{
                            'name': d.name,
                            'rid': d.rid,
                            'creature': d.creature,
                            'sire': d.sire,
                            'order': d.order,
                            'index': d.index,
                            'x': coords[0],
                            'y': coords[1],
                            'angular': coords[2],
                            'radial': coords[3],
                            'display_gauge': coords[4]

                        }]
                    };
                }

            }
        });

        let all_poles = []
        let links = [];
        let cnt = 0;
        for (let pole in poles) {
            let cx = 0;
            let cy = 0;
            cnt = poles[pole]['list'].length;
            poles[pole]['list'].forEach(function (v, k) {
                if (v['creature'] != 'ghoul') {
                    cx += v.x + Math.cos((v.angular) * Math.PI / 180) * 50;
                    cy += v.y + Math.sin((v.angular) * Math.PI / 180) * 50;
                }else{
                    cnt -= 1
                }
            });

            poles[pole]['center'] = {'x': Math.round(cx / cnt), 'y': Math.round(cy / cnt)};
            all_poles.push({'name': pole, 'x': Math.round(cx / cnt), 'y': Math.round(cy / cnt)})

        }
        for (let pole in poles) {
            let center = poles[pole]['center'];
            poles[pole]['list'].forEach(function (v, k) {
                if (v['creature'] != 'ghoul') {
                    //console.log(v['name']);
                    links.push({'x1': v.x, 'y1': v.y, 'x2': center.x, 'y2': center.y, 'category': 0})
                    if (v['creature'] == 'kindred') {
                        poles[pole]['list'].forEach(function (w, l) {
                            //console.log(w['sire']);
                            if (w['creature'] == 'ghoul') {
                                if (w['sire'] == v['rid']){
                                    links.push({'x1': v.x, 'y1': v.y, 'x2': w.x, 'y2': w.y, 'category': 1});
                                }
                            }
                        })
                    }
                }
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
            .style('stroke', function(d){
                if (d.category == 0) {
                    return '#AAA';
                }
                return '#BA8';
            })
            .style('stroke-width', function(d){
                if (d.category == 0) {
                    return '3pt';
                }
                return '1pt';
            })
            .style('stroke-dasharray', function(d){
                if (d.category == 0) {
                    return '3 3';
                }
                return '5 2';
            })
            .style('fill', 'transparent')
            .attr('opacity', 0.5)
        ;

    }

    polar_to_orthographic(idx, pow, span, total, angle, grandtotal) {
        let me = this;
        let angular = (((idx + angle +0.5 ) / total) * (total / grandtotal) * 360) - 90;
        //let angular = (((idx + angle +0.5) / total) * (total / grandtotal) * 360) - 90;
        let radial = me.radiused(pow);
        let coords = []
        coords[0] = Math.cos((angular) * Math.PI / 180) * radial;
        coords[1] = Math.sin((angular) * Math.PI / 180) * radial;
        coords[2] = angular
        coords[3] = radial
        coords[4] = pow
        return coords
    } //

    display_branch(angle, arr, ty, total, span, grandtotal) {
        let me = this;
        let coords = []

        let nodes = me.back.selectAll("." + ty)
            .data(arr)
        ;
        let node_cross = nodes.enter()
            .append("g")
            .attr("transform", function (d) {
                let trans = "";
                coords = me.polar_to_orthographic(d.index, d.display_gauge, span, total, angle, grandtotal);
                trans += "translate(" + coords[0] + "," + coords[1] + ") ";
                return trans;
            })
            .attr("class", function(d){
                return "creature_view " + ty ;
            })
            .attr("id", function (d) {
                return d.id;
            })
            .attr("character", function (d) {
                return d.name;
            })
            .attr("creature", function (d) {
                return d.creature;
            })
            .on("mouseover", function (e, d) {
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
                str += " " + d.creature + "";
                if (d.position) {
                    str += " " + d.position + "";
                }

                if (d.creature == 'garou') {
                    str += "<br/><i>Rank " + d.rank;
                    str += " " + breeds[d.breed];
                    str += " " + auspices[d.auspice];
                    str += " " + d.family + "</i>";
                } else if (d.creature == 'ghoul') {
                    str += "<br/>" + d.group;
                } else if (d.creature == 'kindred') {
                    str += "<br/>" + d.generation + "th generation " + d.family + " ";
                    let arrg = d.ghouls.split(',')
                    if (d.ghouls != '') {
                        str += "<br/><u>Ghouls Retainers:</u>";
                        str += "<ol>";
                        _.forEach(arrg, function (v) {
                            str += "<li>" + v + "</li>";
                        })
                        str += "</ol>";
                    }

                }
                $(".tooltip").removeClass("hidden");
                me.tooltip.transition()
                    .duration(100)
                    .style("opacity", 1.0);
                me.tooltip.html(str);
            })
            .on("mouseout", function (e, d) {
                me.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                $(".tooltip").removeClass("hidden");
            })
            .on("click", function (e, d) {
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
                let x = (d.condition.startsWith("DEAD") ? "#A22" : (d.condition.startsWith("MISSING") ? "#FC4" : "transparent"))
                return x;
            })
            .style("stroke-width", function (d) {
                let x = (d.condition.startsWith("DEAD") ? "3pt" : (d.condition.startsWith("MISSING") ? "3pt" : "1pt"))
                return x;
            })
        ;
        node_cross.append('text')
            .attr("transform", "rotate(" + (-me.global_rotation) + ")")
            .attr("dy", function(d){
                if (d.index % 2 == 0) {
                    return '-12px';
                }
                return "20px";
            })
            .style("text-anchor", 'middle')
            .style("font-family", 'Ruda')
            .style("font-size", '12pt')
            .style("fill", '#CCC')
            .style("stroke", '#111')
            .style("stroke-width", '0.125pt')
            .text(function (d) {
                let name = d.name;
                name ="";
                let words = d.name.split(' ');
                words.forEach(function (word, k) {
                    name += word[0];
                })
                // name += " "+d.index
                let x = (d.condition.startsWith("DEAD") ? "(D)" : (d.condition.startsWith("MISSING") ? "(M)" : ""))

                return d.name
                //return name + x;//+" ("+d.order+" / "+(Math.round(d.angular*100)/100)+")";
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

    draw_circles() {
        let me = this;
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
    }

    draw_sectors() {
        let me = this;
        //console.log(me.sector_data)
        let pie = d3.pie()
            .sort(null)
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
            .data(pie(me.sector_data));
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
            .style("stroke", "#888")
            .attr("fill-opacity", "0.05")
            .attr("stroke-opacity", "0.5")
        ;
        sector_in.append("text")
            .attr('transform', function (d) {
                return "translate(" + sector_arc.centroid(d) + ")";
            })
            .attr('text-anchor', "middle")
            .attr('font-size', "20pt")
            .attr('font-family', function (d) {
                return d.data.font;
            })
            .style("fill", "#CCC")
            .style("stroke", "#EEE")
            .text(function (d) {
                //console.log(d.data)
                return d.data.name.charAt(0).toUpperCase() + d.data.name.slice(1)+" ["+d.data.value+"/"+d.data.total+"]";
                //return d.data.name+":"+d.data.value+"/"+d.data.total;
            })
            .attr("opacity", function (d) {
                if (d.value == 0) {
                    return "0.0"
                }
                return "0.3"
            })
        ;
        let sector_out = sectors.exit();
        sector_out.remove();
    }


    update() {
        let me = this;
        _.forEach(me.sector_data, function (v, k) {
            //console.log(v);
            me.display_poles(v.start, v.collection, v.name, v.collection.length, v.value, v.total+1);
            me.display_branch(v.start, v.collection, v.name, v.collection.length, v.value, v.total+1);
        })
        // me.draw_stats(-me.step_x*90,me.step_y*2,'status',"#A08020");
        // me.draw_stats(-me.step_x*90,me.step_y*25,'balanced',"#A02020");
        // me.draw_stats(-me.step_x*90,me.step_y*35,'creatures',"#208020");
        // me.draw_stats(-me.step_x*90,me.step_y*45,'clans',"#808020");
        // me.draw_stats(-me.step_x*90,me.step_y*60,'disciplines',"#802080");
    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.125, 8])
            .on('zoom', function (event) {
                me.back.attr('transform', event.transform);
            });
        me.back.call(zoom);
    }


    draw_stats(ox,oy,src='status', color="#202020") {
        let me = this;
        let data_set = []
        let local_data = me.stats[src];
        let idx = 0;
        let delta_x = 20, delta_y=30;
        _.forEach(local_data,function (d){
            let x = ox ;
            let y = oy - (me.height-40) / 2 + ((idx)*(delta_x+10));
            let g = "group"+idx;
            let v = d.value;
            let l = d.label;
            data_set.push({"x":x,"y":y,"group":g,"value":v, "label":l})
            idx += 1;
        });
        //console.log(data_set);
        let bar_grp = me.static_back.append("g");
        let bars = bar_grp.append("g")
            .attr("class", 'stats')
            .selectAll(".stats")
            .data(data_set)
            ;
        let bars_enter = bars.enter();
        bars_enter.append('rect')
            .attr("x",function(d){
               return d.x+delta_x;
            })
            .attr("y",function(d){
               return   d.y-(delta_y/3);
            })
            .attr("width",function(d){
               return delta_x*(d.value/3+1);
            })
            .attr("height",function(d){
               return 2*delta_y / 3;
            })
            .style("fill", color)
            .style("stroke", "#7f7f7f")
        ;
        bars_enter.append('text')
            .attr("x",function(d){
                return d.x ;
            })
            .attr("y",function(d){
                return   d.y+(delta_y/2);
            })
            .attr("dy",-8)
            .text(function(d){
                return d.label +" ("+ d.value+")";
            })
            .style("text-anchor", 'end')
            .style("font-family", 'Ruda')
            .style("font-size", '16pt')
            .style("fill", '#CCC')
            .style("stroke", '#888')
            .style("stroke-width", '0.125pt')        ;
        bar_grp.append('text')
            .attr("x",ox)
            .attr("y",oy- (me.height) / 2)
            .attr("dy",-10)
            .text(src.charAt(0).toUpperCase()+src.slice(1))
            .style("text-anchor", 'left')
            .style("font-family", 'Ruda')
            .style("font-size", '24pt')
            .style("fill", '#CCC')
            .style("stroke", '#111')
            .style("stroke-width", '0.125pt')
        ;
        let bar_out = bars.exit();
        bar_out.remove();
    }


    perform() {
        let me = this;
        me.watermark()
        me.update();
        me.zoomActivate()
    }




}
