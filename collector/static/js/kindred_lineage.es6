let line_jump_code = "*N*L*";

// /* Callback functions */
// function toggleAll(d) {
//     if (d.children) {
//         d.children.forEach(toggleAll);
//         toggle(d);
//     }
// }
//
// function toggle(d) {
//     if (d.children) {
//         d._children = d.children;
//         d.children = null;
//     } else {
//         closeSiblings(d);
//         d.children = d._children;
//         d._children = null;
//     }
// }
//
// function collapse(d) {
//     let me = this;
//     if (d.children) {
//         d._children = d.children
//         d._children.forEach(collapse)
//         d.children = null
//     }
// }
//
//
// function toggleSimple(d) {
//     if (d.children) {
//         d._children = d.children;
//         d.children = null;
//     } else {
//         d.children = d._children;
//         d._children = null;
//         d.children.forEach(toggleSimple);
//     }
// }
//
// function closeSiblings(d) {
//     if (!d.parent)
//         return;
//     d.parent.children.forEach(function (c) {
//         if (c === d || !c.children)
//             return;
//         c._children = c.children;
//         c.children = null;
//     });
// }


/* The kindred tree display class */
class KindredLineage {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.data = data[0];
        me.boxWidth = 150;
        me.boxHeight = 30;

        //me.init();
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
    //
    //
    // init() {
    //     let me = this;
    //
    //     me.width = parseInt($(me.parent).css("width"));
    //     me.height = me.width * 0.58;
    //     me.w = me.width * 1;
    //     me.h = me.height * 1;
    //     me.i = 0;
    //     d3.select(me.parent).selectAll("svg").remove();
    //     me.vis = d3.select(me.parent).append("svg")
    //         .attr("viewBox", "0 0 " + me.w + " " + me.h)
    //         .attr("width", me.width)
    //         .attr("height", me.height)
    //         .append('g')
    //         .attr("transform", "translate(" + (me.w / 2) + "," + (me.h / 2) + ")")
    //     me.tree = d3.tree().size([me.height, me.width]);
    //     me.root = d3.hierarchy(me.data);
    //     // me.root.x0 = 0;
    //     // me.root.y0 = 0;
    //     _.forEach(me.root.children, collapse);
    //     me.update(me.root)
    // }
    //
    //
    // // Toggle children on click.
    // uncollapse(d) {
    //     let me = this;
    //     if (d.children) {
    //         d._children = d.children;
    //         d.children = null;
    //     } else {
    //         d.children = d._children;
    //         d._children = null;
    //     }
    // }
    //
    // // Creates a curved (diagonal) path from parent to the child nodes
    // diagonal(s, d) {
    //     let path = `M ${s.x} ${s.y}
    //         C ${(s.x)} ${(s.y + d.y) / 2},
    //           ${(s.x)} ${(s.y + d.y) / 2},
    //           ${d.x} ${d.y}`
    //     return path
    // }
    //
    // update(source) {
    //     let me = this;
    //     me.treedata = me.tree(me.root);
    //     me.nodes = me.treedata.descendants();
    //     me.links = me.treedata.descendants().slice(1);
    //     let i = 0;
    //     // me.nodes.forEach(function (d) {
    //     //     d.y = d.depth * 180;
    //     //     //d.id = ++i
    //     //
    //     // });
    //
    //
    //     i = 0;
    //     me.node = me.vis.selectAll("g.node")
    //         .data(me.nodes, function (d) {
    //             //    console.log(d)
    //             return d.id || (d.id = ++i);
    //         });
    //
    //     // // *** NODE UPDATE ***
    //     // me.nodeUpdate = me.node.transition()
    //     //     .duration(me.duration)
    //     //     .attr("transform", function (d) {
    //     //         return "translate(" + d.x + "," + d.y + ")";
    //     //     });
    //     // me.nodeUpdate.select("text")
    //     //     .style("fill-opacity", 1);
    //
    //     // // *** NODE EXIT ***
    //     // me.nodeExit = me.node.exit().transition()
    //     //     .duration(me.duration)
    //     //     .attr("transform", function (d) {
    //     //         return "translate(" + source.x + "," + source.y + ")";
    //     //     })
    //     //     .remove();
    //     //
    //     // me.nodeExit.select('rect')
    //     //     .attr('x', 0)
    //     //     .attr('y', 0)
    //     //     .attr('width', 0)
    //     //     .attr('height', 0)
    //     // ;
    //     // me.nodeExit.select("text")
    //     //     .style("fill-opacity", 1e-6);
    //
    //     // *** LINKS ***
    //     me.link = me.vis.selectAll("path.link")
    //         .data(me.links, function (d) {
    //             return d.id;
    //         });
    //
    //     me.link_in = me.link.enter().insert("path", "g")
    //         .attr("class", function (d) {
    //             let c = 'link ';
    //             if ((d.data.ghost) || (d.data.parent.ghost)) {
    //                 c += ' ghost';
    //             }
    //             return c;
    //         })
    //         .attr("d", function (d) {
    //             let o = {x: source.y0, y: source.x0};
    //             return me.diagonal(o, o);
    //         })
    //         .style('stroke', 'red')
    //         .style('fill', 'transparent')
    //         .style('stroke-width', '3pt')
    //     ;
    //
    //     // me.link_update = me.link_in.merge(me.link);
    //     // me.link_update.transition()
    //     //     .duration(me.duration)
    //     //     .attr('d', function (d) {
    //     //         return me.diagonal(d, d.parent)
    //     //     });
    //     //
    //     //
    //     // me.link_out = me.link.exit().transition()
    //     //     .duration(me.duration)
    //     //     .attr('d', function (d) {
    //     //         var o = {x: source.y, y: source.x}
    //     //         return me.diagonal(o, o)
    //     //     })
    //     //     .remove();
    //
    //     me.nodes.forEach(function (d) {
    //         d.x0 = d.x;
    //         d.y0 = d.y;
    //     });
    // }

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
            .attr('x', -me.boxWidth * 0.5)
            .attr('y', -me.boxHeight * 1)
            .attr('width', me.boxWidth * 1)
            .attr('height', me.boxHeight * 1)
        ;
        r.append("rect")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth * 0.5)
            .attr('y', -me.boxHeight * 0)
            .attr('width', me.boxWidth * 1)
            .attr('height', me.boxHeight * 4)
        ;

        r.append("rect")
            .attr('class', 'frame')
            .attr('x', -me.boxWidth * 0.5)
            .attr('y', -me.boxHeight * 1)
            .attr('width', me.boxWidth * 1)
            .attr('height', me.boxHeight * 5)
            .on("click", function (e, d) {
                console.log("Frame click " + d.id + " [" + d.data.name + "]!");
                me.uncollapse(d)
                me.update(d);

            });
        ;
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
                console.log(d)
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
            .attr("x", (-me.boxWidth * 0.70))
            .attr("y", (-me.boxHeight * 1.25))
            .attr("width", me.boxWidth * 0.30)
            .attr("height", me.boxHeight * 1)
            .on("click", function (e, d) {
                console.log("Just ctrl+clicked on image for " + d.id + " [" + d.data.name + "]!");
                // if (e.ctrlKey) {
                //     //toggleSimple(d);
                //     me.uncollapse(d)
                // } else {
                //     //toggle(d);
                //     me.uncollapse(d)
                //
                // }
               // me.update(d);

            });
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
                        n = d.data.name ;
                    } else {
                        n = 'Unknown';
                    }
                }
                return n;
            })
            .call(me.wrap, me.boxWidth * 0.9)
            .on("click", function (e, d) {
                if (e.ctrlKey) {
                    console.log("Just ctrl+clicked on text for " + d.id + " [" + d.data.name + "]!");

                    $.ajax({
                        url: 'ajax/view/creature/' + d.data.rid + '/',
                        success: function (answer) {
                            $('.details').html(answer)
                            $('li').removeClass('selected');
                            $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.log('View error...' + answer);
                        }
                    });
                }
            });

        // Display of the properties
        r.select("text.kindred_name")
            .append('tspan')
            .attr('class', 'property')
            .attr('text-anchor', 'start')
            .attr('x', -me.boxWidth * 0.45)
            .attr('y', me.boxHeight * 0.5)
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
                        str += " " + line_jump_code + " "  + d.data.trueage;
                    }
                }
                return str
            })
            .call(me.wrap, me.boxWidth * 0.9);

        // Display of the ghouls
        r.select("text.kindred_name")
            .append('tspan')
            .attr('class', 'property')
            .attr('text-anchor', 'middle')
            .attr('x', me.boxWidth * 0)
            .attr('y', me.boxHeight * 2)
            .attr('dx', '0')
            .attr('dy', '0')
            .text(function (d) {
                let str = '';
                if (d.data.ghost == false) {
                    if (d.data.ghouls != '') {
                        str = 'GHOULS';
                        let list = d.data.ghouls.split(',')
                        _.forEach(list,function(x){
                            str += " " + line_jump_code + " "  + x;
                        })
                    }
                }
                return str
            })
            .style('fill','#EEE')
            .style('stroke','#BBB')
            .style('stroke-width','0.5pt')
            .call(me.wrap, me.boxWidth * 0.9);

        return r;
    }

    go() {
        let me = this;
        let margin = {top: 40, right: 90, bottom: 50, left: 90},
            width = me.boxWidth * 60 - margin.left - margin.right,
            height = me.boxWidth * 20 - margin.top - margin.bottom;
        let treemap = d3.tree()
            .size([width, height]);
        let nodes = d3.hierarchy(me.data);
        nodes = treemap(nodes);
        me.svg = d3.select(me.parent).append("svg")
            .attr('class', 'lineage')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom),
            me.g = me.svg.append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


        let link = me.g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", function (d) {
                let res = "link ";
                if (d.data.ghost | d.parent.data.ghost) {
                    res += "ghost";
                }
                return res;
            })
            .attr("d", function (d) {
                return "M" + d.x + "," + (d.y - me.boxHeight)
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + (d.y + d.parent.y+me.boxHeight*3) / 2
                    + " " + d.parent.x + "," + (d.parent.y + me.boxHeight * 4);

            })
        ;
        let node = me.g.selectAll(".node")
            .data(nodes.descendants())
        let node_in = me.insertNode(node);
    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([1, 1]) // I don't want a zoom, i want panning :)
            .on('zoom', function (event) {
                me.g.selectAll('path')
                    .attr('transform', event.transform);
                me.g.selectAll('rect')
                    .attr('transform', event.transform);
                me.g.selectAll('text')
                    .attr('transform', event.transform);
                me.g.selectAll('image')
                    .attr('transform', event.transform);
            });
        me.svg.call(zoom);
    }

    perform() {
        let me = this;
        me.go()
        me.zoomActivate()
    }

}
