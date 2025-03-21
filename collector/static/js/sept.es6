

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
        me.bit = 20
        me.max_line = 5
    }

    saveSVG() {
        let me = this;
        me.svg.selectAll('.do_not_print').attr('opacity', 0);
        let base_svg = d3.select("#d3area svg.sept").html();
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
        let svg_name = "sept.svg"
        let rid = "sept";
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
        //let pack = d3.select("#"+btoa(x))
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "garou ";
                console.log(d)
                return str;
            })
            .attr("transform", function (d) {
                let x = Math.floor((d.order-1) % me.max_line) * me.bit*22
                let y = Math.floor((d.order-1) / me.max_line) * me.bit*9*6 + me.bit*9*d.packorder  + me.bit*3
                return "translate(" + x + "," + y + ")";
                //return "translate(" + (d.x*me.bit*22) + "," + (d.y*me.bit*9 + me.bit) + ")";
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
            .attr('class', 'garou_box ')
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', me.bit)
            .attr('ry', me.bit)
            .attr('width', me.bit * 18)
            .attr('height', me.bit * 8)
            .style('fill', (d,i) => {
                let color = "#F0F0F0"
                let pos = d.position.toLowerCase()
                let caern_offices = ["warder","master of the rite","master of challenge","keeper of the land","gatekeeper"]
                let minor_offices = ["wyrmfoe","caller of the wyld","truthcatcher","talesinger","master of the howl"]
                if (d.position == "Grand Elder"){
                    color = "#F0C0C0"
                } else if (d.position == "Elder"){
                    color = "#F0D0D0"
                } else if (d.position == "Guardian"){
                    color = "#E0F0E0"
                } else if (caern_offices.includes(pos)){
                    color = "#E0F0E0"
                } else if (minor_offices.includes(pos)){
                    color = "#D0D0F0"
                }
                return color
            })
            .style('stroke', "#101010")
            .style('stroke-width', "2pt")
            .style('stroke-dasharray', (d,i) => {
                let color = "#F0F0F0"
                let pos = d.position.toLowerCase()
                let caern_offices = ["warder","master of the rite","master of challenge","keeper of the land","gatekeeper"]
                let minor_offices = ["wyrmfoe","caller of the wyld","truthcatcher","talesinger","master of the howl"]
                if (d.position == "Grand Elder"){
                    color = "8 4"
                } else if (d.position == "Elder"){
                    color = "4 2"
                } else if (d.position == "Guardian"){
                    color = "1 1"
                } else if (caern_offices.includes(pos)){
                    color = "2 4"
                } else if (minor_offices.includes(pos)){
                    color = "4 8"
                }
                return color
            })
        ;
        r.append("text")
            .attr('class', 'garou_name')
            .attr('x', me.bit)
            .attr('y', me.bit)
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
            .attr('class', 'garou_desc')
            .attr('x', me.bit)
            .attr('y', me.bit)
            .attr('dy', (me.bit*1)+"pt")
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Khand")
            .style('font-size', "12pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.short_desc
                })
        ;

        r.append("text")
            .attr('class', 'garou_rank')
            .attr('x', me.bit)
            .attr('y', me.bit)
            .attr('dy', (me.bit*2)+"pt")
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Khand")
            .style('font-size', "13pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.renown+" renown (rank:"+d.rank+", "+d.age+"yo ) ["+d.player+"]"
                })
        ;

        r.append("text")
            .attr('class', 'garou_position')
            .attr('x', me.bit)
            .attr('y', me.bit)
            .attr('dy', (me.bit*3)+"pt")
            .style('fill', "#1010107F")
            .style('stroke', "#101010")
            .style('stroke-width', "0.25pt")
            .style('font-family', "Trade Winds")
            .style('font-size', "12pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.position
            })
        ;

        r.append("text")
            .attr('class', 'garou_edges')
            .attr('x', me.bit)
            .attr('y', me.bit)
            .attr('dy', (me.bit*4)+"pt")
            .style('fill', "#501010")
            .style('stroke', "#F03030")
            .style('stroke-width', "0.25pt")
            .style('font-family', "Khand")
            .style('font-size', "12pt")
            .style('text-anchor', "start")
            .text( function (d) {
                if (d.kinfolks > 0){
                    let score_to_num = [0,2,5,10,20,50,100]
                    return score_to_num[d.kinfolks]+" kinfolks: "+d.edges
                }
                return ""
                })
        ;
