let line_jump_code = "NR";

/* The kindred tree display class */
class KindredLineage {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.config = data
        me.boxWidth = 100;
        me.boxHeight = 80;
        me.duration = 500;
    }

    saveSVG() {
        let me = this;
        me.svg.selectAll('.do_not_print').attr('opacity', 0);
        let base_svg = d3.select("#d3area svg").html();
        let flist = '<style>';
        for (let f of me.config['fontset']) {
            flist += '@import url("https://fonts.googleapis.com/css2?family=' + f + '");';
        }
        flist += '</style>';
        let lpage = "";
        let exportable_svg = '<?xml version="1.0" encoding="ISO-8859-1" ?> \
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \
<svg class="crossover_sheet" \
xmlns="http://www.w3.org/2000/svg" version="1.1" \
xmlns:xlink="http://www.w3.org/1999/xlink"> \
' + flist + base_svg + '</svg>';
        let svg_name = "kindred_lineage.svg"
        let rid = "kindred_lineage";
        let sheet_data = {
            'svg_name': svg_name,
            'rid': rid,
            'svg': exportable_svg
        }
        me.svg.selectAll('.do_not_print').attr('opacity', 1);
        $.ajax({
            url: 'ajax/character/save2svg/' +rid + '/',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: sheet_data,
            dataType: 'json',
            success: function (answer) {
                console.log("Saved to svg [" + rid + "]["+svg_name+"]...")
            },
            error: function (answer) {
                console.error('Error saving svg...');
                console.error(answer);
            }
        });
    }

    wrap(text, width) {
        let me = this;
        text.each(function () {
            let text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.0, // ems
                x = text.attr("x"),
                dx = text.attr("dx"),
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dx", dx).attr("dy", dy + "em");
            while (word = words.pop()) {
                if (word == line_jump_code) {
                    tspan.text(line.join(" "));
                    line = [];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("dx", dx)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text('');

                } else {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("dx", dx)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
                    }
                }
            }
        });
    }

    insertNode(x) {
        let me = this;
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "node ";
                let x = d.data.condition;
                console.log(d.data.name);
                if (x != undefined) {
                    if (x.startsWith("MISSING") == true) {
                        str += "missing ";
                    }
                    if (x.startsWith("DEAD") == true) {
                        str += "dead ";
                    }
                }
                return str;
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        r.append("rect")
            .attr('class', 'band')
            .attr('x', -me.boxWidth * 1)
            .attr('y', -me.boxHeight * 1)
            .attr('width', me.boxWidth * 2)
            .attr('height', me.boxHeight * 1)
        ;
        r.append("rect")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth * 1)
            .attr('y', -me.boxHeight * 0)
            .attr('width', me.boxWidth * 2)
            .attr('height', me.boxHeight * 3)
        ;
        let ghouls = undefined;
        r.append("rect")
            .attr('class', 'frame')
            .attr('x', -me.boxWidth * 1)
            .attr('y', -me.boxHeight * 1)
            .attr('width', me.boxWidth * 2)
            .attr('height', me.boxHeight * 4)
            .attr('rx', me.boxWidth * 0.05)
            .attr('ry', me.boxWidth * 0.05)
            .on("click", function (e, d) {
                //console.log("Frame click " + d.id + " [" + d.data.name + "]!");
                //me.uncollapse(d)
                me.update(d);
                ghouls = d.data.ghouls.split(',')
                console.log(ghouls)
            });
        ;

        // let ghoulish = r.append('g')
        //     .attr('class','ghoulish_set')
        //     .attr('id',(d) => 'ghoulish_'+d.id)
        //     .data(d.ghoul_list)
        //     ;
        // let ghoulish_in = ghoulish.selectAll('ghoulish').enter();
        // let gg = ghoulish_in.append("g")
        //         .attr("class","ghoulish")
        // gg.append("rect")
        //         .attr("x",me.boxWidth*2)
        //         .attr("y",(g,i) => me.boxHeight+me.boxHeight*0.5*i)
        //         .attr("width",me.boxWidth*1)
        //         .attr("height",(g,i) => me.boxHeight+me.boxHeight*0.5*i)
        //         .style("stroke","#fc4")
        //         .style("fill","#111")
        // gg.append("text")
        //     .style("stroke","#fc4")
        //     .style("fill","#111")
        //     .text((g,i)=> `${i} ${g}`)




        r.selectAll("rect.band")
            .attr('class', function (d) {
                console.log(d.data.ghost);
                console.log(d.data.condition);
                return 'band ' + (d.data.ghost ? ' ghost' : '') + (d.data.condition.startsWith("DEAD") ? ' dead' : '');
            });
        r.selectAll("rect.frame")
            .attr('class', function (d) {
                return 'frame ' + (d.data.ghost ? ' ghost' : '') + (d.data.condition.startsWith("DEAD")==true ? ' dead' : '');
            });
        r.selectAll("rect.plate")
            .attr('class', function (d) {
                return 'plate ' + d.data.faction + (d.data.ghost ? ' ghost' : '') + (d.data.condition.startsWith("DEAD")==true ? ' dead' : '');
            });


        // IMAGE
        r.append("image")
            .attr("xlink:href", function (d) {
                //console.log(d)
                let s;
                if (d.data.clan) {
                    s = 'static/collector/clans/' + d.data.clan.split(" ").join("_").toLowerCase() + '.webp';
                } else {
                    s = 'static/collector/independant.webp';
                }
                return s;
            })
            .attr('class', function (d) {
                return (d.data.ghost ? 'creature_img ghost' : 'creature_img');
            })
            .attr('id', function (d) {
                return d.id;
            })
            .attr("x", (-me.boxWidth * 1.15))
            .attr("y", (-me.boxHeight * 1.25))
            .attr("width", me.boxWidth * 0.30)
            .attr("height", me.boxHeight * 1)
        ;
        // TEXT
        r.append("text")
            .attr('class', function (d) {
                let c = 'kindred_name';
                if (d.data.ghost) c += ' ghost';
                return c;
            })
            .append('tspan')
            .attr('text-anchor', 'middle')
            .attr('x', -me.boxWidth * 0)
            .attr('y', -me.boxHeight * 0.5)
            .attr('dx', '0')
            .attr('dy', '0')
            .text(function (d) {
                let n = d.data.name;
                if (d.data.ghost) {
                    if (d.data.mythic) {
                        n = d.data.name + " " + d.id;
                    } else {
                        n = 'Unknown';
                    }
                }
                return n;
            })
            .call(me.wrap, me.boxWidth * 1.8)
            .on("click", function (e, d) {
                if (e.ctrlKey) {
                    //console.log("Just ctrl+clicked on text for " + d.id + " [" + d.data.name + "]!");

                    $.ajax({
                        url: 'ajax/view/creature/' + d.data.rid + '/',
                        success: function (answer) {
                            $('.details').html(answer)
                            $('li').removeClass('selected');
                            $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.error('View error...' + answer);
                            me.co.rebootLinks();
                        }
                    });
                }else{
                    me.saveSVG();
                }
            });

        // Display of the properties
        r.append('text')
            .attr('class', 'property')
            .attr('text-anchor', 'start')
            .attr('x', -me.boxWidth * 0.9)
            .attr('y', me.boxHeight * 0.2)
            .attr('dx', '0')
            .attr('dy', '0')
            .text(function (d) {
                let str = '';
                if (d.data.ghost == false) {
                    if (d.data.clan) {
                        if (d.data.generation <= 3) {
                            str += d.data.clan + " Antediluvian"
                        } else {
                            str = d.data.generation + 'th gen.';
                            str += ' ' + d.data.clan;
                        }
                        str += " " + line_jump_code + " Born " + d.data.trueage + " years ago. ";
                    }
                }
                return str
            })
            .call(me.wrap, me.boxWidth * 1.8);

        // Display of the ghouls
        r.append("text")
            // .append('tspan')
            .attr('class', 'ghouls_list')
            .attr('text-anchor', 'start')
            .attr('x', -me.boxWidth * 0.95)
            .attr('y', me.boxHeight * 0.5)
            .attr('dx', '5px')
            .attr('dy', '0')
            .text(function (d) {
                let str = '';
                if (d.data.ghost == false) {
                    if (d.data.condition.startsWith('MISSING')) {
                        let wc = d.data.condition.split("=");
                        if (wc.length == 2) {
                            str = 'Missing since ' + wc[1];
                        }
                    } else if (d.data.condition.startsWith('DEAD')){
                        let wc = d.data.condition.split("=");
                        if (wc.length==2) {
                            str = 'Final Death in '+wc[1];
                        }
                    }else {
                        if (d.data.ghouls != '') {
                            str = 'Retainers:';
                            let list = d.data.ghouls.split(',')
                            _.forEach(list, function (x) {
                                str += " " + line_jump_code + " - " + x;
                            })
                        }
                    }
                }
                return str
            })
            .style('fill', '#CCC')
            .style('stroke', '#888')
            .style('stroke-width', '0.5pt')
            .call(me.wrap, me.boxWidth * 1.9)
        ;
        // r.append('line')
        //     .attr("x1", 0)
        //     .attr("y1", 0)
        //     .attr("x2", me.boxWidth * 1)
        //     .attr("y2", me.boxHeight * 0.5)
        //     .style("fill", '#A00')
        //     .style("stroke", '#A00')
        //     .style("stroke-width","3px")
        // ;

        r.append("circle")
            .attr("cx",90)
            .attr("cy",-60)
            .attr("r",3)
            .attr("stroke", "transparent")
            .attr("stroke-width", "2pt")
            .attr("fill", function (d) {
                let col = "transparent";
                if (d.data.primogen){
                    col = '#E08080'
                }

                return col;
            })
        ;

        r.append("circle")
            .attr("cx",100)
            .attr("cy",-60)
            .attr("r",17)
            .attr("stroke", "none")
            .attr("stroke-width", "2pt")
            .attr("fill", function (d) {
                let col = "none";
                if (!d.data.ghost){
                    if (["OK"].includes(d.data.status)){
                        col = '#C0F0C0'
                        console.log("d.data.status >> ",d.data.status)
                    }else{
                        console.log("d.data.status !! ",d.data.status)
                        col = '#1010107f'
                    }
                }
                return col;
            })
        ;


        r.append("circle")
            .attr("cx",75)
            .attr("cy",-60)
            .attr("r",function(d){
                return 2+d.data.is_ancient;
            })
            .attr("stroke", "#a0a0a0")
            .attr("stroke-width", "0.5pt")
            .attr("fill", function (d) {
                let col = "transparent";
                let colors = ["transparent","#C01010","#A01010","#801010","#601010","#401010"]
                if (d.data.is_ancient > 0){
                    col = colors[d.data.is_ancient];
                }
                return col;
            })
        ;

