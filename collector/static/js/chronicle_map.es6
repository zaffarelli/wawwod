class ChronicleMap {
    constructor(data, parent, collector) {
        let me = this
        me.parent = parent
        me.co = collector
        me.data = data
        me.init()
    }

    init() {
        let me = this;
        me.global_rotation = 0;
        me.sector_size = 30;
        me.sector_data = []
        me.starts = []
        _.forEach(me.data, function (v, k) {
            if (v['value'] > 0) { // Only deal with sectors with at least 1 creature
                me.sector_data.push(v);
                me.starts.push(v['start']);
            }
        });
        me.boxWidth = 8;
        me.boxHeight = 12;
        let re = new RegExp("\d+");
        me.width = parseInt($(me.parent).css("width"));
        me.height = me.width*2;
        me.step_x = me.width / 100;
        me.step_y = me.step_x;
    }

    watermark() {
        let me = this;
        d3.select(me.parent).selectAll("svg").remove();
        let width = d3.select(me.parent).style("width");
        let height = d3.select(me.parent).style("height");
        me.vis = d3.select(me.parent).append("svg")
            .attr("viewBox", `0 0 ${me.width} ${me.height}`)
            .attr("class", "character_map")
            .attr("width", width)
            .attr("height", height)
        me.svg = me.vis.append("g")
            .attr("transform", "translate(0,0)")
        me.svg.append("rect")
            .attr("id", "watermark_limit")
            .attr("width",me.width)
            .attr("height",me.height)
            .style("fill","#303030")
            .style("stroke","#F0F0F0")
            .style("stroke-width","1pt")





    }

    update() {
        let me = this;
        let g = me.svg.append("g")
            .attr("transform",`translate(${me.step_x},${me.step_y})`)
        _.forEach(me.data, function (v,i) {
            me.characterBox(g,v,i)
        })
    }

    characterBox(gg,x,i){
        let me = this
        let g = gg.append("g")
            .attr("class",x.creature)
            .attr("id",x.rid)
            .attr("transform",`translate(${(i%10)*(me.boxWidth+1)*me.step_x},${Math.floor(i/10)*(me.boxHeight+1)*me.step_y})`)
            .on("click", function (e, d) {
                if (e.ctrlKey) {
                    $.ajax({
                        url: 'ajax/view/creature/' + x.rid + '/',
                        success: function (answer) {
                            $('.details').html(answer)
                            //$('li').removeClass('selected');
                            $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.error('View error...' + answer);
                        }
                    });
                }

            })
        g.append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("height",me.step_y*me.boxHeight)
            .attr("width",me.step_x*me.boxWidth)
            .attr("rx","8pt")
            .attr("ry","8pt")
            .style("fill","#101010")
            .style("stroke-width","1pt")
            .style("stroke","#E0E0E0")
        let txt = g.append("text")
            .attr("x",me.step_x/2)
            .attr("y",me.step_y/2)
            .style("font-family","Khand")
            .style("font-size","10pt")
            .style("text-anchor","start")
            .style("fill","#F0F0F0")
            .style("stroke-width","0.25pt")
            .style("stroke","#808080")
        let lines = [
            {"text":`${x.name}`, "style":{"stroke":"#C0C0C0","stroke-width":"0.25pt"}},
            {"text":`${x.creature=="kinfolk"?x.family:""} ${x.creature=="garou"?x.rank:""} ${x.creature}`,
                "style":
                {
                    "stroke":() => {
                        let answer = "#C0C0C0"
                        switch (x.creature){
                            case "kinfolk":
                                answer = "#F0C040"
                                break
                            case "garou":
                                answer = "#A02020"
                                break
                            default:
                                break
                        }
                        return answer
                   },
                    "fill":() => {
                        let answer = "#F0F0F0"
                        switch (x.creature){
                            case "kinfolk":
                                answer = "#F0C080"
                                break
                            case "garou":
                                answer = "#A06060"
                                break
                            default:
                                break
                        }
                        return answer
                   }
                }
            },
            {"text":`${x.faction}`},
            {"text":`${x.age} yo ${(x.sex?"male":"female")}`},
            {"text":`${x.adventure}`},
            {"text":`Garou: ${x.edge_for}`, "style":{"stroke":"#5050E0","stroke-width":"0.25pt"}}
            ]

        _.forEach(lines, (v,k) => {
            let span = txt.append("tspan")
                .attr("x","12pt")
                .attr("y",((k+1)*12)+"pt")
                .text(v.text)
            if (v.hasOwnProperty("style")){
                _.forEach(v.style,(w,l)=>{
                    span.style(l,w)
                    })
                }
        })
    }

    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([0.125, 8])
            .on('zoom', function (event) {
                me.svg.attr('transform', event.transform);
            });
        me.vis.call(zoom);
    }

    perform() {
        let me = this;
        me.watermark()
        me.update()
        me.zoomActivate()
    }
}
