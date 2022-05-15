let line_jump_code = "NR";

/* The kindred tree display class */
class KindredLineage {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.data = data[0];
        me.boxWidth = 100;
        me.boxHeight = 80;
        me.duration = 500;
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
            .attr("class", function (d) {
                let str = "node ";
                if (d.data.condition == "MISSING") {
                    str += "missing ";
                }
                if (d.data.condition == "DEAD") {
                    str += "dead ";
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
            .attr('height', me.boxHeight * 2)
        ;
        let ghouls = undefined;
        r.append("rect")
            .attr('class', 'frame')
            .attr('x', -me.boxWidth * 1)
            .attr('y', -me.boxHeight * 1)
            .attr('width', me.boxWidth * 2)
            .attr('height', me.boxHeight * 3)
            .attr('rx', me.boxWidth * 0.05)
            .attr('ry', me.boxWidth * 0.05)
            .on("click", function (e, d) {
                //console.log("Frame click " + d.id + " [" + d.data.name + "]!");
                me.uncollapse(d)
                me.update(d);
                ghouls = d.data.ghouls.split(',')
            });
        ;


        // _.forEach(ghouls,function(x,i){
        //     let g = r.append("g")
        //         .attr("class","ghoul")
        //     g.append("rect")
        //         .attr("x",me.boxWidth*0.5)
        //         .attr("y",me.boxHeight+me.boxHeight*0.5*i)
        //         .style("stroke","#fc4")
        //         .style("fill","#111")
        //     g.append("text")
        //         .text(x)
        // })


        r.selectAll("rect.band")
            .attr('class', function (d) {
                return 'band ' + (d.data.ghost ? ' ghost' : '') + (d.data.condition == 'DEAD' ? ' dead' : '');
            });
        r.selectAll("rect.frame")
            .attr('class', function (d) {
                return 'frame ' + (d.data.ghost ? ' ghost' : '') + (d.data.condition == 'DEAD' ? ' dead' : '');
            });
        r.selectAll("rect.plate")
            .attr('class', function (d) {
                return 'plate ' + d.data.faction + (d.data.ghost ? ' ghost' : '') + (d.data.condition == 'DEAD' ? ' dead' : '');
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
            .attr('y', me.boxHeight * 0.8)
            .attr('dx', '5px')
            .attr('dy', '0')
            .text(function (d) {
                let str = '';
                if (d.data.ghost == false) {
                    if (d.data.ghouls != '') {
                        str = 'Retainers:';
                        let list = d.data.ghouls.split(',')
                        _.forEach(list, function (x) {
                            str += " " + line_jump_code + " - " + x;
                        })
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
            .attr("cy",-70)
            .attr("r",5)
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

        r.append("path")
            .attr("class", "icon_condition")
            .attr("d", function (d) {
                let str = ''
                if (d.data.condition == "MISSING") {
                    str = "M -80 160 l -20 0 l 0 -20 l 180 -140 20 0 0 20 -180 140 Z "
                } else if (d.data.condition == "DEAD"){
                    str = "M -80 160 l -20 0 l 0 -20 l 180 -140 20 0 0 20 -180 140 Z "

                }
                return str;
            })
            .attr("stroke", "transparent")
            .attr("stroke-width", "2pt")
            .attr("fill", function (d) {
                let col = "transparent";
                if (d.data.condition == "MISSING"){
                    col = '#208080'
                }
                if (d.data.condition == "DEAD"){
                    col = '#802020'
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
            .nodeSize([me.boxWidth * 2.5, me.boxHeight * 4.5])
        ;
        let nodes = d3.hierarchy(me.data);
        nodes = treemap(nodes);
        d3.select(me.parent).selectAll("svg").remove();
        me.svg = d3.select(me.parent).append("svg")
            .attr('class', 'lineage')
            .attr("width", width)
            .attr("height", height);
        me.g = me.svg.append("g")
            .attr("transform",
                "translate(0,0)")
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
                    res += "ghost";
                }
                return res;
            })
            .append("path")
            .attr("d", function (d) {
                return "M" + d.x + "," + (d.y - me.boxHeight * 1)
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + (d.y + d.parent.y + me.boxHeight * 2) / 2
                    + " " + d.parent.x + "," + (d.parent.y + me.boxHeight * 2);

            })
        ;

    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.125, 4]) // I don't want a zoom, i want panning :)
            .on('zoom', function (event) {
                me.g.attr('transform', event.transform)
            });
        me.svg.call(zoom);
    }

    perform() {
        let me = this;
        me.go()
        me.zoomActivate()
    }

}