//         r.append("circle")
//             .attr("cx",75)
//             .attr("cy",-10)
//             .attr("r",function(d){
//                 return 2+d.data.is_ancient;
//             })
//             .attr("stroke", "#a0a0a0")
//             .attr("stroke-width", "0.5pt")
//             .attr("fill", function (d) {
//                 let col = "#bab151";
//                 return col;
//             })
//         ;

        r.append("path")
            .attr("class", "icon_condition")
            .attr("d", function (d) {
                let str = ''
                if ((d.data.condition).startsWith("MISSING")) {
                    str = "M -80 240 l -20 0 l 0 -20 l 180 -220 20 0 0 20 -180 220 Z "
                } else if (d.data.condition.startsWith("DEAD")){
                    str = "M -80 240 l -20 0 l 0 -20 l 180 -220 20 0 0 20 -180 220 Z "

                }
                return str;
            })
            .attr("stroke", "transparent")
            .attr("stroke-width", "2pt")
            .attr("fill", function (d) {
                let col = "transparent";
                if (d.data.condition.startsWith("MISSING")){
                    col = '#2080807f'
                }
                if (d.data.condition.startsWith("DEAD")){
                    col = '#8020207f'
                }
                return col;
            })
            .attr("fill-opacity",0.75)
        ;

        return r;
    }

    go() {
        let me = this;
        let margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = me.boxWidth * 60 - margin.left - margin.right,
            height = me.boxWidth * 20 - margin.top - margin.bottom;
        let treemap = d3.tree()
            .size([width, height])
            .nodeSize([me.boxWidth * 2.5, me.boxHeight * 7.5])
        ;
        let nodes = d3.hierarchy(me.data[0]);
        nodes = treemap(nodes);
        d3.select(me.parent).selectAll("svg").remove();
        let pwidth = d3.select(me.parent).style("width");
        let pheight = d3.select(me.parent).style("height");
        let pox = -(parseInt(pwidth)/2);
        let poy = -(parseInt(pheight)/2);
        //console.log(me.parent+" "+pwidth+" "+pheight+" "+pox+" "+poy)
        me.svg = d3.select(me.parent).append("svg")
            .attr('class', 'lineage')
            .attr("width", pwidth)
            .attr("height", pheight);
        me.g = me.svg.append("g")
            .attr("viewBox", pox+"  "+poy+ " " + pwidth + " " + pheight)
            //.attr("transform","translate(0,0)")
            .attr("transform", "translate(" + parseInt(pwidth) / 2 + "," + parseInt(pheight) / 2 + ")")
        ;


        let node = me.g.selectAll(".node")
            .data(nodes.descendants())

        let node_in = me.insertNode(node);

        let link = me.g.selectAll(".links")
            .data(nodes.descendants().slice(1))
            .enter()
        link.append("g")
            .attr("class", function (d) {
                let res = "link ";
                if (d.data.ghost | d.parent.data.ghost) {
                    res += " ghost";
                }
                return res;
            })
            .append("path")
            .attr("d", (d) => {
                return "M" + d.x + "," + (d.y - me.boxHeight * 1)
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + (d.y + d.parent.y + me.boxHeight * 3) / 2
                    + " " + d.parent.x + "," + (d.parent.y + me.boxHeight * 3);

            })
        ;

    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.125, 4])
            .on('zoom', function (event) {
                me.g.attr('transform', event.transform)
            });
        me.svg.call(zoom);
    }

    perform(data) {
        let me = this;
        me.data = data;
        me.go()
        me.zoomActivate()
    }

}
