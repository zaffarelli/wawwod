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
        me.svg = d3.select(me.parent).append("svg")
            .attr("viewBox", (-me.width / 2) + "  " + (-me.height / 2) + " " + me.width + " " + me.height)
            .attr("class", "dashboard")
            .attr("width", pwidth)
            .attr("height", pheight)
        me.static_back = me.svg.append("g");
        me.back = me.svg.append("g")
            .attr("transform", "rotate(" + (me.global_rotation) + ")")
        me.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip hidden")
    }



    update() {
        let me = this;
        me.draw_stats(-me.step_x*90,me.step_y*2,'status',"#A08020");
        me.draw_stats(-me.step_x*90,me.step_y*25,'balanced',"#A02020");
        me.draw_stats(-me.step_x*90,me.step_y*35,'creatures',"#208020");
        me.draw_stats(-me.step_x*90,me.step_y*45,'clans',"#808020");
        me.draw_stats(-me.step_x*90,me.step_y*60,'disciplines',"#802080");

        me.draw_stats(-me.step_x*40,me.step_y*2,'generation',"#80A020");
        me.draw_stats(-me.step_x*40,me.step_y*25,'sect',"#202080");
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

        let bar_grp = me.static_back.append("g");
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
               return   d.y-(delta_y/3);
            })
            .attr("width",function(d){
               return delta_x*(d.value/3);
            })
            .attr("height",function(d){
               return 2*delta_y / 3;
            })
            .style("fill", color)
            .style("stroke", "#7f7f7f")
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
            .style("stroke-width", '0.125pt')
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
        let bar_out = bars.exit()
        bar_out.remove()
    }

    perform() {
        let me = this;
        me.watermark()
        me.update();
        me.zoomActivate()
    }
}
