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
        me.day_size = 6;
        me.day_start = me.day_size + 1;
        me.scene_dim = me.time_coeff * 8;
        me.scene_height = me.scene_dim / 2;
        me.scene_width = me.scene_dim;
        me.hour = (me.stepy * me.day_size) / 24;
        me.debug = true;
        me.place_width = 10;
        me.selected_scenes = []
        me.link_opacity = 0.5;
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
        me.width = (me.story['places_count'] * (me.place_width + 1) + 6) * me.stepx;
        me.height = ((Math.trunc(me.end_time / 24) + 4) * me.day_size) * me.stepy;
        console.log(me.height)
        me.w = parseInt($("body").css("width")) * 1;
        me.h = me.w * 0.52;

        //me.h = parseInt($("body").css("height")) * 0.90;
        me.tiny_font_size = me.time_coeff;
        me.small_font_size = 2 * me.time_coeff;
        me.medium_font_size = 3 * me.time_coeff;
        me.large_font_size = 4 * me.time_coeff;
        me.fat_font_size = 5 * me.time_coeff;

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
        // me.x = d3.scaleLinear().domain([0, me.w]).range([0, me.width]);
        // me.y = d3.scaleLinear().domain([0, me.h]).range([0, me.height]);
        me.pre_title = me.config['pre_title'];
        me.scenario = me.config['scenario'];
        me.post_title = me.config['post_title'];
        me.ax = 0;
        me.ay = 0;
    }

    drawTimeScale() {
        let me = this;
        let days_count = (me.end_time / 24);
        let days = me.back.append('g')
            .attr('class', 'days')
            .selectAll("g")
            .data(d3.range(0, days_count, 1));
        let day_in = days.enter()
        day_in.append('rect')
            .attr('class', 'day_rect')
            .attr('rx', 25)
            .attr('ry', 25)
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
                return me.stepy * me.day_size;
            })
            .style('fill', '#0F0')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.05')
        ;
        day_in.append('rect')
            .attr('class', 'day_rect_morning')
            .attr('rx', 25)
            .attr('ry', 25)
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
                return (me.day_size / 24) * 6.5 * me.stepy;
            })
            .style('fill', '#CCC')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.1')
        ;
        day_in.append('rect')
            .attr('class', 'day_rect_evening')
            .attr('rx', 25)
            .attr('ry', 25)
            .attr('x', function (d) {
                return me.d_start_x + 0;
            })
            .attr('y', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start)) + (me.day_size / 24) * 19.5 * me.stepy;
            })
            .attr('width', function (d) {
                return me.width - me.stepx * 5;
            })
            .attr('height', function (d) {
                return (me.day_size / 24) * 4.5 * me.stepy;
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
                return me.d_start_y + d * (me.stepy * (me.day_start)) + (me.day_size / 24) * 12 * me.stepy;
            })
            .attr('x2', function (d) {
                return me.d_start_x + me.width - me.stepx * 5;
            })
            .attr('y2', function (d) {
                return me.d_start_y + d * (me.stepy * (me.day_start)) + (me.day_size / 24) * 12 * me.stepy;
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
            .attr('rx', 25)
            .attr('ry', 25)
            .attr('x', function (d, i) {
                return me.p_start_x + i * (me.stepx * (me.place_width + 1));
            })
            .attr('y', function (d) {
                return me.p_start_y + 0;
            })
            .attr('width', function (d) {
                return me.place_width * me.stepx;
            })
            .attr('height', function (d) {
                let days_count = (me.end_time / 24);
                return me.stepy * ((days_count + 1) * (me.day_size + 1));
            })
            .style('fill', '#00F')
            .style('stroke', 'transparent')
            .style('stroke-width', '0.25pt')
            .attr('opacity', '0.05')
        ;
        place_in.append('text')
            .attr('class', 'place_txt')
            .attr('x', function (d, i) {
                return me.p_start_x + i * (me.stepx * (me.place_width + 1));
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
                return d['acronym'];
            })
        ;
        place_in.append('text')
            .attr('class', 'place_txt')
            .attr('x', function (d, i) {
                return me.p_start_x + i * (me.stepx * (me.place_width + 1));
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
        me.vis = d3.select(me.parent).append("svg")
            .attr("viewBox", "0 0 " + me.w + " " + me.h)
            .attr("width", me.w)
            .attr("height", me.h)
        ;
        me.svg = me.vis.append("g")
            .attr("class", "all")
            .attr("transform", "translate(0,0)")
        ;

        me.back = me.svg.append("g")
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
            .attr('viewBox', '0 -2 4 4')
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
            .style('stroke', 'transparent')
            .style('stroke-width', '0pt')
            .style('opacity', 1.0)
        ;
        me.defs.append('marker')
            .attr('id', 'arrowtail')
            .attr('class', 'link')
            .attr('viewBox', '-2 -2 4 4')
            .attr('refX', 3)
            .attr('refY', 0)
            .attr('orient', 'auto-start-reverse')
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 1,1 l 1,0 0,-2 -1,0 Z')
            .style('fill', '#000')
            .style('stroke', 'transparent')
            .style('stroke-width', '0pt')
            .style('opacity', 1.0)
        ;

        me.back.append('rect')
            .attr('width', me.width)
            .attr('height', me.height)
            .style('fill', '#FFF')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '0')
            .attr('opacity', 1.0)
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
        link_in.insert("path", "g")
            .attr('class', function (d) {
                return 'link ' + 'linked_' + d.scene_from + ' linked_' + d.scene_to;
            })
            .attr('id', function (d) {
                return 'link_' + d.id;
            })
            .attr("d", function (d) {
                let is_time_flat = Math.abs(d.xo - d.xe) > Math.abs(d.yo - d.ye);
                let x_in = d.xo + (d.order_out - 2) * 16;
                let x_mid = d.xe + 1 * Math.abs(d.xo - d.xe) / 5;
                let x_out = d.xe + (d.order_in - 2) * 16;
                let y_in = d.yo;
                let y_mid1 = d.yo + 7.5 * Math.abs(d.yo - d.ye) / 15;
                let y_mid2 = d.ye - 7.5 * Math.abs(d.yo - d.ye) / 15;
                let y_out = d.ye;
                let x_middle = d.xe - 1 * Math.abs(d.xo - d.xe) / 15;
                let y_middle1 = d.yo + 1 * Math.max(Math.abs(d.yo - d.ye) / 3, 25);
                let y_middle2 = d.ye - 1 * Math.max(Math.abs(d.yo - d.ye) / 3, 25);
                let path = ""
                if (is_time_flat) {
                    path += "M " + x_in + " " + y_in + " ";
                    path += "L " + x_in + " " + (y_middle1) + " ";
                    // path += "  " + x_mid + " " + y_mid1 + " ";
                    // path += "  " + x_mid + " " + y_mid2 + " ";
                    path += "  " + x_out + " " + (y_middle2) + " ";
                    path += "  " + x_out + " " + y_out + " ";

                } else {
                    path += "M " + x_in + " " + y_in + " ";
                    path += "L " + x_in + " " + y_mid1 + " ";
                    // path += "  " + x_mid + " " + y_mid1 + " ";
                    // path += "  " + x_mid + " " + y_mid2 + " ";
                    path += "  " + x_out + " " + y_mid2 + " ";
                    path += "  " + x_out + " " + y_out + " ";
                }
                return path;
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
            .attr('marker-start', "url(#arrowtail)")
            .attr('marker-end', "url(#arrowlink)")
            .style('stroke-width', '3pt')
            .attr('opacity', me.link_opacity)
            .on('click', function (e, d) {
                if (e.ctrlKey) {
                    me.centerNode(d.xo, d.yo);
                } else {
                    me.centerNode(d.xe, d.ye);
                }
            })
        ;
        let link_out = links.exit()
            .remove();
    }

    changeScenes(j) {
        let me = this;
        let changes = false;
        _.forEach(j, function (d) {
            _.forEach(me.scenes, function (e) {
                if (e.id == d.id) {
                    e.time = d.time;
                    changes = true;
                }
            })
        })
        if (changes) {
            me.updateScenes();
            me.drawStory();
            me.vis.call(zoom);
        }
    }

    drawStory() {
        let me = this;
        me.drawLinks()
        d3.select(me.parent).selectAll(".scenes").remove();
        let scenes = me.story_map.append('g')
            .attr('class', 'scenes')
            .selectAll("g")
            .data(me.scenes);
        let scene_in = scenes.enter()

        scene_in.append("rect")
            .attr('id', function (d) {
                return "rect_scene_timeline__" + d.id;
            })
            .attr('class', function (d) {
                return d.timeline_name;
            })
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('x', function (d, i) {
                return d.x - 20;
            })
            .attr('y', function (d, i) {
                return d.y;
            })
            .attr('width', 15 )
            .attr('height', me.scene_height)
            .style('stroke', "#CCC")
            .style('stroke-width', "1pt")
            .attr('fill-opacity', 0.90)
            ;

        scene_in.append("rect")
            .attr('id', function (d) {
                return "rect_scene__" + d.id;
            })
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('x', function (d, i) {
                return d.x;
            })
            .attr('y', function (d, i) {
                return d.y;
            })
            .attr('width', me.scene_width)
            .attr('height', me.scene_height)
            .style('fill', function (d) {
                return d.is_event ? '#faa' : (d.is_downtime ? '#aaf' : '#fff');
            })
            .style('stroke', function (d) {
                return d.selected ? '#FC4' : '#000';
            })
            .style('stroke-width', function (d) {
                return d.selected ? '2pt' : '2pt';
            })
            .attr('fill-opacity', 0.90)
            .on('mouseover', function (e, d) {
                if (e.ctrlKey) {
                    d3.selectAll('.link')
                        .attr('opacity', 0)
                    ;
                    d3.selectAll('.linked_' + d.id)
                        .attr('opacity', 1.0)
                    ;
                }
            })
            .on('mouseout', function (e, d) {
                d3.selectAll('.link')
                    .attr('opacity', me.link_opacity)
                ;
            })
        ;
        scene_in.append("circle")
            .attr('id', function (d) {
                return "rect_tagup__" + d.id;
            })
            .attr('cx', function (d, i) {
                return d.x + 10;
            })
            .attr('cy', function (d, i) {
                return d.y + 10;
            })
            .attr('r', 4)
            .style('fill', "#DC6")
            .style('stroke', "#000")
            .style('stroke-width', '1pt')
            .attr('fill-opacity', 0.90)
            .on('click', function (e, d) {
                // if (e.ctrlKey) {
                // console.log("One hour in the past...")
                $.ajax({
                    url: 'ajax/action/time_slip/m0d_m1h__' + d.id + '/',
                    success: function (answer) {
                        let d = JSON.parse(answer["changes_on_scenes"])
                        me.changeScenes(d);
                        // me.centerNode(d.x,d.y);
                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error(answer);
                        me.rebootLinks();
                    },
                });
                // }
            })
        ;
        scene_in.append("circle")
            .attr('id', function (d) {
                return "rect_tagddydown__" + d.id;
            })
            .attr('cx', function (d, i) {
                return d.x + 20;
            })
            .attr('cy', function (d, i) {
                return d.y + 10;
            })
            .attr('r', 4)
            .style('fill', "#DC6")
            .style('stroke', "#000")
            .style('stroke-width', '1pt')
            .attr('fill-opacity', 0.90)
            .on('click', function (e, d) {
                // if (e.ctrlKey) {
                // console.log("One day in the past...")
                $.ajax({
                    url: 'ajax/action/time_slip/m1d_p0h__' + d.id + '/',
                    success: function (answer) {
                        let d = JSON.parse(answer["changes_on_scenes"])
                        me.changeScenes(d);
                        // me.centerNode(d.x,d.y);
                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error(answer);
                        me.rebootLinks();
                    },
                });
                // }
            })
        ;

        scene_in.append("circle")
            .attr('id', function (d) {
                return "rect_tagdown__" + d.id;
            })
            .attr('cx', function (d, i) {
                return d.x + 10;
            })
            .attr('cy', function (d, i) {
                return d.y - 10 + me.scene_height;
            })
            .attr('r', 4)
            .style('fill', "#DC2")
            .style('stroke', "#000")
            .style('stroke-width', '1pt')
            .attr('fill-opacity', 0.90)
            .on('click', function (e, d) {
                // if (e.ctrlKey) {
                // console.log("One hour in the future...")
                $.ajax({
                    url: 'ajax/action/time_slip/m0d_p1h__' + d.id + '/',
                    success: function (answer) {
                        let d = JSON.parse(answer["changes_on_scenes"])
                        me.changeScenes(d);
                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error(answer);
                        me.rebootLinks();
                    },
                });
                // }
            })
        ;
        scene_in.append("circle")
            .attr('id', function (d) {
                return "rect_tagdaydown__" + d.id;
            })
            .attr('cx', function (d, i) {
                return d.x + 20;
            })
            .attr('cy', function (d, i) {
                return d.y - 10 + me.scene_height;
            })
            .attr('r', 4)
            .style('fill', "#DC6")
            .style('stroke', "#000")
            .style('stroke-width', '1pt')
            .attr('fill-opacity', 0.90)
            .on('click', function (e, d) {
                // if (e.ctrlKey) {
                // console.log("One day in the future...")
                $.ajax({
                    url: 'ajax/action/time_slip/p1d_p0h__' + d.id + '/',
                    success: function (answer) {
                        let d = JSON.parse(answer["changes_on_scenes"])
                        me.changeScenes(d);
                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error(answer);
                        me.rebootLinks();
                    },
                });
                // }
            })
        ;


        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_width + 5;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_height / 2);
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
                return d.x + me.scene_width + 5;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_height / 2);
            })
            .attr('dy', me.small_font_size / 3)
            .style("text-anchor", 'start')
            .style("font-family", me.mono_font)
            .style("font-size", me.small_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return d['name'];//+" "+d.x+" / "+d.y;
            })
            .on("click", function (e, d) {
                if (e.ctrlKey) {
                    d.selected = !d.selected;
                    let col = d.selected ? '#A22' : '#000';
                    // if (d.selected) {
                    //     me.selected_scenes.push(d.id);
                    // } else {
                    //     me.selected_scenes.pop(d.id);
                    // }
                    // me.drawStory();
                    me.centerNode(d.x, d.y);
                    me.co.rebootLinks();
                } else {
                    $.ajax({
                        url: 'ajax/view/scene/' + d.id + '/',
                        success: function (answer) {
                            $('.details').html(answer)
                            $('.details').removeClass('hidden');
                            me.co.rebootLinks();
                        },
                        error: function (answer) {
                            console.error('View error...' + answer);
                            me.co.rebootLinks();
                        }
                    });
                }
            })

        ;
        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_width / 2;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_height / 2);
            })
            .attr('dy', me.small_font_size / 3)
            .style("text-anchor", 'start')
            .style("font-family", me.mono_font)
            .style("font-size", me.small_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                return String(d['time']).padStart(3, '0');
            })
        ;
        scene_in.append('text')
            .attr('class', 'scene_txt')
            .attr('x', function (d, i) {
                return d.x + me.scene_dim + 5;
            })
            .attr('y', function (d) {
                return d.y + (me.scene_dim) * 0;
            })
            .attr('dy', me.tiny_font_size)
            .style("text-anchor", 'start')
            .style("font-family", me.mono_font)
            .style("font-size", (me.tiny_font_size + 2) + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                let k = d['story_time'];
                let res = new Date(k.year, k.month - 1, k.day, k.hour, k.minute)
                let options = {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: false,
                    timeZone: 'Europe/Berlin'
                }
                let new_d = Intl.DateTimeFormat('de-DE', options).format(res);
                return new_d + " [Sc:" + String(d.id).padStart(4, '0') + "]";
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
                + (d['time'] % 24) * me.hour
                - me.scene_height / 2;
            d.x = 0;
            _.forEach(me.places, function (e, i) {
                if (e['id'] == d['place']) {
                    d.x = (me.scene_width * 2) * (d['place_order'] - 3) + e.x + (me.stepx * me.place_width) / 2 - me.scene_width / 2;
                }
            })
            d.timeline_name = 'timeline';
            _.forEach(me.timelines, function (e, i) {
                // console.log(d['timeline'])
                // console.log(e['label'])
                if (e['label'] == d['timeline']) {
                    d.timeline_name = e['name'];
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
                    d.xo = s.x + me.scene_width / 2;
                    d.yo = s.y + me.scene_height;
                }
                if (s.id == d.scene_to) {
                    d.xe = s.x + me.scene_width / 2;
                    d.ye = s.y;
                }
            });
        });
    }

    updatePlaces() {
        let me = this;
        _.forEach(me.places, function (d, i) {
            d.x = me.p_start_x + i * (me.stepx * (me.place_width + 1));
        })
    }

    centerNode(x, y) {
        let me = this;
        me.svg
            .transition()
            .duration(750)
            .call(me.zoom.scaleTo, 0.5)

            .transition()
            .duration(750)
            .call(me.zoom.translateTo, x + me.w / 4, y + me.h / 4)

            .transition()
            .duration(750)
            .call(me.zoom.scaleBy, 2)
        ;

    }


    centerToScene(id) {
        let me = this;
        _.forEach(me.scenes, function (e) {
            if (e.id == id) {
                me.centerNode(e.x, e.y);
            }
        })

    }

    zoomActivate() {
        let me = this;
        me.zoom = d3.zoom()
            .scaleExtent([0.25, 4])
            .on('zoom', function (event) {
                me.svg.attr('transform', event.transform)
            });
        me.vis.call(me.zoom);
    }

    perform(data) {
        let me = this;
        me.data = data;
        me.story = JSON.parse(data['story']);
        me.places = JSON.parse(data['places']);
        me.scenes = JSON.parse(data['scenes']);
        me.timelines = JSON.parse(data['timelines']);
        me.links = JSON.parse(data['links']);
        me.end_time = JSON.parse(data['end_time'])

        console.log('yo')

        me.updatePlaces()
        me.updateScenes()
        me.story['places_count'] = Object.keys(me.places).length;
        me.init();
        me.drawWatermark()
        me.drawStory()

        me.zoomActivate()
    }

}