//         r.append("rect")
//             .attr('class', 'band')
//             .attr('x', 0)
//             .attr('y', 0)
//             .attr('rx', "50%")
//             .attr('ry', "50%")
//             .attr('width', me.bit)
//             .attr('height', me.bit)
//             .style('fill', "none")
//             .style('stroke', "#F080C0")
//             .style('stroke-width', "5pt")

        r.append("path")
            .attr('class', 'band')
            .attr('x', me.bit*16)
            .attr('y', me.bit)
            .attr('d', (d) => {
                let pattern = ""
                switch (d.auspice){
                    case 0:
                        pattern = "M -8,-4 m 3,0 a 3 3 0 1 1 0 0.01 "
                        break;
                    case 1:
                        pattern = "M -8,4 m 6 1 a -6 -6 1 0 1 0 -10 a -2 -2 0 0 0 0 10 z"
                        break;
                    case 2:
                        pattern = "M -8,-4 a 5,5 0 1 1 0,10 z"
                        break;
                    case 3:
                        pattern = "M -8,-0.5 a 5.0 5.0 0 1 1 0,.01 m 0,0 a 6 6 1 1 1 0,.01 z"
                        break;
                    case 4:
                        pattern = "M -8,-4 a 6 6 0 1 1 0 0.01 z"
                        break;
                }
                return pattern
                })
            .style('fill', (d) => {
                let fill = ""
                switch (d.auspice){
                    case 0:
                        fill = "#808080"
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        fill = "#B0E0F0"
                        break;
                }
                return fill;
            })
            .style('stroke', "#000000")
            .style('stroke-width', "1pt")



        return r;
    }

    insertPack(x) {
        let me = this;
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "pack ";
                return str;
            })
            .attr("id", (d) => {
                let str = btoa(d.name);
                return str;
            })
            .attr("transform", function (d) {
                let x = Math.floor(d.order % me.max_line) * me.bit*22
                let y = Math.floor(d.order / me.max_line) * me.bit*9*6 + me.bit
                console.log(d.order, x, y)
                return "translate(" + x + "," + y + ")";
                //return "translate(" + (d.x*me.bit*22) + "," + (d.y*me.bit) + ")";
            });
        r.append("rect")
            .attr('class', 'pack_box')
            .attr('x', -me.bit)
            .attr('y', -me.bit)
            .attr('rx', me.bit)
            .attr('ry', me.bit)
            .attr('width', me.bit * 20)
            .attr('height', (d,i) => {
                return me.bit*3 + (me.bit*9) * (d.cnt)
            })
            .style('fill', "#F0F0F0")
            .style('stroke', "#101010")
        ;
        r.append("text")
            .attr('class', 'plate')
            .attr('x', me.bit)
            .attr('y', 0)
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Trade Winds")
            .style('font-size', "16pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.name + " " +d.order
                })
        ;
        r.append("text")
            .attr('class', 'plate')
            .attr('x', me.bit)
            .attr('y', 0)
            .attr('dy', "16pt")
            .style('fill', "#101010")
            .style('stroke', "#303030")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Khand")
            .style('font-size', "12pt")
            .style('text-anchor', "start")
            .text( function (d) {
                return d.totem
                })
        ;
        return r;
    }

    insertStats(x) {
        let me = this;
        let r = x.enter().append("g")
            .attr("class", (d) => {
                let str = "stat ";
                return str;
            })
            .attr("id", (d) => d.name )
            .attr("transform", function (d) {
                return "translate(" + ((d.id-1)*me.step*2.25) + "," + (-me.step*3) + ")";
            });
        let vals = {"auspices":{},"breeds":{},"tribes":{}}
        let ministep = me.step/10
        r.append("rect")
            .attr('class', 'band')
            .attr('x', -me.boxWidth * .75)
            .attr('y', -me.boxHeight * .75)
            .attr('rx', me.step/10)
            .attr('ry', me.step/10)
            .attr('width', me.boxWidth * 2.5)
            .attr('height', (d,i) => {
                return me.boxHeight*5
            })
            .style('fill', "#C0C0C0")
            .style('stroke', "#101010")
        ;
        r.append("text")
            .attr('x', me.boxWidth*.25)
            .attr('y', -ministep)
            .style('fill', "#101010")
            .style('stroke', "#404040")
            .style('stroke-width', "0.15pt")
            .style('font-family', "Trade Winds")
            .style('font-size', "24pt")
            .style('text-anchor', "start")
            .text( (d) => {
                let v = { "name":d.name,"id":d.id, "values": d.values}
                vals[d.name] = v
                return d.name
            })
        ;
        let g = undefined
        let coeff = {"breeds":4,"auspices":1,"tribes":1}
        let color = {"breeds":"#C0F0C0","auspices":"#F0C0C0","tribes":"#C0C0Fts0"}
        _.forEach(vals, (v,k) => {
                g = d3.select("#"+k)
                _.forEach(v.values, (w,l) => {
                    g.append("rect")
                        .attr("id",v.name+" "+w.id)
                        .attr("x",ministep*1.25)
                        .attr("y",l*ministep)
                        .attr("height",3*ministep/4)
                        .attr("width",ministep/coeff[k] * w)
                        .style("fill",color[k])
                        .style("stroke","#101010")
                    g.append("text")
                        .attr('x', ministep)
                        .attr('y', l*ministep)
                        .attr('dy', ministep/2)
                        .style('fill', "#101010")
                        .style('stroke', "#303030")
                        .style('stroke-width', "0.15pt")
                        .style('font-family', "Trade Winds")
                        .style('font-size', "8pt")
                        .style('text-anchor', "end")
                        .text( () => {
                            let label = ""
                            let labels = []
                            if (k == "auspices"){
                                labels = ["Ragabash","Theurge","Philodox","Galliard","Ahroun"]
                            }
                            if (k == "breeds"){
                                labels = ["Homid","Metis","Lupus"]
                            }
                            if (k == "tribes"){
                                labels = ["Black Furies","Black Spiral Dancers","Bone Gnawers","Bunyips",
                                    "Children of Gaia","Croatans","Fiannas","Gets of Fenris","Glass Walkers",
                                    "Red Talons","Shadow Lords","Silent Striders","Silver Fangs","Stargazers",
                                    "Uktenas","Wendigos","White Howlers"]
                            }
                            label = labels[l]+" ("+w+")"
                            return label
                        })
                });
        })
    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.25, 4])
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
        let order = 0
        let packorder = 0
        _.forEach(me.data.packs, (v,k) => {
            let pack = {"name":v.name,"totem":v.totem,"cnt":0}
            pack["y"] = -1
            pack["id"] = idx++
            pack["order"] = order++
            j = 0
            packorder = 0
            _.forEach(v.members, (w,l) => {
                    let garou = w
                    garou["id"] = idx+"_"+j
                    garou["x"] = i
                    garou["y"] = j
                    garou["order"] = order
                    garou["packorder"] = packorder++
                    garou["packname"] = v.name
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

    go() {
        let me = this;
        let margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = me.boxWidth * 60 - margin.left - margin.right,
            height = me.boxWidth * 20 - margin.top - margin.bottom;
        let ox = 10, oy = 10
        d3.select(me.parent).selectAll("svg").remove();
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
            .on("click", function(e,d){
                if (e.altKey){
                    me.saveSVG()
                    console.log("Saved!!")
                }
            })
        let pack = me.vis.selectAll(".pack")
            .data(me.mapping.packs)
        let pack_in = me.insertPack(pack)
        let stat = me.vis.selectAll(".stats")
            .data(me.mapping.stats)
        let garou = me.vis.selectAll(".garou")
            .data(me.mapping.garous)
        let garou_in = me.insertGarou(garou)
        let stat_in = me.insertStats(stat)
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