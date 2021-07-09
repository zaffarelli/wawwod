class Storytelling {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.config = data;
        me.pre_init()
    }

    pre_init() {
        let me = this;
        me.stepx = 90;
        me.time_coeff = 10;
        me.stepy = me.time_coeff * 12;
        me.d_start_x = me.stepx * 3;
        me.d_start_y = me.stepy * 5;
        me.p_start_x = me.stepx * 4;
        me.p_start_y = me.stepy * 4;
        me.day_start = 3 + 0.1;
        me.scene_dim = me.time_coeff * 3;
        me.hour = (me.stepy * 3) / 24;
        me.diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.x, d.y];
            });
        me.debug = true
        me.selected_scenes = []
    }

    decorationText(x, y, d = 0, a = 'middle', f, s, b, c, w, t, v, o = 1) {
        let me = this;
        v.append('text')
            .attr("x", me.stepx * x)
            .attr("y", me.stepy * y)
            .attr("dy", d)
            .style("text-anchor", a)
            .style("font-family", f)
            .style("font-size", s + 'px')
            .style("fill", b)
            .style("stroke", c)
            .style("stroke-width", w + 'pt')
            .text(t)
            .attr('opacity', o);
    }

    midline(y, startx = 2, stopx = -1) {
        let me = this;
        if (stopx == -1) {
            stopx = (me.width - me.stepx * 2) / me.stepx;
        }

        me.back.append('line')
            .attr('x1', me.stepx * startx)
            .attr('x2', me.stepx * stopx)
            .attr('y1', me.stepy * y)
            .attr('y2', me.stepy * y)
            .style('fill', 'transparent')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '3pt')
            .attr('marker-end', "url(#arrowhead)")
            .attr('marker-start', "url(#arrowhead)")
        ;
    }

    crossline(x, starty = 2, stopy = -1) {
        let me = this;
        if (stopy == -1) {
            stopy = (me.height - me.stepy * 2) / me.stepy;
        }
        me.back.append('line')
            .attr('x1', me.stepx * x)
            .attr('x2', me.stepx * x)
            .attr('y1', me.stepy * starty)
            .attr('y2', me.stepy * stopy)
            .style('fill', 'transparent')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '3pt')
            .attr('marker-end', "url(#arrowhead)")
            .attr('marker-start', "url(#arrowhead)")
        ;
    }

    init() {
        let me = this;
        me.stretch_coeff = 2;
        me.width = (me.story['places_count'] * 4 + 6) * me.stepx;
        me.height = ((Math.trunc(me.end_time / 24) + 2) * 4 + 8) * me.stepy;
        me.w = parseInt($("body").css("width")) * 1;
        me.h = me.w * 0.52;

        me.h = parseInt($("body").css("height")) * 0.90;
        me.tiny_font_size = me.time_coeff;
        me.small_font_size = 2 * me.time_coeff;
        me.medium_font_size = 3 * me.time_coeff;
        me.large_font_size = 4 * me.time_coeff;
        me.fat_font_size = 5 * me.time_coeff;

        // me.dot_radius = me.stepx / 8;
        // me.stat_length = 150;
        // me.stat_max = 5;
        me.shadow_fill = "#B0B0B0";
        me.shadow_stroke = "#A0A0A0";
        me.draw_stroke = '#111';
        me.draw_fill = '#222';
        me.user_stroke = '#911';
        me.user_fill = '#A22';
        me.user_font = 'Gochi Hand';
        me.mono_font = 'Syne Mono';
        me.title_font = 'Khand';
        me.logo_font = 'Trade Winds';
        me.base_font = 'Philosopher';
        me.x = d3.scale.linear().domain([0, me.w]).range([0, me.width]);
        me.y = d3.scale.linear().domain([0, me.h]).range([0, me.height]);
        me.pre_title = me.config['pre_title'];
        me.scenario = me.config['scenario'];
        me.post_title = me.config['post_title'];
        me.ax = 0;
        me.ay = 0;
    }

    drawTimeScale() {
        let me = this;
        let days_count = (me.end_time / 24) + 1;
        let days = me.back.append('g')
            .attr('class', 'days')
            .selectAll("g")
            .data(d3.range(0, days_count, 1));
        let day_in = days.enter()
        day_in.append('rect')
            .attr('class', 'day_rect')
            .attr('x', function (d) {
                return me.d_start_x + 0;
            })
            .attr('y', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start));
            })
            .attr('width', function (d) {
                return me.width - me.stepx * 5;
            })
            .attr('height', function (d) {
                return me.stepy * 3;
            })
            .style('fill', '#0F0')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.05')
        ;
        day_in.append('rect')
            .attr('class', 'day_rect_morning')
            .attr('x', function (d) {
                return me.d_start_x + 0;
            })
            .attr('y', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start));
            })
            .attr('width', function (d) {
                return me.width - me.stepx * 5;
            })
            .attr('height', function (d) {
                return (3 / 24) * 6.5 * me.stepy;
            })
            .style('fill', '#CCC')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.1')
        ;
        day_in.append('rect')
            .attr('class', 'day_rect_evening')
            .attr('x', function (d) {
                return me.d_start_x + 0;
            })
            .attr('y', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start)) + (3 / 24) * 19.5 * me.stepy;
            })
            .attr('width', function (d) {
                return me.width - me.stepx * 5;
            })
            .attr('height', function (d) {
                return (3 / 24) * 4.5 * me.stepy;
            })
            .style('fill', '#CCC')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.1')
        ;
        day_in.append('line')
            .attr('class', 'day_line_noon')
            .attr('x1', function (d) {
                return me.d_start_x + 0;
            })
            .attr('y1', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start)) + (3 / 24) * 12 * me.stepy;
            })
            .attr('x2', function (d) {
                return me.d_start_x + me.width - me.stepx * 5;
            })
            .attr('y2', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start)) + (3 / 24) * 12 * me.stepy;
            })
            .style('fill', 'transparent')
            .style('stroke', '#000')
            .style('stroke-dasharray', '3 4 3 4')
            .style('stroke-width', '1pt')
            .attr('opacity', 0.25)
        ;
        day_in.append('text')
            .attr('class', 'day_txt')
            .attr('x', function (d) {
                return me.d_start_x - 5;
            })
            .attr('y', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start));
            })
            .attr('dy', 10)
            .style("text-anchor", 'end')
            .style("font-family", me.base_font)
            .style("font-size", me.medium_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return "Day #" + d;
            })
        ;

        day_in.append('text')
            .attr('class', 'day_txt')
            .attr('x', function (d) {
                return me.d_start_x - 5;
            })
            .attr('y', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start));
            })
            .attr('dy', 40)
            .style("text-anchor", 'end')
            .style("font-family", me.base_font)
            .style("font-size", me.small_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return me.story.dday.day + d + "/" + me.story.dday.month + "/" + me.story.dday.year;
            })
        ;
    }

    drawPlaces() {
        let me = this;
        let places = me.back.append('g')
            .attr('class', 'places')
            .selectAll("g")
            .data(me.places);
        let place_in = places.enter();
        place_in.append('rect')
            .attr('class', 'place_rect')
            .attr('x', function (d, i) {
                return me.p_start_x + i * (me.stepx * (3 + 1));
            })
            .attr('y', function (d) {
                return me.p_start_y + 0;
            })
            .attr('width', function (d) {
                return me.stepx * 3;
            })
            .attr('height', function (d) {
                return (me.stepy) * (me.story['places_count'] + 2) * me.day_start;
            })
            .style('fill', '#00F')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.05')
        ;
        place_in.append('text')
            .attr('class', 'place_txt')
            .attr('x', function (d, i) {
                return me.p_start_x + i * (me.stepx * (3 + 1));
            })
            .attr('y', function (d) {
                return me.p_start_y + 0;
            })
            .attr('dy', -40)
            .style("text-anchor", 'start')
            .style("font-family", me.base_font)
            .style("font-size", me.medium_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return d['acronym'] + " (" + d['id'] + ")";
            })
        ;
        place_in.append('text')
            .attr('class', 'place_txt')
            .attr('x', function (d, i) {
                return me.p_start_x + i * (me.stepx * (3 + 1));
            })
            .attr('y', function (d) {
                return me.p_start_y + 0;
            })
            .attr('dy', -20)
            .style("text-anchor", 'start')
            .style("font-family", me.base_font)
            .style("font-size", me.small_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return d['name'];
            })
        ;

    }

    getStories() {
        let me = this;
        let str = me.selected_scenes.join('_');
        return str;
    }

    drawWatermark() {
        let me = this;
        d3.select(me.parent).selectAll("svg").remove();
        me.vis = d3.select(me.parent).append("svg:svg")
            .attr("viewBox", "0 0 " + me.w + " " + me.h)
            .attr("width", me.w)
            .attr("height", me.h)
            .append("svg:g")
            .attr("class", "all")
            //.attr("transform", "translate(0,0)")


            .call(d3.behavior.zoom()
                .x(me.x)
                .y(me.y)
                .scaleExtent([1, 4])
                .on("zoom", function () {
                    let drawing = me.vis.select("#storyboard");
                    drawing.attr("transform", function () {
                        return "translate(" + me.x(me.ax) + "," + me.y(me.ay) + ") ";
                    });
                })
            );

        me.back = me.vis.append("g")
            .attr("id", "storyboard");
        me.defs = me.vis.append('defs');
        me.defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 0)
            .attr('refY', 0)
            .attr('orient', 'auto-start-reverse')
            .attr('markerWidth', 9)
            .attr('markerHeight', 9)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 1,-1 l 3,1 -3,1 -1,-1 1,-1 M 5,-1 l  3,1 -3,1 -1,-1 1,-1   Z')
            .style('fill', me.draw_fill)
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '0pt');
        me.defs.append('marker')
            .attr('id', 'arrowlink')
            .attr('class', 'link')
            .attr('viewBox', '-0 -2 4 4')
            .attr('refX', 3)
            .attr('refY', 0)
            .attr('orient', 'auto-start-reverse')
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 1,-1 l 2,1 -2,1 Z')
            .style('fill', '#000')
            .style('stroke', '#888')
            .style('stroke-width', '0pt')

        ;
        me.back.append('rect')
            .attr('width', me.width)
            .attr('height', me.height)
            .style('fill', '#FFF')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '0')
            .attr('opacity', 0.5)
        ;
        // Grid
        if (me.debug) {
            let verticals = me.back.append('g')
                .attr('class', 'verticals')
                .selectAll("g")
                .data(d3.range(0, (me.width / me.stepx) / me.stepx, 1));
            verticals.enter()
                .append('line')
                .attr('x1', function (d) {
                    return d * me.stepx
                })
                .attr('y1', 0)
                .attr('x2', function (d) {
                    return d * me.stepx
                })
                .attr('y2', me.height - me.stepy)
                .style('fill', 'transparent')
                .style('stroke', '#CCC')
                .style('stroke-width', '0.25pt');
            let horizontals = me.back.append('g')
                .attr('class', 'horizontals')
                .selectAll("g")
                .data(d3.range(0, (me.height / me.stepy) / me.stepy, 1));
            horizontals.enter()
                .append('line')
                .attr('x1', 0)
                .attr('x2', me.width - me.stepx)
                .attr('y1', function (d) {
                    return d * me.stepy
                })
                .attr('y2', function (d) {
                    return d * me.stepy
                })
                .style('fill', 'transparent')
                .style('stroke', '#CCC')
                .style('stroke-width', '0.25pt');
        }
        me.drawTimeScale();
        me.drawPlaces();
        let lines = me.back.append('g');
        me.crossline(1, 1, (me.height / me.stepy) - 1);
        me.crossline((me.width / me.stepx) - 1, 1, (me.height / me.stepy) - 1);
        me.midline(2, 1, (me.width / me.stepx) - 1);
        me.midline((me.height / me.stepy) - 1, 1, (me.width / me.stepx) - 1);
        me.decorationText(1.25, 1.75, 0, 'start', me.title_font, me.large_font_size, me.draw_fill, me.draw_stroke, 0.5, "Story: " + me.story['name'], me.back);
        me.decorationText((me.width - me.stepx * 1.25) / me.stepx, 1.75, 0, 'end', me.title_font, me.large_font_size, me.draw_fill, me.draw_stroke, 0.5, "Chronicle: " + me.story['chronicle_id'], me.back);
        // Sheet content
        me.story_map = me.back.append('g')
            .attr('class', 'storytelling')
            .attr('id', 'storyboard');
    }

    drawLinks() {
        let me = this;
        d3.select('#storyboard').selectAll(".scenes_links").remove();
        let links = me.story_map.append('g')
            .attr('class', 'scenes_links')
            .selectAll("g.scene_links")
            .data(me.links);
        let link_in = links.enter();
        link_in.insert("svg:path", "g")
            .attr('class', 'link')
            .attr("d", function (d) {
                let x_in = d.xo + (d.order_out - 2.5) * 4;
                let x_out = d.xe + (d.order_in - 2.5) * 4;
                let midy = d.yo + 1 * Math.abs(d.yo - d.ye) / 5;
                let path = ""
                path += "M " + x_in + " " + d.yo + " ";
                path += "L " + x_in + " " + midy + " ";
                path += "L " + x_out + " " + midy + " ";
                path += "L " + x_out + " " + d.ye + " ";
                return path;
                // return me.diagonal({
                //      source: { x: x_out, y: d.ye },
                //      target: { x: x_in, y: d.yo }
                //  });
            })
            .style('fill', 'transparent')
            .style('stroke', function (d) {
                let color = "#111";
                if (d.category == "FRIEND") {
                    color = "#116";
                } else if (d.category == "FOE") {
                    color = "#611";
                } else if (d.category == "TIME") {
                    color = "#616";
                } else if (d.category == "FATE") {
                    color = "#166";
                }
                return color;
            })
            .attr('marker-end', "url(#arrowlink)")
            .style('stroke-width', '2pt')
            .attr('opacity', 1)
        let link_out = links.exit()
            .remove();
    }

    changeScenes(j) {
        let me = this;
        let changes = false;
        _.forEach(j, function (d) {
            _.forEach(me.scenes, function (e) {
                if (e.id == d.id) {
                    console.log(e);
                    console.log(e.time);
                    e.time = d.time;
                    console.log(e.time);
                    changes = true;
                }
            })
        })
        if (changes) {
            me.updateScenes();
            me.drawStory();
        }
    }

    drawStory() {
        let me = this;
        console.log(me.selected_scenes);
        me.drawLinks()
        d3.select(me.parent).selectAll(".scenes").remove();
        let scenes = me.story_map.append('g')
            .attr('class', 'scenes')
            .selectAll("g")
            .data(me.scenes);
        let scene_in = scenes.enter()
        scene_in.append("rect")
            .attr('id', function (d) {
                return "rect_scene__" + d.id;
            })
            .attr('x', function (d, i) {
                return d.x;
            })
            .attr('y', function (d, i) {
                return d.y;
            })
            .attr('width', me.scene_dim)
            .attr('height', me.scene_dim)
            .style('fill', function (d) {
               return d.is_event ? '#faa' : (d.is_downtime ?  '#aaf' : '#fff');
            })
            .style('stroke', function (d) {
                return d.selected ? '#FC4' : '#000';
            })
            .style('stroke-width', function (d) {
                return d.selected ? '2pt' : '2pt';
            })
            .attr('fill-opacity', 0.90)
        ;
        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_dim + 3;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_dim / 2);
            })
            .attr('dy', me.small_font_size / 3)
            .style("text-anchor", 'start')
            .style("font-family", me.mono_font)
            .style("font-size", me.small_font_size + 'px')
            .style("fill", "#fff")
            .style("stroke", "#fff")
            .style("stroke-width", '3pt')
            .text(function (d) {
                return d['name'];
            })
            .attr('opacity', 0.5)
        ;
        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_dim + 3;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_dim / 2);
            })
            .attr('dy', me.small_font_size / 3)
            .style("text-anchor", 'start')
            .style("font-family", me.mono_font)
            .style("font-size", me.small_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return d['name'];
            })
            .on("click", function (d) {
                if (d3.event.ctrlKey) {
                    d.selected = !d.selected;
                    let col = d.selected ? '#A22' : '#000';
                    if (d.selected) {
                        me.selected_scenes.push(d.id);
                    } else {
                        me.selected_scenes.pop(d.id);
                    }
                    me.drawStory();
                } else {
                    $.ajax({
                        url: 'ajax/view/scene/' + d.id + '/',
                        success: function (answer) {
                            $('.details').html(answer)
                            $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.log('View error...' + answer);
                        }
                    });
                }
            })

        ;
        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_dim / 2;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_dim / 2);
            })
            .attr('dy', me.tiny_font_size / 3)
            .style("text-anchor", 'middle')
            .style("font-family", me.mono_font)
            .style("font-size", me.tiny_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return d['time'];
            })
        ;
        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_dim+5;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_dim)*0;
            })
            .attr('dy',0)
            .style("text-anchor", 'start')
            .style("font-family", me.mono_font)
            .style("font-size", (me.tiny_font_size+2) + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                let k = d['story_time'];
                let res = new Date(k.year, k.month, k.day, k.hour, k.minute)
                let options = {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: false,
                    timeZone: 'Europe/Berlin'
                };

                return Intl.DateTimeFormat('de-DE',options).format(res);
            })
        ;

        let scene_out = scenes.exit().remove();
    }


    updateScenes() {
        let me = this;
        _.forEach(me.scenes, function (d, i) {

            d.y = me.p_start_y
                + me.stepy
                + Math.trunc(d['time'] / 24) * me.stepy * (me.day_start)
                + (d['time'] % 24) * me.hour;
            d.x = 0;
            _.forEach(me.places, function (e, i) {
                if (e['id'] == d['place']) {
                    d.x = (3 * me.scene_dim / 2) * (d['place_order'] - 1) + e.x;
                }
            })
        })
        me.updateLinks()
    }

    updateLinks() {
        let me = this;
        _.forEach(me.links, function (d) {
            d.xo = 0;
            d.yo = 0;
            d.xe = 0;
            d.ye = 0;
            _.forEach(me.scenes, function (s) {
                if (s.id == d.scene_from) {
                    d.xo = s.x + me.scene_dim / 2;
                    d.yo = s.y + me.scene_dim;
                }
                if (s.id == d.scene_to) {
                    d.xe = s.x + me.scene_dim / 2;
                    d.ye = s.y;
                }
            });
        });
    }

    updatePlaces(){
        let me = this;
        _.forEach(me.places, function (d, i) {
            d.x = me.p_start_x + i * (me.stepx * (3 + 1));
        })
    }

    perform(data) {
        let me = this;
        me.data = data;
        me.story = JSON.parse(data['story']);
        me.places = JSON.parse(data['places']);
        me.scenes = JSON.parse(data['scenes']);
        me.links = JSON.parse(data['links']);
        me.end_time = JSON.parse(data['end_time'])
        me.updatePlaces()
        me.updateScenes()
        me.story['places_count'] = Object.keys(me.places).length;
        me.init();
        me.drawWatermark()
        me.drawStory()

    }

}