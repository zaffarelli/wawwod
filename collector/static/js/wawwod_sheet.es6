class WawwodSheet {
    constructor(data, parent, collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.config = data;
        me.count = 0;
        me.mark_overhead = false
        me.disposition = "portrait"
        me.button_ox = 1;
        me.button_oy = 1;

    }

  setButtonsOrigin(x, y) {
        let me = this;
        me.button_ox = x;
        me.button_oy = y;
  }

 drawLine(x1 = 1, x2 = 23, y1 = 1, y2 = 35, fill = '#000000', stroke = '#888888', size = 1, dasharray = "", opacity = 1) {
        let me = this;
        if (!me.daddy) {
            console.error('Daddy is undefined for drawLine !')
        } else {
            me.daddy.append('line')
                .attr('x1', me.stepx * x1)
                .attr('x2', me.stepx * x2)
                .attr('y1', me.stepy * y1)
                .attr('y2', me.stepy * y2)
                .style('fill', fill)
                .style('stroke', stroke)
                .style('stroke-width', size + 'pt')
                .style('stroke-dasharray', dasharray)
                .style('stroke-linecap', 'round');
        }
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

    sheet_type(str) {
        let res = "";
        switch (str) {
            case "garou":
                res = "Werewolf"
                break;
            case "fomori":
                res = "Fomori"
                break;
            case "kinfolk":
                res = "Kinfolk";
                break;
            case "changeling":
                res = "Changeling";
                break;7
            case "ghoul":
                res = "Ghoul";
                break;
            case "wraith":
                res = "Wraith";
                break;
            case "mage":
                res = "Mage";
                break;
            case "kindred":
                res = "Vampire";
                break;
            default:
                res = "Mortal";
        }
        return res;
    }

    init() {
        let me = this;
        me.debug = false
        me.blank = false
        me.page = 0;
        if (me.disposition == "portrait"){
            me.width = parseInt($(me.parent).css("width"), 10) * 0.75;
            me.height = me.width * 1.4;
            me.width_span = 24
            me.height_span = 36
            me.w = 1.25 * me.width;
            me.h = 1.25 * me.height;
            me.stepx = me.width / 24;
            me.stepy = me.height / 36;

            me.small_font_size = 1.3 * me.stepy / 5;
            me.medium_font_size = 1.7 * me.stepy / 5;
            me.big_font_size = 2 * me.stepy / 5;
            me.fat_font_size = 8 * me.stepy / 5;
        }else{
            me.height = parseInt($(me.parent).css("width"), 10) * 0.75
            me.width = me.height * 1.4
            me.width_span = 36
            me.height_span = 24
            me.w = 1.25 * me.width
            me.h = 1.25 * me.height
            me.stepx = me.width / 36
            me.stepy = me.height / 24
            me.small_font_size = 1.3 * me.stepy / 5;
            me.medium_font_size = 1.7 * me.stepy / 5;
            me.big_font_size = 1 * me.stepy / 5;
            me.fat_font_size = 4 * me.stepy / 5;
        }
        me.tiny_font_size = me.small_font_size*0.75;

        me.margin = [0, 0, 0, 0]
        me.dot_radius = me.stepx / 8
        me.stat_length = 150
        me.stat_max = 5
        me.shadow_fill = "#B0B0B07F"
        me.shadow_stroke = "#A0A0A07F"
        me.draw_stroke = '#888'
        me.draw_fill = '#222'
        me.user_stroke = '#286'
        me.user_fill = '#143'
        me.overhead_fill = '#C22'
        me.user_font = 'Gochi Hand'
        //me.user_font = 'Whisper'
        me.mono_font = 'Syne Mono'
        me.creature_font = 'Trade Winds'
        me.title_font = 'Khand'
        //me.title_font = 'Trade Winds';
        me.logo_font = 'Splash';
        me.base_font = 'Philosopher';
        me.x = d3.scaleLinear().domain([0, me.width]).range([0, me.width]);
        me.y = d3.scaleLinear().domain([0, me.height]).range([0, me.height]);
        me.pre_title = me.config['pre_title'];
        me.scenario = me.config['scenario'];
        me.post_title = me.config['post_title'];
        me.health_levels = ['Bruised/X', 'Hurt/-1', 'Injured/-1', 'Wounded/-2', 'Mauled/-2', 'Crippled/-5', 'Incapacitated/X'];
    }

    midline(y, startx = 2, stopx = 22) {
        let me = this;
        me.back.append('line')
            .attr('x1', me.stepx * startx)
            .attr('x2', me.stepx * stopx)
            .attr('y1', me.stepy * y)
            .attr('y2', me.stepy * y)
            .style('fill', 'none')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '3pt')
            .attr('marker-end', "url(#arrowhead)")
            .attr('marker-start', "url(#arrowhead)")
        ;
    }

    crossline(x, starty = 2, stopy = 35) {
        let me = this;
        me.back.append('line')
            .attr('x1', me.stepx * x)
            .attr('x2', me.stepx * x)
            .attr('y1', me.stepy * starty)
            .attr('y2', me.stepy * stopy)
            .style('fill', 'none')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '3pt')
            .attr('marker-end', "url(#arrowhead)")
            .attr('marker-start', "url(#arrowhead)")
        ;
    }


    drawWatermark() {
        let me = this;
        d3.select(me.parent).selectAll("svg").remove();
        // me.svg = d3.select(me.parent).append("svg")
        //     .attr("id", me.data['rid'])
        //     .attr("viewBox", "0 0 " + me.w + " " + me.h)
        //     .attr("width", me.width)
        //     .attr("height", me.height)
        //     .append("svg:g")
        //     .attr("transform", "translate(0,0)")
        // .call(d3.behavior.zoom().x(me.x).y(me.y).scaleExtent([2, 8]).on("zoom", function(e){
        //     })
        // )
        // ;
        // d3.select(me.parent).selectAll("svg").remove();
        me.vis = d3.select(me.parent).append("svg")
            .attr("id", me.data['rid'])
            .attr("viewBox", "0 0 " + me.w + " " + me.h)
            .attr("width", me.w)
            .attr("height", me.h)
        ;
        me.svg = me.vis.append("g")
            .attr("class", "all")
            .attr("transform", "translate(0,0)")
        ;
        me.back = me.svg
            .append("g")
            .attr("class", "page")
            .attr("transform", "translate(" + 0 * me.stepx + "," + 0 * me.stepy + ")")
        ;
        me.defs = me.svg.append('defs');
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
            .style('stroke-width', '0pt')
        ;
        me.back.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', me.width)
            .attr('height', me.height)
            .style('fill', 'white')
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '0')
            .attr('opacity', 1.0)
        ;
        // Grid
        if (me.debug) {
            let verticals = me.back.append('g')
                .attr('class', 'verticals')
                .selectAll("g")
                .data(d3.range(0, me.width_span, 1));
            verticals.enter()
                .append('line')
                .attr('x1', function (d) {
                    return d * me.stepx
                })
                .attr('y1', 0)
                .attr('x2', function (d) {
                    return d * me.stepx
                })
                .attr('y2', me.height_span * me.stepy)
                .style('fill', 'none')
                .style('stroke', '#CCC')
                .style('stroke-width', '0.25pt');
            let horizontals = me.back.append('g')
                .attr('class', 'horizontals')
                .selectAll("g")
                .data(d3.range(0, me.height_span, 1));
            horizontals.enter()
                .append('line')
                .attr('x1', 0)
                .attr('x2', me.width_span * me.stepx)
                .attr('y1', function (d) {
                    return d * me.stepy
                })
                .attr('y2', function (d) {
                    return d * me.stepy
                })
                .style('fill', 'none')
                .style('stroke', '#CCC')
                .style('stroke-width', '0.25pt');
        }

        // Sheet content
        me.character = me.back.append('g')
            .attr('class', 'xover_sheet');

        me.drawPages();
    }

    reinHagenStat(name, value, ox, oy, type, statcode, source, power = false, maxo=10) {
        let me = this;
        let item = source.append('g')
            .attr('class', type);
        item.append('rect')
            .attr('x', ox)
            .attr('y', oy)
            .attr('width', me.stat_length * 1.6)
            .attr('height', 18)
            .style('fill', '#FFF')
            .style('stroke', 'none')
            .style('stroke-width', '0.5pt')
        ;

        item.append('line')
            .attr('x1', function (d, i) {
                return ox;
            })
            .attr('y1', function (d, i) {
                return oy + 9;
            })
            .attr('x2', function (d, i) {
                return ox + me.stepx * 4.75;
            })
            .attr('y2', function (d, i) {
                return oy + 9;
            })
            .style("fill", me.draw_fill)
            .style("stroke", me.shadow_stroke)
            .style("stroke-width", '1.0pt')
            .style("stroke-dasharray", '2 7')
        ;


        item.append('text')
            .attr("x", ox)
            .attr("y", oy)
            .attr("dy", 10)
            .style("text-anchor", 'start')
            .style("font-family", function () {
                return (power ? me.user_font : me.base_font);
                //return (power ? 'NothingYouCouldDo' : 'Titre');
            })
            .style("font-size", me.medium_font_size + 'px')
            .style("fill", function () {
                return (power ? me.user_fill : me.draw_fill);
            })
            .style("stroke", function () {
                return (power ? me.user_stroke : me.draw_stroke);
            })
            .style("stroke-width", '0.5pt')
            .text(function () {
                return name.charAt(0).toUpperCase() + name.slice(1);
            })
        if (me.blank) {
            value = 0;
        }
        let max = me.stat_max;
        if (value > me.stat_max) {
            max = me.stat_max * 2;
        }

        let dots = item.append('g')
            .attr('class', 'dots ' + type)
            .selectAll("g")
            .data(d3.range(0, max, 1));
        dots.enter()
            .append('circle')
            .attr('cx', function (d) {
                let cx = ox + me.stepx * 5 + (d % me.stat_max) * ((me.dot_radius) * 2);
//                 if (d>=me.stat_max){
//                     cx = ox+me.stepx*4+(d%me.stat_max)*((me.dot_radius)*2);
//                 }
                return cx;
            })
            .attr('cy', function (d) {
                let cy = oy + me.dot_radius / 2;
                if (max > me.stat_max) {
                    cy -= me.dot_radius;
                }

                if (d >= me.stat_max) {
                    cy += +me.dot_radius / 2 + 2;
                }
                return cy;
            })
            .attr('r', function (d) {
                return (d >= me.stat_max ? me.dot_radius - 2 : me.dot_radius - 2);
            })
            .style('fill', function (d) {
                let color = "white"
                if (me.mark_overhead){
                    color = (d < value ? (d <= maxo-1 ? me.user_fill:me.overhead_fill  ) : "white")
                }else{
                    color = (d < value ? me.user_fill : "white")
                }
                return color;
            })
            .style('stroke', function (d) {
                return me.draw_stroke;
            })
            .style('stroke-width', '1.5pt')
        ;
    }

    drawPages() {
        let me = this;
    }

    powerStat(name, ox, oy, type, statcode, source) {
        let me = this;
        if (me.blank) {
        } else {
            if (name == '') {
                me.reinHagenStat('   ', 0, ox, oy, type, statcode, source)
            } else {
                let words = name.split(' (');
                let power = words[0];
                let val = (words[1].split(')'))[0];
                if (type == 'flaw') {
                    power = power + ' -F-'
                }
                me.reinHagenStat(power, val, ox, oy, type, statcode, source, power = true)
            }
        }
    }


    statText(name, value, ox, oy, type, statcode, source, fat = false, mono = false) {
        let me = this;
        let item = source.append('g')
            .attr('class', type);
        item.append('rect')
            .attr('x', ox)
            .attr('y', oy)
            .attr('width', me.stat_length * 1.6)
            .attr('height', 18)
            .style('fill', 'none')
            .style('stroke', 'none')
            .style('stroke-width', '0.5pt')
        ;
        item.append('line')
            .attr('x1', function (d, i) {
                return ox;
            })
            .attr('y1', function (d, i) {
                return oy + 9;
            })
            .attr('x2', function (d, i) {
                return ox + me.stepx * 6;
            })
            .attr('y2', function (d, i) {
                return oy + 9;
            })
            .style("fill", me.draw_fill)
            .style("stroke", me.shadow_stroke)
            .style("stroke-width", '1.5pt')
            .style("stroke-dasharray", '2 7')
        ;

        if (me.blank) {
            value = "";
        }

        item.append('text')
            .attr("x", ox)
            .attr("y", oy)
            .attr("dy", 10)
            .style("text-anchor", 'start')
            .style("font-family", me.base_font)
            .style("font-size", me.medium_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function () {
                return name.charAt(0).toUpperCase() + name.slice(1);
            });

        if (fat) {
            item.append('text')
                .attr("x", ox + me.stepx * 6)
                .attr("y", oy)
                .attr("dy", 10)
                .style("text-anchor", 'end')
                .style("font-family", function (d) {
                    return (mono == true ? me.mono_font : me.user_font);
                })
                .style("font-size", (me.medium_font_size * 1.25) + 'px')
                .style("fill", me.user_fill)
                .style("stroke", me.user_stroke)
                .style("stroke-width", '0.5pt')
                .text(function () {
                    return value;
                });
        } else {
            item.append('text')
                .attr("x", ox + me.stepx * 6)
                .attr("y", oy)
                .attr("dy", 10)
                .style("text-anchor", 'end')
                .style("font-family", function (d) {
                    return (mono == true ? me.mono_font : me.user_font);
                })
                .style("font-size", me.medium_font_size + 'px')
                .style("fill", me.user_fill)
                .style("stroke", me.user_stroke)
                .style("stroke-width", '0.5pt')
                .text(function () {
                    return value;
                });
        }
    }

    smallText(data,ox, oy, source){
        let me = this;
        let item = source.append('g')
            .attr("transform",`translate(${ox},${oy})`)
        let lines = data.split("\n")
        let txt = item.append('text')
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", me.small_font_size + 'pt')
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.small_font_size + 'pt')
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.5pt')
        _.forEach(lines, (v,k) => {
            txt.append("tspan")
                .attr("x",0)
                .attr("y",0)
                .attr("dy",10*k+"pt")
                .text(v)
            })

    }

    title(name, ox, oy, source) {
        let me = this;
        let item = source.append('g');
        item.append('text')
            .attr("x", ox)
            .attr("y", oy)
            .attr("dy", 10)
            .style("text-anchor", 'middle')
            .style("font-family", me.title_font)
            .style("font-size", me.big_font_size + 'px')
            .style("fill", '#111')
            .style("stroke", '#888')
            .style("stroke-width", '0.5pt')
            .text(function () {
                return name.charAt(0).toUpperCase() + name.slice(1);
            })

    }

    gaugeStat(name, value, ox, oy, source, withTemp = false, automax = false, max = 10) {
        let me = this;
        let type = name;
        let item = source.append('g');
        let lines = 1;
        let tempmax = max;

        item.append('text')
            .attr("x", ox)
            .attr("y", oy)
            .attr("dy", 5)
            .style("text-anchor", 'middle')
            .style("font-family", me.title_font)
            .style("font-size", me.big_font_size + 'px')
            .style("fill", '#111')
            .style("stroke", '#888')
            .style("stroke-width", '0.5pt')
            .text(function () {
                return name.charAt(0).toUpperCase() + name.slice(1);
            });
        if (automax) {
            tempmax = (Math.round(value / 10) + 1) * 10;
        }else{
            tempmax = max;
        }
        lines = tempmax / 10;
        if (me.blank) {
            value = 0;
        }

        let dots = item.append('g')
            .attr('class', 'dots ' + type)
            .selectAll("g")
            .data(d3.range(0, tempmax, 1));
        let dot = dots.enter();
        dot.append('circle')
            .attr('cx', function (d) {
                let cx = ox + (((d % 10)) - 4.5) * ((me.dot_radius * 2 + 1) * 2);
//                 if (d>=10){
//                     cx = ox+((d-10)-4.5)*((me.dot_radius+1)*2);
//                 }
                return cx;
            })
            .attr('cy', function (d) {
                let cy = oy + 0.2 * me.stepx + me.dot_radius;
                //if (d >= 10) {
                    cy += me.dot_radius * (2.2 * Math.floor(d/10))
                //}
                return cy;
            })
            .style('fill', function (d) {
                return (d < value ? me.user_fill : "white");
            })
            .attr('r', me.dot_radius)
            .style('stroke', me.draw_stroke)
            .style('stroke-width', '1pt')
        ;
        dot.append('rect')
            .attr('x', function (d) {
                let cx = ox + ((d % 10) - 4.5) * ((me.dot_radius * 2 + 1) * 2) - me.dot_radius;
                return cx;
            })
            .attr('y', function (d) {
                let cy = oy + 0.2 * me.stepx + me.dot_radius - me.dot_radius + (me.dot_radius * 2 + 2) * lines + 2;
                if (d >= 10) {
                    cy += me.dot_radius * 2 + 5;
                }
                return cy;
            })
            .attr('width', me.dot_radius * 2)
            .attr('height', me.dot_radius * 2)
            .style('fill', function (d) {
                return (withTemp ? 'white' : 'none');
            })
            .style('stroke', function (d) {
                return (withTemp ? me.draw_stroke : 'none');
            })
            .style('stroke-width', '0.5pt')
        ;

    }

    fillAttributes(basey) {
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = 'attribute';

        oy -= 0.5 * me.stepy;

        me.statText('Name', me.data['name'], ox + me.stepx * 2, oy, 'name', 'name', me.character, true);
        me.statText('Nature', me.data['nature'], ox + me.stepx * 9, oy, 'nature', 'nature', me.character);
        if (me.data["creature"] == 'kindred') {
            me.statText('Age/R(E)', me.data['age'] + "/" + me.data['trueage'] + " (" + me.data['embrace'] + "A.D)", ox + me.stepx * 16, oy, 'age', 'age', me.character);
        } else {
            me.statText('Age', me.data['age'], ox + me.stepx * 16, oy, 'age', 'age', me.character);
        }
        oy += 0.5 * me.stepy;
        if (me.data['player'] == '') {
            me.statText('Player', "Storyteller Character", ox + me.stepx * 2, oy, 'player', 'player', me.character);
        } else {
            me.statText('Player', me.data['player'], ox + me.stepx * 2, oy, 'player', 'player', me.character);
        }
        me.statText('Demeanor', me.data['demeanor'], ox + me.stepx * 9, oy, 'demeanor', 'demeanor', me.character);
        me.statText('Sex', (me.data['sex'] ? 'male' : 'female'), ox + me.stepx * 16, oy, 'sex', 'sex', me.character);

        oy += 0.5 * me.stepy;
        me.statText('Chronicle', me.data['chronicle_name'], ox + me.stepx * 2, oy, 'chronicle', 'chronicle', me.character);
        if (me.data["creature"] == 'kindred') {
            me.statText('Position', me.data['position'], ox + me.stepx * 9, oy, 'group', 'group', me.character);
        } else {
            me.statText('Residence', me.data['residence'], ox + me.stepx * 9, oy, 'group', 'group', me.character);
        }
        me.statText('Concept', me.data['concept'], ox + me.stepx * 16, oy, 'concept', 'concept', me.character);

        oy += 0.5 * me.stepy;
        me.statText('Creature', me.data['creature'].charAt(0).toUpperCase() + me.data['creature'].slice(1), ox + me.stepx * 2, oy, 'chronicle', 'chronicle', me.character);

        if (me.data["creature"] == 'kindred') {
            if (me.data["faction"] == 'Sabbat') {
                me.statText('Pack', me.data['groupspec'], ox + me.stepx * 9, oy, 'group', 'group', me.character);
            } else {
                me.statText('Coterie', me.data['groupspec'], ox + me.stepx * 9, oy, 'group', 'group', me.character);
            }
            me.statText('Clan', me.data['family'], ox + me.stepx * 16, oy, 'concept', 'concept', me.character);
        } else if (me.data["creature"] == 'garou') {
            me.statText('Pack', me.data['groupspec'], ox + me.stepx * 9, oy, 'group', 'group', me.character);
            me.statText('Totem', me.data['sire'], ox + me.stepx * 16, oy, 'concept', 'concept', me.character);
        } else if (me.data["creature"] == 'kinfolk') {
            me.statText('Garou', me.data['edge_for'], ox + me.stepx * 9, oy, 'Garou', 'edge_for', me.character);
        }

        if (me.data["creature"] == 'kindred') {
            oy += 0.5 * me.stepy;
            me.statText('Faction', me.data['faction'], ox + me.stepx * 2, oy, 'faction', 'faction', me.character);
            me.statText('Territory', me.data['territory'], ox + me.stepx * 9, oy, 'Terri', 'territor', me.character);
            me.statText('Weakness', me.data['weakness'], ox + me.stepx * 16, oy, 'weakness', 'weakness', me.character);

            oy += 1.0 * me.stepy;
        } else {
            oy += 1.5 * me.stepy;
        }

        let reparts = me.data.reparts.split("_")

        if (me.blank) {
            me.title('Physical (__)', ox + me.stepx * 5, oy, me.character);
            me.title('Social (__)', ox + me.stepx * 12, oy, me.character);
            me.title('Mental (__)', ox + me.stepx * 19, oy, me.character);
        } else {
            me.title('Physical (' + me.data['total_physical'] +'/'+reparts[0]+ ')', ox + me.stepx * 5, oy, me.character);
            me.title('Social (' + me.data['total_social'] +'/'+reparts[1]+ ')', ox + me.stepx * 12, oy, me.character);
            me.title('Mental (' + me.data['total_mental'] +'/'+reparts[2]+ ')', ox + me.stepx * 19, oy, me.character);
        }
        oy += 0.5 * me.stepy;
        ox = 2 * me.stepx;
        [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(function (d) {
            let x = ox + me.stepx * 7 * ((Math.round((d + 2) / 3)) - 1);
            let y = oy + 0.5 * me.stepy * ((d + 3) % 3);
            me.reinHagenStat(me.config['labels'][stat + 's'][d], me.data[stat + d], x, y, stat, stat + d, me.character);
        });

    }

    fillAbilities(basey) {
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';

        let reparts = me.data.reparts.split("_")

        if (me.blank) {
            me.title('Talents (__)', ox + me.stepx * 5, oy, me.character);
            me.title('Skills (__)', ox + me.stepx * 12, oy, me.character);
            me.title('Knowledges (__)', ox + me.stepx * 19, oy, me.character);
        } else {
            me.title('Talents (' + me.data['total_talents'] +'/'+reparts[3]+ ')', ox + me.stepx * 5, oy, me.character);
            me.title('Skills (' + me.data['total_skills'] +'/'+reparts[4]+ ')', ox + me.stepx * 12, oy, me.character);
            me.title('Knowledges (' + me.data['total_knowledges'] +'/'+reparts[5]+ ')', ox + me.stepx * 19, oy, me.character);
        }
        oy += 0.5 * me.stepy;
        let overheads = []
        let indexed = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        stat = 'talent';
        overheads = me.build_overheads(stat,indexed,parseInt(reparts[3]))
        indexed.forEach(function (d) {
            let x = ox + me.stepx * 2;
            let y = oy + 0.5 * me.stepy * (d);
            me.reinHagenStat(me.config['labels'][stat + 's'][d], me.data[stat + d], x, y, stat, stat + d, me.character, false, overheads[d]);
        });
        stat = 'skill';
        overheads = me.build_overheads(stat,indexed,parseInt(reparts[4]))
        indexed.forEach(function (d) {
            let x = ox + me.stepx * 9;
            let y = oy + 0.5 * me.stepy * (d);
            me.reinHagenStat(me.config['labels'][stat + 's'][d], me.data[stat + d], x, y, stat, stat + d, me.character, false, overheads[d]);
        });
        stat = 'knowledge';
        overheads = me.build_overheads(stat,indexed,parseInt(reparts[5]))
        indexed.forEach(function (d) {
            let x = ox + me.stepx * 16;
            let y = oy + 0.5 * me.stepy * (d);
            me.reinHagenStat(me.config['labels'][stat + 's'][d], me.data[stat + d], x, y, stat, stat + d, me.character, false, overheads[d]);
        });
    }


    build_overheads(stat,indexed=[],stat_total=5){
        let me = this
        let arr = Array(indexed.length).fill(0)
        let ov = Array(indexed.length).fill(0)
        let real_total = 0;
        let total = stat_total
        indexed.forEach(function (z) {
            real_total += me.data[stat + z]
            arr[z] = me.data[stat + z]
            ov[z] = me.data[stat + z]
        })
        while(real_total>0){
            indexed.forEach(function (z) {
                if (total>0){
                    if (arr[z]>0){
                        total -= 1
                        real_total -= 1
                        arr[z] -= 1
                        ov[z] -= 1
                    }
                }else{
                    if (arr[z]>0){
                        real_total -= 1

                    }
                }
            })
        }
         indexed.forEach(function (z) {
            arr[z] = me.data[stat + z]-ov[z]
         });
        console.log("Overheads for "+stat+":",arr)

        return arr
    }

    fillAdvantages(basey) {
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';

        if (me.blank) {
            me.title('Backgrounds (__)', ox + me.stepx * 5, oy, me.character);

        } else {
            me.title('Backgrounds (' + me.data['total_backgrounds'] + ')', ox + me.stepx * 5, oy, me.character);
        }
        if (me.data['creature'] == 'garou') {
            if (me.blank) {
                me.title('Gifts (__)', ox + me.stepx * 12, oy, me.character);
                }else{
                me.title('Gifts (' + me.data['total_traits'] + ')', ox + me.stepx * 12, oy, me.character);
            }

        } else if (me.data['creature'] == 'kindred') {
            if (me.blank) {
                me.title('Disciplines (  )', ox + me.stepx * 12, oy, me.character);
            } else {
                me.title('Disciplines (' + me.data['total_traits'] + ')', ox + me.stepx * 12, oy, me.character);
            }
            me.title('Virtues', ox + me.stepx * 19, oy, me.character);
        } else if (me.data['creature'] == 'kinfolk') {
            me.title('Notes', ox + me.stepx * 12, oy, me.character);
            me.title('Equipment', ox + me.stepx * 19, oy, me.character);
        } else {
            me.title('Other Traits', ox + me.stepx * 12, oy, me.character);
            if ((me.data['creature'] == 'mortal')) {
                me.title('Virtues', ox + me.stepx * 19, oy, me.character);
            }
        }
        oy += 0.5 * me.stepy;

        // *** Backgrounds
        stat = 'background';
        let overheads = []
        let indexed = [0,1,2,3,4,5,6,7,8,9]
        let indexedb = [0,1,2,3,4,5,6,7,8,9,10,11]

        overheads = me.build_overheads(stat,indexedb,5)

        if (me.data["creature"] == "kinfolk"){
            indexedb = [0,1,2,3,4,5]
        }

        indexedb.forEach(function (z) {
            let x = ox + me.stepx * 2;
            let y = oy + 0.5 * me.stepy * (z);
            me.reinHagenStat(me.config['labels'][stat + 's'][z], me.data[`${stat}${z}`], x, y, stat, `${stat}${z}`, me.character, false,overheads[z]);
        });
        // *** Traits

        if (me.data["creature"] == "kinfolk"){
            console.log("Here we go")
            let x = ox + me.stepx * 9
            let y = oy + 0.5 * me.stepy
            me.smallText(me.data["notes"],x,y,me.character)
        }else{
            stat = 'trait';
            overheads = me.build_overheads(stat,indexed,3)
            indexed.forEach(function (d) {
                let x = ox + me.stepx * 9;
                let y = oy + 0.5 * me.stepy * (d);
                me.powerStat(me.data[stat + d], x, y, stat, stat + d, me.character, false, overheads[d]);
            });
        }
        stat = 'virtue';
        let levels = [];
        if (me.data['creature'] == 'garou') {
            oy -= me.stepy * 0.5;
            levels = ['Glory', 'Honor', 'Wisdom'];
            [0, 1, 2].forEach(function (d) {
                let x = ox + me.stepx * 19;
                let y = oy + 1.20 * me.stepy * (d);
                me.gaugeStat(levels[d], me.data[levels[d].toLowerCase()], x, y, me.character, true, false);
            });
        } else if (me.data['creature'] == 'kinfolk') {
            let x = ox + me.stepx * 16
            let y = oy + 0.5 * me.stepy
            me.smallText(me.data["equipment"],x,y,me.character)
        } else {

            levels = ['Conscience', 'Self-Control', 'Courage'];
            [0, 1, 2].forEach(function (d) {
                let x = ox + me.stepx * 16;
                let y = oy + 0.5 * me.stepy * (d);
                me.reinHagenStat(levels[d], me.data[stat + d], x, y, stat, stat + d, me.character);
            });

        }



        if (me.data['creature'] == 'garou') {
            let ranks = ['Pup','Cliath', 'Fostern', 'Adren', 'Athro', 'Elder', 'Legend'];
            let breeds = ['Homid', 'Metis', 'Lupus'];
            let auspices = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'];
            oy += 3.75 * me.stepy;
            me.statText('Breed', breeds[me.data['breed']], ox + me.stepx * 16, oy, 'breed', 'breed', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Auspice', auspices[me.data['auspice']], ox + me.stepx * 16, oy, 'auspice', 'auspice', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Tribe', me.data['family'], ox + me.stepx * 16, oy, 'tribe', 'tribe', me.character);
            oy += 0.5 * me.stepy;
            me.reinHagenStat('Rank', me.data['garou_rank'], ox + me.stepx * 16, oy, 'garou_rank', 'garou_rank', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Rank name', ranks[me.data['garou_rank']], ox + me.stepx * 16, oy, 'rank', 'rank', me.character);
//             if (me.data['player']) {
//                 oy += 1 * me.stepy;
//                 me.statText('Experience', me.data['experience'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
//                 oy += 0.5 * me.stepy;
//                 me.statText('Remaining', me.data['exp_pool'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
//                 oy += 0.5 * me.stepy;
//                 me.statText('Spent', me.data['exp_spent'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
//             }

        } else if (me.data['creature'] == 'kindred') {
            oy += 2 * me.stepy;
            me.statText('Generation', 13 - me.data['background3'] + 'th', ox + me.stepx * 16, oy, 'gener', 'gener', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Sire', me.data['sire_name'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
            if (me.data['player']) {
                oy += 1 * me.stepy;
                me.statText('Experience', me.data['experience'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
                oy += 0.5 * me.stepy;
                me.statText('Remaining', me.data['exp_pool'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
                oy += 0.5 * me.stepy;
                me.statText('Spent', me.data['exp_spent'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
            }
        }
    }


    drawHealth(basey) {
        let me = this;
        let ox = 0;
        let oy = basey;
        me.title('Health', ox + me.stepx * 19, oy, me.character);
        oy += me.stepy * 0.8;
        let h = me.character.append('g')
            .selectAll('g')
            .data(me.health_levels)
        ;
        let x = h.enter();
        x.append('line')
            .attr('x1', function (d, i) {
                return ox + me.stepx * 16;
            })
            .attr('y1', function (d, i) {
                return oy + i * me.stepy * 0.6;
            })
            .attr('x2', function (d, i) {
                return ox + me.stepx * 22;
            })
            .attr('y2', function (d, i) {
                return oy + i * me.stepy * 0.6;
            })
            .style("fill", me.draw_fill)
            .style("stroke", me.shadow_stroke)
            .style("stroke-width", '0.5pt')
            .style("stroke-dasharray", '2 7')
        ;
        x.append('text')
            .attr('x', function (d, i) {
                return ox + me.stepx * 16;
            })
            .attr('y', function (d, i) {
                return oy + i * me.stepy * 0.6;
            })
            .style("text-anchor", 'start')
            .style("font-family", me.base_font)
            .style("font-size", me.medium_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                let words = d.split('/');
                return words[0];
            });
        x.append('text')
            .attr('x', function (d, i) {
                return ox + me.stepx * 19;
            })
            .attr('y', function (d, i) {
                return oy + i * me.stepy * 0.6;
            })
            .style("text-anchor", 'middle')
            .style("font-family", 'Titre')
            .style("font-size", me.medium_font_size + 'px')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                let words = d.split('/');
                if (words[1] == 'X') {
                    return '';
                }
                return words[1];
            });
        x.append('rect')
            .attr('x', function (d, i) {
                return ox + me.stepx * 22 - me.dot_radius * 2;
            })
            .attr('y', function (d, i) {
                return oy + i * me.stepy * 0.6 - me.dot_radius * 2;
            })
            .attr('width', me.dot_radius * 2)
            .attr('height', me.dot_radius * 2)
            .style("fill", "white")
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
        ;

    }


    fillOther(basey) {
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';
        me.title('Merits/Flaws', ox + me.stepx * 5, oy, me.character);
        oy += 0.5 * me.stepy;

        let merits_flaws = [];
        stat = 'merit';
        let idx = 0;
        [0, 1, 2, 3, 4].forEach(function (d) {
            if (me.data[stat + d] != '') {
                merits_flaws.push({'idx': idx, 'class': 'merit', 'id': 'merit' + d});
                idx++;
            }
        });
        stat = 'flaw';
        [0, 1, 2, 3, 4].forEach(function (d) {
            if (me.data[stat + d] != '') {
                merits_flaws.push({'idx': idx, 'class': 'flaw', 'id': 'flaw' + d});
                idx++;
            }
        });
        // Merits/Flaws
        _.forEach(merits_flaws, function (d, idx) {
            let x = ox + me.stepx * 2;
            let y = oy + 0.5 * me.stepy * (idx);
            me.powerStat(me.data[d['id']], x, y, d['class'], d['id'], me.character);
        });


        oy = basey;
        me.gaugeStat('Willpower', me.data['willpower'], ox + me.stepx * 12, oy, me.character, true);
        if (me.data['creature'] == 'garou') {
            oy += 1.7 * me.stepy;
            me.gaugeStat('Rage', me.data['rage'], ox + me.stepx * 12, oy, me.character, true);
            oy += 1.5 * me.stepy;
            me.gaugeStat('Gnosis', me.data['gnosis'], ox + me.stepx * 12, oy, me.character, true);
        }
        if (me.data['creature'] == 'kindred') {
            oy += 1.7 * me.stepy;
            me.gaugeStat('Humanity', me.data['humanity'], ox + me.stepx * 12, oy, me.character);
            oy += 1.5 * me.stepy;
            me.gaugeStat('Blood Pool', me.data['bloodpool'], ox + me.stepx * 12, oy, me.character, true, true, 20);

        }
        oy = basey;
        me.drawHealth(oy);
    }


    fillExperience(basey) {
        let me = this;
        let ox = 18 * me.stepx;
        let oy = basey;
        let stat = '';
        //me.title('Experience', ox + me.stepx * 5, oy, me.character);


        if (me.data['player']) {
            me.gaugeStat('Experience Earned', 0, ox, oy, me.character, false, false, 30);
            oy += 1.5 * me.stepy;
            me.gaugeStat('Experience Spent', 0, ox, oy, me.character, false, false, 30);
            oy += 1.5 * me.stepy;
            me.gaugeStat('Experience Remaining', 0, ox, oy, me.character, false, false, 30);
            oy += 1.5 * me.stepy;
//             me.statText('Experience', "", ox, oy, '','',me.character,true);
//             oy += 0.5 * me.stepy;
//             me.statText('Remaining', "", ox, oy, '', '', me.character);
//             oy += 0.5 * me.stepy;
//             me.statText('Spent', "", ox, oy, 'sire', 'sire', me.character);
        }


    }


    fillNewManyForms(basey) {
        let me = this
        let ox = 1;
        let oy = basey;
        let attr = ["STR","DEX","STA","CHA","MAN","APP"]
        let FORMS = {
            "homid":{
                "attributes_mods":[0,0,0,0,0,0],
                "note":"",
                "diff":"6",
                },
            "glabro":{
                "attributes_mods":[2,0,2,0,-1,-1],
                "diff":"7",
                } ,
            "crinos":{
                "attributes_mods":[4,1,3,0,-3,-10],
                "note":"DELIRIUM",
                "diff":"6",
                } ,
            "hispo":{
                "attributes_mods":[3,2,3,0,-3,0],
                "diff":"7",
                } ,
            "lupus":{
                "attributes_mods":[1,2,2,0,-3,0],
                "diff":"6",
                } ,
            }
        if (me.data['creature'] == 'garou') {
            let idx = 0
            let form_width = 4
            let form_height = 5
//             me.title('Many Forms', 12*me.stepx , oy, me.character);
                me.character.append("svg:image")
                    .attr("xlink:href", "static/collector/breed/manyforms.svg")
                    .attr("width", "65%")
                    .style("fill", "#8080807f")
                    .attr("x", (ox+2)*me.stepx)
                    .attr("y",basey-4*me.stepy);


            _.forEach(FORMS,(v,k)=> {
                let ox =  (1.5+idx*(form_width+0.25))
                let oy = (basey)+me.stepy
                let form_group = me.character.append("g")
                    .attr("transform",`translate(${ox*me.stepx},${oy})`)

//                 form_group.append("svg:image")
//                     .attr("xlink:href", "static/collector/breed/"+k+".svg")
//                     .attr("width", "10%")
//                     .attr("height", "10%")
//                     .style("fill", "#C0C0C07f")
//                     .attr("x", 0)
//                     .attr("y",0);
//




                form_group.append("rect")
                    .attr('x',0)
                    .attr('y',0)
                    .attr('rx',"5pt")
                    .attr('ry',"5pt")
                    .attr('width',form_width*me.stepx)
                    .attr('height',form_height*me.stepx)
                    .style("fill","none")
                    .style("stroke","#101010")
                    .style("stroke-width","1pt")
                me.title(k, 2*me.stepx , -0.25*me.stepy, form_group);
                _.forEach(v.attributes_mods, (w,l) => {
                    let val = parseInt(w) + parseInt(me.data["attribute"+l])
                    if (val < 0){
                        val = 0
                    }
                    let label = attr[l]
                    form_group.append("text")
                        .attr('x',"10pt")
                        .attr('y',me.stepy*2.5+l*me.small_font_size+"pt")
                        .style("fill",me.draw_fill)
                        .style("stroke",me.shadow_stroke)
                        .style("stroke-width","0.5pt")
                        .style("font-family",me.mono_font)
                        .style("text-anchor","start")
                        .style("font-size",me.small_font_size+"pt")
                        .text((d)=> {
                            return label+" "+val
                            })
                });

                form_group.append("text")
                    .attr('x',me.stepy*4.0)
                    .attr('y',me.stepy*3.75+"pt")
                    .style("fill",me.draw_fill)
                    .style("stroke",me.shadow_stroke)
                    .style("stroke-width","0.5pt")
                    .style("font-family",me.user_font)
                    .style("text-anchor","end")
                    .style("font-size",me.small_font_size+"pt")
                    .text("Diff.:"+v.diff)

                form_group.append("text")
                    .attr('x',me.stepy*1.0)
                    .attr('y',me.stepy*0.5+"pt")
                    .style("fill",me.draw_fill)
                    .style("stroke",me.shadow_stroke)
                    .style("stroke-width","1.0pt")
                    .style("font-family",me.user_font)
                    .style("text-anchor","center")
                    .style("font-size",me.small_font_size+"pt")
                    .text(v.note)
                idx += 1
            })
        }

    }


    fillSpecial(basey) {
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';
        me.title('Specialities', ox + me.stepx * 5, oy, me.character);
        me.title('Action Shortcuts', ox + me.stepx * 12, oy, me.character);
//         if (me.data['creature'] == 'garou') {
//             me.title('Many Forms', ox + me.stepx * 19, oy, me.character);
//         }
        oy += 0.5 * me.stepy;
        stat = 'speciality';
        let srs = []
        let srs_list = {}
        if ("srs" in me.data){
            console.log(me.data.srs)
            srs_list = {}
            srs = me.data.srs.split(", ")
            _.forEach(srs,(v,k)=>{
                let sr = v.split(":")
                srs_list[sr[0]] = sr[1]
            })
        }else{
                console.warn("NO SRS")
        }
        me.config['specialities'].forEach(function (d, idx) {
            let x = ox + me.stepx * 2;
            let y = oy + 0.5 * me.stepy * (idx);
            if (me.blank) {
            } else {
                console.log(d)
                console.log(me.config["specialities"])
                let ss = d.split(" ")
                let txt = ""
                if (ss[0] in srs_list){
                    console.log(srs_list[ss[0]])
                    console.log(ss[1])
                    txt = srs_list[ss[0]]
                }
                me.statText(d, txt, x, y, stat, stat + idx, me.character);
            }
        });
        stat = 'shortcuts';
        me.config['shortcuts'].forEach(function (d, idx) {
            let x = ox + me.stepx * 9 + Math.floor(idx / 12) * me.stepx * 7;
            let y = oy + 0.4 * me.stepy * (idx % 12);
            let w = d.split('=');
            if (me.blank) {
            } else {
                me.statText(w[0], w[1], x, y, stat, stat + idx, me.character);
            }
        });

//         if (me.data['creature'] == 'garou') {
//             let stored_blank = me.blank
//             me.blank = false
//             me.config["many_forms"] = [
//                 {
//                     'form': 'homid', 'motherform': true, 'size': 1.00, 'weight': 1.00, 'changes': {
//                         'attribute0': 0, 'attribute1': 0, 'attribute2': 0,
//                         'attribute3': 0, 'attribute4': 0, 'attribute5': 0,
//                     }
//                 },
//                 {
//                     'form': 'glabro', 'motherform': false, 'size': 1.25, 'weight': 1.50, 'changes': {
//                         'attribute0': 2, 'attribute1': 0, 'attribute2': 2,
//                         'attribute3': 0, 'attribute4': -1, 'attribute5': -1
//                     }
//                 },
//                 {
//                     'form': 'crinos', 'motherform': false, 'size': 1.50, 'weight': 2.00, 'changes': {
//                         'attribute0': 4, 'attribute1': 1, 'attribute2': 3,
//                         'attribute3': 0, 'attribute4': -3, 'attribute5': -10
//                     }
//                 },
//                 {
//                     'form': 'hispo', 'motherform': false, 'size': 1.25, 'weight': 2.00, 'changes': {
//                         'attribute0': 3, 'attribute1': 2, 'attribute2': 3,
//                         'attribute3': 0, 'attribute4': -3, 'attribute5': 0
//                     }
//                 },
//
//                 {
//                     'form': 'lupus', 'motherform': false, 'size': 0.5, 'weight': 0.5, 'changes': {
//                         'attribute0': 1, 'attribute1': 2, 'attribute2': 2,
//                         'attribute3': 0, 'attribute4': -3, 'attribute5': 0
//                     }
//                 },
//             ]
//             let bonuses = "";
//             let ax = ox + me.stepx * 16;
//             let ay = oy + 0.5 * me.stepy * (0);
//             me.statText("Attributes", "Str  Dex  Sta  Cha  Man  App", ax, ay, 'fl', 'fl', me.character, false, true);
//             me.config['many_forms'].forEach(function (d, idx) {
//                 ax = ox + me.stepx * 16;
//                 ay = oy + 0.5 * me.stepy * (idx + 1);
//                 bonuses = "";
//                 let list = d['changes'];
//
//                 _.forEach(list, function (v, k) {
//                     //let da = parseInt(me.data[k] + v);
//                     let da = parseInt( + v);
//                     let sign = ""
//                     if (da >= 0) {
//                         sign = "+";
//                     }
//                     if (da == -10){
//                         da = ".."
//                     }
//                     bonuses += " "+sign + da + ".";
//                 });
//                 me.statText(d['form'], bonuses, ax, ay, d['form'], d['form'], me.character, false, true);
//             });
//             me.blank = stored_blank
        //}


    }

    formatXml(xml) {
        var formatted = '';
        xml = xml.replace(/[\u00A0-\u2666]/g, function (c) {
            return '&#' + c.charCodeAt(0) + ';';
        })
        var reg = /(>)(<)(\/*)/g;
        /**/
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function (index, node) {
            var indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }


    addButton(num, txt) {
        let me = this;
        let ox = me.button_ox * me.stepy;
        let oy = me.button_oy * me.stepy;
        let button = me.back.append('g')
            .attr('class', 'do_not_print')
            .on('click', function (d) {
                if (num == 0) {
                    me.saveSVG();
                } else if (num == 1) {
                    me.savePNG();
                } else if (num == 2) {
                    me.createPDF();
                } else if (num == 3) {
                    me.editCreature();
                } else if (num == 4) {
                    me.page = 0;
                    me.perform(me.data)
                } else if (num == 5) {
                    me.page = 1;
                    me.perform(me.data)
                } else if (num == 6) {
                    me.page = 2;
                    me.perform(me.data)
                } else if (num >= 7) {
                    me.page = num - 4;
                    me.perform(me.data)
                }
            })
        button.append('rect')
            .attr('id', "button" + num)
            .attr('x', ox + me.stepx * (-0.8))
            .attr('y', oy + me.stepy * (num - 0.4))
            .attr('width', me.stepx * 1.6)
            .attr('height', me.stepy * 0.8)
            .style('fill', '#CCC')
            .style('stroke', '#111')
            .style('stroke-width', '1pt')
            .attr('opacity', 1.0)
            .style('cursor', 'pointer')
            .on('mouseover', function (d) {
                me.svg.select('#button' + num).style("stroke", "#A22");
            })
            .on('mouseout', function (d) {
                me.svg.select('#button' + num).style("stroke", "#111");
            })

        ;
        button.append('text')
            .attr('x', ox)
            .attr('y', oy + me.stepy * num)
            .attr('dy', 5)
            .style('font-family', me.title_font)
            .style('text-anchor', 'middle')
            .style("font-size", me.medium_font_size + 'px')
            .style('fill', '#000')
            .style('cursor', 'pointer')
            .style('stroke', '#333')
            .style('stroke-width', '0.5pt')
            .attr('opacity', 1.0)
            .text(txt)
            .on('mouseover', function (d) {
                me.svg.select('#button' + num).style("stroke", "#A22");
            })
            .on('mouseout', function (d) {
                me.svg.select('#button' + num).style("stroke", "#111");
            })

        ;
    }

    oldsaveSVG() {
//         let me = this;
//         me.svg.selectAll('.do_not_print').attr('opacity', 0);
//         let base_svg = d3.select("svg").html();
//         let flist = '<style>';
//         for (let f of me.config['fontset']) {
//             flist += '@import url("https://fonts.googleapis.com/css2?family=' + f + '");';
//         }
//         flist += '</style>';
//
//         let exportable_svg = '<?xml version="1.0" encoding="UTF-8" ?> \
// <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \
// <svg class="crossover_sheet" \
// xmlns="http://www.w3.org/2000/svg" version="1.1" \
// xmlns:xlink="http://www.w3.org/1999/xlink"> \
// ' + flist + base_svg + '</svg>';
//         let fname = me.data['rid'] + ".svg"
//         let nuke = document.createElement("a");
//         nuke.href = 'data:application/octet-stream;base64,' + btoa(me.formatXml(exportable_svg));
//         nuke.setAttribute("download", fname);
//         nuke.click();
//         me.svg.selectAll('.do_not_print').attr('opacity', 1);
    }

    saveSVG() {
//         let me = this;
//         me.svg.selectAll('.do_not_print').attr('opacity', 0);
//         let base_svg = d3.select("#d3area svg").html();
//         let flist = '<style>';
//         for (let f of me.config['fontset']) {
//             flist += '@import url("https://fonts.googleapis.com/css2?family=' + f + '");';
//         }
//         flist += '</style>';
//         let lpage = "";
//         let exportable_svg = '<?xml version="1.0" encoding="ISO-8859-1" ?> \
// <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \
// <svg class="crossover_sheet" \
// xmlns="http://www.w3.org/2000/svg" version="1.1" \
// xmlns:xlink="http://www.w3.org/1999/xlink"> \
// ' + flist + base_svg + '</svg>';
//
//         // lpage = "_" + me.page;
//         // let fname = "character_sheet"+me.data['rid'] + lpage + ".svg"
//         // let nuke = document.createElement("a");
//         // nuke.href = 'data:application/octet-stream;base64,' + btoa(me.formatXml(exportable_svg));
//         // nuke.setAttribute("/media/results/svg/", fname);
//         // nuke.click();
//
//         lpage = "_p" + (me.page);
//
//         let svg_name = "character_sheet" + me.data['rid'] + lpage + ".svg"
//         let rid = me.data['rid'];
//         let sheet_data = {
//             'svg_name': svg_name,
//             'rid': rid,
//             'svg': exportable_svg
//         }
//         me.svg.selectAll('.do_not_print').attr('opacity', 1);
//         $.ajax({
//             url: 'ajax/character/save2svg/' + me.data['rid'] + '/',
//             type: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             data: sheet_data,
//             dataType: 'json',
//             success: function (answer) {
//                 console.log("Saved to svg [" + rid + "]["+svg_name+"]...")
//             },
//             error: function (answer) {
//                 console.error('Error saving svg...');
//                 console.error(answer);
//             }
//         });
//
//
//         me.svg.selectAll('.do_not_print').attr('opacity', 1);
    }

    createPDF() {
        let me = this;
        me.svg.selectAll('.do_not_print').attr('opacity', 0);
        let base_svg = d3.select("#d3area svg").html();
        let flist = '<style>';
        console.log(me.config['fontset']);
        for (let f of me.config['fontset']) {

            flist += '@import url("https://fonts.googleapis.com/css2?family=' + f + '");';
        }
        flist += '</style>';
        let lpage = "";
        let exportable_svg = '<?xml version="1.0" encoding="UTF-8" ?> \
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \
<svg class="crossover_sheet" \
xmlns="http://www.w3.org/2000/svg" version="1.1" \
xmlns:xlink="http://www.w3.org/1999/xlink" width="' + me.width + '" height="' + me.height + '"> \
' + flist + base_svg + '</svg>';
        lpage = "_p" + (me.page);
        let svg_name = "character_sheet" + me.data['rid'] + lpage + ".svg"
        let pdf_name = "character_sheet" + me.data['rid'] + lpage + ".pdf"
        let rid = me.data['rid'];
        let sheet_data = {
            'pdf_name': pdf_name,
            'svg_name': svg_name,
            'rid': rid,
            'svg': exportable_svg
        }
        me.svg.selectAll('.do_not_print').attr('opacity', 1);
        $.ajax({
            url: 'ajax/character/svg2pdf/' + me.data['rid'] + '/',
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: sheet_data,
            dataType: 'json',
            success: function (answer) {
                console.log("PDF generated for [" + rid + "]...")
                console.error(answer);
            },
            error: function (answer) {
                console.error('Error generating the PDF...');
                console.error(answer);
            }
        });
    }

    // wrap(txt_src, y_met, y_coe, x_off, y_off, width, font = 'default') {
    //     let me = this;
    //     if (font == 'default') {
    //         font = me.user_font;
    //     }
    //     let tgt = d3.select(this);
    //     tgt.attr('x', function (d) {
    //         return x_off;
    //     })
    //         .attr('y', function (d) {
    //             return y_off + d[y_met] * y_coe * me.stepy;
    //         })
    //         .attr('dx', 0)
    //         .attr('dy', 0)
    //         .text(function (d) {
    //             return d[txt_src];
    //         })
    //         .style("text-anchor", 'start')
    //         .style("font-family", font)
    //         .style("font-size", me.small_font_size + 'pt')
    //         .style("fill", me.user_fill)
    //         .style("stroke", me.user_stroke)
    //         .style("stroke-width", '0.05pt');
    //     let words = tgt.text().split(/\s+/).reverse(),
    //         word,
    //         line = [],
    //         lineNumber = 0,
    //         lineHeight = me.small_font_size * 1.15,
    //         x = tgt.attr("x"),
    //         y = tgt.attr("y");
    //     tgt.text(null);
    //     let tspan = tgt.append("tspan")
    //         .attr("x", function (d) {
    //             return x_off;
    //         })
    //         .attr('y', function (d) {
    //             return y_off + d[y_met] * y_coe * me.stepy;
    //         });
    //
    //     while (word = words.pop()) {
    //         line.push(word);
    //         tspan.text(line.join(" "));
    //         if (tspan.node().getComputedTextLength() > width * me.stepy) {
    //             line.pop();
    //             tspan.text(line.join(" "));
    //             line = [word];
    //             tspan = tgt.append("tspan")
    //                 .attr("x", function (d) {
    //                     return x_off;
    //                 })
    //                 .attr('y', function (d) {
    //                     return y_off + d[y_met] * y_coe * me.stepy;
    //                 })
    //                 .attr("dy", ++lineNumber * lineHeight)
    //                 .style("font-size", me.small_font_size + 'pt')
    //                 .style("stroke-width", '0.05pt')
    //                 .text(word);
    //         }
    //     }
    //     // return (lineNumber);
    // }

    zoomActivate() {
        let me = this;
        me.zoom = d3.zoom()
            .scaleExtent([0.25, 4])
            .on('zoom', function (event) {
                me.svg.attr('transform', event.transform)
            });
        me.vis.call(me.zoom);
    }

    superwrap(text, width, stacked = false, a_font_size) {
        let font = "Gochi Hand",
            user_fill = '#A8A',
            user_stroke = '#828',
            font_size = a_font_size,
            base_y = 0,
            stackedHeight = 0
        ;
        let total_lines = 0

        text.each(function () {
            let tgt = d3.select(this),
                words = tgt.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                x = 0,//tgt.attr("x"),
                y = 0,//tgt.attr("y"),
                lineHeight = font_size * 1.1
            ;
            tgt.text("")
            let tspan = tgt.append("tspan")
                .attr("class", "to_be_blanked")
                .attr("x", x)
                .attr('y', y)
                .attr("dy", 0)
                .style("font-size", font_size + 'px')
                .style("font-family","Khand")
                .style("fill","#101010")
                .style("stroke","#101010")
                .style("stroke-width", '0.50pt')
            ;

            while (word = words.pop()) {
                if (word == "µ"){
                    word = ""
                    tspan.text(line.join(" "));
                    line = [];
                    tspan = tgt.append("tspan")
                        .attr("x", x)
                        .attr('y', y)
                        .attr("dy", ++lineNumber * lineHeight)
                        .style("font-size", font_size + 'px')
                        .style("stroke-width", '0.05pt')
                        .style("fill","#505050")
                        .style("stroke","#505050")
                        .text(word)

                }else{
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = tgt.append("tspan")
                            .attr("x", x)
                            .attr('y', y)
                            .attr("dy", ++lineNumber * lineHeight)
                            .style("font-size", font_size + 'px')
                            .style("stroke-width", '0.05pt')
                            .style("fill","#505050")
                            .style("stroke","#505050")
                            .text(word)
                    }
                }
            }
            tgt.attr("lines",lineNumber+1)
        });

    }

    blockwrap(text, width, stacked = false, a_font_size) {
        let font = "Gochi Hand",
            user_fill = '#A8A',
            user_stroke = '#828',
            font_size = a_font_size,
            base_y = 0,
            stackedHeight = 0
        ;
        let total_lines = 0

        text.each(function () {
            let tgt = d3.select(this),
                words = tgt.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                x = 0,//tgt.attr("x"),
                y = 0,//tgt.attr("y"),
                lineHeight = font_size * 1.1
            ;
            let tspan = tgt.text(null).append("tspan")
                .attr("x", x)
                .attr('y', y)
                .attr("dy", 0)
                .style("font-size", font_size + 'px')
                .style("stroke-width", '0.05pt')
            ;

            while (word = words.pop()) {
                if (word == "µ"){
                    tspan.text(line.join(" "));
                    line = [];
                    tspan = tgt.append("tspan")
                        .attr("x", x)
                        .attr('y', y)
                        .attr("dy", ++lineNumber * lineHeight)
                        .style("font-size", font_size + 'px')
                        .style("stroke-width", '0.05pt')
                        .text(word)

                }else{
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = tgt.append("tspan")
                            .attr("x", x)
                            .attr('y', y)
                            .attr("dy", ++lineNumber * lineHeight)
                            .style("font-size", font_size + 'px')
                            .style("stroke-width", '0.05pt')
                            .text(word)
                    }
                }
            }
            tgt.attr("lines",lineNumber+1)
        });

    }



}

let global_last_lines = 0

function wrap(text, width, stacked = false, a_font_size) {
    let font = "Gochi Hand",
        user_fill = '#A8A',
        user_stroke = '#828',
        font_size = a_font_size,
        base_y = 0,
        stackedHeight = 0
    ;
    let total_lines = 0

    text.each(function () {
        let tgt = d3.select(this),
            words = tgt.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            x = tgt.attr("x"),
            y = tgt.attr("y"),
            lineHeight = font_size * 1.1
        ;
        let tspan = tgt.text(null).append("tspan")
            .attr("x", x)
            .attr('y', y)
            .attr("dy", 0)
            .style("font-size", font_size + 'px')
            .style("stroke-width", '0.05pt')
        ;

        while (word = words.pop()) {
//             console.log(word)
            if (word == "µ"){
                tspan.text(line.join(" "));
                line = [];
                tspan = tgt.append("tspan")
                    .attr("x", x)
                    .attr('y', y)
                    .attr("dy", ++lineNumber * lineHeight)
                    .style("font-size", font_size + 'px')
                    .style("stroke-width", '0.05pt')
                    .text(word)

            }else{
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = tgt.append("tspan")
                        .attr("x", x)
                        .attr('y', y)
                        .attr("dy", ++lineNumber * lineHeight)
                        .style("font-size", font_size + 'px')
                        .style("stroke-width", '0.05pt')
                        .text(word)
                }
            }
        }
        global_last_lines = lineNumber
    });
}


