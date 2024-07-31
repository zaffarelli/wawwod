

/* The kindred tree display class */
class Sept {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.config = data
        me.boxWidth = 160;
        me.boxHeight = 80;
        me.duration = 500;
        me.step = 200
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

    insertGarou(x) {
        let me = this;
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "garou ";
                console.log(d)
                return str;
            })
            .attr("transform", function (d) {
                return "translate(" + (d.x*me.step*2.25) + "," + (d.y*me.step) + ")";
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


        r.append("rect")
            .attr('class', 'band')
            .attr('x', -me.boxWidth * .5)
            .attr('y', -me.boxHeight * .5)
            .attr('rx', me.step/10)
            .attr('ry', me.step/10)
            .attr('width', me.boxWidth * 2.0)
            .attr('height', me.boxHeight * 2)
            .style('fill', "#E0E0E0")
            .style('stroke', "#101010")
        ;
        r.append("text")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth*.45)
            .attr('y', 0)
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Trade Winds")
            .style('font-size', "16pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.name
                })
        ;
        r.append("text")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth*.45)
            .attr('y', 0)
            .attr('dy', "10pt")
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Cinzel")
            .style('font-size', "8pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.short_desc
                })
        ;

        r.append("text")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth*.45)
            .attr('y', 0)
            .attr('dy', "20pt")
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Cinzel")
            .style('font-size', "8pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.renown+" renown (rank:"+d.rank+")"
                })
        ;


        return r;
    }

    insertPack(x) {
        let me = this;
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "pack ";
                console.log(d)
                return str;
            })
            .attr("transform", function (d) {
                return "translate(" + (d.x*me.step*2.25) + "," + (d.y*me.step) + ")";
            });
        r.append("rect")
            .attr('class', 'band')
            .attr('x', -me.boxWidth * .75)
            .attr('y', -me.boxHeight * .5)
            .attr('rx', me.step/10)
            .attr('ry', me.step/10)
            .attr('width', me.boxWidth * 2.5)
            .attr('height', (d,i) => {
                return me.boxHeight*2.5 * (d.cnt+1)
            })
            .style('fill', "#A0A0A0")
            .style('stroke', "#101010")
        ;
        r.append("text")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth*.65)
            .attr('y', 0)
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Trade Winds")
            .style('font-size', "12pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.name
                })
        ;
        r.append("text")
            .attr('class', 'plate')
            .attr('x', -me.boxWidth*.65)
            .attr('y', 0)
            .attr('dy', "10pt")
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Cinzel")
            .style('font-size', "8pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.totem
                })
        ;

//         r.append("text")
//             .attr('class', 'plate')
//             .attr('x', -me.boxWidth*.65)
//             .attr('y', 0)
//             .attr('dy', "20pt")
//             .style('fill', "#101010")
//             .style('stroke', "#303030")
//             .style('stroke-width', "0.15pt")
//             .style('font-family', "Cinzel")
//             .style('font-size', "8pt")
//             .style('text-anchor', "start")
//             .text( function (d) {
//                 return d.renown+" renown (rank:"+d.rank+")"
//                 })
//         ;


        return r;
    }


    go() {
        let me = this;
        let margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = me.boxWidth * 60 - margin.left - margin.right,
            height = me.boxWidth * 20 - margin.top - margin.bottom;

        let ox = 10, oy = 10

        d3.select(me.parent).selectAll(".sept").remove();
        let pwidth = d3.select(me.parent).style("width");
        let pheight = d3.select(me.parent).style("height");
        let pox = -(parseInt(pwidth)/2);
        let poy = -(parseInt(pheight)/2);

        me.svg = d3.select(me.parent).append("svg")
            .attr('class', 'sept')
            .attr("width", pwidth)
            .attr("height", pheight);
        me.vis = me.svg.append("g")
            .attr("viewBox", pox+"  "+poy+ " " + pwidth + " " + pheight)
            //.attr("transform","translate(0,0)")
            .attr("transform", "translate(" + parseInt(pwidth) / 2 + "," + parseInt(pheight) / 2 + ")")
        ;

        me.vis.append("rect")
            .attr("x",-me.step)
            .attr("y",-me.step)
            .attr("width",me.step*30)
            .attr("height",me.step*15)
            .style("fill","#F0F0F0")
            .style("stroke","#202020")

        let pack = me.vis.selectAll(".pack")
            .data(me.mapping.packs)

        let pack_in = me.insertPack(pack)

        let stat = me.vis.selectAll(".stats")
            .data(me.mapping.stats)


        let garou = me.vis.selectAll(".garou")
            .data(me.mapping.garous)


        let garou_in = me.insertGarou(garou)

        let stat_in = me.insertStats(stat)


//         let link = me.g.selectAll(".links")
//             .data(nodes.descendants().slice(1))
//             .enter()
//         link.append("g")
//             .attr("class", function (d) {
//                 let res = "link ";
//                 if (d.data.ghost | d.parent.data.ghost) {
//                     res += " ghost";
//                 }
//                 return res;
//             })
//             .append("path")
//             .attr("d", (d) => {
//                 return "M" + d.x + "," + (d.y - me.boxHeight * 1)
//                     + "C" + d.x + "," + (d.y + d.parent.y) / 2
//                     + " " + d.parent.x + "," + (d.y + d.parent.y + me.boxHeight * 2) / 2
//                     + " " + d.parent.x + "," + (d.parent.y + me.boxHeight * 2);
//
//             })
//         ;

    }

    insertStats(x) {
        let me = this;
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "stat ";
                return str;
            })
            .attr("id", (d) => "stat_"+d.name )
            .attr("transform", function (d) {
                return "translate(" + ((d.id-1)*me.step*2.25) + "," + (10*me.step) + ")";
            });
