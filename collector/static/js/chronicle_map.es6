class ChronicleMap {
    constructor(data, parent) {
        let me = this
        me.parent = parent
        me.data = data
        me.init()
    }

    setCollector(collector){
        let me = this
        me.co = collector
        me.co.sayHi()
    }

    init() {
        let me = this;
        me.step = 24;
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
        me.boxWidth = 12;
        me.boxHeight = 16;
        let re = new RegExp("\d+");
        me.width = me.step*((me.boxWidth+1)*6+1)
        me.height = me.step*((me.boxHeight+1)*6+1)

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
//             .style("fill","#303030")
//             .style("stroke","#F0F0F0")
            .style("fill","none")
            .style("stroke","none")
            .style("stroke-width","1pt")
    }

    update() {
        let me = this;
        let g = me.svg.append("g")
            .attr("transform",`translate(${me.step},${me.step})`)
        _.forEach(me.data, function (v,i) {
            me.characterBox(g,v,i)
        })
    }

    characterBox(gg,x,i){
        let length_size = 6
        let me = this
        let g = gg.append("g")
            .attr("class",x.creature)
            .attr("id",x.rid)
            .attr("transform",`translate(${(i%length_size)*(me.boxWidth+1)*me.step},${Math.floor(i/length_size)*(me.boxHeight+1)*me.step})`)
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
                }else if (e.altKey){
                    $.ajax({
                        url: 'ajax/display/crossover_sheet/' + x.rid + '/',
                        success: function (answer) {
                            let s = JSON.parse(answer.settings);
                            let d = JSON.parse(answer.data);
                            me.d3 = new CrossOverSheet(s, "#d3area");
                            me.d3.setCollector(me.co)
                            me.d3.perform(d);
//                             $('.details').html(answer)
//                             //$('li').removeClass('selected');
//                             $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.error('Sheet display error...' + answer);
                        }
                    });
                }

            })
        g.append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("height",me.step*me.boxHeight)
            .attr("width",me.step*me.boxWidth)
            .attr("rx",me.step/3+"pt")
            .attr("ry",me.step/3+"pt")
            .style("fill","#101010")
            .style("stroke-width","1pt")
            .style("stroke","#E0E0E0")
        let txt = g.append("text")
            .attr("x",me.step/2)
            .attr("y",me.step/2)
            .style("font-family","Khand")
            .style("font-size","10pt")
            .style("text-anchor","start")
            .style("fill","#F0F0F0")
            .style("stroke-width","0.25pt")
            .style("stroke","#808080")
        let entrance = ["garou","mage","kindred"].includes(x.creature) ? x.entrance : ""
        let lines = [
            {"text":`${x.name}`, "style":{"font-size":"16pt",
                "stroke":() => {
                        let answer = "#C0C0C0"
                        switch (x.creature){
                            case "kinfolk":
                                answer = "#F0C040"
                                break
                            case "garou":
                                answer = "#F02020"
                                break
                            case "mage":
                                answer = "#2030F0"
                                break
                            case "kindred":
                                answer = "#20F020"
                                break
                            case "ghoul":
                                answer = "#208020"
                                break
                            default:
                                break
                        }
                        if (x.is_player){
                            answer = "#50F0F0"
                        }
                        if (x.family == "Black Spiral Dancer"){
                            answer = "#F040F0"
                            console.log("hit")
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
                                answer = "#F06060"
                                break
                            case "mage":
                                answer = "#1030F0"
                                break
                            case "kindred":
                                answer = "#20F020"
                                break
                            case "ghoul":
                                answer = "#208020"
                                break
                            default:
                                break
                        }
                        if (x.is_player){
                            answer = "#50F0F0"
                        }
                        if (x.family == "Black Spiral Dancer"){
                            answer = "#F040F0"
                            console.log("hit")
                        }
                        return answer
                   }
            ,"stroke-width":"0.25pt"},"order":1},
            {"text":`${x.creature=="kinfolk"?x.family+' '+x.creature:""}${entrance}`,"order":3},
            {"text":`${x.concept}`,"style":{"font-size":"11pt"},"order":2},
            {"text":`${x.faction}`,"order":4},
            {"text":`${x.age} yo ${(x.sex?"male":"female")}`,"order":5},
            {"text":`${x.adventure}`,"order":6}
        ]

        if (x.edge_for.length>0){
            lines.push({"text":`Garou: ${x.edge_for}`, "style":{"stroke":"#5050E0","stroke-width":"0.25pt"},"order":7})
        }
        if (x.sire.length>0){
            lines.push({"text":`Totem: ${x.sire}`, "style":{"stroke":"#E05050","stroke-width":"0.25pt"},"order":7})
        }

        _.forEach(lines, (v,k) => {
            let span = txt.append("tspan")
                .attr("x","12pt")
                .attr("y",((v.order+1)*12)+"pt")
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
            .scaleExtent([1, 3])
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
