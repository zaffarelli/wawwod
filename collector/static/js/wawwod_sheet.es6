class WawwodSheet {
    constructor(settings, parent) {
        this.parent = parent;
        this.config = settings;
        this.count = 0;
        this.mark_overhead = false
        this.disposition = "portrait"
        this.button_ox = 1;
        this.button_oy = 1;
    }

    setCollector(collector){
        let me = this
        me.co = collector
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
            me.medium_font_size = 1.9 * me.stepy / 5;
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
        me.user_stroke = '#4C8'
        me.user_fill = '#143'
        me.user_fill = '#143'
        me.overhead_fill = '#C22'
        //me.user_font = 'Gochi Hand'
        me.user_font = 'Slackside One'
        //me.user_font = 'Whisper'
        me.mono_font = 'Syne Mono'
        me.creature_font = 'Trade Winds'
        me.creature_font = 'Spectral SC'
        me.title_font = 'Khand'
        //me.title_font = 'Trade Winds';
        me.logo_font = 'Splash';
        me.base_font = 'Philosopher';
        me.base_font = 'Khand'
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
            .style('stroke', me.draw_fill)
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
            .style('stroke', me.draw_fill)
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

    reinHagenStat(name="xxx", value, ox, oy, type, statcode, source, power = false, maxo=10) {
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
                if (name === "xxx"){
                    return ""
                }
                return name.charAt(0).toUpperCase() + name.slice(1)
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
        if (!fat){
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
        }
        if (fat) {
            item.append('text')
                .attr("x", ox )
                .attr("y", oy)
                .attr("dy", 10)
                .style("text-anchor", 'start')
                .style("font-family", function (d) {
                    return me.base_font;
                })
                .style("font-size", (me.medium_font_size )*1.5 + 'px')
                 .style("fill", me.user_fill)
                 .style("stroke", me.user_stroke)
//                 .style("fill", "#A03020")
//                 .style("stroke", "#A03020")
                .style("stroke-width", '1pt')
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
            .attr("y", me.small_font_size+'pt')
            //.attr("dy", me.small_font_size+'pt')
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.small_font_size + 'pt')
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.5pt')
        _.forEach(lines, (v,k) => {
            txt.append("tspan")
                .attr("x",0)
                .attr("y",me.small_font_size*k+"pt")
                //.attr("dy",me.small_font_size*k+"pt")
                .text(v)
            })

    }

    title(name, ox, oy, source) {
        let item = source.append('text')
            .attr("x", ox)
            .attr("y", oy)
            .attr("dy", 10)
            .style("text-anchor", 'middle')
            .style("font-family", this.title_font)
            .style("font-size", this.big_font_size + 'pt')
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
                let cy = oy + 0.3 * me.stepx + me.dot_radius - me.dot_radius + (me.dot_radius * 2 + 2) * lines + 2;
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

        me.statText('',me.data['name'] , ox + me.stepx * 2, oy, 'name', 'name', me.character, true);
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
        let indexed = [0,1,2,3,4,5,6,7,8,9,10,11]
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
            //oy = 0.5 * me.stepy;
            let x = ox + me.stepx * 9
            let y = oy
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
            //oy -= 0.5 * me.stepy;
            let x = ox + me.stepx * 16
            let y = oy
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

    drawHealthCompact(basex,basey) {
        let me = this
        let ox = (basex+0.25)*me.stepx
        let oy = (basey*me.stepy)
        me.title('Health', ox+me.stepx*3, oy-me.stepy*0.5, me.daddy);

        let h = me.daddy.append('g')
            .selectAll('g')
            .data(me.health_levels)
        ;
        let x = h.enter();
        x.append('line')
            .attr('x1', function (d, i) {
                return ox
            })
            .attr('y1', function (d, i) {
                return oy + i * me.stepy * 0.3;
            })
            .attr('x2', function (d, i) {
                return ox + me.stepx * 5;
            })
            .attr('y2', function (d, i) {
                return oy + i * me.stepy * 0.3;
            })
            .style("fill", me.draw_fill)
            .style("stroke", me.shadow_stroke)
            .style("stroke-width", '0.5pt')
            .style("stroke-dasharray", '2 7')
        ;
        x.append('text')
            .attr('x', function (d, i) {
                return ox ;
            })
            .attr('y', function (d, i) {
                return oy + i * me.stepy * 0.3;
            })
            .style("text-anchor", 'start')
            .style("font-family", me.base_font)
            .style("font-size", me.tiny_font_size + 'pt')
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", '0.5pt')
            .text(function (d) {
                let words = d.split('/');
                return words[0];
            });
        x.append('text')
            .attr('x', function (d, i) {
                return ox + me.stepx * 5;
            })
            .attr('y', function (d, i) {
                return oy + i * me.stepy * 0.3;
            })
            .style("text-anchor", 'middle')
            .style("font-family", "Khand")
            .style("font-size", me.tiny_font_size + 'pt')
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
                return ox + me.stepx * 5.5 - me.dot_radius * 2;
            })
            .attr('y', function (d, i) {
                return oy + i * me.stepy * 0.3 - me.dot_radius * 2;
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
            oy += 1.2 * me.stepy;
            me.gaugeStat('Rage', me.data['rage'], ox + me.stepx * 12, oy, me.character, true);
            oy += 1.2 * me.stepy;
            me.gaugeStat('Gnosis', me.data['gnosis'], ox + me.stepx * 12, oy, me.character, true);
            oy += 1.6 * me.stepy;
            me.reinHagenStat("Max Rage Actions ", me.data["fury_limit"], ox+ me.stepx * 9, oy, "fury_limit", "fury_limit", me.character, false)
            oy += 0.5 * me.stepy;
            me.reinHagenStat("Body Limit", me.data["body_limit"], ox+ me.stepx * 9, oy, "body_limit", "body_limit", me.character, false)


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
        let ox = me.stepx * 12.5
        let oy = basey;
        let stat = '';

        if (me.data['player'].length>0) {
//             me.gaugeStat('Experience Earned', me.data.experience, ox, oy, me.character, false, false, 30);
//             oy += 1.5 * me.stepy;
//             me.gaugeStat('Experience Spent', me.data.exp_spent, ox, oy, me.character, false, false, 30);
//             oy += 1.5 * me.stepy;
//             me.gaugeStat('Experience Remaining', me.data.exp_pool, ox, oy, me.character, false, false, 30);
//             oy += 1.5 * me.stepy;
            //oy += 1 * me.stepy;
            me.title('Experience', ox+5*me.stepx , oy, me.character);
            oy += 0.5 * me.stepy;
            me.statText('Earned', me.data['experience'], ox , oy, 'sire', 'sire', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Remaining', me.data['exp_pool'], ox , oy, 'sire', 'sire', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Spent', me.data['exp_spent'], ox , oy, 'sire', 'sire', me.character);


            let histories = me.data["experience_expenditure"].split(";")
            let all_histo_exp = []

            _.forEach(histories, (history) => {
                if (history.length > 0){
                    let terms = history.split("=")
                    let txt = ""
                    if (terms[0] == "loss"){
                        let vals = terms[1].split(">")
                        txt = `- Special penalty: ${terms[2]} loses ${vals[0]} point(s).`
                     }else{
                        let vals = terms[1].split(">")
                        txt = `- ${terms[2]} xp(s) to bring ${terms[0]} from ${vals[0]} to ${vals[1]} point(s).`
                    }
                    all_histo_exp.push(txt)
                }else{
                    all_histo_exp.push(`No experience expenditure right now.`)
                }

            })

            ox = me.stepx * 12.5
            oy += 1 * me.stepy
            let line_count = 0 //me.appendText("Transactions:",all_histo_exp,ox,oy,me.stepx*10)
            console.log("Line count",line_count)
        }
    }

    appendText(title,base_txt="",ox,oy,width,source){
        let me = this
        let lines_written = 0
        console.log("source:",source)
        if (!source){
            source = me.daddy
            console.log("daddy")
            console.log("source:",source)
        }
        if (!source){
            return 0
        }
//         let aline = source.append('line')
//             .attr('x1',ox)
//             .attr('y1',oy-me.medium_font_size)
//             .attr('x2',ox+width)
//             .attr('y2',oy-me.medium_font_size)
//             .style("stroke", me.user_stroke)
//             .style("stroke-width", '3pt')
//             .attr("opacity",0)
        let text = source.append('text')
            .attr('x',ox-me.medium_font_size)
            .attr('y',oy)
            .attr('dx', 0)
            .attr('dy', 0)

            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.medium_font_size + "px")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.5pt')
            .attr("opacity",1)
            .text(title)
        if (title.length>0) {
            lines_written += 1
            }
        let txt_index = 0
        let txt = base_txt.split("µ")
        console.log("txt length:",txt.length)
        while (txt.length>0){
            let line = txt.shift()
            let tspan = text.append("tspan")
                .attr('x', ox)
                .attr("dy",me.medium_font_size+"pt")
                .text(line)
            let next_line = []
            lines_written += 1
            while (tspan.node().getComputedTextLength() > width) {
                let parts = line.split(" ")
                let word = parts.pop()
                line = parts.join(" ")
                tspan.text(line)
                next_line.splice(0,0,word)
            }
            if (next_line.length>0){
                txt.splice(0,0,next_line.join(" "))
            }
        }
        return lines_written
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
                "path":"M36.2016-150.0788s-2.944.4567-2.7566.4567c.8335 0 1.5705-1.0722 1.7758-2.5834.1224-.9013.1042-1.6197-.0448-1.769-.138-.1382-.2509-.8642-.2509-1.6132-.099-1.9341-1.8361-5.4131-1.5822-7.6605-.6934-3.2277-2.3753-9.4612-3.8993-12.4898.5456-2.8447 3.2077-8.4179 3.3756-9.1879.0759-.348 3.237-11.5078 4.0716-11.5078.2818 0-.6871 13.5742-1.4904 18.459 1.2657 3.2114 1.2005 5.986 1.7444 7.0925.4485 3.5029.6048 8.9484.2794 9.7338-.1168.2818-.0823 1.5424.0766 2.8013.2 1.5842.2059 2.6783.0192 3.5536-.1992.934-.1857 1.4217.0517 1.8652.4251.7943-.0543 1.7913-1.37 2.8492Zm-4.1372 3.9071c-.0145.1935 1.6597-.0107 3.4512-.0107.2882 0 .9585-.3441 1.4895-.7647.866-.6855 1.1368-.7572 2.6268-.6915 0 0 1.1406.1343 3.3835-.6352.45-.1544.3666-1.9296.1188-4.325-.1378-1.3323-.1854-6.1189-.1058-10.6369.1522-8.6329.0212-6.5459-1.8063-13.2716.0946-3.4579.2968-5.5146.9144-9.3905.9093-5.7064 1.0211-7.3788.6812-10.1926-.156-1.291-.321-3.2402-.3667-4.3316-.0458-1.0914-.2199-2.5797-.387-3.3073-.2105-.9164-.3465-5.7742-.2371-7.7584.3066-5.5613.588-10.7188.656-13.0113.0414-1.3928.6018-6.3508.6192-6.0079.0858 1.7002 1.4958 5.6479 1.4885 9.7856-.0087 1.5355.0853 1.3867.2408 3.9188.1109 1.806.2633 4.1171.3386 5.1358.0753 1.0186.1325 2.2093.1271 2.6458-.013 1.0499-.3283 12.353-.3966 14.7182-.0691 2.3949.386 2.6271.7779.3969.1758-1.0003.3158-1.3878.3347-.9261.0581 1.4163.7118 3.1687 1.2192 3.2685.4367.0859.4621-.0808.311-2.0405-.0983-1.2753-.0617-2.1975.091-2.2919.1512-.0935.2555.3795.2555 1.159 0 .7243.0723 1.5052.1606 1.7354.1902.4957.8932.5637.9081.0878.0057-.1819.0776-1.2275.1599-2.3237.115-1.5323.0468-2.2356-.295-3.0427-.2649-.6255-.4944-2.0656-.5678-3.5633-.2244-4.1283-1.3547-6.3002-.5064-10.4244-.3585-1.1911-.0302-17.6969-.496-19.3514.1174-.692.7314-1.2199-.1684-3.9269-.711-2.1389-2.5862-.8389-4.1261-1.7116-1.627-.9221-1.2684-.593-2.3239-2.018.1332-.5746-.1071-3.1848-.1036-3.7477.3334-2.0201 2.8773-2.7128 3.2557-6.6875.1263-1.3267.2001-3.7187-2.0924-5.5677-1.3899-1.121-4.8259-1.6733-7.3082 1.2699-1.6888 2.0024-1.3554 6.296-.7455 9.5123.3294 1.7367 1.6675 1.2116 2.7572 1.2678.4445 1.1944.6323 4.0713-.1328 4.9625-2.6175 1.1142-1.1324.3663-2.5767.9708-.9234.3865-3.7718 1.007-4.2042 2.0418-.4975 1.1907-.8381 3.3353-.2923 3.6408-.0691 1.463.1131 4.5863-.5181 8.2441-.345 1.9995-.3776 2.7193-.1436 3.175.1664.3241.2632.7679.2151.9862s-.1594.6945-.2474 1.0583c-.7291 3.0147-.4606 5.1025-1.0073 6.936-.1057.3547-.4506.4321-.6192 3.5695-.2431 4.523-.4566 6.031-.854 6.031-.5054 0-.6158.2491-.6548 1.4774-.0204.6426-.1504 1.3895-.2889 1.6598-.1629.3179-.157.5862.0166.7599.1476.1476.2046.4348.1265.6382-.2854.7437.2186 3.7844.7277 4.3906.7806.9296 1.0545.1936.9773-2.6269-.0447-1.6341.0388-2.5383.2546-2.7553.252-.2535.2927-.1286.1888.5802-.0728.4968-.0066 1.0818.1469 1.3001.2425.3447.3307.3293.6711-.1167.2155-.2828.3918-.4075.3918-.2778 0 .1297.1228.113.2729-.0371.1501-.1501.3215-1.2376.3809-2.4167.0594-1.1791.3507-3.3126.6472-4.741s.5866-3.2519.6445-4.0523c.0579-.8004.1877-1.6513.2884-1.891.1007-.2397.15-.5969.1097-.7937-.0404-.1969.0543-.5961.2103-.8871.3531-.6588.9472-8.5411.8809-11.6869-.0677-3.2083.9747-8.3105 1.1026-7.5017.14.8854.3874 3.8694.4878 6.224.2414 5.662.4661 7.8922-.1691 10.8078-.2878 1.3211-.3556 2.4368-.3812 4.7953-.0319 2.9445-1.2958 5.6208-1.7536 7.505-1.0998 4.5274-6.187 21.3624-7.1703 25.2297 1.4258 4.2452 2.5513 8.682 3.3065 11.8168.7678 3.1874.9659 7.6435 2.6075 10.5754.3032 1.0999.2904 1.1542-.3274 1.3891-.3536.1344-.7244.245-.8241.2457-.5117.0035-3.3792 1.3434-3.6409 1.7013-.1666.2278-.4315.4142-.5888.4142-.4582 0-.6527.5218-.3364.9028.224.2699.579.2918 1.5441.0954.6893-.1403 2.4141-.333 3.833-.4283 2.3656-.1588 2.9954-.0644 2.3267.349-.1392.086-.1906.3191-.1143.518.0763.1989.0116.4402-.1438.5363-.4402.2721-.3356.8869.2963 1.7417Z",
                "pathx":2,
                "pathy":8,
                },
            "glabro":{
                "attributes_mods":[2,0,2,0,-1,-1],
                "diff":"7",
                "path":"M74.5169-215.1726c-.3679.8367-.7946 1.5214-.9481 1.5214-.6255 0-2.288-2.0642-2.7744-3.4447-.8252-2.3422-2.1047-4.9969-3.5596-7.3854-.7475-1.2271-1.4832-2.6922-1.635-3.2558-.2659-.9875-.2286-1.089 1.0278-2.796.717-.9742 1.4851-2.1287 1.7069-2.5656.2217-.4369.6591-1.026.9718-1.309.3128-.2831.8073-.9376 1.099-1.4546.574-1.0174 1.0619-1.8641 1.3569-1.5489.3453.369 3.1076 9.6129 3.399 12.7798.1607 1.7462.4476 4.0084.6377 5.0271.3175 1.7019.3067 1.895-.1337 2.3812-.2636.291-.7803 1.2138-1.1482 2.0505Zm23.6084 17.1979c.0193 1.4188-.0281 2.5797-.1054 2.5797-.3368 0-.3828-.818-.1639-2.9152l.2342-2.2441.0352 2.5797ZM91.673-143.7114c.6272.6273 4.4383.4527 6.0244-.276 1.4733-.6768 1.6028-1.2489.3969-1.7537-.9409-.3939-2.8443-2.3458-2.8443-2.9168 0-.1967-.4757-1.2977-1.0572-2.4466-.5815-1.1489-1.0577-2.2973-1.0583-2.552s-.134-.463-.2963-.463c-.4845 0-.045-10.2221.4735-11.0135.3387-.517.3518-.7617.0788-1.4836-.3502-.9261-1.0327-6.9934-1.1538-10.2571-.0405-1.0914-.2813-3.2345-.5351-4.7625-.2538-1.528-.4925-4.0094-.5304-5.5142-.0379-1.5048-.1899-2.8145-.3378-2.9104-.1518-.0984-.3615-2.2476-.4816-4.9368-.22-4.9243-.2314-6.3435-.1004-12.5016.075-3.5254-.2974-6.6403-.8841-7.3962-.136-.1752-.1726-1.0087-.0813-1.8521.0913-.8434.2161-4.1529.2773-7.3543.1498-7.8313 1.5437-12.8005 1.5715-13.5342.0285-.7454 2.1603 3.478 2.836 5.1226.1669.4063.375 1.2745.4623 1.9293.1222.9164.265 1.1822.6202 1.1539.3475-.0277.4628.1682.4673.7937.0116 1.6191.2716 5.6342.5593 8.6357.3184 3.322.0736 5.936-.7332 7.8291-.6601 1.5489-.6736 3.4845-.0275 3.937.5462.3826.4221.9339-.2102.9339-.206 0-.5537.3274-.7727.7276-.6042 1.1038-1.4235 1.9766-1.6969 1.8076-.2883-.1782-.5643.4429-.5643 1.2699 0 .3228-.1239.7108-.2752.8622-.3336.3336-.5457 4.6502-.2518 5.1257.3327.5383.9901.1058 1.1845-.7794.098-.4464.3358-.8116.5282-.8116.1925 0 .4719-.3499.621-.7775.2101-.6027.1862-.8479-.1064-1.0907-.4822-.4002-.491-.8778-.0128-.6943.2005.077.4748.0297.6095-.105.1501-.1501.4441-.0942.7598.1446.2895.2189.3701.3929.1842.3979-.2478.0063-.3307.9002-.3307 3.5631 0 3.7425.2286 4.912.96 4.912.3992 0 .4275-.3064.2808-3.0427-.0897-1.6735-.0629-3.0427.0594-3.0427.2737 0 .8518.6692.7067.8181-.0578.0594-.1701.5245-.2496 1.0337-.1666 1.0675.4411 2.2437 1.0405 2.0137.2616-.1004.3772.0488.3772.4868 0 .9246.2669 1.4685.7206 1.4685.2818 0 .3627-.1919.2747-.6522-.0686-.3587-.0281-.6861.09-.7276.2998-.1053.8394-3.7855.7134-4.8652-.0572-.4897-.0025-.9242.1216-.9655.3212-.1071.3152-1.7314-.011-2.9759-.1526-.5821-.4183-2.0263-.5905-3.2094-.2547-1.7498-.2472-2.268.0402-2.7781.4826-.8567.7058-17.1636.2349-17.1636-.1853 0-.1364-.1724.1222-.431.2483-.2485.357-.6126.2563-.8599-.6126-1.5042-1.448-5.1602-1.229-5.3792.335-.335-1.23-4.7-2.7311-7.6175-.6364-1.2369-1.3436-2.9257-1.5714-3.7529-.3914-1.421-1.3341-2.597-2.0819-2.597-1.1235-.364-1.4839.2602-2.279.1431-.1943-.0286-1.7883.0105-3.5702-.2192l-2.3453-.3024-1.5725-2.3663c-.3593-.5407-.2748-1.0016.0355-1.9987.511-1.6417 1.5217 1.0736 3.0373-6.7052.3321-1.7043.2185-2.1058.1074-3.5002-.15-1.8828-.6632-1.8089-1.1131-3.4357-.8163-1.7033-1.8878-1.6977-2.9576-2.1608-1.1925-.5167-2.6634-.2868-4.0423.2329-2.6581 1.0458-3.3724 2.8549-3.4791 5.437-.1442 3.4906.5457 4.6209 1.8282 8.2365.9578 2.7003 2.1519 1.4759 2.1698 2.5371l.0278 1.6503c.0163.9656-.4548 1.3154-1.2563 1.9973l-1.2747.6656c-.2811.1468-1.3632.2345-1.6841.0341-.3791-.2367-.9691-.2095-2.5945.1198-2.4774.5019-3.323 1.2522-3.8399 3.4066-.3518 1.4663-.6454 1.9781-3.2154 5.6048-.9771 1.3788-2.1345 3.2161-2.572 4.0829-.6552 1.2979-.8903 1.5512-1.3324 1.4356-.3479-.091-.5339-.0131-.5284.2212.0104.4474.6282 1.2876.9468 1.2876.1295 0 .2354.9838.2354 2.1861 0 2.1372.0296 2.2381 1.3229 4.5091.7276 1.2776 1.9424 3.1216 2.6996 4.0977 2.1528 2.7753 4.0563 5.5682 4.4701 6.5585.39.9335.7309 1.1282 1.0555.6029.1038-.1679.3976.3799.6617 1.2335.4266 1.3787.435 1.6129.0828 2.2941-.2158.4173-.3163.8817-.2233 1.0321.093.1504-.0067.4744-.2214.7198-.2147.2455-.4711 1.0068-.5696 1.6918-.1554 1.0803-.1071 1.2905.3645 1.585.299.1867.5437.5528.5437.8134 0 .2606.1786.5423.3969.6261.2705.1038.3969.5272.3969 1.3301 0 1.477.5088 4.8366.822 5.4283.1296.2447.2961 1.9239.3701 3.7314.074 1.8075.3027 4.4053.5083 5.7727.2056 1.3675.3243 3.3197.2638 4.3384-.0605 1.0187-.1135 2.7037-.1179 3.7446-.0059 1.418-.1057 1.9301-.3979 2.0422-.2703.1037-.39.5482-.39 1.4486 0 .7144-.1933 1.7599-.4296 2.3234-.3554.8477-.4022 1.6408-.2707 4.5964.3818 8.5867.7437 11.3326 1.7958 13.626.7163 1.5614.9086 3.9268.3806 4.6807-.2018.2882-.4337.4023-.5231.2577-.2372-.3839-2.6681.3247-3.8916 1.1343-1.4057.9303-1.4198 1.8236-.038 2.4139 1.1937.51 2.9766.7326 2.9766.3717 0-.1427.3274-.2627.7276-.2657.4002-.0035 1.6702-.2814 2.8222-.6176 1.6263-.4747 2.144-.7449 2.3156-1.2088.2574-.6959.0555-1.1631-.3936-.9109-.2107.1183-.2047.0594.0183-.1809.1819-.196.3307-.5277.3307-.7372s.2084-.5409.463-.7365c.4341-.3333.4279-.3655-.099-.5143-.5363-.1515-.5688-.3608-.7087-4.5684-.0807-2.4253-.1994-4.6477-.2639-4.9388-.0645-.291-.029-.6482.0787-.7937.8475-1.1443.9524-5.3785.2361-9.525-.4094-2.37-.6057-10.283-.2496-10.0629.1903.1176.2743-.2061.2505-.9655-.065-2.0763.9316-12.5419 1.2804-13.4456.0843-.2183.1763-.7541.2045-1.1906.0282-.4366.2164-1.4188.4182-2.1828.326-1.2339.4453-1.3891 1.0681-1.3891.5544 0 .7305.1523.8417.7276.0773.4002.2615 1.1443.4092 1.6536.6532 2.2514 1.0704 4.0466 1.6224 6.9822.3254 1.7302.7709 3.5749.99 4.0994.6602 1.5801 1.1042 5.1079 1.1446 9.095.021 2.0725.1409 3.8937.2663 4.047.2059.2517.007 3.0843-.4315 6.1465-.1101.7689-.048 1.2714.1932 1.5619.1955.2355.3706 1.0351.389 1.7768s.4002 2.404.8484 3.694c.451 1.2979.9546 3.4972 1.1275 4.9242l.3125 2.5787-.8302 1.7572c-.4566.9665-.8302 1.9117-.8302 2.1005 0 .1888-.1325.4758-.2944.6377-.4286.4286-.1385.7475 1.9024 2.0921 1.0074.6637 1.8316 1.3065 1.8316 1.4284 0 .122.1763.398.3917.6135Z",
                "pathx":1,
                "pathy":8,
                } ,
            "crinos":{
                "attributes_mods":[4,1,3,0,-3,-10],
                "note":"INCITE DELIRIUM IN HUMANS",
                "diff":"6",
                "pathx":0,
                "pathy":-4,
                //"path":"m 109.89463,302.93975 c -0.0855,-0.22277 -0.0809,-0.7778 0.0102,-1.23339 l 0.16567,-0.82835 -0.59725,0.50579 c -0.32849,0.27818 -0.69489,0.65894 -0.81422,0.84613 -0.125,0.19608 -0.62971,0.31658 -1.19063,0.28427 -0.53551,-0.0309 -1.23371,0.0839 -1.55157,0.25496 -0.74932,0.40329 -2.3781,0.40077 -2.62831,-0.004 -0.10728,-0.17359 -0.0414,-0.36624 0.14672,-0.42894 0.18781,-0.0626 0.53631,-0.34839 0.77445,-0.63508 0.44005,-0.52978 1.57726,-1.12793 1.974,-1.03829 0.11995,0.0271 0.14269,-0.0727 0.0505,-0.22186 -0.25857,-0.41837 -2.3292,-0.32062 -2.98835,0.14107 -0.32368,0.22671 -0.70736,0.33875 -0.85263,0.24897 -0.36779,-0.22731 -0.33003,-0.8573 0.0666,-1.11105 0.1819,-0.11637 0.33073,-0.44971 0.33073,-0.74075 0,-0.42862 0.16339,-0.52175 0.8599,-0.49015 0.81887,0.0371 0.86025,-0.007 0.86726,-0.92605 0.0106,-1.38471 0.69997,-2.22715 4.46064,-5.45077 l 0.63155,-0.54136 -0.13656,0.75234 c -0.11188,0.61631 -0.0757,0.68806 0.20025,0.39687 0.45372,-0.47882 0.68866,-3.26126 0.30756,-3.64237 -0.21614,-0.21614 -0.17819,-0.52172 0.14277,-1.14958 0.50149,-0.98101 0.99302,-7.6372 1.12799,-15.27497 0.045,-2.54662 0.1139,-4.74927 0.15311,-4.89479 0.16292,-0.60461 -0.35318,-1.74836 -0.72461,-1.60583 -0.45011,0.17272 -1.6217,-1.01144 -1.83278,-1.85247 -0.22535,-0.89786 -2.4852,-1.12143 -2.4852,-0.24587 0,0.18714 0.18614,0.41169 0.41364,0.49899 0.22751,0.0873 0.33194,0.29094 0.23207,0.45252 -0.20065,0.32467 -3.36946,0.0899 -4.1102,-0.30453 -0.31113,-0.16566 -0.68966,0.0497 -1.44276,0.82099 -0.56154,0.57506 -1.16693,1.04557 -1.34532,1.04557 -0.178385,0 -0.76066,-0.4115 -1.293942,-0.91445 -0.572492,-0.53993 -1.531395,-1.07777 -2.341293,-1.31322 -1.480119,-0.43028 -2.598855,-1.39797 -3.076164,-2.66085 -0.163697,-0.43311 -0.411539,-2.93342 -0.55076,-5.55625 -0.139221,-2.62282 -0.426093,-5.66174 -0.637494,-6.75314 -0.211401,-1.09141 -0.462612,-2.65908 -0.558247,-3.48372 -0.133967,-1.15517 -0.287585,-1.52908 -0.669207,-1.62888 -0.374904,-0.098 -0.495325,-0.37504 -0.495325,-1.13939 v -1.00986 l -1.785938,1.73138 c -2.197868,2.13074 -5.461041,4.46035 -8.850955,6.31878 l -2.567101,1.40735 2.081126,1.03761 c 2.901224,1.44649 4.897792,3.475 3.979118,4.04277 -0.46556,0.28773 -0.283186,0.92604 0.264583,0.92604 0.291042,0 0.529167,0.14243 0.529167,0.31651 0,0.17408 0.309003,0.7624 0.686675,1.30738 0.410118,0.5918 0.603811,1.12495 0.480929,1.32377 -0.39906,0.6457 -0.287858,1.69704 0.317215,2.99908 0.596251,1.28304 0.599381,1.33014 0.123072,1.85208 -0.268806,0.29455 -0.569977,0.80344 -0.669269,1.13087 -0.09929,0.32742 -0.34118,0.59531 -0.537528,0.59531 -0.196349,0 -0.418437,0.14883 -0.493531,0.33073 -0.08225,0.19923 -0.209321,0.0908 -0.319608,-0.27268 -0.176431,-0.58151 -0.221188,-0.56231 -1.233433,0.52917 -0.577697,0.62291 -1.561437,2.20413 -2.186088,3.51382 -1.095928,2.2978 -2.816217,6.8356 -2.737399,7.22074 0.02111,0.10318 -0.0384,0.36619 -0.132266,0.58447 -0.09386,0.21828 -0.266722,0.87217 -0.384135,1.45308 -0.126176,0.62427 -0.425217,1.1669 -0.731243,1.3269 -0.284772,0.14888 -1.033498,0.77492 -1.663836,1.39119 -0.630337,0.61627 -1.285181,1.12232 -1.455208,1.12455 -0.197448,0.003 -0.178892,0.0866 0.05136,0.23245 0.263379,0.16686 -0.375248,0.77164 -2.370564,2.2449 -1.502084,1.10908 -2.628249,2.01651 -2.50259,2.01651 0.125659,0 0.995589,-0.42899 1.933177,-0.95332 1.085518,-0.60706 1.796684,-0.86135 1.957935,-0.7001 0.275195,0.2752 -2.308005,1.91561 -5.083638,3.22828 -2.134072,1.00926 -2.607979,1.46327 -2.491129,2.38658 0.09092,0.71841 0.04443,0.75035 -1.34486,0.92393 -0.79147,0.0989 -2.064114,0.11277 -2.828098,0.0308 -3.768964,-0.40413 -4.116086,-0.40393 -4.272016,0.002 -0.194158,0.50597 -1.526095,1.05072 -3.136318,1.28272 -1.021937,0.14724 -1.256771,0.10681 -1.256771,-0.2164 0,-0.21861 0.119063,-0.47105 0.264584,-0.56099 0.524979,-0.32445 0.24907,-0.6236 -0.457061,-0.49556 -0.396904,0.072 -0.772902,0.18212 -0.835551,0.24477 -0.06265,0.0627 -0.269282,-0.015 -0.459183,-0.17264 -0.281133,-0.23332 -0.262215,-0.41721 0.101837,-0.9899 0.24591,-0.38683 0.568923,-0.79081 0.717805,-0.89772 0.316007,-0.22693 -0.04109,-0.27086 -1.671062,-0.2056 -0.9824,0.0393 -1.134718,-0.0239 -1.055886,-0.43848 0.05712,-0.30039 0.543558,-0.64027 1.280298,-0.89457 1.399913,-0.48321 2.849578,-1.17987 4.495469,-2.16037 1.203059,-0.71669 3.835385,-1.53055 4.950381,-1.53055 0.429481,0 0.60587,0.15405 0.60587,0.52916 0,0.75467 0.516778,0.65651 1.725653,-0.32776 0.57886,-0.47132 1.171534,-0.95266 1.317055,-1.06967 0.145521,-0.117 0.900891,-0.61499 1.678601,-1.10665 0.826374,-0.52242 2.704307,-2.3222 4.518781,-4.33072 3.606327,-3.99201 4.942074,-6.32542 5.97158,-10.43176 0.356062,-1.4202 0.776631,-2.82368 0.934598,-3.11885 0.157968,-0.29516 0.216243,-0.76027 0.129502,-1.03357 -0.200558,-0.6319 0.283018,-0.95552 0.594941,-0.39815 0.173978,0.31088 0.379483,-0.0781 0.796419,-1.50733 0.309065,-1.05948 0.526277,-1.96199 0.482693,-2.00558 -0.04358,-0.0436 -0.900671,0.0365 -1.904637,0.17804 -1.003967,0.1415 -3.194613,0.28586 -4.868103,0.32079 -2.831225,0.0591 -3.145749,0.0139 -4.525198,-0.65034 -1.698226,-0.81774 -5.264385,-4.3674 -5.264385,-5.24004 0,-0.29372 -0.113942,-0.74693 -0.253204,-1.00715 -0.207753,-0.38818 -0.378212,-1.27855 -0.521686,-2.72493 -0.01037,-0.10458 -0.197454,-0.1216 -0.415735,-0.0378 -0.654904,0.25131 -0.463273,-0.37579 0.890559,-2.91428 1.10582,-2.07346 1.352686,-2.82456 1.74999,-5.32442 0.585431,-3.68355 1.787597,-6.26102 2.559978,-5.48864 0.169782,0.16979 0.120696,0.59215 -0.141845,1.22049 -0.703006,1.68253 0.02073,1.03531 1.339463,-1.19785 2.600384,-4.40353 5.986481,-7.14256 10.259973,-8.29934 1.5592,-0.42206 1.71361,-0.53261 2.16032,-1.54668 0.264603,-0.60068 0.808251,-1.65673 1.208107,-2.34679 0.686895,-1.18541 0.717219,-1.37521 0.549556,-3.43958 -0.0976,-1.20172 -0.221739,-1.97658 -0.275866,-1.72192 -0.05413,0.25466 -0.194857,0.46302 -0.312735,0.46302 -0.301659,0 -0.53008,-0.98437 -0.552564,-2.38125 -0.01416,-0.87967 -0.380405,-1.91617 -1.402355,-3.96875 -0.760755,-1.52797 -1.527663,-2.74836 -1.70424,-2.71198 -0.176577,0.0364 -0.32105,-0.10068 -0.32105,-0.30459 0,-0.483 -1.838867,-1.59818 -2.484235,-1.50656 -0.384324,0.0546 -0.467526,-0.0527 -0.359968,-0.46399 0.147151,-0.56271 -0.286472,-0.88629 -1.256838,-0.93787 -0.371716,-0.0198 -0.506203,-0.18558 -0.451989,-0.5573 0.06321,-0.43338 0.02903,-0.45733 -0.188786,-0.13229 -0.56364,0.84107 -1.433558,0.31825 -1.176255,-0.70692 0.121633,-0.48463 0.05514,-0.55545 -0.407884,-0.43436 -0.448935,0.11739 -0.553211,0.0237 -0.553211,-0.49708 0,-0.35297 -0.168126,-0.87168 -0.373614,-1.1527 -0.410971,-0.56204 -0.304661,-0.70326 -1.213535,1.61211 -0.145328,0.37023 -0.413219,0.65378 -0.595313,0.63011 -0.739841,-0.0961 -0.992538,0.046 -0.992538,0.55815 0,1.05017 -2.519633,4.00719 -5.129484,6.01993 -1.224924,0.94466 -1.715951,1.55045 -2.298958,2.83624 -0.407743,0.89926 -1.15216,2.17321 -1.654262,2.83099 -0.502101,0.65779 -0.9931,1.4801 -1.091108,1.82736 -0.09801,0.34726 -0.315973,0.91062 -0.484366,1.25192 -0.277572,0.56259 -0.194484,0.72322 0.889579,1.7198 0.65766,0.60458 1.595473,1.31276 2.084029,1.57374 0.579838,0.30973 0.798286,0.56449 0.629104,0.73367 -0.408741,0.40875 -2.055548,-0.41246 -3.388656,-1.6898 -0.652872,-0.62556 -1.233384,-1.01123 -1.290027,-0.85704 -0.05664,0.15418 0.19519,0.52602 0.55963,0.82631 0.570862,0.47036 0.619745,0.62608 0.35301,1.12448 -0.173545,0.32427 -0.563945,0.57851 -0.888339,0.57851 h -0.578729 l 0.610335,0.42749 c 1.004115,0.70331 0.270743,0.97451 -1.042417,0.38549 -0.925483,-0.41514 -1.5017,-0.49203 -2.757467,-0.36798 -0.873125,0.0862 -1.728717,0.26779 -1.901316,0.40343 -0.437868,0.34411 -1.238137,-0.13453 -2.088082,-1.24886 -0.386989,-0.50737 -0.844676,-0.92249 -1.017083,-0.92249 -0.172406,0 -0.572258,-0.44649 -0.888561,-0.99219 -0.494888,-0.85381 -0.575942,-0.90673 -0.581172,-0.37948 -0.01587,1.60017 -1.142919,2.02743 -1.46614,0.55582 -0.09322,-0.42441 -0.279085,-0.77165 -0.413043,-0.77165 -0.133959,0 -0.243561,0.0654 -0.243561,0.14543 0,0.35453 0.78893,1.62028 1.295829,2.07901 0.30594,0.27687 0.556254,0.60402 0.556254,0.72698 0,0.44322 -0.647544,0.20922 -1.394787,-0.50403 l -0.762285,-0.7276 0.195809,0.79375 c 0.107695,0.43656 0.354912,1.17688 0.54937,1.64515 0.403822,0.97243 0.46379,1.92673 0.121076,1.92673 -0.215627,0 -0.413838,-0.42356 -1.083405,-2.31511 -0.141656,-0.40018 -0.570137,-2.03729 -0.952181,-3.63802 -0.382044,-1.60073 -0.861456,-3.17412 -1.065361,-3.49642 -0.203905,-0.3223 -0.370736,-0.75605 -0.370736,-0.96388 0,-0.20783 -0.185704,-0.44914 -0.412675,-0.53623 -0.361403,-0.13869 -0.387546,0.0797 -0.210419,1.75763 0.277063,2.62463 0.270138,3.34563 -0.03295,3.43072 -0.142545,0.04 -0.415162,-0.9988 -0.605815,-2.30849 -0.345891,-2.37608 -0.257627,-4.10104 0.209846,-4.10104 0.141875,0 0.125278,-0.26698 -0.03901,-0.62755 -0.157264,-0.34516 -0.482133,-0.61305 -0.721932,-0.59532 -0.312966,0.0231 -0.570823,-0.41572 -0.913786,-1.55525 -1.970094,-6.54584 -3.209106,-9.77022 -4.097253,-10.66262 -0.488831,-0.49118 -1.154084,-1.93988 -1.664568,-3.62488 -0.176347,-0.58209 -1.133382,-2.74318 -2.126745,-4.80244 -1.921313,-3.9829 -2.442645,-5.64476 -2.181071,-6.95263 0.09118,-0.45588 0.03293,-0.96717 -0.132963,-1.16706 -0.162376,-0.19565 -0.206966,-0.44402 -0.09909,-0.55193 0.107878,-0.10792 0.196142,-2.47821 0.196142,-5.26733 v -5.07111 l 0.908082,-2.31511 c 0.844662,-2.15342 1.326317,-2.71623 1.744915,-2.03893 0.09388,0.1519 0.0364,0.43798 -0.12772,0.63573 -0.213091,0.25676 -0.215832,0.38708 -0.0096,0.45583 0.198872,0.0663 0.17251,0.37289 -0.08465,0.98449 -0.323532,0.76945 -0.321697,0.99198 0.01372,1.66434 0.212952,0.42688 0.326722,1.00735 0.252822,1.28994 -0.129651,0.49579 0.192607,0.89235 0.742001,0.91309 0.308935,0.0117 0.196115,0.91752 -0.169755,1.36299 -0.249466,0.30374 -0.19874,1.0925 0.341874,5.31586 0.185346,1.44795 0.393102,2.18281 0.617113,2.18281 0.316354,0 0.562929,-3.34007 0.442847,-5.99876 -0.07615,-1.68609 0.971318,-5.82443 1.841647,-7.27595 1.680643,-2.80295 2.494139,-2.61757 1.651191,0.37627 -0.164916,0.58572 0.577777,0.63149 0.801157,0.0494 0.0873,-0.22751 0.265143,-0.34788 0.395203,-0.2675 0.13006,0.0804 0.383605,-0.0311 0.563432,-0.24781 0.432391,-0.521 1.160432,-0.51879 0.960236,0.003 -0.08376,0.21828 -0.02651,0.39688 0.12724,0.39688 0.180935,0 0.214515,0.38485 0.0952,1.09107 -0.132842,0.78629 -0.08568,1.15204 0.16883,1.30934 0.279788,0.17292 0.224376,0.39246 -0.266698,1.05668 -0.715264,0.96744 -2.000213,6.69558 -1.644538,7.33113 0.147997,0.26446 0.271798,0.0235 0.395621,-0.76989 0.09912,-0.63514 0.522491,-2.16682 0.940823,-3.40375 0.418331,-1.23693 0.831533,-2.67016 0.918225,-3.18496 0.112283,-0.66676 0.386125,-1.07097 0.952014,-1.40525 0.747195,-0.44138 0.804734,-0.44231 0.968444,-0.0157 0.09573,0.24946 0.02729,0.94136 -0.152081,1.53755 -1.039253,3.45418 -1.388372,8.70859 -0.653179,9.83064 0.269303,0.41101 0.42,1.16001 0.401209,1.9941 -0.01939,0.86079 0.156546,1.7017 0.494737,2.3646 0.288658,0.56582 0.524833,1.26593 0.524833,1.55579 0,0.54448 2.286402,4.03931 2.770033,4.23407 0.545769,0.21979 1.672937,1.61962 1.839945,2.28503 0.198109,0.78933 3.619221,5.77503 5.16494,7.52704 l 1.050436,1.19062 0.01128,-0.86869 c 0.02137,-1.64533 1.682977,-4.19218 3.780357,-5.79439 0.61707,-0.47139 0.862364,-1.0948 1.630167,-4.14307 0.49709,-1.97351 0.982962,-3.71628 1.079717,-3.87283 0.398173,-0.64426 1.16319,-5.97683 1.013802,-7.06674 L 58.663844,187.18051 57.51,189.44098 c -0.634613,1.24325 -1.153843,2.45866 -1.153843,2.70089 0,0.24224 -0.226713,0.68623 -0.503806,0.98665 -0.675551,0.73243 -1.187011,2.55364 -0.660399,2.35156 0.504923,-0.19376 0.468662,0.29732 -0.05398,0.73108 -0.233441,0.19374 -0.52815,0.62504 -0.65491,0.95844 -0.236772,0.62276 -0.772735,0.83829 -0.772735,0.31074 0,-0.16276 -0.231948,-0.23478 -0.516481,-0.16038 -0.284064,0.0743 -2.157443,1.72508 -3.005246,1.88413 -0.508804,0.0954 -0.992388,0.3489 -1.074632,0.56323 -0.192593,0.50189 -0.803897,0.49957 -1.222352,-0.005 -0.20709,-0.24953 -0.559019,-0.33615 -0.958439,-0.2359 -0.372551,0.0935 -0.631184,0.0417 -0.631184,-0.12655 0,-0.15673 -0.154189,-0.22579 -0.342643,-0.15348 -0.399485,0.1533 -1.50944,-1.02715 -1.50944,-1.60531 0,-0.54722 0.693848,-0.49659 0.934154,0.0682 0.169357,0.39801 0.22322,0.37015 0.383643,-0.19844 0.102643,-0.3638 0.09476,-0.84609 -0.01751,-1.07175 -0.262336,-0.52727 0.50918,-2.897 0.94318,-2.897 0.410847,0 0.70603,-2.28684 0.494442,-3.83055 -0.0902,-0.65809 -0.04127,-1.1967 0.117633,-1.29491 0.324285,-0.20042 -0.35458,-3.42405 -0.750057,-3.56169 -0.380952,-0.13259 -0.304727,-0.83785 0.09056,-0.83785 0.189177,0 0.486833,0.14288 0.661458,0.3175 0.246944,0.24695 0.317172,0.17345 0.316024,-0.33073 -0.0022,-0.97855 -0.498136,-2.56525 -0.93978,-3.00689 -0.215681,-0.21568 -0.391523,-0.72572 -0.39076,-1.13341 7.64e-4,-0.40769 -0.06982,-1.32469 -0.156851,-2.03777 -0.139632,-1.14406 -0.105603,-1.27632 0.289386,-1.12475 0.403304,0.15476 0.441114,-0.0705 0.38187,-2.27536 -0.03617,-1.34592 -0.346629,-3.87588 -0.68992,-5.62213 -0.504552,-2.56655 -0.5638,-3.28843 -0.309171,-3.76692 0.241971,-0.45471 0.243174,-0.83164 0.0052,-1.62595 -0.170391,-0.56872 -0.241858,-1.21109 -0.158815,-1.4275 0.08304,-0.21641 -0.0445,-1.09207 -0.283435,-1.94592 -0.739083,-2.6412 -0.751293,-2.74308 -0.32872,-2.74308 0.226558,0 0.848506,0.94124 1.486053,2.24895 2.807298,5.75824 3.282833,6.66545 3.879305,7.40078 l 0.637731,0.7862 0.776364,-0.74381 c 0.427,-0.40909 0.980942,-1.29866 1.230982,-1.97682 0.25004,-0.67816 0.963738,-2.48317 1.585995,-4.01114 0.622258,-1.52797 1.265253,-3.55203 1.42888,-4.49791 0.659315,-3.81135 0.859941,-4.63535 1.227497,-5.04149 0.211113,-0.23328 0.383841,-0.74219 0.383841,-1.13091 0,-0.38872 0.135702,-0.70677 0.301561,-0.70677 0.165858,0 0.461252,-0.20836 0.65643,-0.46302 0.310247,-0.4048 0.388263,-0.41312 0.620429,-0.0661 0.146058,0.21828 0.267383,0.60998 0.269612,0.87044 0.0022,0.26046 0.228748,0.9153 0.503377,1.45521 0.274629,0.5399 0.944166,2.29133 1.487859,3.89206 0.543693,1.60073 1.150394,3.22798 1.348225,3.61612 l 0.359692,0.7057 0.794557,-0.74223 c 0.929165,-0.86797 1.93866,-1.18435 2.618334,-0.8206 0.384391,0.20572 0.853214,-0.009 2.304704,-1.05359 1.002184,-0.72151 1.936011,-1.27389 2.075171,-1.2275 0.555435,0.18515 0.378037,0.61464 -0.439824,1.06485 -1.286876,0.70839 -2.91717,2.21847 -2.604022,2.41201 0.290137,0.17931 1.042881,-0.2475 2.887182,-1.63706 1.316198,-0.99167 2.023468,-1.08757 2.429231,-0.3294 0.224502,0.41949 0.198294,0.56648 -0.122983,0.68977 -0.887573,0.34059 -0.320062,0.51837 1.443798,0.45228 1.030912,-0.0386 1.852084,0.0411 1.852084,0.17975 0,0.13702 -0.446485,0.48484 -0.992188,0.77293 l -0.992187,0.52379 0.79375,0.005 c 0.436562,0.003 1.269896,-0.10499 1.851851,-0.23989 1.187556,-0.27528 1.73111,0.004 1.21607,0.62439 -0.269492,0.32472 -0.199938,0.40301 0.421317,0.47424 0.409252,0.0469 1.623612,-0.005 2.698578,-0.11544 2.000173,-0.20544 2.675726,-0.013 2.675726,0.76231 0,0.41739 -0.307159,0.47473 -0.674688,0.12595 -0.286899,-0.27227 -3.555519,0.1552 -3.929908,0.51395 -0.134986,0.12934 -0.460308,0.11053 -0.747632,-0.0433 -0.454393,-0.24318 -0.478025,-0.21498 -0.221503,0.26434 0.271426,0.50716 0.346819,0.51551 1.376209,0.15232 1.367766,-0.48258 3.677207,-0.49728 4.319665,-0.0275 0.58706,0.42927 0.309719,1.05853 -0.336638,0.7638 -0.24583,-0.11209 -1.161339,-0.14218 -2.034464,-0.0669 l -1.5875,0.13695 1.822598,0.19191 c 1.46962,0.15474 1.903954,0.30846 2.242681,0.79375 0.231045,0.33101 0.690798,0.85362 1.021673,1.16135 0.330874,0.30773 0.60159,0.66934 0.60159,0.80359 0,0.13425 0.267891,0.26402 0.595312,0.28839 0.327422,0.0244 0.811681,0.31092 1.07613,0.63677 0.444095,0.5472 0.545133,0.56515 1.322917,0.23505 1.202292,-0.51026 3.363595,-0.61894 4.149391,-0.20865 0.363802,0.18996 0.907045,0.81843 1.207206,1.39661 0.540784,1.04167 0.562441,1.05261 2.38125,1.2034 2.666605,0.22107 4.670998,0.89628 6.037648,2.03387 0.65345,0.54393 1.19567,1.1002 1.20494,1.23615 0.009,0.13596 0.26597,0.76174 0.57041,1.39064 0.64365,1.32961 1.29089,3.62343 1.29541,4.59094 0.002,0.44606 0.408,1.0697 1.20548,1.85208 0.66128,0.64876 1.68729,1.92371 2.28002,2.83321 0.59275,0.90951 1.21255,1.65761 1.37736,1.66245 1.17523,0.0345 4.61975,5.35361 5.09162,7.86255 0.0916,0.48716 0.32345,0.8599 0.53482,0.8599 0.20521,0 0.5059,0.32742 0.66822,0.7276 0.16231,0.40019 0.44676,1.0753 0.63211,1.50026 0.22716,0.52085 0.25786,0.98079 0.0942,1.41128 -0.20431,0.53736 -0.11666,0.7493 0.55284,1.33678 0.43761,0.38399 0.79565,0.85025 0.79565,1.03612 0,0.59838 0.45644,0.36003 0.74618,-0.38965 0.15467,-0.40018 0.437,-1.30881 0.62741,-2.01917 0.36352,-1.35622 0.94032,-1.71059 0.78479,-0.48216 -0.0498,0.39347 -0.32995,1.37024 -0.62252,2.17061 -0.88171,2.41205 -0.8874,2.59097 -0.0939,2.95254 0.54221,0.24705 0.6732,0.45683 0.56197,0.89999 -0.0798,0.31782 0.0337,0.93612 0.25214,1.374 0.62352,1.24988 -0.0125,2.16747 -0.91628,1.3219 -0.29072,-0.27198 -0.32426,-0.21324 -0.18882,0.33073 0.0906,0.3638 0.1663,0.75076 0.16827,0.8599 0.002,0.10914 0.16159,0.19844 0.35468,0.19844 0.23245,0 0.31497,0.24581 0.24429,0.7276 -0.0587,0.40018 0.14592,1.97776 0.45473,3.50573 0.30881,1.52797 0.62182,4.20687 0.69557,5.95312 0.20078,4.75419 0.19973,4.75028 1.29718,4.82849 1.07224,0.0764 1.23088,-0.36001 0.26446,-0.72744 -0.36381,-0.13832 -0.66146,-0.36647 -0.66146,-0.50701 0,-0.54655 0.55277,-0.54294 1.73189,0.0113 1.00171,0.47086 1.26988,0.51141 1.4504,0.21931 0.44186,-0.71494 3.3542,-1.08297 5.94583,-0.75137 3.40646,0.43586 3.93829,0.58867 4.21832,1.21203 0.20975,0.46691 0.53099,0.57144 2.01361,0.65522 1.83983,0.10396 1.79206,0.0813 5.14516,2.44325 0.7276,0.51253 1.53127,0.93609 1.78593,0.94124 0.57845,0.0117 0.60712,0.49983 0.0421,0.71665 -0.51556,0.19784 -2.00451,-0.48827 -3.31917,-1.52951 -1.34466,-1.06498 -3.33381,-1.91533 -3.88596,-1.66122 -0.24405,0.11233 -0.61258,0.21154 -0.81894,0.22047 -0.57424,0.0249 -0.65798,0.65543 -0.10982,0.82693 0.26676,0.0835 0.66362,0.24287 0.8819,0.35426 0.21828,0.11139 0.95662,0.2225 1.64076,0.24692 2.12277,0.0758 4.33779,1.2615 4.0945,2.19184 -0.072,0.27544 -0.0175,0.4265 0.12267,0.33987 0.66507,-0.41103 5.00958,2.37617 7.8598,5.04242 1.4229,1.33106 2.15727,2.40999 2.15727,3.16945 0,0.64553 -0.71927,0.47821 -0.89133,-0.20734 -0.16748,-0.66728 -2.26605,-3.19262 -2.47743,-2.98124 -0.0707,0.0707 0.1042,0.46283 0.38868,0.87139 0.28449,0.40856 0.90099,1.47125 1.37002,2.36153 0.46904,0.89028 1.14363,1.77435 1.49911,1.9646 0.42609,0.22804 0.59772,0.49911 0.50364,0.7955 -0.1395,0.43954 1.10571,2.17748 3.31914,4.63249 1.20812,1.33998 3.12192,4.58604 3.33655,5.65927 0.0963,0.48168 0.0294,0.96512 -0.16625,1.20087 -0.44646,0.53796 -0.75216,0.28665 -0.60265,-0.49543 0.1139,-0.59587 -1.4696,-3.90717 -2.03579,-4.2571 -0.11623,-0.0718 0.11757,0.81922 0.51955,1.98011 0.64382,1.85931 0.72433,2.4497 0.67598,4.95689 -0.0354,1.83772 -0.15432,2.82633 -0.33549,2.79014 -0.15893,-0.0317 -0.45966,1.00098 -0.69344,2.38125 -0.64845,3.82858 -1.06274,5.06882 -1.72619,5.16768 -0.31209,0.0465 -0.56743,0.25486 -0.56743,0.46302 0,0.20816 -0.15639,0.37847 -0.34755,0.37847 -0.25913,0 -0.36103,-0.64463 -0.40053,-2.53375 -0.031,-1.48224 -0.19997,-2.82731 -0.40717,-3.24114 -0.1948,-0.38907 -0.5562,-1.52906 -0.8031,-2.53331 -0.24689,-1.00426 -0.61933,-2.06924 -0.82763,-2.36664 -0.33908,-0.48409 -0.36142,-0.35522 -0.21333,1.23061 0.13382,1.43302 0.0935,1.77132 -0.2111,1.77132 -0.27116,0 -0.45984,-0.61108 -0.67432,-2.18398 -0.34314,-2.51642 -1.26755,-4.80645 -2.43211,-6.02505 -0.44595,-0.46665 -0.88003,-1.04294 -0.96463,-1.28065 -0.0846,-0.23771 -0.4942,-0.70026 -0.91024,-1.02788 l -0.75643,-0.59569 0.3638,1.38944 c 0.20853,0.7964 0.5936,1.54436 0.9022,1.75243 0.67049,0.45207 0.69328,0.82763 0.0502,0.82763 -0.75175,0 -1.27513,-0.77995 -1.6423,-2.4474 -0.35138,-1.59575 -0.62019,-1.8963 -0.86359,-0.96557 -0.086,0.32868 -0.2681,0.47992 -0.44577,0.37012 -0.16523,-0.10213 -0.23191,-0.36424 -0.14816,-0.58247 0.22277,-0.58054 -0.91988,-2.45165 -1.76362,-2.88797 -0.72356,-0.37416 -0.72559,-0.37272 -0.42013,0.2977 0.2291,0.5028 0.23073,0.74991 0.006,0.97418 -0.22426,0.22427 -0.37457,0.10499 -0.59253,-0.4702 -0.16062,-0.42388 -0.552,-1.05016 -0.86973,-1.39175 -0.62338,-0.67019 -2.53381,-1.74433 -2.73845,-1.5397 -0.0688,0.0688 0.12132,0.60815 0.42252,1.19854 0.63045,1.23578 0.68236,1.62414 0.21689,1.62255 -0.1819,-6.3e-4 -0.79065,-0.89702 -1.35278,-1.99198 -0.7861,-1.53122 -1.10012,-1.92607 -1.36017,-1.71025 -0.25417,0.21095 -0.54164,0.0236 -1.15797,-0.75455 -0.45092,-0.56934 -1.05924,-1.09776 -1.35181,-1.17427 -0.54269,-0.14192 -0.73703,0.18254 -0.27893,0.46567 0.13917,0.086 0.1868,0.32898 0.10585,0.53993 -0.11756,0.30634 -0.26171,0.32255 -0.71605,0.0805 -0.50686,-0.27002 -0.5306,-0.25666 -0.21783,0.12258 0.3997,0.48462 0.32576,1.55538 -0.11746,1.70113 -0.16257,0.0535 -0.36728,-0.26123 -0.45489,-0.69932 -0.0885,-0.44267 -0.72903,-1.38761 -1.44171,-2.12701 -1.1975,-1.24237 -1.36884,-1.33073 -2.58782,-1.33452 -0.71797,-0.002 -1.47759,-0.11298 -1.68803,-0.24612 -0.23405,-0.14808 -0.56897,-0.14234 -0.86257,0.0148 -0.37363,0.19996 -0.61797,0.10794 -1.10293,-0.41534 -0.34263,-0.36971 -0.75815,-0.6722 -0.92336,-0.6722 -0.16522,0 -0.31853,-0.14883 -0.34069,-0.33073 -0.0222,-0.1819 -0.0589,-0.44979 -0.0817,-0.59531 -0.0228,-0.14552 -0.29043,-0.66357 -0.59485,-1.15121 -0.52509,-0.84116 -0.56285,-0.85712 -0.73608,-0.3113 -0.1261,0.39728 -0.04,0.67963 0.27835,0.91238 0.31906,0.23331 0.368,0.39451 0.15898,0.52369 -0.20952,0.12949 -0.14258,0.35772 0.21861,0.74541 0.3354,0.36002 0.46799,0.76831 0.37274,1.14781 -0.0813,0.32397 -0.0243,0.66536 0.12663,0.75866 0.15096,0.0933 0.2074,0.34441 0.12542,0.55803 -0.0953,0.24838 0.0144,0.3884 0.30445,0.3884 0.2944,0 0.40006,0.13923 0.30119,0.39688 -0.0957,0.24938 0.003,0.39687 0.26496,0.39687 0.31016,0 0.3757,0.16562 0.25531,0.64525 -0.0891,0.35488 -0.0376,0.72209 0.11437,0.81601 0.15198,0.0939 0.19871,0.41529 0.10386,0.71414 -0.22542,0.71024 -0.31896,2.58651 -0.12908,2.58917 0.0812,0.001 0.27738,0.2819 0.43585,0.62393 0.24972,0.53898 0.17039,0.75417 -0.59531,1.61465 -0.48589,0.54603 -0.87995,1.06893 -0.87569,1.162 0.004,0.0931 0.37248,-0.23194 0.81826,-0.72226 0.74027,-0.81425 0.8653,-0.86216 1.44306,-0.55295 1.11319,0.59576 1.10179,1.31771 -0.0363,2.30154 l -1.0138,0.87636 1.0225,0.84283 c 0.56237,0.46355 1.38944,1.25382 1.83793,1.75614 0.44849,0.50233 1.26368,1.3999 1.81153,1.99461 0.54786,0.59471 1.06987,1.37895 1.16002,1.74275 0.0901,0.3638 0.32049,0.84277 0.51186,1.06438 0.21914,0.25375 0.26202,0.54197 0.11582,0.77852 -0.15499,0.25078 -0.0846,0.48777 0.21183,0.71314 0.28979,0.22034 0.32699,0.34047 0.10712,0.34596 -0.25904,0.006 -0.24793,0.14589 0.0481,0.60373 0.57157,0.88399 1.5037,3.37344 1.26312,3.37344 -0.11469,0 -0.13567,0.66185 -0.0466,1.47079 0.0965,0.87695 0.055,1.53683 -0.10273,1.63435 -0.14555,0.09 -0.31099,0.0245 -0.36765,-0.14552 -0.20846,-0.62538 -0.87744,0.42775 -0.70589,1.11124 0.27074,1.0787 -0.0739,1.72375 -0.88846,1.66308 -0.67455,-0.0502 -0.7395,-0.17513 -1.14519,-2.20196 -0.46153,-2.30583 -1.50564,-4.53199 -2.3824,-5.07953 -0.47799,-0.29852 -0.52347,-0.28199 -0.39011,0.1418 0.98645,3.1349 0.91449,9.18192 -0.12204,10.25459 -0.27342,0.28296 -0.57379,0.43781 -0.66748,0.34411 -0.0937,-0.0937 -0.20246,-1.42896 -0.24169,-2.96725 -0.0795,-3.11673 -0.79474,-5.61168 -1.84574,-6.4384 -0.32149,-0.25288 -0.79578,-1.11215 -1.05398,-1.90948 -0.2582,-0.79734 -0.63889,-1.62829 -0.84598,-1.84657 -0.31013,-0.3269 -0.30464,-0.19273 0.0312,0.76086 0.4808,1.36532 0.52712,3.14009 0.10917,4.18285 -0.1642,0.40965 -0.27522,1.84616 -0.24671,3.19222 0.0347,1.63756 -0.0447,2.4474 -0.23975,2.4474 -0.19789,0 -0.23369,0.43626 -0.11144,1.35787 0.14581,1.09911 0.10973,1.33445 -0.18932,1.23495 -0.2032,-0.0676 -0.42901,-0.41077 -0.50181,-0.76257 -0.0728,-0.35179 -0.33048,-1.00093 -0.57263,-1.44252 -0.24215,-0.44159 -0.52326,-1.24526 -0.62469,-1.78594 -0.10143,-0.54067 -0.28151,-0.98304 -0.40018,-0.98304 -0.31875,0 -1.04827,-1.57616 -1.04827,-2.26484 0,-0.44825 -0.12057,-0.56451 -0.48626,-0.46888 -0.39669,0.10374 -0.5906,-0.18109 -1.05261,-1.54612 l -0.56634,-1.67329 0.15797,2.91042 c 0.16377,3.01707 0.19919,3.1749 0.71252,3.17515 0.39512,2e-4 0.33366,13.42983 -0.0796,17.39601 -0.53997,5.18202 -1.14042,8.2049 -1.65658,8.33988 -0.57593,0.15061 -0.59005,0.52995 -0.0593,1.59381 0.42378,0.84948 0.63453,0.96485 2.30265,1.26049 0.5457,0.0967 0.99218,0.28166 0.99218,0.41098 0,0.31873 -1.3887,0.29762 -2.26193,-0.0344 -0.60362,-0.2295 -0.68476,-0.20664 -0.54639,0.15393 0.0894,0.2329 0.16249,0.53697 0.16249,0.6757 0,0.15249 0.2024,0.14394 0.51177,-0.0216 0.63442,-0.33953 1.6049,-0.35787 1.6049,-0.0303 0,0.13396 -0.35926,0.32247 -0.79835,0.41891 -0.49097,0.10784 -0.93643,0.447 -1.15699,0.88092 -0.37186,0.73156 -0.40617,3.13807 -0.0529,3.70968 0.47783,0.77315 -1.02837,1.27616 -2.00813,0.67064 -0.11934,-0.0738 -0.21962,0.0217 -0.22286,0.21224 -0.003,0.19196 -0.21215,0.0783 -0.46862,-0.25489 l -0.46274,-0.60123 -0.47125,0.79776 c -0.25919,0.43877 -0.73292,0.93507 -1.05273,1.10288 -0.31982,0.16781 -0.6767,0.46633 -0.79307,0.66337 -0.28117,0.47606 -0.69422,0.45426 -0.88649,-0.0468 z M 132.01772,262.035 c -0.34934,-1.29738 -1.94816,-4.64253 -2.52192,-5.27652 -0.20852,-0.23042 -0.37913,-0.60617 -0.37913,-0.835 0,-0.22883 -0.42217,-0.66513 -0.93815,-0.96957 l -0.93815,-0.55352 0.60808,0.85811 c 1.55037,2.18785 2.34976,3.79397 2.41782,4.85784 0.0372,0.58211 0.39141,1.33237 0.97578,2.06703 0.50453,0.63429 0.95491,1.11835 1.00086,1.07569 0.0459,-0.0427 -0.0554,-0.59349 -0.22519,-1.22406 z m -17.83793,-5.96818 c -0.21898,-0.94379 -0.30267,-1.06191 -0.41506,-0.58579 -0.27102,1.14803 -0.78765,0.88521 -0.78765,-0.40068 0,-0.66697 -0.0893,-1.21182 -0.19844,-1.21077 -0.10914,10e-4 -0.51373,0.49528 -0.8991,1.09831 -0.68424,1.0707 -0.68917,1.10874 -0.2104,1.62265 0.4362,0.4682 0.58007,0.48904 1.30447,0.18899 0.96327,-0.399 1.30139,-0.18125 0.84738,0.54573 -0.29385,0.47053 -0.27846,0.49299 0.15319,0.22342 0.41992,-0.26225 0.44561,-0.4474 0.20561,-1.48186 z m -4.22328,-4.37034 c 0.42439,-0.62484 1.04581,-1.43373 1.38093,-1.79753 0.40488,-0.43953 0.57069,-0.88339 0.49417,-1.32291 -0.26708,-1.53429 -1.08585,-4.37234 -1.28491,-4.45382 -0.1185,-0.0485 -0.21545,-0.31385 -0.21545,-0.58964 0,-0.42408 -0.0919,-0.45956 -0.59531,-0.22996 -0.57779,0.2635 -0.59691,0.39634 -0.64951,4.51076 -0.0298,2.3316 -0.13186,4.48397 -0.22678,4.78305 -0.25002,0.78774 0.20306,0.41599 1.09686,-0.89995 z M 123.825,241.13531 c 0,-0.46063 -0.47072,-0.2197 -0.60979,0.3121 -0.11679,0.44661 -0.0748,0.48827 0.23373,0.23218 0.20683,-0.17165 0.37606,-0.41658 0.37606,-0.54428 z m -0.79376,-1.37229 c 1e-5,-0.2678 -0.48303,-1.4e-4 -1.25676,0.69641 -0.95425,0.85906 -0.68559,1.06744 0.33072,0.25653 0.50932,-0.40639 0.92604,-0.83521 0.92604,-0.95294 z m -50.138534,-5.91794 c 2.627587,-1.85473 2.98394,-2.19302 1.455208,-1.38144 -1.582624,0.84018 -3.679841,2.37769 -4.497917,3.2975 l -0.661458,0.74372 0.79375,-0.58285 c 0.436563,-0.32056 1.74625,-1.25518 2.910417,-2.07693 z m 5.087717,-2.62681 c -0.08792,-0.0879 -0.316122,-0.0973 -0.507118,-0.0209 -0.211067,0.0845 -0.148372,0.14715 0.159852,0.15985 0.278915,0.0115 0.435185,-0.051 0.347266,-0.13896 z m 31.976107,-3.61043 c -0.0989,-0.61847 -0.28781,-3.98198 -0.41981,-7.47448 -0.132,-3.4925 -0.47131,-8.19547 -0.75404,-10.45104 -0.28273,-2.25558 -0.45965,-4.19034 -0.39317,-4.29948 0.0665,-0.10914 0.0246,-0.19889 -0.0932,-0.19943 -0.11773,-5.5e-4 -0.42488,-0.51378 -0.68256,-1.14052 -0.30125,-0.73274 -1.37864,-2.04819 -3.01802,-3.68491 l -2.54951,-2.54538 -0.83317,1.37079 c -1.642285,2.70205 -1.782403,3.03544 -2.800084,6.66247 -0.979082,3.48946 -1.363066,7.97878 -1.060067,12.39372 0.185709,2.70594 0.267994,3.046 0.902784,3.73095 0.384148,0.4145 0.698452,0.84469 0.698452,0.95598 0,0.1113 0.51384,0.4511 1.141865,0.75512 0.83328,0.40338 1.65558,0.55277 3.04271,0.55277 1.4843,0 1.90084,0.0841 1.90084,0.38373 0,0.21105 -0.18443,0.48694 -0.40984,0.61308 -0.31955,0.17883 -0.20297,0.29285 0.52917,0.51755 l 0.939,0.28819 v -1.13755 c 0,-0.74118 0.13155,-1.18803 0.37754,-1.28242 0.43971,-0.16874 0.68384,0.0967 1.41949,1.54346 0.29598,0.58208 0.79271,1.32777 1.10385,1.65707 0.31114,0.32931 0.48955,0.72196 0.39647,0.87257 -0.22823,0.36928 0.0516,1.04224 0.43335,1.04224 0.21385,0 0.25287,-0.34305 0.12792,-1.12448 z m -2.99097,0.32013 c -0.12021,-0.45968 -1.28681,-1.31232 -1.79555,-1.31232 -0.31889,0 0.64107,1.13151 1.2402,1.46182 0.33756,0.18611 0.63237,0.35005 0.65512,0.36432 0.0228,0.0143 -0.0221,-0.21695 -0.0998,-0.51382 z m -59.605146,-1.1637 c 0,-0.0638 -0.357188,-0.50703 -0.79375,-0.98501 -0.436563,-0.47797 -0.79375,-0.75973 -0.79375,-0.62612 0,0.13361 0.319931,0.57687 0.710959,0.98501 0.698884,0.72948 0.876541,0.85638 0.876541,0.62612 z m 55.781066,-0.64292 c -0.33849,-0.41739 -0.66552,-0.71457 -0.72673,-0.66042 -0.112,0.0991 1.03758,1.4193 1.23587,1.4193 0.0585,0 -0.17065,-0.34149 -0.50914,-0.75888 z m 7.47551,-4.53008 c 0.001,-1.6376 -0.0622,-3.04235 -0.14152,-3.12168 -0.0793,-0.0793 -0.14422,1.32422 -0.14422,3.11898 0,1.79475 0.0637,3.19951 0.14151,3.12168 0.0778,-0.0778 0.14274,-1.48137 0.14423,-3.11898 z m 10.66801,-5.9294 c -0.0992,-0.96798 -0.23754,-1.70274 -0.30747,-1.63281 -0.0699,0.0699 -0.0427,0.91583 0.0605,1.87975 0.10323,0.96393 0.24159,1.69869 0.30748,1.63281 0.0659,-0.0659 0.0386,-0.91177 -0.0605,-1.87975 z m -1.23583,-12.13115 c -0.37963,-1.12888 -0.67615,-0.85741 -0.4335,0.39688 0.11964,0.61846 0.23459,1.24354 0.25543,1.38906 0.0208,0.14552 0.12449,-0.0331 0.23032,-0.39687 0.10584,-0.36381 0.0823,-0.98888 -0.0523,-1.38907 z m -19.6398,-4.16718 c 0.0899,-0.14553 0.0374,-0.26459 -0.11667,-0.26459 -0.15411,0 -0.2802,0.11906 -0.2802,0.26459 0,0.14552 0.0525,0.26458 0.11667,0.26458 0.0642,0 0.19027,-0.11906 0.2802,-0.26458 z m 0.79777,-1.33069 c 0.43702,-0.84511 0.29465,-1.58736 -0.20805,-1.08466 -0.24615,0.24615 -0.49777,1.88618 -0.28939,1.88618 0.0456,0 0.26948,-0.36069 0.49744,-0.80152 z m 16.00327,-0.9432 c 0,-0.5433 -0.80506,-1.7191 -1.06645,-1.55755 -0.11815,0.073 -0.0166,0.59689 0.22565,1.16415 0.4266,0.99894 0.8408,1.19274 0.8408,0.3934 z m -2.98766,-5.86163 c -0.63904,-1.37929 -2.79826,-4.82907 -3.02252,-4.82907 -0.07,0 0.12685,0.38696 0.43735,0.8599 0.3105,0.47294 1.12586,1.89118 1.81192,3.15165 1.36749,2.51243 1.74192,2.9083 0.77325,0.81752 z m -9.70671,-14.73404 c -0.31786,-0.95518 -0.6198,-1.73669 -0.67096,-1.73669 -0.0512,0 -0.0843,0.38695 -0.0737,0.85989 0.0176,0.78299 0.99338,2.94271 1.22494,2.71115 0.0537,-0.0537 -0.16241,-0.87917 -0.48027,-1.83435 z m -1.83395,-3.54439 c -0.1427,-0.26663 -0.44727,-0.64066 -0.67683,-0.83118 -0.35965,-0.29848 -0.39313,-0.27718 -0.24206,0.15406 0.15362,0.43848 0.83059,1.1619 1.0873,1.1619 0.0501,0 -0.0257,-0.21815 -0.16841,-0.48478 z m -2.14043,-1.3673 c 0.34203,-0.22104 0.33504,-0.25704 -0.0505,-0.26054 -0.24607,-0.002 -0.520987,0.11501 -0.610924,0.26054 -0.206952,0.33485 0.143304,0.33485 0.661454,0 z m -1.587495,-0.54479 c 0,-0.13693 -0.320413,-0.24896 -0.712029,-0.24896 -0.677867,0 -0.687527,0.0179 -0.201355,0.37341 0.51924,0.37968 0.913384,0.32598 0.913384,-0.12445 z m -1.659158,-0.40882 c -0.08792,-0.0879 -0.316122,-0.0973 -0.507119,-0.0209 -0.211066,0.0845 -0.148372,0.14716 0.159853,0.15986 0.278915,0.0115 0.435184,-0.0511 0.347266,-0.13897 z m -4.080846,-2.25816 c -0.390336,-0.39033 -0.716429,-0.50364 -1.050984,-0.36517 -0.423538,0.17529 -0.384388,0.24555 0.308696,0.55399 1.152927,0.51309 1.385129,0.45402 0.742288,-0.18882 z m -7.358745,-1.01854 c 0.09269,-0.14998 -0.01351,-0.19434 -0.248968,-0.10398 -0.458369,0.17589 -0.542234,0.36554 -0.161649,0.36554 0.136933,0 0.321711,-0.1177 0.410617,-0.26156 z m -1.585627,-1.06136 c -0.08994,-0.14552 -0.461177,-0.26458 -0.82498,-0.26458 -0.373597,0 -0.590295,0.11514 -0.497936,0.26458 0.08994,0.14552 0.461177,0.26458 0.824979,0.26458 0.373598,0 0.590296,-0.11514 0.497937,-0.26458 z m -2.585199,-0.42444 c -0.08792,-0.0879 -0.316122,-0.0973 -0.507118,-0.0209 -0.211067,0.0845 -0.148373,0.14716 0.159852,0.15986 0.278915,0.0115 0.435184,-0.051 0.347266,-0.13897 z m 2.122178,-0.81628 c -0.254661,-0.0666 -0.67138,-0.0666 -0.926041,0 -0.254662,0.0665 -0.0463,0.121 0.463021,0.121 0.509323,0 0.717682,-0.0545 0.46302,-0.121 z m -3.108854,-0.44668 c 0,-0.0549 -0.208359,-0.2633 -0.463021,-0.46302 -0.419643,-0.3291 -0.429002,-0.31975 -0.09989,0.0999 0.345643,0.44073 0.562915,0.58089 0.562915,0.36312 z m 1.515842,-0.32454 c -0.08792,-0.0879 -0.316122,-0.0973 -0.507118,-0.0209 -0.211067,0.0845 -0.148372,0.14716 0.159853,0.15986 0.278915,0.0115 0.435184,-0.0511 0.347265,-0.13897 z m -6.879167,-1.85208 c -0.08792,-0.0879 -0.316121,-0.0973 -0.507118,-0.0209 -0.211066,0.0845 -0.148372,0.14716 0.159853,0.15985 0.278915,0.0115 0.435184,-0.051 0.347265,-0.13896 z m -9.346462,-3.49929 c -0.03351,-0.048 -0.577285,0.19013 -1.208384,0.52917 -0.6311,0.33903 -1.172497,0.62163 -1.203106,0.62798 -0.03061,0.006 0.0096,0.26102 0.08932,0.56592 0.13406,0.51265 0.229182,0.47196 1.264036,-0.54072 0.615487,-0.60229 1.091648,-1.13435 1.058136,-1.18235 z m 7.632183,2.161 c -0.181901,-0.0734 -0.479557,-0.0734 -0.661458,0 -0.181901,0.0734 -0.03307,0.13345 0.330729,0.13345 0.363802,0 0.51263,-0.06 0.330729,-0.13345 z m -2.349428,-1.71258 c 1.543026,-0.85089 1.308898,-1.00203 -0.410509,-0.26501 -1.142687,0.48981 -2.444009,1.588 -1.412852,1.19231 0.256366,-0.0984 1.076879,-0.51566 1.823361,-0.9273 z",
                "path":"M109.8946 302.9398c-.0855-.2228-.0809-.7778.0102-1.2334l.1657-.8284-.5973.5058c-.3285.2782-.6949.6589-.8142.8461-.125.1961-.6297.3166-1.1906.2843-.5355-.0309-1.2337.0839-1.5516.255-.7493.4033-2.3781.4008-2.6283-.004-.1073-.1736-.0414-.3662.1467-.4289.1878-.0626.5363-.3484.7745-.6351.44-.5298 1.5773-1.1279 1.974-1.0383.12.0271.1427-.0727.0505-.2219-.2586-.4184-2.3292-.3206-2.9883.1411-.3237.2267-.7074.3388-.8526.249-.3678-.2273-.33-.8573.0666-1.111.1819-.1164.3307-.4497.3307-.7407 0-.4286.1634-.5217.8599-.4902.8189.0371.8602-.007.8673-.926.0106-1.3847.7-2.2271 4.4606-5.4508l.6316-.5414-.1366.7523c-.1119.6163-.0757.6881.2002.3969.4537-.4788.6887-3.2613.3076-3.6424-.2161-.2161-.1782-.5217.1428-1.1496.5015-.981.993-7.6372 1.128-15.275.045-2.5466.1139-4.7493.1531-4.8948.1629-.6046-.3532-1.7484-.7246-1.6058-.4501.1727-1.6217-1.0114-1.8328-1.8525-.2254-.8979-2.4852-1.1214-2.4852-.2459 0 .1871.1861.4117.4136.499.2275.0873.3319.2909.2321.4525-.2006.3247-3.3695.0899-4.1102-.3045-.3111-.1657-.6897.0497-1.4428.821-.5615.5751-1.1669 1.0456-1.3453 1.0456-.1784 0-.7607-.4115-1.2939-.9144-.5725-.5399-1.5314-1.0778-2.3413-1.3132-1.4801-.4303-2.5989-1.398-3.0762-2.6608-.1637-.4331-.4115-2.9334-.5508-5.5562-.1392-2.6228-.4261-5.6617-.6375-6.7531-.2114-1.0914-.4626-2.6591-.5582-3.4837-.134-1.1552-.2876-1.5291-.6692-1.6289-.3749-.098-.4953-.375-.4953-1.1394V242.108l-1.7859 1.7314c-2.1979 2.1307-5.461 4.4604-8.851 6.3188l-2.5671 1.4074 2.0811 1.0376c2.9012 1.4465 4.8978 3.475 3.9791 4.0428-.4656.2877-.2832.926.2646.926.291 0 .5292.1424.5292.3165s.309.7624.6867 1.3074c.4101.5918.6038 1.125.4809 1.3238-.3991.6457-.2879 1.697.3172 2.9991.5963 1.283.5994 1.3301.1231 1.8521-.2688.2946-.57.8034-.6693 1.1309-.0993.3274-.3412.5953-.5375.5953-.1963 0-.4184.1488-.4935.3307-.0823.1992-.2093.0908-.3196-.2727-.1764-.5815-.2212-.5623-1.2334.5292-.5777.6229-1.5614 2.2041-2.1861 3.5138-1.0959 2.2978-2.8162 6.8356-2.7374 7.2207.0211.1032-.0384.3662-.1323.5845-.0939.2183-.2667.8722-.3841 1.4531-.1262.6243-.4252 1.1669-.7312 1.3269-.2848.1489-1.0335.7749-1.6638 1.3912-.6303.6163-1.2852 1.1223-1.4552 1.1245-.1974.003-.1789.0866.0514.2324.2634.1669-.3752.7716-2.3706 2.2449-1.5021 1.1091-2.6282 2.0165-2.5026 2.0165s.9956-.429 1.9332-.9533c1.0855-.6071 1.7967-.8614 1.9579-.7001.2752.2752-2.308 1.9156-5.0836 3.2283-2.1341 1.0093-2.608 1.4633-2.4911 2.3866.0909.7184.0444.7504-1.3449.9239-.7915.0989-2.0641.1128-2.8281.0308-3.769-.4041-4.1161-.4039-4.272.002-.1942.506-1.5261 1.0507-3.1363 1.2827-1.0219.1472-1.2568.1068-1.2568-.2164 0-.2186.1191-.471.2646-.561.525-.3245.2491-.6236-.4571-.4956-.3969.072-.7729.1821-.8356.2448-.0626.0627-.2693-.015-.4592-.1726-.2811-.2333-.2622-.4172.1018-.9899.2459-.3868.5689-.7908.7178-.8977.316-.2269-.0411-.2709-1.6711-.2056-.9824.0393-1.1347-.0239-1.0559-.4385.0571-.3004.5436-.6403 1.2803-.8946 1.3999-.4832 2.8496-1.1799 4.4955-2.1604 1.2031-.7167 3.8354-1.5306 4.9504-1.5306.4295 0 .6059.154.6059.5292 0 .7547.5168.6565 1.7257-.3278.5789-.4713 1.1715-.9527 1.3171-1.0697.1455-.117.9009-.615 1.6786-1.1067.8264-.5224 2.7043-2.3222 4.5188-4.3307 3.6063-3.992 4.9421-6.3254 5.9716-10.4318.3561-1.4202.7766-2.8237.9346-3.1189.158-.2952.2162-.7603.1295-1.0336-.2006-.6319.283-.9555.5949-.3981.174.3109.3795-.0781.7964-1.5073.3091-1.0595.5263-1.962.4827-2.0056-.0436-.0436-.9007.0365-1.9046.178-1.004.1415-3.1946.2859-4.8681.3208-2.8312.0591-3.1457.0139-4.5252-.6503-1.6982-.8177-5.2644-4.3674-5.2644-5.24 0-.2937-.1139-.7469-.2532-1.0071-.2078-.3882-.3782-1.2785-.5217-2.7249-.0104-.1046-.1975-.1216-.4157-.0378-.6549.2513-.4633-.3758.8906-2.9143 1.1058-2.0735 1.3527-2.8246 1.75-5.3244.5854-3.6835 1.7876-6.261 2.56-5.4886.1698.1698.1207.5922-.1418 1.2205-.703 1.6825.0207 1.0353 1.3395-1.1978 2.6004-4.4035 5.9865-7.1426 10.26-8.2993 1.5592-.4221 1.7136-.5326 2.1603-1.5467.2646-.6007.8083-1.6567 1.2081-2.3468.6869-1.1854.7172-1.3752.5496-3.4396-.0976-1.2017-.2217-1.9766-.2759-1.7219-.0541.2547-.1949.463-.3127.463-.3017 0-.5301-.9844-.5526-2.3812-.0142-.8797-.3804-1.9162-1.4024-3.9688-.7608-1.528-1.5277-2.7484-1.7042-2.712-.1766.0364-.321-.1007-.321-.3046 0-.483-1.8389-1.5982-2.4842-1.5066-.3843.0546-.4675-.0527-.36-.464.1472-.5627-.2865-.8863-1.2568-.9379-.3717-.0198-.5062-.1856-.452-.5573.0632-.4334.029-.4573-.1888-.1323-.5636.8411-1.4336.3183-1.1763-.7069.1216-.4846.0551-.5555-.4079-.4344-.4489.1174-.5532.0237-.5532-.4971 0-.353-.1681-.8717-.3736-1.1527-.411-.562-.3047-.7033-1.2135 1.6121-.1453.3702-.4132.6538-.5953.6301-.7398-.0961-.9925.046-.9925.5582 0 1.0502-2.5196 4.0072-5.1295 6.0199-1.2249.9447-1.716 1.5505-2.299 2.8362-.4077.8993-1.1522 2.1732-1.6543 2.831-.5021.6578-.9931 1.4801-1.0911 1.8274-.098.3473-.316.9106-.4844 1.2519-.2776.5626-.1945.7232.8896 1.7198.6577.6046 1.5955 1.3128 2.084 1.5737.5798.3097.7983.5645.6291.7337-.4087.4087-2.0555-.4125-3.3887-1.6898-.6529-.6256-1.2334-1.0112-1.29-.857-.0566.1542.1952.526.5596.8263.5709.4704.6197.6261.353 1.1245-.1735.3243-.5639.5785-.8883.5785h-.5787l.6103.4275c1.0041.7033.2707.9745-1.0424.3855-.9255-.4151-1.5017-.492-2.7575-.368-.8731.0862-1.7287.2678-1.9013.4034-.4379.3441-1.2381-.1345-2.0881-1.2489-.387-.5074-.8447-.9225-1.0171-.9225-.1724 0-.5723-.4465-.8886-.9922-.4949-.8538-.5759-.9067-.5812-.3795-.0159 1.6002-1.1429 2.0274-1.4661.5558-.0932-.4244-.2791-.7716-.413-.7716-.134 0-.2436.0654-.2436.1454 0 .3545.7889 1.6203 1.2958 2.079.3059.2769.5563.604.5563.727 0 .4432-.6475.2092-1.3948-.504l-.7623-.7276.1958.7937c.1077.4366.3549 1.1769.5494 1.6452.4038.9724.4638 1.9267.1211 1.9267-.2156 0-.4138-.4236-1.0834-2.3151-.1417-.4002-.5701-2.0373-.9522-3.638s-.8615-3.1741-1.0654-3.4964c-.2039-.3223-.3707-.756-.3707-.9639s-.1857-.4491-.4127-.5362c-.3614-.1387-.3875.0797-.2104 1.7576.2771 2.6246.2701 3.3456-.0329 3.4307-.1425.04-.4152-.9988-.6058-2.3085-.3459-2.3761-.2576-4.101.2098-4.101.1419 0 .1253-.267-.039-.6276-.1573-.3452-.4821-.613-.7219-.5953-.313.0231-.5708-.4157-.9138-1.5553-1.9701-6.5458-3.2091-9.7702-4.0973-10.6626-.4888-.4912-1.1541-1.9399-1.6646-3.6249-.1763-.5821-1.1334-2.7432-2.1267-4.8024-1.9213-3.9829-2.4426-5.6448-2.1811-6.9526.0912-.4559.0329-.9672-.133-1.1671-.1624-.1957-.207-.444-.0991-.5519.1079-.1079.1961-2.4782.1961-5.2673v-5.0711l.9081-2.3151c.8447-2.1534 1.3263-2.7162 1.7449-2.0389.0939.1519.0364.438-.1277.6357-.2131.2568-.2158.3871-.0096.4558.1989.0663.1725.3729-.0846.9845-.3235.7695-.3217.992.0137 1.6643.213.4269.3267 1.0074.2528 1.2899-.1297.4958.1926.8923.742.9131.3089.0117.1961.9175-.1698 1.363-.2495.3037-.1987 1.0925.3419 5.3159.1853 1.4479.3931 2.1828.6171 2.1828.3164 0 .5629-3.3401.4428-5.9988-.0761-1.6861.9713-5.8244 1.8416-7.2759 1.6806-2.803 2.4941-2.6176 1.6512.3763-.1649.5857.5778.6315.8012.0494.0873-.2275.2651-.3479.3952-.2675.1301.0804.3836-.0311.5634-.2478.4324-.521 1.1604-.5188.9602.003-.0838.2183-.0265.3969.1272.3969.1809 0 .2145.3849.0952 1.0911-.1328.7863-.0857 1.152.1688 1.3093.2798.1729.2244.3925-.2667 1.0567-.7153.9674-2.0002 6.6956-1.6445 7.3311.148.2645.2718.0235.3956-.7699.0991-.6351.5225-2.1668.9408-3.4038.4183-1.2369.8315-2.6702.9182-3.185.1123-.6668.3861-1.071.952-1.4052.7472-.4414.8047-.4423.9684-.0157.0957.2495.0273.9414-.1521 1.5376-1.0393 3.4542-1.3884 8.7086-.6532 9.8306.2693.411.42 1.16.4012 1.9941-.0194.8608.1565 1.7017.4947 2.3646.2887.5658.5248 1.2659.5248 1.5558 0 .5445 2.2864 4.0393 2.77 4.2341.5458.2198 1.6729 1.6196 1.8399 2.285.1981.7893 3.6192 5.775 5.1649 7.527l1.0504 1.1906.0113-.8687c.0214-1.6453 1.683-4.1922 3.7804-5.7944.6171-.4714.8624-1.0948 1.6302-4.1431.4971-1.9735.983-3.7163 1.0797-3.8728.3982-.6443 1.1632-5.9768 1.0138-7.0667l-.158-1.1527L57.51 189.441c-.6346 1.2432-1.1538 2.4587-1.1538 2.7009 0 .2422-.2267.6862-.5038.9866-.6756.7324-1.187 2.5536-.6604 2.3516.5049-.1938.4687.2973-.054.7311-.2334.1937-.5281.625-.6549.9584-.2368.6228-.7727.8383-.7727.3107 0-.1628-.2319-.2348-.5165-.1604-.2841.0743-2.1574 1.7251-3.0052 1.8841-.5088.0954-.9924.3489-1.0746.5632-.1926.5019-.8039.4996-1.2224-.005-.2071-.2495-.559-.3362-.9584-.2359-.3726.0935-.6312.0417-.6312-.1266 0-.1567-.1542-.2258-.3426-.1535-.3995.1533-1.5094-1.0272-1.5094-1.6053 0-.5472.6938-.4966.9342.0682.1694.398.2232.3701.3836-.1984.1026-.3638.0948-.8461-.0175-1.0718-.2623-.5273.5092-2.897.9432-2.897.4108 0 .706-2.2868.4944-3.8305-.0902-.6581-.0413-1.1967.1176-1.2949.3243-.2004-.3546-3.424-.7501-3.5617-.381-.1326-.3047-.8379.0906-.8379.1892 0 .4868.1429.6615.3175.2469.2469.3172.1735.316-.3307-.0022-.9786-.4981-2.5652-.9398-3.0069-.2157-.2157-.3915-.7257-.3908-1.1334.0008-.4077-.0698-1.3247-.1569-2.0378-.1396-1.1441-.1056-1.2763.2894-1.1248.4033.1548.4411-.0705.3819-2.2754-.0362-1.3459-.3466-3.8759-.6899-5.6221-.5046-2.5666-.5638-3.2884-.3092-3.7669.242-.4547.2432-.8316.0052-1.6259-.1704-.5687-.2419-1.2111-.1588-1.4275.083-.2164-.0445-1.0921-.2834-1.9459-.7391-2.6412-.7513-2.7431-.3287-2.7431.2266 0 .8485.9412 1.4861 2.249 2.8073 5.7582 3.2828 6.6654 3.8793 7.4008l.6377.7862.7764-.7438c.427-.4091.9809-1.2987 1.231-1.9768s.9637-2.4832 1.586-4.0111c.6223-1.528 1.2653-3.552 1.4289-4.4979.6593-3.8114.8599-4.6353 1.2275-5.0415.2111-.2333.3838-.7422.3838-1.1309s.1357-.7068.3016-.7068c.1659 0 .4613-.2084.6564-.463.3102-.4048.3883-.4131.6204-.0661.1461.2183.2674.61.2696.8704.0022.2605.2287.9153.5034 1.4552.2746.5399.9442 2.2913 1.4879 3.8921s1.1504 3.228 1.3482 3.6161l.3597.7057.7946-.7422c.9292-.868 1.9387-1.1843 2.6183-.8206.3844.2057.8532-.009 2.3047-1.0536 1.0022-.7215 1.936-1.2739 2.0752-1.2275.5554.1851.378.6146-.4398 1.0649-1.2869.7084-2.9172 2.2185-2.604 2.412.2901.1793 1.0429-.2475 2.8872-1.6371 1.3162-.9917 2.0235-1.0876 2.4292-.3294.2245.4195.1983.5665-.123.6898-.8876.3406-.3201.5184 1.4438.4523 1.0309-.0386 1.8521.0411 1.8521.1798 0 .137-.4465.4848-.9922.7729l-.9922.5238.7938.005c.4366.003 1.2699-.105 1.8519-.2399 1.1876-.2753 1.7311.004 1.2161.6244-.2695.3247-.1999.403.4213.4742.4093.0469 1.6236-.005 2.6986-.1154 2.0002-.2054 2.6757-.013 2.6757.7623 0 .4174-.3072.4747-.6747.1259-.2869-.2723-3.5555.1552-3.9299.5139-.135.1293-.4603.1105-.7476-.0433-.4544-.2432-.478-.215-.2215.2643.2714.5072.3468.5155 1.3762.1523 1.3678-.4826 3.6772-.4973 4.3197-.0275.5871.4293.3097 1.0585-.3366.7638-.2458-.1121-1.1613-.1422-2.0345-.0669l-1.5875.137 1.8226.1919c1.4696.1547 1.904.3085 2.2427.7937.231.331.6908.8536 1.0217 1.1613.3309.3077.6016.6693.6016.8036s.2679.264.5953.2884c.3274.0244.8117.3109 1.0761.6368.4441.5472.5451.5651 1.3229.2351 1.2023-.5103 3.3636-.6189 4.1494-.2087.3638.19.907.8184 1.2072 1.3966.5408 1.0417.5624 1.0526 2.3812 1.2034 2.6666.2211 4.671.8963 6.0376 2.0339.6535.5439 1.1957 1.1002 1.2049 1.2362.009.136.266.7617.5704 1.3906.6436 1.3296 1.2909 3.6234 1.2954 4.5909.002.4461.408 1.0697 1.2055 1.8521.6613.6488 1.6873 1.9237 2.28 2.8332.5927.9095 1.2125 1.6576 1.3774 1.6625 1.1752.0345 4.6197 5.3536 5.0916 7.8625.0916.4872.3234.8599.5348.8599.2052 0 .5059.3274.6682.7276.1623.4002.4468 1.0753.6321 1.5003.2272.5208.2579.9808.0942 1.4113-.2043.5374-.1167.7493.5528 1.3368.4376.384.7956.8502.7956 1.0361 0 .5984.4564.36.7462-.3896.1547-.4002.437-1.3088.6274-2.0192.3635-1.3562.9403-1.7106.7848-.4822-.0498.3935-.3299 1.3702-.6225 2.1706-.8817 2.412-.8874 2.591-.0939 2.9525.5422.2471.6732.4568.562.9-.0798.3178.0337.9361.2521 1.374.6235 1.2499-.0125 2.1675-.9163 1.3219-.2907-.272-.3243-.2132-.1888.3307.0906.3638.1663.7508.1683.8599.002.1091.1616.1984.3547.1984.2325 0 .315.2458.2443.7276-.0587.4002.1459 1.9778.4547 3.5057s.6218 4.2069.6956 5.9531c.2008 4.7542.1997 4.7503 1.2972 4.8285 1.0722.0764 1.2309-.36.2645-.7274-.3638-.1383-.6615-.3665-.6615-.507 0-.5465.5528-.5429 1.7319.0113 1.0017.4709 1.2699.5114 1.4504.2193.4419-.7149 3.3542-1.083 5.9458-.7514 3.4065.4359 3.9383.5887 4.2183 1.212.2098.4669.531.5714 2.0136.6552 1.8398.104 1.7921.0813 5.1452 2.4433.7276.5125 1.5313.9361 1.7859.9412.5785.0117.6071.4998.0421.7166-.5156.1978-2.0045-.4883-3.3192-1.5295-1.3447-1.065-3.3338-1.9153-3.886-1.6612-.244.1123-.6126.2115-.8189.2205-.5742.0249-.658.6554-.1098.8269.2668.0835.6636.2429.8819.3543s.9566.2225 1.6408.2469c2.1228.0758 4.3378 1.2615 4.0945 2.1918-.072.2754-.0175.4265.1227.3399.6651-.411 5.0096 2.3762 7.8598 5.0424 1.4229 1.3311 2.1573 2.41 2.1573 3.1695 0 .6455-.7193.4782-.8913-.2073-.1675-.6673-2.2661-3.1926-2.4774-2.9812-.0707.0707.1042.4628.3887.8714.2845.4086.901 1.4712 1.37 2.3615.469.8903 1.1436 1.7743 1.4991 1.9646.4261.228.5977.4991.5036.7955-.1395.4395 1.1057 2.1775 3.3191 4.6325 1.2081 1.34 3.1219 4.586 3.3365 5.6593.0963.4817.0294.9651-.1662 1.2009-.4465.538-.7522.2867-.6027-.4954.1139-.5959-1.4696-3.9072-2.0358-4.2571-.1162-.0718.1176.8192.5196 1.9801.6438 1.8593.7243 2.4497.676 4.9569-.0354 1.8377-.1543 2.8263-.3355 2.7901-.1589-.0317-.4597 1.001-.6934 2.3813-.6484 3.8286-1.0627 5.0688-1.7262 5.1677-.3121.0465-.5674.2549-.5674.463 0 .2082-.1564.3785-.3476.3785-.2591 0-.361-.6446-.4005-2.5337-.031-1.4822-.2-2.8273-.4072-3.2411-.1948-.3891-.5562-1.5291-.8031-2.5333-.2469-1.0043-.6193-2.0692-.8276-2.3666-.3391-.4841-.3614-.3552-.2133 1.2306.1338 1.433.0935 1.7713-.2111 1.7713-.2712 0-.4598-.6111-.6743-2.184-.3431-2.5164-1.2675-4.8065-2.4321-6.025-.446-.4666-.88-1.0429-.9646-1.2807-.0846-.2377-.4942-.7003-.9102-1.0279l-.7564-.5957.3638 1.3894c.2085.7964.5936 1.5444.9022 1.7524.6705.4521.6933.8276.0502.8276-.7517 0-1.2751-.78-1.6423-2.4474-.3514-1.5958-.6202-1.8963-.8636-.9656-.086.3287-.2681.4799-.4458.3701-.1652-.1021-.2319-.3642-.1482-.5825.2228-.5805-.9199-2.4517-1.7636-2.888-.7236-.3742-.7256-.3727-.4201.2977.2291.5028.2307.7499.006.9742-.2243.2243-.3746.105-.5925-.4702-.1606-.4239-.552-1.0502-.8697-1.3918-.6234-.6702-2.5338-1.7443-2.7385-1.5397-.0688.0688.1213.6081.4225 1.1985.6304 1.2358.6824 1.6241.2169 1.6225-.1819-.0006-.7906-.897-1.3528-1.992-.7861-1.5312-1.1001-1.9261-1.3602-1.7103-.2542.2109-.5416.0236-1.158-.7545-.4509-.5693-1.0592-1.0978-1.3518-1.1743-.5427-.1419-.737.1825-.2789.4657.1392.086.1868.329.1059.5399-.1176.3063-.2617.3226-.716.0805-.5069-.27-.5306-.2567-.2178.1226.3997.4846.3258 1.5554-.1175 1.7011-.1626.0535-.3673-.2612-.4549-.6993-.0885-.4427-.729-1.3876-1.4417-2.127-1.1975-1.2424-1.3688-1.3307-2.5878-1.3345-.718-.002-1.4776-.113-1.688-.2461-.234-.1481-.569-.1423-.8626.0148-.3736.2-.618.1079-1.1029-.4153-.3426-.3697-.7582-.6722-.9234-.6722-.1652 0-.3185-.1488-.3407-.3307-.0222-.1819-.0589-.4498-.0817-.5953s-.2904-.6636-.5948-1.1512c-.5251-.8412-.5628-.8571-.7361-.3113-.1261.3973-.04.6796.2784.9124.3191.2333.368.3945.159.5237-.2095.1295-.1426.3577.2186.7454.3354.36.468.7683.3727 1.1478-.0813.324-.0243.6654.1266.7587.151.0933.2074.3444.1254.558-.0953.2484.0144.3884.3045.3884.2944 0 .4001.1392.3012.3969-.0957.2494.003.3969.265.3969.3102 0 .3757.1656.2553.6453-.0891.3549-.0376.7221.1144.816.152.0939.1987.4153.1039.7141-.2254.7102-.319 2.5865-.1291 2.5892.0812.001.2774.2819.4359.6239.2497.539.1704.7542-.5953 1.6147-.4859.546-.8799 1.0689-.8757 1.162.004.0931.3725-.2319.8183-.7223.7403-.8142.8653-.8622 1.4431-.553 1.1132.5958 1.1018 1.3177-.0363 2.3015l-1.0138.8764 1.0225.8428c.5624.4635 1.3894 1.2538 1.8379 1.7561.4485.5023 1.2637 1.3999 1.8115 1.9946.5479.5947 1.0699 1.379 1.16 1.7428.0901.3638.3205.8428.5119 1.0644.2191.2537.262.542.1158.7785-.155.2508-.0846.4878.2118.7131.2898.2203.327.3405.1071.346-.259.006-.2479.1459.0481.6037.5716.884 1.5037 3.3734 1.2631 3.3734-.1147 0-.1357.6619-.0466 1.4708.0965.877.055 1.5368-.1027 1.6343-.1455.09-.311.0245-.3676-.1455-.2085-.6254-.8774.4278-.7059 1.1112.2707 1.0787-.0739 1.7237-.8885 1.6631-.6746-.0502-.7395-.1751-1.1452-2.202-.4615-2.3058-1.5056-4.532-2.3824-5.0795-.478-.2985-.5235-.282-.3901.1418.9864 3.1349.9145 9.1819-.122 10.2546-.2734.283-.5738.4378-.6675.3441-.0937-.0937-.2025-1.429-.2417-2.9672-.0795-3.1167-.7947-5.6117-1.8457-6.4384-.3215-.2529-.7958-1.1121-1.054-1.9095-.2582-.7973-.6389-1.6283-.846-1.8466-.3101-.3269-.3046-.1927.0312.7609.4808 1.3653.5271 3.1401.1092 4.1828-.1642.4096-.2752 1.8462-.2467 3.1922.0347 1.6376-.0447 2.4474-.2398 2.4474-.1979 0-.2337.4363-.1114 1.3579.1458 1.0991.1097 1.3345-.1893 1.235-.2032-.0676-.429-.4108-.5018-.7626-.0728-.3518-.3305-1.0009-.5726-1.4425-.2421-.4416-.5233-1.2453-.6247-1.7859-.1014-.5407-.2815-.983-.4002-.983-.3187 0-1.0483-1.5762-1.0483-2.2648 0-.4482-.1206-.5645-.4863-.4689-.3967.1037-.5906-.1811-1.0526-1.5461l-.5663-1.6733.158 2.9104c.1638 3.0171.1992 3.1749.7125 3.1751.3951.0002.3337 13.4298-.0796 17.396-.54 5.182-1.1404 8.2049-1.6566 8.3399-.5759.1506-.5901.5299-.0593 1.5938.4238.8495.6345.9649 2.3026 1.2605.5457.0967.9922.2817.9922.411 0 .3187-1.3887.2976-2.2619-.0344-.6036-.2295-.6848-.2066-.5464.1539.0894.2329.1625.537.1625.6757 0 .1525.2024.1439.5118-.0216.6344-.3395 1.6049-.3579 1.6049-.0303 0 .134-.3593.3225-.7983.4189-.491.1078-.9364.447-1.157.8809-.3719.7316-.4062 3.1381-.0529 3.7097.4778.7731-1.0284 1.2762-2.0081.6706-.1193-.0738-.2196.0217-.2229.2122-.003.192-.2121.0783-.4686-.2549l-.4627-.6012-.4712.7978c-.2592.4388-.7329.9351-1.0527 1.1029-.3198.1678-.6767.4663-.7931.6634-.2812.4761-.6942.4543-.8865-.0468Zm22.1231-40.9047c-.3493-1.2974-1.9482-4.6425-2.5219-5.2765-.2085-.2304-.3791-.6062-.3791-.835s-.4222-.6651-.9382-.9696l-.9381-.5535.6081.8581c1.5504 2.1879 2.3498 3.794 2.4178 4.8578.0372.5821.3914 1.3324.9758 2.067.5045.6343.9549 1.1184 1.0009 1.0757.0459-.0427-.0554-.5935-.2252-1.2241Zm-17.8379-5.9682c-.219-.9438-.3027-1.0619-.4151-.5858-.271 1.148-.7876.8852-.7876-.4007 0-.667-.0893-1.2118-.1984-1.2108-.1091.001-.5137.4953-.8991 1.0983-.6842 1.0707-.6892 1.1087-.2104 1.6227.4362.4682.5801.489 1.3045.189.9633-.399 1.3014-.1812.8474.5457-.2939.4705-.2785.493.1532.2234.4199-.2622.4456-.4474.2056-1.4819Zm-4.2233-4.3703c.4244-.6248 1.0458-1.4337 1.3809-1.7975.4049-.4395.5707-.8834.4942-1.3229-.2671-1.5343-1.0858-4.3723-1.2849-4.4538-.1185-.0485-.2155-.3139-.2155-.5896 0-.4241-.0919-.4596-.5953-.23-.5778.2635-.5969.3963-.6495 4.5108-.0298 2.3316-.1319 4.484-.2268 4.7831-.25.7877.2031.416 1.0969-.8999Zm13.8685-10.5612c0-.4606-.4707-.2197-.6098.3121-.1168.4466-.0748.4883.2337.2322.2068-.1716.3761-.4166.3761-.5443Zm-.7938-1.3723c0-.2678-.483-.0001-1.2568.6964-.9543.8591-.6856 1.0674.3307.2565.5093-.4064.926-.8352.926-.9529Zm-50.1385-5.9179c2.6276-1.8547 2.9839-2.193 1.4552-1.3814-1.5826.8402-3.6798 2.3777-4.4979 3.2975l-.6615.7437.7938-.5829c.4366-.3206 1.7463-1.2552 2.9104-2.0769Zm5.0877-2.6268c-.0879-.0879-.3161-.0973-.5071-.0209-.2111.0845-.1484.1472.1599.1599.2789.0115.4352-.051.3473-.139Zm31.9761-3.6104c-.0989-.6185-.2878-3.982-.4198-7.4745s-.4713-8.1955-.754-10.451c-.2827-2.2556-.4596-4.1903-.3932-4.2995.0665-.1091.0246-.1989-.0932-.1994-.1177-.0006-.4249-.5138-.6826-1.1405-.3012-.7327-1.3786-2.0482-3.018-3.6849l-2.5495-2.5454-.8332 1.3708c-1.6423 2.7021-1.7824 3.0354-2.8001 6.6625-.9791 3.4895-1.3631 7.9788-1.0601 12.3937.1857 2.7059.268 3.046.9028 3.731.3841.4145.6985.8447.6985.956 0 .1113.5138.4511 1.1419.7551.8333.4034 1.6556.5528 3.0427.5528 1.4843 0 1.9008.0841 1.9008.3837 0 .2111-.1844.4869-.4098.6131-.3196.1788-.203.2928.5292.5175l.939.2882v-1.1376c0-.7412.1316-1.188.3775-1.2824.4397-.1687.6838.0967 1.4195 1.5435.296.5821.7927 1.3278 1.1038 1.6571.3111.3293.4895.722.3965.8726-.2282.3693.0516 1.0422.4334 1.0422.2138 0 .2529-.3431.1279-1.1245Zm-2.991.3201c-.1202-.4597-1.2868-1.3123-1.7956-1.3123-.3189 0 .6411 1.1315 1.2402 1.4618.3376.1861.6324.3501.6551.3643.0228.0143-.0221-.2169-.0998-.5138Zm-59.6051-1.1637c0-.0638-.3572-.507-.7938-.985-.4366-.478-.7938-.7597-.7938-.6261s.3199.5769.711.985c.6989.7295.8765.8564.8765.6261Zm55.7811-.6429c-.3385-.4174-.6655-.7146-.7267-.6604-.112.0991 1.0376 1.4193 1.2359 1.4193.0585 0-.1706-.3415-.5091-.7589Zm7.4755-4.5301c.001-1.6376-.0622-3.0423-.1415-3.1217-.0793-.0793-.1442 1.3242-.1442 3.119 0 1.7947.0637 3.1995.1415 3.1217.0778-.0778.1427-1.4814.1442-3.119Zm10.668-5.9294c-.0992-.968-.2375-1.7027-.3075-1.6328-.0699.0699-.0427.9158.0605 1.8798.1032.9639.2416 1.6987.3075 1.6328.0659-.0659.0386-.9118-.0605-1.8798Zm-1.2358-12.1311c-.3796-1.1289-.6762-.8574-.4335.3969.1196.6185.2346 1.2435.2554 1.3891.0208.1455.1245-.0331.2303-.3969.1058-.3638.0823-.9889-.0523-1.3891Zm-19.6398-4.1672c.0899-.1455.0374-.2646-.1167-.2646-.1541 0-.2802.1191-.2802.2646 0 .1455.0525.2646.1167.2646.0642 0 .1903-.1191.2802-.2646Zm.7978-1.3307c.437-.8451.2947-1.5874-.2081-1.0847-.2462.2462-.4978 1.8862-.2894 1.8862.0456 0 .2695-.3607.4974-.8015Zm16.0033-.9432c0-.5433-.8051-1.7191-1.0665-1.5575-.1181.073-.0166.5969.2257 1.1642.4266.9989.8408 1.1927.8408.3934Zm-2.9877-5.8616c-.639-1.3793-2.7983-4.8291-3.0225-4.8291-.07 0 .1269.387.4373.8599.3105.4729 1.1259 1.8912 1.8119 3.1516 1.3675 2.5124 1.7419 2.9083.7733.8175Zm-9.7067-14.734c-.3179-.9552-.6198-1.7367-.671-1.7367-.0512 0-.0843.387-.0737.8599.0176.783.9934 2.9427 1.2249 2.7112.0537-.0537-.1624-.8792-.4803-1.8344Zm-1.834-3.5444c-.1427-.2666-.4473-.6407-.6768-.8312-.3597-.2985-.3931-.2772-.2421.1541.1536.4385.8306 1.1619 1.0873 1.1619.0501 0-.0257-.2182-.1684-.4848Zm-2.1404-1.3673c.342-.221.335-.257-.0505-.2605-.2461-.002-.521.115-.6109.2605-.207.3348.1433.3348.6615 0Zm-1.5875-.5448c0-.1369-.3204-.249-.712-.249-.6779 0-.6875.0179-.2014.3734.5192.3797.9134.326.9134-.1244Zm-1.6592-.4088c-.0879-.0879-.3161-.0973-.5071-.0209-.2111.0845-.1484.1472.1599.1599.2789.0115.4352-.0511.3473-.139Zm-4.0808-2.2582c-.3903-.3903-.7164-.5036-1.051-.3652-.4235.1753-.3844.2456.3087.554 1.1529.5131 1.3851.454.7423-.1888Zm-7.3587-1.0185c.0927-.15-.0135-.1943-.249-.104-.4584.1759-.5422.3655-.1616.3655.1369 0 .3217-.1177.4106-.2616Zm-1.5856-1.0614c-.0899-.1455-.4612-.2646-.825-.2646-.3736 0-.5903.1151-.4979.2646.0899.1455.4612.2646.825.2646.3736 0 .5903-.1151.4979-.2646Zm-2.5852-.4244c-.0879-.0879-.3161-.0973-.5071-.0209-.2111.0845-.1484.1472.1599.1599.2789.0115.4352-.051.3473-.139Zm2.1222-.8163c-.2547-.0666-.6714-.0666-.926 0-.2547.0665-.0463.121.463.121.5093 0 .7177-.0545.463-.121Zm-3.1089-.4467c0-.0549-.2084-.2633-.463-.463-.4196-.3291-.429-.3197-.0999.0999.3456.4407.5629.5809.5629.3631Zm1.5158-.3245c-.0879-.0879-.3161-.0973-.5071-.0209-.2111.0845-.1484.1472.1599.1599.2789.0115.4352-.0511.3473-.139Zm-6.8792-1.8521c-.0879-.0879-.3161-.0973-.5071-.0209-.2111.0845-.1484.1472.1599.1599.2789.0115.4352-.051.3473-.139Zm-9.3465-3.4993c-.0335-.048-.5773.1901-1.2084.5292-.6311.339-1.1725.6216-1.2031.628-.0306.006.0096.261.0893.5659.1341.5127.2292.472 1.264-.5407.6155-.6023 1.0916-1.1344 1.0581-1.1824Zm7.6322 2.161c-.1819-.0734-.4796-.0734-.6615 0s-.0331.1335.3307.1335c.3638 0 .5126-.06.3307-.1335Zm-2.3494-1.7126c1.543-.8509 1.3089-1.002-.4105-.265-1.1427.4898-2.444 1.588-1.4129 1.1923.2564-.0984 1.0769-.5157 1.8234-.9273Z",
                } ,
            "hispo":{
                "attributes_mods":[3,2,3,0,-3,0],
                "diff":"7",
                "pathx":-1,
                "pathy":3,
                "path":"M146.6598-1.9995c-.0783.2994-.2475.5443-.3761.5443-.3569 0-.2786-.4272.1423-.7765.3085-.2561.3505-.2144.2337.2322Zm-7.2244 3.4547c0 .1455-.1191.2646-.2646.2646s-.2646-.1191-.2646-.2646c0-.1455.1191-.2646.2646-.2646s.2646.1191.2646.2646Zm24.7272 6.3683c-.2268.367-.3856.2986-.3856-.1662 0-.2269.121-.3377.2689-.2463.1479.0914.2004.277.1167.4125Zm3.9871.562c.0815.0815-.0654.2294-.3263.3288-.3771.1436-.4075.1132-.1481-.1481.1795-.1808.3929-.2621.4744-.1807Zm-6.191 1.338c-.1997.2547-.4875.463-.6394.463-.1519 0-.2266-.0337-.166-.0749.0606-.0412.3484-.2495.6394-.463.4895-.359.5019-.3534.166.0749Zm-31.0632 7.4452c.1918.1918.8672-.546.8672-.9473 0-.3281.7363-.2541.8494.0854.1982.5946 1.7317.465 2.3556-.1991.5796-.617 1.059-.8242.9969-.431-.0845.5351.0666.8599.3999.8599.4283 0 .6898-.5641.6898-1.488 0-.6667.2156-1.0223 1.2568-2.073.7718-.7788.7891-2.1517.0374-2.9519-.5796-.6169-1.5376-3.6622-1.551-4.9303-.005-.4738.1307-.7276.3892-.7276.5112 0 .5033-.6997-.0245-2.1495-.9777-2.686-1.0785-4.4241-.5619-9.6935.3455-3.5241.432-5.7614.2992-7.7361-.3316-4.9306-.3387-4.845.8247-9.974.3566-1.5721.6498-3.0696.6508-3.3279.0016-.3093.2734-.5238.7962-.6284.9692-.1938 1.0686-.8864.1273-.8864-.5934 0-.6472-.0798-.4904-.7276.0968-.4002.2744-.9945.3945-1.3206.1202-.3262.1568-.7536.0815-.9499-.1013-.2639 2.0849-3.618 2.357-3.6162.0241.0002.0608 1.9349.0817 4.2995.039 4.4173.2385 7.1976.5531 7.7066.0983.159.1476.6495.1097 1.0898l-.069.8006 1.2716-.0965c.6994-.0531 1.4686-.2709 1.7093-.4842.3674-.3254.5295-.3316 1.0089-.0389.5073.3098.6364.2748 1.1542-.3127.7474-.848 1.8243-.9453 1.7113-.1547-.0434.3033-.179.5138-.3014.4678-.2925-.1101-.949.7666-.9597 1.2817-.0046.2223-.2594.6191-.5661.8817-.4967.4253-.5386.6557-.383 2.1093.1497 1.3991.0608 1.9715-.6235 4.0131-.439 1.3097-.9202 3.1625-1.0693 4.1174-.1491.9549-.5076 2.4432-.7967 3.3073-.289.8641-.528 1.7562-.532 1.9824-.0098.6188-1.5264 2.8886-2.0563 3.0774-.2551.0909-.7019.4508-.9929.7997-.4535.5437-.8855.7517-1.7675.8509-.099.0111-.2184.2881-.2654.6156-.0635.4426-.2401.5787-.6888.5307-.7944-.0851-.9242.3628-.4791 1.6521.2633.7626.5767 1.1323 1.1216 1.3229.4159.1455.9153.3672 1.1096.4926.1943.1254 1.1658.28 2.1588.3436 1.5888.1017 1.8506.0512 2.1815-.4213.3157-.4507.8347-.6761 1.824-.7922.0922-.0108.2375-.228.323-.4827.0855-.2547.2704-.6416.4108-.8599.1404-.2183.5784-1.8256.9733-3.5719.3949-1.7463 1.0441-4.1275 1.4428-5.2917.3986-1.1642.8134-2.5327.9217-3.0412.1083-.5085.5878-1.9373 1.0657-3.175.4778-1.2377 1.1324-3.5074 1.4546-5.0436.5295-2.5245.6595-2.8355 1.3522-3.233.7178-.4121.7632-.5365.7158-1.9693-.039-1.1783.0857-1.7553.5429-2.513.6093-1.0097.5601-1.5301-.1445-1.5301-.4458 0-1.1561-.6188-1.1561-1.0071 0-.1381.1956-.7122.4347-1.2757l.4347-1.0245.3359 1.0583c.1847.5821.4091 1.3897.4986 1.7948.1353.6123.2842.7238.883.6615.6187-.0644.7082.0118.6343.5398-.0604.4311.0684.6553.4308.75.9162.2396 1.4765 2.2644.8108 2.93-.4631.4631-.0572 1.129.6883 1.129.6136 0 .7794-.2002.6036-.7276-.0364-.1091-.1643-.1657-.2842-.1257-.12.04-.1447-.0461-.055-.1912.2635-.4263 2.2954-.8706 3.2635-.7135.7082.1149.8624.0655.7455-.2391-.1109-.2891.0742-.384.7487-.384.4929 0 1.0844-.0723 1.3146-.1606.3345-.1284.4185.0332.4185.8055 0 1.3996.8085 4.4045 1.2285 4.5656.1974.0758.359.3264.359.5569 0 .3384-.0728.3202-.378-.0944-.3442-.4677-.3935-.4737-.5513-.0667-.0953.2458-.0494 1.0792.102 1.8521.428 2.1845.7063 5.4851.9773 11.5922.1872 4.2195-.0842 6.0814-.8879 6.0895-.4979.005-1.6435 1.0883-1.6435 1.5541 0 .1614.1583.2934.3517.2934.1946 0 .3423.266.3307.5953-.015.4256-.3982.8137-1.3439 1.361-1.6789.9718-4.8163 3.7295-5.0382 4.4285-.1013.319-.0046.7137.2412.9854.3727.4118.3628.4827-.1084.777-.5725.3575-.6932.8485-.2087.8485.1704 0 .5574-.2052.8599-.456.3025-.2508.4012-.2865.2193-.0794-.5228.5954-.3917 1.0194.4499 1.4546 1.2345.6384 2.8064.508 4.3466-.3605.7453-.4203 1.6528-.8504 2.0166-.9558.3638-.1054.9591-.4608 1.3229-.7898.3638-.329 1.0099-.7621 1.4357-.9625.9741-.4583 1.141-.928.4118-1.1595-.3096-.0983-.5004-.3167-.424-.4855.0764-.1688.5712-1.3714 1.0995-2.6727.7019-1.7287 1.2433-2.6242 2.0104-3.3254l1.0498-.9596-.2761-1.7017c-.3392-2.0905-.3724-14.8607-.0396-15.2086.1406-.1469.1478-.856.0173-1.7066-.1227-.8004-.2874-3.1727-.3659-5.2718-.1479-3.9552-.2909-4.4053-1.3001-4.091-.8421.2622-1.7436-.1436-2.1759-.9795-.2309-.4464-.7645-.9301-1.1896-1.0783-1.2609-.4395-1.5985-2.5302-1.0366-6.4181.1456-1.0073.3859-1.9775.5341-2.156.1646-.1984.1999-1.0015.0908-2.0667-.1228-1.1982-.08-1.8608.1368-2.1222.2493-.3004.2266-.4296-.1083-.617-.237-.1326-.5966-.9872-.8163-1.9396-.216-.9364-.4562-1.9092-.5338-2.1618-.091-.2962.1403-.1779.6512.333.4358.4358.8303 1.0592.8766 1.3854.0507.3571.2973.6236.6197.6698.2945.0422.6663.3994.8263.7938.5575 1.3742.8553 2.3107 1.0271 3.2306.0951.5093.351 1.4618.5685 2.1167.4203 1.265 1.1489 4.6954 1.8217 8.5769.4751 2.7408.7878 3.4952 1.2795 3.0872.2624-.2178.3311.1208.3261 1.5968-.0053 1.4137.0926 1.9288.399 2.1003.2616.1464.4225.6652.4525 1.4595.0256.6778.1319 1.3674.236 1.5324.1042.1651.1513.9847.1047 1.8215-.0588 1.0549.0127 1.5214.2331 1.5214.3639 0 .2939.6282-.4363 3.9144-.4206 1.8931-.4353 2.2269-.1068 2.4299.2095.1295.4946.1651.6336.0792.1491-.0921.1859.0997.0897.4675-.0897.343-.0284 1.8577.1363 3.3659l.2994 2.7422.6819-.1682c.9348-.2306 1.3006-.6239.8432-.9066-.5421-.335-.1622-2.1691.4043-1.9517.5753.2207.8193-.2869 1.0335-2.15.1015-.8826.3941-2.1405.6504-2.7954.9021-2.3057 1.4012-5.2521 1.2503-7.3812-.1034-1.4585-.0716-1.8297.1156-1.35.224.574.3063.9786.4554 2.2395.0166.1403.2247.0606.4625-.1772.4-.4.3898-.587-.1368-2.5041-.313-1.1395-.6178-2.8457-.6773-3.7916-.0595-.9459-.5468-3.3867-1.0829-5.424-.5361-2.0373-1.2695-5.0139-1.6298-6.6146-.6983-3.1026-2.7512-9.3845-3.3808-10.3453-.2085-.3182-.4065-1.0972-.4401-1.7312-.0336-.634-.1582-1.3313-.277-1.5496-.1188-.2183-.4525-.9687-.7416-1.6676-.877-2.1199-2.7472-4.4471-4.9325-6.1376-1.1286-.8731-2.8391-2.3614-3.801-3.3073-2.9229-2.8741-5.9285-5.0271-7.0179-5.0271-.2357 0-.9262-.3424-1.5345-.7609-2.341-1.6104-4.7251-1.936-10.7177-1.4636-1.6579.1307-1.9882.0853-2.2799-.3138-.3205-.4383-.3804-.4276-.9873.1759-.3554.3534-1.3398 1.1645-2.1876 1.8025-1.3345 1.0043-1.5739 1.102-1.7834.7276-.3819-.6825-.8138-.5203-2.0788.7805-1.4601 1.5014-3.4902 2.5961-4.3047 2.3212-.3185-.1075-.6981-.2025-.8437-.2111-.4031-.0239-1.7276-.937-2.9463-2.0311-1.4346-1.288-2.4285-1.7814-4.2702-2.1197-.8331-.1531-2.2887-.6062-3.2346-1.0069-.9459-.4007-2.5532-.878-3.5719-1.0607-1.0186-.1827-2.4092-.49-3.0902-.6829-1.8327-.5192-5.3971-.7851-5.6231-.4195-.1306.2113-.2954.1864-.5676-.0858-.335-.3351-.5589-.3312-1.7691.0304-.762.2277-2.1594.4463-3.1053.4859-2.1096.0883-3.7676.6422-5.9858 1.9999-.933.5711-1.8338 1.0383-2.0017 1.0383-.1679 0-.5205.1948-.7836.4329-.6207.5617-.6346.5123-1.0159-3.6079-.1683-1.819-.4108-3.4148-.5389-3.5463-.1341-.1376-.1294-.4321.0109-.6943.1771-.3308.1059-.58-.2603-.9114-.6056-.5481-1.0699-.3421-.8785.3898.0983.3759.008.5289-.3122.5289-.3572 0-.4353.2055-.3774.9922.1058 1.4353-.2883 3.4476-.7065 3.6081-.1978.0759-.7366.8876-1.1974 1.8037-.4608.9162-.9242 1.7253-1.0298 1.798s-.3729.4815-.5939.9083l-.4019.776-1.1516-2.0989c-.6334-1.1544-1.8434-2.8133-2.6889-3.6864-.8455-.8731-1.5976-1.8852-1.6714-2.249-.2925-1.4423-.7494-1.9899-1.5781-1.8911-1.011.1205-1.2284.4691-1.0779 1.7288.0676.5656.0031 1.2204-.1432 1.4552-.1932.31-.053 1.0889.512 2.8448.6497 2.019.7432 2.6301.5667 3.7042-.2587 1.5743-.2988 3.6108-.0823 4.1751.1853.4828.8977.57.8977.1098 0-.1698.0608-.2479.1351-.1736.0743.0743-.0529.6597-.2826 1.3009-.2869.8007-.3988 1.9115-.3572 3.547.0333 1.3097-.0355 2.6016-.1528 2.871-.141.3237-.0881.569.1559.7236.2956.1872.2769.2347-.0938.2379-.3808.0033-.4564.2273-.4254 1.2608.0479 1.6002-1.1448 6.6749-2.0161 8.5779-1.1244 2.456-3.2044 6.0142-4.0749 6.9708-.4542.4991-.8258 1.0822-.8258 1.2958s-.1191.4619-.2646.5518c-.4381.2708-.2983.8555.2381.9958.2765.0723 1.1088-.0737 1.8495-.3245.7408-.2508 1.4097-.393 1.4866-.3161.0769.0769.5841.2941 1.127.4826.8397.2916 1.1176.2815 1.8595-.0673.5532-.2601 1.1646-.346 1.6714-.2347.5755.1264.9423.046 1.3105-.2873.932-.8434.3889-1.6646-.5581-.8438-.2099.1819-.0706-.0265.3095-.463.3801-.4366 1.223-1.597 1.8731-2.5787.65-.9817 1.2706-1.6963 1.379-1.5879s.358-.023.5547-.292c.1967-.269.4696-.4199.6065-.3353.246.1521 3.376-1.7085 3.8874-2.3108.2835-.3339 3.1784-2.4655 5.2027-3.8309 1.0262-.6922 1.427-.8137 2.3809-.7218.9143.0881 1.3176-.0196 1.9878-.5309.7131-.544 1.0493-.6215 2.2139-.5106 1.2659.1205 1.3625.09 1.2369-.3903-.1298-.4962-.1084-.5.4488-.0797.7824.5902.383 1.6298-.557 1.4501-.4867-.093-.6109.0002-.6109.4589 0 .3166.1046.511.2324.432.4743-.2931 1.7951.6603 2.254 1.6271l.4741.9988-.6375-.5953c-1.288-1.2028-1.707-.5954-.4888.7086.7118.762 1.3122 1.7436 3.3291 5.443.3967.7276 1.1607 1.8587 1.6979 2.5135 1.6806 2.0489 2.7681 3.7946 2.7823 4.4662.0178.8418.5323.9984 1.1004.3349.4151-.4848.4994-.4942 1.071-.1197.3412.2236.6204.5863.6204.806 0 .3068.1996.3628.8599.2413l.8599-.1582-.7542.4121c-.6324.3456-.7257.5259-.578 1.1173.7829 3.1344 1.1249 6.3839 1.0021 9.519-.1387 3.5383.2938 8.8522.7325 9.0015.4143.141.2925 3.7644-.1704 5.0712-.232.6548-.4678 2.1431-.5241 3.3073-.0563 1.1642-.2201 2.6524-.3641 3.3073-.144.6548-.2985 1.5113-.3433 1.9032-.1016.8882-1.253 1.8636-1.795 1.5206-.8764-.5546-3.1313.006-4.2621 1.0595-.4264.3973-1.5591.8031-2.2149.7936-.3217-.0047-1.4688 1.6126-1.3175 1.8574.1955.3163 1.4611.2581 1.4611-.0671 0-.1242.1871-.0387.4158.19.2287.2287.6481.4158.9321.4158.4895 0 .4939.0342.0843.6594-.2483.3794-.3553.8569-.2513 1.1245.1609.414.2482.3872.7949-.2448.3377-.3904.6651-.8629.7275-1.05.0915-.2746.3274-.2695 1.2245.0265 1.0543.3479 1.1075.4152 1.0391 1.3146-.0979 1.2873.6329 1.304.9525.0218.1923-.7716.4491-1.0239 1.5395-1.5127.9161-.4107 1.294-.7281 1.26-1.0583-.0271-.2594-.0349-.6108-.0181-.7809.0313-.3179 1.8215-1.5386 2.2604-1.5414.1351-.0009.332-.2992.4376-.663.1056-.3638.464-1.1972.7964-1.8521.5091-1.003.6409-1.8368.8365-5.2917.1277-2.2556.2565-5.1726.2862-6.4823.0463-2.0388.3029-3.1615.8715-3.8128.0521-.0597.3312.1053.6201.3667.9657.8743.9623-.2276-.007-2.1373-.4806-.9468-.8658-2.102-.8558-2.567.0324-1.5168.3675-4.2286.8881-7.1861.2808-1.5956.5106-3.2195.5106-3.6087s.2098-.9668.4663-1.2835c.3889-.4802.5807-.5323 1.1554-.3138.4056.1542 1.0852.1727 1.6518.0449 1.1318-.2553 1.4322.0357.9559.9258-.3985.7447-.1539 1.565.403 1.3513.2572-.0987.3947.0099.3947.3118 0 .2548.1814 1.1142.4032 1.9099.2217.7957.5824 2.804.8015 4.4629.2191 1.6589.5163 3.5423.6604 4.1853.1752.7813.1712 1.9006-.0119 3.3739-.3095 2.4907-.0126 5.0048 1.1883 10.0621.9372 3.9469 1.0144 4.9553.5455 7.1303-.2212 1.026-.4692 2.312-.5513 2.8577-.0821.5457-.2696.9922-.4167.9922-.3753 0-1.3708 2.3365-1.443 3.3869-.033.4804-.2516 1.0851-.4857 1.3438-.8942.9881-.3117 1.6252.7339.8027l.6926-.5448V15.944c0 .5684.086 1.1195.1912 1.2246Z"
                } ,
            "lupus":{
                "attributes_mods":[1,2,2,0,-3,0],
                "diff":"6",
                "path":"M-73.7826-444.357c0 .3044-.2638.5535-.5861.5535-.3224 0-.4322-.2491-.2441-.5535.1881-.3044.4519-.5535.5861-.5535s.2441.2491.2441.5535Zm61.1174 44.2772c-.2036.761-.6009 1.7572-.8831 2.2139-.3565.577-.4001.4082-.1428-.5535.2036-.761.6009-1.7572.8831-2.2139.3565-.577.4001-.4082.1428.5535Zm-5.079 6.2186c3.4932.2265 5.4606-.0524 6.2868-.8911.3376-.3427 1.1913-2.9175 1.8971-5.7217 1.453-5.7723 1.5264-5.4476-2.5145-11.1257-2.1816-3.0655-2.4864-3.8471-2.4818-6.3648l.0052-2.8702 1.6227 2.8291c.8925 1.556 2.42 3.5 3.3945 4.32 2.4062 2.0247 7.0853 4.3397 8.0349 3.9753 1.5523-.5957.8522-3.4572-1.5781-6.4493-1.2937-1.5929-2.7642-3.4218-3.2677-4.0644-.5035-.6426-1.4457-3.4011-2.0939-6.1302-2.6778-11.275-5.5697-12.7995-25.7709-13.5857-6.6969-.2606-13.494-.7339-15.1046-1.0518-3.3824-.6676-7.3021-2.7536-10.078-5.3636-1.0654-1.0017-3.1202-2.3434-4.5661-2.9815-1.4459-.6381-2.629-1.3784-2.629-1.6452 0-.6703-2.7586-3.8908-3.3327-3.8908-.2568 0-.6238.4941-.8155 1.098-.3436 1.0826-.3713 1.0812-1.9676-.099-1.9731-1.4588-2.5647-1.035-1.6472 1.18.6302 1.5213.5506 1.8371-.9461 3.7536-.8988 1.1509-1.9226 2.9409-2.2753 3.9778-.3526 1.0369-1.6692 2.7652-2.9258 3.8408l-2.2847 1.9556 1.5571 1.3393c1.5755 1.3552 1.7814 1.3711 7.1045.5494.8129-.1255 1.5516.8473 3.3208 4.3734 1.2514 2.4941 2.9017 5.2338 3.6673 6.0881.7656.8543 1.8609 2.425 2.4339 3.4905 1.4719 2.7366 2.371 3.6685 4.5264 4.6912 1.0595.5028 1.8861 1.3086 1.8852 1.8379-.0039 2.2209-1.634 17.6683-1.952 18.4968-.192.5002-1.0762 1.163-1.965 1.4728-.8888.3098-1.616.9216-1.616 1.3595 0 .8574 2.5959 1.4677 4.0578.9539.975-.3427 3.6848-5.3162 3.6884-6.7698.0013-.5095.3055-2.2398.6761-3.8452.5757-2.4943.7287-2.7218 1.0518-1.5643.2079.745.4028 3.1603.4332 5.3672.0492 3.576-.0579 4.0126-.984 4.0126-1.1549 0-2.4763 1.2812-1.9079 1.8497.4921.4921 4.1771.4479 4.951-.0594.8876-.5818 1.2777-3.7809 1.5004-12.3061.1074-4.1095.3611-7.8454.5639-8.302.2866-.6454 1.1995-.7926 4.0999-.6615 2.2768.103 5.3938-.2275 7.9964-.8478 2.7098-.6459 5.2972-.9092 7.095-.7222 2.7008.2809 2.8867.408 4.0764 2.785.7682 1.5349 2.718 3.7225 5.0812 5.7011 4.4861 3.756 5.9472 6.0163 5.4379 8.4122-.4561 2.1455-1.8666 4.9024-2.291 4.478-.4536-.4536-2.3563 1.3394-2.3563 2.2205 0 .4702.996.7801 2.9057.9039Z",
                "pathx":3.5,
                "pathy":14,
                } ,
            }
        if (me.data['creature'] == 'garou') {
            let idx = 0
            let form_width = 4
            let form_height = 5
            _.forEach(FORMS,(v,k)=> {
                let ox =  (1.5+idx*(form_width+0.25))*me.stepx
                let oy = (basey)+me.stepy
                let form_group = me.character.append("g")
                    .attr('class',"form_group")
                    .attr("transform",`translate(${ox},${oy})`)
                let sil = form_group.append("g")
                    .attr("transform",`translate(${v.pathx*me.stepx},${v.pathy*me.stepy})scale(2)`)
                sil.append("path")
                    .attr("d",v.path)
                    .attr("x",0)
                    .attr("y",0)
                    .style("fill", "#6060607f")
                    .style("stroke", "none")
                    //.attr("transform",`translate(${v.pathy*me.stepx},${v.pathy*me.stepy})scale(2)`)

//                 form_group.append("circle")
//                     .attr("cx",0)
//                     .attr("cy",0)
//                     .attr("r","5pt")
//                     .style("fill", "#A02020")
//                     .style("stroke", "#F03030")

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
                    .attr('x',me.stepx*3.75)
                    .attr('y',me.stepy*3.75+"pt")
                    .style("fill",me.draw_fill)
                    .style("stroke",me.shadow_stroke)
                    .style("stroke-width","0.5pt")
                    .style("font-family",me.user_font)
                    .style("text-anchor","end")
                    .style("font-size",me.small_font_size+"pt")
                    .text("Diff.:"+v.diff)

                form_group.append("text")
                    .attr('x',me.stepx*2)
                    .attr('y',me.stepy*2.0)
                    .style("fill",me.draw_fill)
                    .style("stroke",me.shadow_stroke)
                    .style("stroke-width","1.0pt")
                    .style("font-family",me.user_font)
                    .style("text-anchor","middle")
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
            console.log("My srs",me.data.srs)
            srs_list = {}
            srs = me.data.srs.split(", ")
            _.forEach(srs,(v,k)=>{
                let sr = v.split(":")
                console.log(v,k)
                srs_list[sr[0]] = sr[1]
            })
        }else{
                console.warn("NO SRS")
        }
        console.debug(srs_list)
        me.config['specialities'].forEach(function (d, idx) {
            let x = ox + me.stepx * 2;
            let y = oy + 0.5 * me.stepy * (idx);
            console.log(">>>>>>>",me.config["specialities"])
            if (me.blank) {
            } else {
                let txt = ""
                if (srs_list.hasOwnProperty(d)){
                    txt = srs_list[d]
                }
                me.statText(d, txt, x, y, stat, stat + idx, me.character);
//                 let ss = d.split(" ")
//                 let txt = ""
//                 if (ss[0] in srs_list){
//                     console.log(srs_list[ss[0]])
//                     console.log("ss0",ss[0])
//                     console.log("ss1",ss[1])
//                     txt = srs_list[ss[0]]+" > "
//                 }

            }
        });
        stat = 'shortcuts';
        let shortcuts = []
        me.config['shortcuts'].forEach(function (d, idx) {
            shortcuts.push(d)
            if ((idx%5 == 4) && (idx % 15 != 14)){
                shortcuts.push(" ")
            }
        })
        shortcuts.forEach(function (d, idx) {
            let x = ox + me.stepx * 9 + Math.floor(idx / 17) * me.stepx * 7;
            let y = oy + 0.4 * me.stepy * (idx % 17);
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
        let me = this
        let ox = me.button_ox * me.stepy
        let oy = me.button_oy * me.stepy
        let button = me.back.append('g')
            .attr('class', 'do_not_print '+(num==1?"display":""))
            .attr('action', (num==1?"chronicle_map":""))
            .on('click', function (e,d) {
                e.stopPropagation()
                e.preventDefault()
                switch (num){
                    case 1:
//                         let x = document.createElement("span")
//                         x.id = "toto"
//                         x.class = "display"
//                         x.action = "chronicle_map"
//                         me.co.rebootLinks()
//                         x.click()
//                         console.log(me.parent,x)
//                         let $nuke = $("span",{"id":"npc_launcher","class":"display","action":"chronicle_map"})
//                         $nuke.appendTo(me.parent)
//
//                         $nuke.trigger("click")

//                         let x = document.createElement("div")
//                         x.id = "gershwin"
//                         x.class = "display"
//                         x.action = "chronicle_map"

//                         $("#gershiwin").trigger("click")
//                         console.log("NPC")
                        break
                    case 2:
                        me.createPDF();
                        break
                    default:
                        me.page = num - 3;
                        me.perform(me.data)
                        break;
                }
//                 if (num == 10) {
//                     me.saveSVG();
//                 } else if (num == 11) {
//                     me.savePNG();
//                 } else if (num == 2) {
//                     me.createPDF();
//                 } else if (num == 30) {
//                     me.editCreature();
//                 } else if (num == 3) {
//                     me.page = 0;
//                     me.perform(me.data)
//                 } else if (num == 4) {sc
//                     me.page = 1;
//                     me.perform(me.data)
//                 } else if (num == 5) {
//                     me.page = 2;
//                     me.perform(me.data)
//                 } else if (num == 6) {
//                     me.page = 3;
//                     me.perform(me.data)
//                 } else if (num == 1) {
//
//                 }
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
        if (me.data.creature == undefined){
            me.data['rid']  = "ADV_RID"
            me.data.creature = "ADV_CREATURE"
        }
        let svg_name = "character_sheet" + me.data['rid'] + lpage + ".svg"
        let pdf_name = "character_sheet" + me.data['rid'] + lpage + ".pdf"
        let rid = me.data['rid'];
        let sheet_data = {
            'pdf_name': pdf_name,
            'svg_name': svg_name,
            'rid': rid,
            'svg': exportable_svg,
            'creature': me.data.creature,
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
        user_fill = '#8AA',
        user_stroke = '#288',
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