//         r.append("rect")
//             .attr('x', -me.boxWidth * .75)
//             .attr('y', -me.boxHeight * .5)
//             .attr('rx', me.step/10)
//             .attr('ry', me.step/10)
//             .attr('width', me.boxWidth * 2.5)
//             .attr('height', (d,i) => {
//                 return me.boxHeight*2.5 * (d.cnt+1)
//             })
//             .style('fill', "#A0C0A0")
//             .style('stroke', "#101010")
//             .style('stroke-width', "1pt")
//         ;
        let vals = {"auspices":{},"breeds":{},"tribes":{}}
        let ministep = me.step/10
        r.append("text")
            .attr('x', -me.boxWidth*.65)
            .attr('y', 0)
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Trade Winds")
            .style('font-size', "12pt")
            .style('text-anchor', "middle")
            .text( (d) => {
                let v = { "name":d.name,"id":d.id, "values": d.values}
                vals[d.name] = v
                return d.name
            })
        ;


        _.forEach(vals, (v,k) => {
            if (k=="auspices"){
                _.forEach(v.values, (w,l) => {
                    r.append("rect")
                        .attr("id",v.name+" "+w.id)
                        .attr("x",l*ministep)
                        .attr("y",-ministep * w)
                        .attr("width",ministep/2)
                        .attr("height",ministep * w)
                        .style("fill","#803030")
                        .style("stroke","#101010")
                });
            }
        });


    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.125, 4])
            .on('zoom', function (event) {
                me.vis.attr('transform', event.transform)
            });
        me.svg.call(zoom);
    }

    prepareTree(){
        let me = this
        me.mapping = {"garous":[], "packs":[], "stats":[]}
        let idx = 0
        let j = 0, i = 0
        _.forEach(me.data.packs, (v,k) => {
            let pack = {"name":v.name,"totem":v.totem,"cnt":0}
            pack["y"] = -1
            pack["id"] = ++idx
            j = 0
            _.forEach(v.members, (w,l) => {
                    let garou = w
                    garou["id"] = ++idx
                    garou["x"] = i
                    garou["y"] = j
                    pack["x"] = i
                    pack["cnt"]++
                    me.mapping.garous.push(garou)
                    j+=1
                }
            );
            me.mapping.packs.push(pack)
            i +=1
            }
        );
        idx = 0
        _.forEach(me.data.statistics, (v,k) => {
            let stat = {"name":"none","values":[], "id":0}
            stat["name"] = k
            stat["values"] = v
            stat["id"] = ++idx
            me.mapping.stats.push(stat)
        });
        console.log(me.mapping)
    }

    perform(data) {
        let me = this;
        me.data = data;
        me.prepareTree()
        me.go()
        me.zoomActivate()
    }

}


/*

Path for moon
M -2.5 -2
a 3 3 0 1 1 0 4
a 1 0.7 0 0 0 0 -4
z


 */