class Dashboard {
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
        _.forEach(me.data, function (v, k) {
            if (v['value'] > 0) { // Only deal with sectors with at least 1 creature
                me.sector_data.push(v)
                me.starts.push(v['start'])
            }
        })
        me.boxWidth = 7
        me.boxHeight = 4
        let re = new RegExp("\d+")
        me.width = parseInt($(me.parent).css("width"))
        me.height = me.width
        me.step_x = me.width / 100
        me.step_y = me.height / 100
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
        me.vis = d3.select(me.parent).append("svg")
            .attr("viewBox", (-me.width / 2) + "  " + (-me.height / 2) + " " + me.width + " " + me.height)
            .attr("class", "dashboard")
            .attr("width", pwidth)
            .attr("height", pheight)
        me.svg = me.vis.append("g")
            .attr("width", me.step_x*100)
            .attr("height", me.step_y*100)
            .attr("class", "all")
            .attr("transform", "translate(0,0)")
            //.attr("transform", "translate(0,0)")
        me.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip hidden")
    }






    draw_stats(ox,oy,src='status', color="#202020") {
        let me = this;
        let data_set = []
        let local_data = me.stats[src];

        let idx = 0;
        let delta_x = 20, delta_y=30;
        let cnt = 0
        _.forEach(local_data,function (d){
            let x = 0
            let y = 0+ ((idx)*(delta_x+10))
            let g = "group"+idx;
            let v = d.value;
            let l = d.label;
            data_set.push({"x":x,"y":y,"group":g,"value":v, "label":l})
            idx += 1
            cnt += 1
        });

        let bar_grp = me.svg.append("g")
            .attr("id",src)
            .attr("transform",`translate(${ox},${-oy})`)
        bar_grp.append("circle")
                .attr("cx",0)
                .attr("cy",0)
                .attr("r",me.step_x/4)
                .style("fill",color)
                .style("stroke","white")
                .style("stroke-width","1pt")
        bar_grp.append("rect")
                .attr("x",-me.step_x*10)
                .attr("y",-me.step_y*2)
                .attr("rx",me.step_x/4)
                .attr("ry",me.step_x/4)
                .attr("width",50*me.step_y+me.step_x*10)
                .attr("height",10*me.step_y+2*me.step_y)
                .style("fill","none")
                .style("stroke","silver")
                .style("stroke-width","5pt")

        let bars = bar_grp.append("g")
            .attr("class", 'stats')
            .selectAll(".stats")
            .data(data_set)




        let bars_enter = bars.enter();
        bars_enter.append('rect')
            .attr("x",function(d){
               return d.x+delta_x;
            })
            .attr("y",function(d){
               return   d.y-(delta_y/6);
            })
            .attr("width",function(d){
               return delta_x*(d.value/3);
            })
            .attr("height",function(d){
               return delta_y / 3;
            })
            .style("fill", color)
            .style("stroke", "#7f7f7f")
        bars_enter.append('text')
            .attr("x",function(d){
                return d.x-delta_x ;
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
            .style("stroke-width", '0.125pt')

        bar_grp.append('text')
            .attr("x",0)
            .attr("y",0 )
            .attr("dy",-80)
            .style("text-anchor", 'left')
            .style("font-family", 'Ruda')
            .style("font-size", '24pt')
            .style("fill", '#CCC')
            .style("stroke", '#111')
            .style("stroke-width", '0.125pt')
            .text(src.charAt(0).toUpperCase()+src.slice(1))

        _.forEach([0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200],function (item){
            bar_grp.append('line')
                .attr("x1", + (item * delta_x/3) + delta_x)
                .attr("x2", + (item * delta_x/3)+ delta_x)
                .attr("y1", 0 )
                .attr("y2",  (cnt)*delta_y)
                .style("fill", 'none')
                .style("stroke", '#999')
                .style("stroke-width", '0.5pt')

            bar_grp.append('text')
                .attr("x", (item * delta_x/3) + delta_x)
                .attr("y",  (1+cnt)*delta_y)
                .style("text-anchor", 'middle')
                .style("font-family", 'Ruda')
                .style("font-size", '16pt')
                .style("fill", '#CCC')
                .style("stroke", '#111')
                .style("stroke-width", '0.125pt')
                .text(item)
        })
        let bar_out = bars.exit()
        bar_out.remove()
    }

    update() {
        let me = this;
        me.svg.append("circle")
            .attr("cx",0)
            .attr("cy",0)
            .attr("r",5)
            .style("fill","red")
            .style("stroke","white")
            .style("stroke-width","1pt")
//         me.draw_stats(-me.step_x*90,me.step_y*2,'status',"#A08020");
        me.draw_stats(-me.step_x*55,me.step_y*0,'balanced',"#A02020");
        me.draw_stats(-me.step_x*55,me.step_y*15,'creatures',"#208020");
        me.draw_stats(-me.step_x*55,me.step_y*30,'clans',"#808020");
//         me.draw_stats(-me.step_x*90,me.step_y*60,'disciplines',"#802080");

        me.draw_stats(me.step_x*15,me.step_y*0,'generation',"#80A0F0");
        me.draw_stats(me.step_x*15,me.step_y*15,'sect',"#802080");
    }


    zoomActivate() {
        let me = this;
        let zoom = d3.zoom()
            .scaleExtent([1, 4])
            .on('zoom', function (event) {
                me.svg.attr('transform', event.transform);
            });
        me.vis.call(zoom);
    }

    perform() {
        let me = this;
        me.watermark()
        me.update();
        me.zoomActivate()
    }
}
