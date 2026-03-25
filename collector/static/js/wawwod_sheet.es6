class WawwodSheet {
    constructor(settings, parent) {
        this.parent = parent;
        this.config = settings;
        this.count = 0;
        this.mark_overhead = false
        this.disposition = "portrait"
        this.button_ox = 1
        this.button_oy = 1
        this.max_pages = 8
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
        me.debug = this.config.debug
        me.blank = this.config.blank
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
        me.draw_stroke = '#111'
        me.draw_fill = '#222'
        me.user_stroke = '#526555'
        me.user_fill = '#293b2d'

        me.overhead_fill = '#C22'
        me.user_font = 'Gochi Hand'
        me.user_font = 'Slackside One'
        me.user_font = 'Kalam'
        //me.user_font = "Tac One"
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
            .style('stroke-width', '1pt')
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
            me.title('Physical ___', ox + me.stepx * 5, oy, me.character);
            me.title('Social ___', ox + me.stepx * 12, oy, me.character);
            me.title('Mental ___', ox + me.stepx * 19, oy, me.character);
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
            me.title('Talents ___', ox + me.stepx * 5, oy, me.character);
            me.title('Skills ___', ox + me.stepx * 12, oy, me.character);
            me.title('Knowledges ___', ox + me.stepx * 19, oy, me.character);
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
            me.title('Backgrounds ___', ox + me.stepx * 5, oy, me.character);

        } else {
            me.title('Backgrounds (' + me.data['total_backgrounds'] + ')', ox + me.stepx * 5, oy, me.character);
        }
        if (me.data['creature'] == 'garou') {
            if (me.blank) {
                me.title('Gifts ___', ox + me.stepx * 12, oy, me.character);
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
            oy += 0.5 * me.stepy;
            let pathes = me.data['ritual_pathes'].split(';')
            if (pathes.length>0){
                me.statText('Paths', 'Thaumaturgy', ox + me.stepx * 16, oy, 'ritual_path', 'ritual_path', me.character)
                oy += 0.5 * me.stepy;
                _.forEach(pathes, (p,i)=>{
                    me.statText(`${i+1}`, p, ox + me.stepx * 16, oy, 'ritual_path', 'ritual_path_'+i, me.character)
                    oy += 0.5 * me.stepy;
                })
            }
//             me.statText('Paths', me.data['ritual_pathes'], ox + me.stepx * 16, oy, 'ritual_path', 'ritual_path', me.character)
//             oy += 0.5 * me.stepy;
//             me.statText('', me.data['ritual_pathes'], ox + me.stepx * 16, oy, 'ritual_path', 'ritual_path', me.character)
//
//             if (me.data['player']) {
//                 oy += 1 * me.stepy;
//                 me.statText('Experience', me.data['experience'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
//                 oy += 0.5 * me.stepy;
//                 me.statText('Remaining', me.data['exp_pool'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
//                 oy += 0.5 * me.stepy;
//                 me.statText('Spent', me.data['exp_spent'], ox + me.stepx * 16, oy, 'sire', 'sire', me.character);
//             }
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
            .style("stroke-width", '1pt')
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
        console.log("Merit Flaws !!!!!")
        if (me.blank){
            _.forEach([" (0)"," (0)"," (0)"," (0)"," (0)"," (0)"," (0)",], function (d, idx) {
                let x = ox + me.stepx * 2;
                let y = oy + 0.5 * me.stepy * (idx);
                me.powerStat(d, x, y, "merit", `merit${idx}`, me.character)
                console.log(d)
            })
        }else{
            _.forEach(merits_flaws, function (d, idx) {
                let x = ox + me.stepx * 2;
                let y = oy + 0.5 * me.stepy * (idx);
                me.powerStat(me.data[d['id']], x, y, d['class'], d['id'], me.character);
            })
        }


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
            oy += 1.25 * me.stepy;
            me.gaugeStat('Humanity', me.data['humanity'], ox + me.stepx * 12, oy, me.character);
            oy += 1.25 * me.stepy;
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
            me.statText('Earned', me.data['experience'], ox+2*me.stepx , oy, 'sire', 'sire', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Remaining', me.data['exp_pool'], ox+2*me.stepx , oy, 'sire', 'sire', me.character);
            oy += 0.5 * me.stepy;
            me.statText('Spent', me.data['exp_spent'], ox+2*me.stepx , oy, 'sire', 'sire', me.character);


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

            ox = me.stepx * 13
            oy += 1 * me.stepy

            let atxt = all_histo_exp.join("µ")
            me.appendText("Experience Details",atxt,ox,oy,8 * me.stepx,me.character)



            let line_count = 0 //me.appendText("Transactions:",all_histo_exp,ox,oy,me.stepx*10)
            //line_count = me.appendText("Transactions:",all_histo_exp,ox,oy,me.stepx*10)
            console.log(all_histo_exp)
            console.log("Line count",line_count)
        }
    }

    appendText(title,base_txt="",ox,oy,width,source, opacity=1.0){
        let me = this
        let lines_written = 0
        let max_lines = 30
//         console.log("source:",source)
        if (!source){
            source = me.daddy
            console.log("daddy")
            console.log("source:",source)
        }
        if (!source){
            return 0
        }
        let aline = source.append('line')
            .attr('x1',ox)
            .attr('y1',oy-me.medium_font_size)
            .attr('x2',ox+width)
            .attr('y2',oy-me.medium_font_size)
            .style("stroke", "#f02090")
            .style("stroke-width", '3pt')
            .attr("opacity",0)
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
            .attr("opacity",opacity)
            .text(title)
        if (title.length>0) {
            lines_written += 1
            }
        let txt_index = 0
        let txt = base_txt.split("µ")
//         console.log("txt length:",txt.length)
        while (txt.length>0){
            let line = txt.shift()
            let tspan = text.append("tspan")
                .attr('x', ox)
                .attr("dy",me.medium_font_size+"pt")
                .text(line)
                .attr("opacity",opacity)
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
        let attr = ["STR","DEX","STA","MAN","APP"]

        let FORMS = {
            "homid":{
                "attributes_mods":[0,0,0,0,0],
                "note":"",
                "diff":"6",
                "pathx":2.5,
                "pathy":4.5,
                "path":"m -2.5,-15 0.26686,0.26686 c 0.45451,0.0571 0.10879,0.52258 0.0148,0.80058 -0.26421,0.78179 -0.61893,1.52354 -0.87471,2.3128 -0.96929,2.99093 -0.62593,5.6614 -0.59056,8.71747 0.003,0.23603 0.0388,0.94896 -0.0322,1.13662 -0.16409,0.43436 -1.03586,0.53913 -0.56337,1.08722 -0.38785,0.24464 -1.34669,1.29142 -0.43949,1.56259 0.78472,0.23456 1.1823,-0.37636 1.77729,-0.70209 0.23237,-0.12721 0.6186,-0.15091 0.78082,-0.37688 0.21334,-0.29721 0.0594,-1.08477 0.11098,-1.46211 0.21502,-1.5729 0.15002,-3.19837 0.1589,-4.8035 0.0105,-1.90714 1.35338,-4.13755 2.5929,-5.51514 0.0862,1.68327 0.51376,3.35947 0.49,5.07036 -0.0162,1.17009 -0.46664,2.31898 -0.63867,3.4692 -0.0516,0.34506 0.10846,0.64399 0.0932,0.97849 -0.036,0.7902 -0.3577,2.65381 0.50538,3.1652 0.47586,0.28197 1.45523,0.39468 1.59704,-0.32005 0.14276,-0.71943 -0.664,-1.29323 -0.53811,-2.04456 0.39248,-2.34224 0.67736,-4.64398 0.908,-7.02734 0.0851,-0.87949 0.34071,-1.6872 0.34071,-2.57967 1.74103,-0.005 1.5484,-1.52122 1.67503,-2.84651 0.26336,-2.75632 0.96087,-6.01491 0.0624,-8.71747 -0.34553,-1.03933 -1.78072,-1.18138 -2.00427,-2.3128 -0.76315,-1.10994 0.91646,-2.92339 -0.55397,-4.02584 -1.43861,-1.0786 -2.41963,0.95231 -2.46112,2.06886 -0.0121,0.3242 0.32796,0.76081 0.22814,1.04081 -0.091,0.25541 0.35796,0.7489 -0.53871,0.88509 -0.71466,0.10855 -1.49725,0.66641 -1.99262,1.19674 -0.79517,0.8513 -1.1582,2.52743 -1.44166,3.63784 -0.23965,0.93883 -0.03,1.85476 0.49288,2.66861 0.25502,0.3969 0.70687,0.78515 0.83841,1.24536 0.12043,0.42136 -0.13672,1.02136 -0.26439,1.42326 m 6.1378,-3.29129 c 0.47058,1.47163 0.94978,3.54353 0.26687,4.98141 h -0.089 l -0.17173,-2.0539 -0.0951,-1.14844 v -0.089 l 0.089,-1.69012 m -9.16223,2.31279 v 0.53373 h 0.089 z",
                "path_f":"m -2.5,0 c -0.26653,-0.0279 -0.44381,-0.20883 -0.44381,-0.45289 0,-0.0789 0.13285,-0.30649 0.29522,-0.50582 l 0.29523,-0.36242 v -0.74591 c 0,-0.49113 -0.0561,-1.08087 -0.16428,-1.72656 -0.26973,-1.61015 -0.32077,-2.40534 -0.2335,-3.63765 0.0871,-1.22948 0.0408,-1.94102 -0.22617,-3.47707 -0.0909,-0.52321 -0.17817,-0.98678 -0.19386,-1.03016 -0.0157,-0.0434 -0.1671,-0.14201 -0.33645,-0.21915 l -0.30791,-0.14027 0.0435,-1.06015 c 0.0395,-0.96403 0.12006,-1.82831 0.30633,-3.29073 0.11745,-0.92201 0.17781,-1.23952 0.29312,-1.54172 0.19567,-0.51279 0.19692,-0.75084 0.005,-1.07723 -0.2008,-0.34265 -0.42021,-0.50743 -0.8266,-0.6208 -1.02955,-0.28723 -1.92148,-0.63751 -2.57179,-1.01002 -0.46648,-0.2672 -0.5481,-0.39016 -0.4844,-0.72974 0.0897,-0.47817 0.96814,-1.42194 1.74409,-1.87382 0.19845,-0.11557 0.61177,-0.46928 0.91846,-0.78603 0.65959,-0.68116 0.98487,-0.90725 1.45571,-1.01181 l 0.34798,-0.0773 0.11655,-0.65457 c 0.0641,-0.36001 0.14419,-0.80218 0.17802,-0.9826 0.0339,-0.18041 0.11904,-0.65277 0.18941,-1.04968 0.16028,-0.90411 0.35229,-1.42055 0.65115,-1.75136 0.35234,-0.38999 0.51638,-0.45384 0.97355,-0.37897 0.21162,0.0347 0.39206,0.0632 0.40098,0.0634 0.009,2.1e-4 0.13688,0.10939 0.28437,0.24264 0.32377,0.29251 0.68206,0.98164 0.74382,1.43067 0.1265,0.91957 0.38546,2.35233 0.50395,2.78822 0.12987,0.47774 0.35039,0.78604 0.56288,0.78693 0.0426,1.8e-4 0.30831,0.25844 0.59044,0.57392 0.28214,0.31547 0.71686,0.76569 0.96604,1.00048 1.04076,0.98065 1.42683,1.41345 1.61784,1.8137 0.335,0.70191 0.29669,0.76794 -0.726,1.25149 -0.60877,0.28784 -1.1056,0.46608 -1.78635,0.64085 -0.54007,0.13865 -0.96599,0.47989 -1.09791,0.87963 -0.0814,0.24667 -0.0754,0.29289 0.0841,0.64833 0.11544,0.25723 0.25099,0.83334 0.41338,1.75692 0.22659,1.28867 0.24204,1.4636 0.24813,2.81096 0.006,1.35882 -2e-4,1.43778 -0.11689,1.45517 -0.19663,0.0293 -0.22624,0.0932 -0.3322,0.71689 -0.24553,1.44544 -0.25954,2.27121 -0.0679,4.00137 0.12178,1.09928 0.10364,1.67898 -0.10878,3.47707 -0.0953,0.80679 -0.11963,1.28768 -0.0879,1.73853 0.0422,0.59998 0.054,0.63672 0.31513,0.98408 0.22183,0.29499 0.27792,0.42901 0.30747,0.73454 0.0341,0.3526 0.0273,0.37593 -0.12009,0.41293 -0.32691,0.0904 -0.65664,0.0293 -0.86396,0.009 -0.2061,-0.0203 -0.24214,-0.12569 -0.32507,-0.18676 -0.0113,-0.12163 -0.15365,-0.11951 -0.22695,-0.17635 -0.0567,-0.10079 -0.0567,-0.17891 -0.0195,-0.22378 0.042,-0.12344 0.0602,-0.0247 0.0483,-1.75029 -0.007,-0.95032 -0.0441,-1.43435 -0.17279,-2.23057 -0.0904,-0.55928 -0.19024,-1.47448 -0.22182,-2.03376 -0.0353,-0.62624 -0.0976,-1.12856 -0.1619,-1.30759 -0.24217,-0.67368 -0.2929,-1.04563 -0.33168,-2.4319 -0.0217,-0.77578 -0.0613,-1.5286 -0.088,-1.67293 -0.0464,-0.25065 -0.0588,-0.2617 -0.27544,-0.24622 -0.54262,0.0387 -0.52211,0.009 -0.52204,0.7559 2e-5,0.36917 0.0329,0.99595 0.0732,1.39287 0.10257,1.01166 0.0941,1.44868 -0.0367,1.90254 -0.0785,0.27236 -0.13106,0.808 -0.17053,1.73854 -0.0314,0.7397 -0.10216,1.58108 -0.15731,1.86975 -0.14648,0.76672 -0.20098,1.84952 -0.11249,2.23526 0.0502,0.21886 0.0564,0.53533 0.019,0.97939 -0.0718,0.8527 0.0531,0.81372 -0.0471,0.88351 -0.0345,0.0855 -0.14986,0.11241 -0.25592,0.25295 -0.16556,0.21937 -0.27035,0.27877 -0.77091,0.22637 z m 4.45394,-20.02286 c 0.64295,-0.23023 0.82331,-0.32038 1.47625,-0.73788 0.51164,-0.32714 0.60603,-0.43499 0.53737,-0.61393 -0.0212,-0.0554 -0.41661,-0.40967 -0.87855,-0.78726 -0.9441,-0.77172 -1.09133,-0.82348 -1.43952,-0.50612 -0.16457,0.15 -0.21382,0.26892 -0.29209,0.70526 -0.14946,0.83312 -0.16193,2.1324 -0.0205,2.13184 0.0451,-1.8e-4 0.32277,-0.0865 0.61703,-0.19191 z m -4.72887,-0.85049 c -0.091,-1.24817 -0.14208,-1.61766 -0.25168,-1.82171 -0.14284,-0.26597 -0.41146,-0.47724 -0.55764,-0.43857 -0.0627,0.0166 -0.49781,0.30405 -0.96689,0.63881 -0.5591,0.399 -0.85985,0.65582 -0.87315,0.7456 -0.0163,0.10977 0.11398,0.22484 0.65605,0.5796 0.67448,0.44142 1.53039,0.87976 1.71785,0.87976 0.0544,0 0.11738,0.03 0.14004,0.0667 0.0227,0.0367 0.0727,0.0472 0.1113,0.0233 0.0471,-0.0291 0.055,-0.2498 0.0241,-0.67352 z"
                },
            "glabro":{
                "attributes_mods":[2,0,2,-1,-1],
                "diff":"7",
                "pathx":2.5,
                "pathy":4.5,
                "path":"m -5,-15 c 0.12758,0.39104 0.20516,0.71945 0.61231,0.87472 0.2772,-1.01838 -0.73592,-1.72392 -0.76985,-2.6242 -0.0297,-0.78732 0.53967,-1.62521 0.76762,-2.36178 0.31454,-1.01635 0.31405,-2.11033 0.61455,-3.14905 0.99197,2.3056 -0.10583,4.97908 -0.33506,7.34777 -0.11079,1.14499 -0.21812,2.26522 -0.0773,3.41147 0.0861,0.70059 0.39294,1.39763 0.40761,2.09937 0.0233,1.11362 -0.52601,2.14004 -0.59976,3.23652 -0.087,1.29405 0.38046,2.57202 0.48826,3.84883 0.0619,0.73309 -0.42215,1.50839 -0.93697,1.98691 -0.20146,0.18728 -0.74284,0.52394 -0.53091,0.86212 0.61225,0.97703 2.52592,-0.22676 2.61739,-1.0137 0.0878,-0.75511 -0.22394,-1.51733 -0.14337,-2.2727 0.0953,-0.89318 0.59274,-1.66007 0.73361,-2.53673 0.11634,-0.72402 -0.073,-1.46841 0.0481,-2.18683 0.39063,-2.31785 0.95911,-4.67734 1.38992,-6.99789 0.31808,0.44221 0.27903,0.96912 0.40808,1.48705 0.28789,1.15545 0.6226,2.21783 0.74386,3.41147 0.0713,0.70178 0.39342,1.32867 0.4917,2.01189 0.10353,0.71973 -0.053,1.46504 0.0345,2.18684 0.0934,0.77039 0.48461,1.50915 0.6387,2.27431 0.29713,1.47538 -0.60133,2.68207 0.78963,3.74915 0.33604,0.25779 1.63399,0.32461 1.71147,-0.25973 0.0477,-0.35985 -0.4872,-0.72237 -0.6985,-0.95269 -0.41246,-0.44953 -0.6934,-0.95558 -0.70661,-1.57452 -0.0265,-1.24093 0.41165,-2.4383 0.45829,-3.67389 0.0457,-1.21061 -0.54061,-2.305 -0.54023,-3.49894 5e-4,-1.46592 0.49266,-2.87525 0.42705,-4.37367 -0.0965,-2.20433 -0.95275,-4.3737 -0.94305,-6.56051 0.003,-0.68776 0.29076,-1.42447 0.42165,-2.09937 h 0.0875 l 0.51621,2.88663 0.84855,2.71167 -0.92739,2.53674 c 0.51057,0.0851 0.63119,-0.24445 0.69979,-0.6998 h 0.3499 c 0.0366,0.51033 -0.1166,0.79213 -0.61232,0.96221 0.006,0.16812 -0.0863,0.5009 0.0134,0.64323 0.3653,0.52176 1.36202,-0.8668 1.43705,-1.16807 0.14677,-0.58938 0.0366,-1.31915 0.0366,-1.92441 0,-1.26952 0.0512,-2.5899 -0.11279,-3.84883 -0.083,-0.63693 -0.3916,-1.20605 -0.48779,-1.83695 -0.16178,-1.06118 -0.0436,-2.42099 -0.40037,-3.41147 -0.52328,-1.45267 -2.72042,-1.24277 -3.36997,-2.53808 -0.18704,-0.373 0.0621,-0.84854 0.1215,-1.23111 0.1085,-0.6992 0.22452,-1.58183 -0.0363,-2.26648 -0.32761,-0.85992 -1.49887,-1.21858 -2.24853,-0.6383 -0.8111,0.62783 -0.73356,2.01622 -0.51822,2.91261 0.10472,0.43594 0.45422,0.85032 0.21381,1.30832 -0.61387,1.16952 -2.67246,1.06682 -3.23124,2.36557 -0.33195,0.77152 -0.16002,1.792 -0.28908,2.62421 -0.3674,2.36887 -0.74921,4.49149 -0.75015,6.9104 -2.4e-4,0.70007 -0.0872,3.17606 1.37137,2.72801 0.25922,-0.0796 0.11585,-0.38651 7e-5,-0.52295 -0.36747,-0.43297 -0.84384,-0.65451 -0.23428,-1.15537 z",
                "path_f":"m -4,0 c -0.185,-0.11717 -0.13521,-0.50562 0.16465,-1.28455 0.16338,-0.4244 0.21811,-1.13259 0.29526,-3.82047 0.0747,-2.60014 0.14203,-3.50111 0.31799,-4.25069 0.2387,-1.01683 0.25339,-1.99023 0.0818,-5.41626 -0.0782,-1.56225 -0.0616,-1.84699 0.16554,-2.83642 0.13889,-0.6049 0.27761,-1.3185 0.30825,-1.58576 l 0.0558,-0.48594 -0.3533,0.10132 c -0.30845,0.0885 -0.41376,0.0508 -0.82952,-0.29654 -1.10566,-0.92376 -2.30421,-2.48327 -2.30421,-2.99815 0,-0.37921 0.5797,-1.32021 1.32359,-2.14853 0.20222,-0.22518 0.53639,-0.70427 0.74257,-1.06464 0.3993,-0.69791 1.31607,-1.47814 1.7368,-1.47814 0.29034,0 0.46381,-0.29329 0.52568,-0.88877 0.12884,-1.24014 0.43764,-2.9761 0.60285,-3.388981 0.60611,-1.514826 2.27318,-1.563124 2.99078,-0.08665 0.21691,0.446311 0.34071,1.005651 0.47908,2.164731 0.10262,0.85961 0.24703,1.68615 0.3209,1.83675 0.0771,0.15715 0.32548,0.33846 0.58294,0.42549 0.54337,0.18368 1.14341,0.74017 1.55533,1.44246 0.16807,0.28654 0.59837,0.87102 0.95622,1.29886 0.35786,0.42784 0.77534,1.01291 0.92772,1.30017 0.27206,0.51282 0.27332,0.52926 0.0702,0.90639 -0.31953,0.59333 -1.58565,2.05423 -2.16003,2.49232 -0.43483,0.33165 -0.58497,0.38434 -0.95407,0.33484 l -0.43804,-0.0588 0.0657,0.48096 c 0.0362,0.26453 0.19279,1.03375 0.34804,1.70938 0.26584,1.15703 0.28051,1.40257 0.25219,4.22567 -0.0276,2.7506 -0.009,3.07824 0.22039,3.98132 0.28519,1.12058 0.38783,2.40386 0.39813,4.97819 0.005,1.33047 0.0694,2.10567 0.24787,2.99799 0.23383,1.1693 0.23458,1.20798 0.0263,1.36032 -0.25692,0.18787 -0.43646,0.19409 -1.00952,0.0349 -0.29072,-0.0807 -0.43415,-0.18761 -0.43415,-0.32351 0,-0.11162 -0.0455,-0.25244 -0.10103,-0.31294 -0.0555,-0.0605 -0.13051,-0.55642 -0.16654,-1.10206 -0.0561,-0.84913 -0.0339,-1.04018 0.15353,-1.32599 0.12352,-0.18831 0.1778,-0.38676 0.12444,-0.45507 -0.0521,-0.0666 -0.12737,-0.41355 -0.16742,-0.77093 -0.04,-0.35737 -0.20949,-1.11278 -0.37657,-1.67869 -0.16706,-0.56591 -0.37216,-1.4978 -0.45577,-2.07087 -0.0836,-0.57307 -0.21196,-1.25034 -0.28522,-1.50503 -0.12967,-0.45072 -0.27131,-1.16246 -0.63362,-3.18373 -0.097,-0.54123 -0.32108,-1.50504 -0.49793,-2.14178 -0.26819,-0.96561 -0.35937,-1.15772 -0.5495,-1.15772 -0.19397,0 -0.27469,0.18992 -0.54125,1.27349 -0.17231,0.70042 -0.36914,1.69027 -0.4374,2.19967 -0.28187,2.10313 -0.37797,2.66887 -0.47329,2.78603 -0.0552,0.0678 -0.15764,0.64088 -0.22771,1.27349 -0.07,0.63262 -0.27624,1.72329 -0.45815,2.42371 -0.51661,1.98914 -0.58852,2.69192 -0.32172,3.14411 0.18501,0.31357 0.20058,0.44345 0.0977,0.81415 -0.0674,0.24259 -0.12277,0.65941 -0.12313,0.92627 -2.5e-4,0.26685 -0.056,0.51937 -0.12356,0.56116 -0.0676,0.0418 -0.16766,0.19366 -0.22235,0.33751 -0.12925,0.33994 -1.1192,0.54274 -1.49316,0.30587 z m 1.43535,-20.73554 c 0.20721,-0.12806 0.40802,-0.34948 0.44622,-0.49203 0.13278,-0.4954 0.0643,-2.33813 -0.10436,-2.80615 -0.0918,-0.2547 -0.16762,-0.5559 -0.16857,-0.66933 -0.005,-0.62162 -0.71054,-0.22493 -1.79383,1.00897 l -0.66231,0.75438 0.40782,0.72648 c 0.44581,0.79417 1.18309,1.71054 1.37624,1.71054 0.0671,0 0.29157,-0.10479 0.49879,-0.23286 z m 6.87884,-0.42288 c 0.26142,-0.29698 0.63535,-0.81972 0.83098,-1.16164 0.34091,-0.59584 0.34777,-0.63377 0.16519,-0.91242 -0.33056,-0.50449 -1.64806,-1.78531 -1.83645,-1.78531 -0.23983,0 -0.28101,0.0809 -0.54338,1.06727 -0.13879,0.52177 -0.22527,1.2296 -0.22696,1.85768 l -0.003,1.0147 0.37625,0.22941 c 0.54532,0.33249 0.70758,0.29187 1.23709,-0.30969 z"
                } ,
            "crinos":{
                "attributes_mods":[4,1,3,-3,-10],
                "note":"INCITE DELIRIUM IN HUMANS",
                "diff":"6",
                "pathx":2.5,
                "pathy":4.5,
                "path":"m 10,0 c -0.15367,-0.0301 -0.37521,-0.1418 -0.42152,-0.21249 -0.12718,-0.19408 -0.0915,-0.34199 0.14092,-0.58338 0.22741,-0.23623 0.26223,-0.30812 0.2491,-0.51428 -0.009,-0.14029 -0.0328,-0.20609 -0.17102,-0.47166 l -0.16063,-0.30862 -0.0201,-0.37228 -0.0201,-0.37228 -0.19056,-0.36336 c -0.1048,-0.19985 -0.25805,-0.5403 -0.34054,-0.75655 -0.0825,-0.21626 -0.18167,-0.45597 -0.22041,-0.53271 -0.18795,-0.37223 -0.41664,-0.64932 -0.68054,-0.82454 l -0.14542,-0.0966 -0.0854,0.0991 c -0.11292,0.13101 -0.33217,0.26007 -0.54233,0.3192 -0.34208,0.0963 -0.87972,0.0559 -1.30858,-0.0982 -0.19124,-0.0687 -0.61838,-0.27553 -0.78065,-0.37798 -0.11857,-0.0749 -0.1228,-0.075 -0.12431,-0.004 -6.8e-4,0.0468 -0.0365,0.0197 -0.1966,-0.14986 -0.10745,-0.11382 -0.26794,-0.2665 -0.35663,-0.3393 -0.18218,-0.14953 -0.18211,-0.14985 -0.038,0.18701 0.0468,0.10936 0.0851,0.21171 0.0851,0.22744 0,0.0551 -0.2847,-0.2515 -0.51364,-0.55312 -0.12708,-0.16742 -0.27183,-0.35026 -0.32166,-0.40631 -0.0498,-0.0561 -0.1227,-0.14165 -0.16195,-0.19024 -0.0504,-0.0624 -0.0288,-0.006 0.0734,0.19068 0.0796,0.15348 0.15616,0.29358 0.1701,0.31136 0.0139,0.0178 0.0188,0.0388 0.0109,0.0467 -0.008,0.008 -0.0455,-0.0326 -0.0834,-0.0899 -0.0379,-0.0574 -0.0747,-0.0986 -0.0817,-0.0917 -0.007,0.007 0.03,0.1336 0.0822,0.28143 0.0521,0.14784 0.0898,0.27382 0.0836,0.27994 -0.006,0.006 -0.0831,-0.17451 -0.17118,-0.40141 -0.11507,-0.29659 -0.22095,-0.51392 -0.37672,-0.77325 -0.11917,-0.19839 -0.22097,-0.3564 -0.22622,-0.35115 -0.005,0.005 0.007,0.042 0.0272,0.0817 0.0202,0.0396 0.045,0.10065 0.0552,0.13553 0.0181,0.0618 0.0174,0.0621 -0.0219,0.0127 -0.0462,-0.058 -0.0564,-0.0907 0.14776,0.47918 0.0644,0.17985 0.11261,0.33148 0.10711,0.33697 -0.005,0.005 -0.0528,-0.0903 -0.10493,-0.21283 -0.0522,-0.12255 -0.14906,-0.31984 -0.21517,-0.43844 -0.0661,-0.11858 -0.23482,-0.45102 -0.37491,-0.73875 -0.21499,-0.44159 -0.31103,-0.6099 -0.31103,-0.54511 0,0.018 0.28425,0.70791 0.36436,0.88434 0.0364,0.0802 0.061,0.14586 0.0547,0.14586 -0.0186,0 -0.18256,-0.26444 -0.30873,-0.49778 -0.0639,-0.11825 -0.12101,-0.21024 -0.12683,-0.20441 -0.006,0.006 6.8e-4,0.0606 0.0151,0.12174 0.014,0.0611 0.0253,0.13399 0.0247,0.16189 -5e-4,0.0279 -0.0342,-0.0832 -0.075,-0.24694 -0.0407,-0.16371 -0.10684,-0.36348 -0.14696,-0.44391 -0.0401,-0.0804 -0.093,-0.19965 -0.11745,-0.2649 -0.0245,-0.0653 -0.0737,-0.14517 -0.10925,-0.17758 -0.0528,-0.048 -0.0617,-0.0504 -0.0482,-0.013 0.0491,0.13615 0.0982,0.50737 0.0769,0.58134 -0.0222,0.0772 -0.0276,0.069 -0.15987,-0.2356 -0.0753,-0.17354 -0.20235,-0.4468 -0.28232,-0.60725 -0.12242,-0.24563 -0.16848,-0.31154 -0.29157,-0.41723 -0.15555,-0.13354 -0.12404,-0.12104 -1.73607,-0.68902 -0.77816,-0.27418 -1.21567,-0.36346 -1.78837,-0.36497 -0.77156,-0.002 -1.09471,-0.0606 -1.81574,-0.32903 -0.2282,-0.085 -0.47861,-0.17098 -0.55645,-0.19115 -0.19867,-0.0515 -0.49655,-0.0911 -0.54505,-0.0725 -0.0363,0.0139 -0.0353,0.0216 0.008,0.0695 0.056,0.0616 0.11472,0.16773 0.10062,0.18184 -0.005,0.005 -0.0604,-0.0243 -0.12255,-0.0655 -0.13701,-0.0909 -0.15109,-0.0922 -0.15109,-0.0141 0,0.0468 -0.0109,0.0582 -0.0466,0.0488 -0.0394,-0.0103 -0.0448,-9e-5 -0.0352,0.0658 0.006,0.0429 0.005,0.078 -0.002,0.078 -0.007,0 -0.0542,-0.0571 -0.10431,-0.12683 -0.0669,-0.0931 -0.10771,-0.12684 -0.15346,-0.12684 -0.0618,0 -0.062,7.7e-4 -0.0265,0.10147 0.0197,0.0558 0.0283,0.10147 0.0191,0.10147 -0.009,0 -0.0533,-0.0355 -0.098,-0.0788 l -0.0813,-0.0788 -0.031,0.0579 c -0.017,0.0319 -0.0366,0.12853 -0.0436,0.21485 -0.0148,0.18319 0.0309,0.34594 0.14528,0.51826 0.14968,0.22553 0.59356,0.51935 1.06842,0.70724 0.10592,0.0419 0.24578,0.1121 0.31083,0.15601 0.11181,0.0755 0.6801,0.35548 0.79119,0.38985 0.0284,0.009 0.0716,0.0498 0.096,0.0912 0.0434,0.0734 0.0429,0.0783 -0.0212,0.20478 -0.0909,0.17939 -0.32539,0.40518 -0.68445,0.65904 -0.7081,0.50065 -0.95371,0.89941 -0.90762,1.47358 0.0154,0.19183 -0.0279,0.37071 -0.21037,0.86839 -0.1336,0.36446 -0.18383,0.43795 -0.37365,0.54671 -0.41874,0.23992 -0.57683,0.57262 -0.54283,1.14243 l 0.0144,0.24223 -0.0495,-0.0631 c -0.0955,-0.12175 -0.25851,-0.47987 -0.30119,-0.66151 l -0.0432,-0.18342 -0.0448,0.11187 c -0.0686,0.17163 -0.25693,0.41866 -0.40309,0.52885 -0.0724,0.0546 -0.32572,0.18722 -0.5629,0.29472 -1.4795,0.67059 -1.47895,0.67037 -1.74408,0.67172 -0.23306,0.002 -0.49306,0.0511 -0.60419,0.11601 -0.20646,0.12058 -0.34117,0.40602 -0.38776,0.82164 l -0.0299,0.26634 -0.0566,-0.13951 c -0.0813,-0.20039 -0.11522,-0.4169 -0.098,-0.62597 0.0148,-0.17969 0.10452,-0.46495 0.18009,-0.57285 0.0601,-0.0857 0.0475,-0.11136 -0.069,-0.14207 -0.20698,-0.0545 -0.25311,-0.0495 -0.27493,0.0298 -0.0419,0.15208 -0.14262,0.24028 -0.44276,0.38733 -0.41457,0.20313 -0.40553,0.18588 -0.40189,0.76685 0.002,0.25553 -0.006,0.45529 -0.0168,0.44393 -0.0607,-0.0639 -0.20595,-0.37656 -0.25102,-0.54018 -0.063,-0.22882 -0.0698,-0.62204 -0.0147,-0.85031 0.0202,-0.0837 0.0372,-0.16153 0.0376,-0.17293 5e-4,-0.0114 -0.1846,-0.0171 -0.41131,-0.0127 -0.46384,0.009 -0.5639,0.0386 -0.67222,0.19792 -0.0926,0.13623 -0.0779,0.25799 0.0476,0.39414 0.0576,0.0624 0.0979,0.11358 0.0895,0.11358 -0.008,0 -0.0775,-0.0276 -0.15362,-0.0612 -0.19896,-0.088 -0.2819,-0.2193 -0.28064,-0.44427 0.002,-0.32038 0.17576,-0.51276 0.70031,-0.77451 0.3699,-0.18458 0.41919,-0.2167 0.65325,-0.42569 0.21107,-0.18846 0.46555,-0.31215 0.94869,-0.46111 0.20641,-0.0637 0.46152,-0.1516 0.56691,-0.19547 0.399,-0.16611 0.91442,-0.47346 1.48318,-0.88448 0.38932,-0.28134 0.42064,-0.31334 0.52137,-0.53293 0.10588,-0.2308 0.18495,-0.31687 0.46543,-0.50664 0.28038,-0.18972 0.39223,-0.3149 0.44571,-0.49889 0.0834,-0.28671 -0.008,-0.60763 -0.26005,-0.90989 -0.15219,-0.18277 -0.41698,-0.41689 -0.48672,-0.43031 -0.0276,-0.005 -0.20335,-0.11218 -0.39057,-0.23749 -0.29477,-0.19728 -0.51232,-0.3057 -0.54595,-0.27207 -0.005,0.005 0.0648,0.14444 0.15607,0.309 0.0912,0.16455 0.16094,0.30411 0.15494,0.31012 -0.006,0.006 -0.0614,-0.0452 -0.12298,-0.11369 -0.0837,-0.0931 -0.14608,-0.13551 -0.24665,-0.16766 -0.074,-0.0237 -0.13711,-0.0405 -0.14014,-0.0375 -0.003,0.003 0.0336,0.072 0.0814,0.15316 0.0478,0.0812 0.0725,0.13892 0.0549,0.12836 -0.0176,-0.0106 -0.17188,-0.13164 -0.34279,-0.26906 -0.17091,-0.13743 -0.31075,-0.23901 -0.31075,-0.22574 0,0.0133 0.0285,0.1449 0.0634,0.29252 0.0982,0.41547 0.0951,0.41866 -0.15162,0.1597 -0.117,-0.12279 -0.28201,-0.32735 -0.36667,-0.45456 -0.0847,-0.12721 -0.15393,-0.21958 -0.15393,-0.20526 0,0.0143 0.0351,0.14856 0.078,0.2983 0.0429,0.14974 0.0719,0.27843 0.0644,0.28598 -0.008,0.008 -0.0679,-0.0976 -0.1341,-0.23363 -0.12555,-0.25796 -0.16117,-0.27803 -0.10924,-0.0616 0.0322,0.13453 0.0172,0.19938 -0.0224,0.0965 -0.0128,-0.0333 -0.0913,-0.23181 -0.17435,-0.44109 -0.0831,-0.20928 -0.15989,-0.40334 -0.17074,-0.43124 -0.0385,-0.0992 -0.0666,0.0886 -0.0847,0.56786 l -0.0176,0.46638 -0.11926,-0.21272 c -0.14031,-0.25027 -0.23312,-0.48729 -0.2993,-0.76437 -0.0263,-0.11025 -0.0818,-0.25383 -0.12327,-0.31906 -0.0999,-0.15708 -0.17044,-0.31358 -0.22509,-0.4991 l -0.0448,-0.1522 -0.0127,0.20294 -0.0127,0.20293 -0.0963,-0.14223 c -0.11412,-0.16855 -0.21949,-0.45184 -0.22024,-0.59214 -6.9e-4,-0.14686 -0.0454,-0.0837 -0.0993,0.14066 l -0.0449,0.18707 -0.0169,-0.12365 c -0.0236,-0.17166 -0.0204,-0.42858 0.008,-0.62296 0.0131,-0.0902 0.0181,-0.16962 0.0111,-0.17657 -0.0238,-0.0238 -0.13475,0.13744 -0.1907,0.27709 -0.0903,0.22534 -0.10569,0.21477 -0.0923,-0.0634 0.0128,-0.26669 0.0758,-0.49709 0.17127,-0.62681 0.0279,-0.0378 0.0506,-0.075 0.0506,-0.0828 0,-0.0224 -0.18109,0.0589 -0.28771,0.12916 -0.0536,0.0353 -0.10237,0.0593 -0.10838,0.0533 -0.02,-0.02 0.17213,-0.28278 0.31669,-0.43296 0.0786,-0.0816 0.21579,-0.19787 0.305,-0.25838 l 0.16217,-0.11001 -0.11145,-0.008 -0.11144,-0.008 0.16489,-0.1232 c 0.18054,-0.1349 0.34996,-0.22757 0.54539,-0.29833 0.0777,-0.0282 0.10474,-0.0462 0.0697,-0.0469 -0.0797,-0.002 -0.0712,-0.0324 0.0244,-0.0888 0.0448,-0.0264 0.0703,-0.0518 0.0568,-0.0563 -0.0135,-0.005 -0.1614,0.0252 -0.32863,0.066 -0.16724,0.0408 -0.30821,0.07 -0.31327,0.065 -0.0237,-0.0237 0.44197,-0.19262 0.76998,-0.27919 0.22651,-0.0597 0.22731,-0.0603 0.10148,-0.0624 l -0.12684,-0.002 0.0599,-0.0499 c 0.033,-0.0274 0.0479,-0.0499 0.0333,-0.0499 -0.048,0 -0.39434,0.13158 -0.54337,0.20647 -0.17634,0.0886 -0.18921,0.0646 -0.0247,-0.0461 0.20414,-0.13736 0.52467,-0.28398 0.77147,-0.3529 0.12992,-0.0362 0.32877,-0.10482 0.44188,-0.15232 0.11312,-0.0475 0.21804,-0.0864 0.23315,-0.0864 0.015,0 0.0356,-0.0131 0.0455,-0.0292 0.0134,-0.0217 -0.0618,-0.0245 -0.29633,-0.0108 -0.17291,0.0101 -0.30848,0.0125 -0.30126,0.005 0.0237,-0.0237 0.41496,-0.16053 0.55084,-0.19259 0.12033,-0.0284 0.18124,-0.0753 0.10147,-0.0782 -0.0174,-4.9e-4 -0.066,-0.0179 -0.10782,-0.0383 -0.0735,-0.0359 -0.0707,-0.0367 0.0831,-0.0246 0.0876,0.007 0.18744,0.0197 0.22196,0.0283 0.0349,0.009 0.0627,0.005 0.0627,-0.009 0,-0.029 -0.4026,-0.16537 -0.61516,-0.20836 -0.0802,-0.0162 -0.14586,-0.0359 -0.14586,-0.0436 0,-0.03 0.41878,0.0243 0.6539,0.0848 0.28663,0.0737 0.28365,0.0735 0.44956,0.0316 0.0829,-0.0209 0.10925,-0.0356 0.0761,-0.0425 -0.0279,-0.006 -0.0616,-0.0207 -0.0748,-0.0333 -0.024,-0.0227 0.0336,-0.0287 0.35387,-0.0365 0.25168,-0.006 0.26532,-0.0108 0.16488,-0.0554 l -0.0888,-0.0395 0.13952,-0.0459 c 0.0767,-0.0253 0.18837,-0.0584 0.2481,-0.0738 0.0597,-0.0154 0.10241,-0.0379 0.0949,-0.0501 -0.0132,-0.0213 0.0706,-0.0544 0.2249,-0.0887 0.0403,-0.009 0.10877,-0.0432 0.1522,-0.0759 0.0435,-0.0328 0.22528,-0.12411 0.40409,-0.20297 0.17881,-0.0789 0.38942,-0.18452 0.46801,-0.23479 0.16212,-0.10371 0.49198,-0.26152 0.67304,-0.32199 0.12386,-0.0414 0.9323,-0.59935 1.28295,-0.88549 0.40153,-0.32765 0.56883,-0.65843 0.60372,-1.19353 l 0.0163,-0.25022 -0.085,0.0187 c -0.0468,0.0103 -0.15988,0.043 -0.25134,0.0726 -0.16277,0.0528 -0.16656,0.0561 -0.17898,0.15348 l -0.0127,0.0995 -0.0364,-0.0687 c -0.0218,-0.0412 -0.0506,-0.0632 -0.0718,-0.0551 -0.0194,0.008 -0.0445,0.0136 -0.0558,0.0136 -0.0113,0 -0.0679,0.0799 -0.12589,0.17757 -0.058,0.0977 -0.11228,0.17756 -0.12058,0.17756 -0.0179,0 0.006,-0.2214 0.0309,-0.28537 0.009,-0.0244 0.007,-0.0444 -0.006,-0.0444 -0.0127,0 -0.0624,0.0741 -0.11053,0.16467 -0.0481,0.0906 -0.0958,0.16476 -0.10601,0.16488 -0.0101,1.1e-4 -0.0115,-0.0512 -0.003,-0.11393 0.009,-0.0628 0.01,-0.11416 0.002,-0.11416 -0.008,0 -0.0495,0.0562 -0.0936,0.12489 -0.0441,0.0687 -0.0983,0.13994 -0.12045,0.15834 -0.0355,0.0295 -0.038,0.0262 -0.0211,-0.0272 l 0.0192,-0.0607 -0.0727,0.0504 c -0.13945,0.0967 -0.14819,0.0941 -0.0616,-0.0184 0.14302,-0.18576 0.14549,-0.19231 0.0397,-0.10568 -0.17907,0.14667 -0.45361,0.33796 -0.55807,0.38885 -0.0964,0.0469 -0.0931,0.0417 0.0634,-0.10329 0.0907,-0.084 0.15677,-0.1529 0.14684,-0.15313 -0.01,-2.3e-4 -0.12899,0.0679 -0.26458,0.15143 -0.13561,0.0835 -0.25106,0.14734 -0.25658,0.14182 -0.01,-0.01 0.13818,-0.15295 0.27286,-0.26472 0.0349,-0.029 0.0543,-0.053 0.0432,-0.0534 -0.0111,-5e-4 -0.1992,0.0505 -0.41792,0.11331 -0.58298,0.16734 -0.67152,0.15986 -1.08384,-0.0916 -0.34991,-0.21338 -0.41162,-0.22692 -1.20493,-0.26445 -0.72819,-0.0345 -0.93421,-0.0646 -1.38839,-0.20314 -0.11663,-0.0356 -0.3,-0.10545 -0.40749,-0.15528 -0.2805,-0.13006 -0.39092,-0.16006 -0.68612,-0.18645 -0.31642,-0.0283 -0.46429,-0.0889 -0.66462,-0.27229 -0.14902,-0.13644 -0.38678,-0.43342 -0.48237,-0.60251 l -0.0574,-0.10147 0.14993,0.1444 c 0.26791,0.25803 0.59553,0.40714 0.79719,0.36285 l 0.0755,-0.0166 -0.15095,-0.1008 c -0.28436,-0.18989 -0.45512,-0.4437 -0.49866,-0.74119 l -0.0154,-0.10528 0.082,0.12626 c 0.2139,0.32924 0.62322,0.60651 1.04411,0.70727 l 0.0677,0.0162 -0.013,-0.4883 -0.013,-0.48829 0.1368,0.24343 c 0.17095,0.30419 0.28676,0.46272 0.44856,0.61407 0.13733,0.12846 0.14215,0.1292 0.40537,0.0627 l 0.11096,-0.028 -0.0172,-0.21778 c -0.0217,-0.27613 -0.0961,-0.64575 -0.1786,-0.88795 -0.0353,-0.10351 -0.06,-0.19232 -0.0549,-0.19737 0.005,-0.005 0.0732,0.06 0.15141,0.14444 0.15744,0.17006 0.29847,0.39767 0.44827,0.72345 0.13023,0.28322 0.13901,0.28699 0.53921,0.23106 0.17073,-0.0239 0.37272,-0.0573 0.44886,-0.0743 l 0.13844,-0.031 -0.25109,-0.20258 c -0.31392,-0.25326 -0.48891,-0.4773 -0.56873,-0.72818 -0.10257,-0.32237 -0.22152,-0.5208 -0.44748,-0.74641 l -0.20691,-0.20661 0.13581,0.0468 c 0.39961,0.13749 0.68434,0.35895 0.95821,0.74532 0.21136,0.29816 0.31732,0.39167 0.54519,0.48107 0.2158,0.0847 0.32844,0.19934 0.48543,0.4942 0.14699,0.27607 0.23887,0.35816 0.40085,0.35816 0.10155,0 0.15234,-0.0197 0.30986,-0.12049 l 0.1884,-0.12049 -0.17757,-0.0135 -0.17757,-0.0136 0.0924,-0.0427 c 0.0508,-0.0235 0.18209,-0.0581 0.29172,-0.0768 l 0.19934,-0.0341 -0.24734,-0.0605 c -0.13603,-0.0332 -0.24733,-0.0704 -0.24733,-0.0825 0,-0.0205 0.21457,-0.0117 0.52637,0.0214 0.19528,0.0208 0.16248,-0.0249 -0.0432,-0.0601 -0.19304,-0.0331 -0.67276,-0.17944 -0.653,-0.1992 0.007,-0.007 0.0963,0.005 0.19889,0.0262 0.10261,0.0212 0.32039,0.0521 0.48397,0.0687 0.24129,0.0244 0.30491,0.0239 0.33719,-0.003 0.0219,-0.0181 0.0307,-0.0419 0.0197,-0.0526 -0.0111,-0.0108 -0.14529,-0.0381 -0.29829,-0.0607 -0.15301,-0.0226 -0.28182,-0.0447 -0.28623,-0.0491 -0.004,-0.005 0.0522,-0.0156 0.126,-0.0248 0.13245,-0.0165 0.40519,-0.0689 0.42145,-0.0809 0.005,-0.003 -0.004,-0.03 -0.0199,-0.0591 -0.0202,-0.0377 -0.0531,-0.0529 -0.11471,-0.0529 -0.0475,0 -0.0934,-0.0114 -0.10207,-0.0254 -0.009,-0.014 0.007,-0.0253 0.0345,-0.0253 0.11549,0 0.12976,-0.0208 0.0905,-0.13203 -0.061,-0.17285 -0.0408,-0.18755 0.0598,-0.0435 0.0528,0.0757 0.10421,0.13465 0.11415,0.13117 0.01,-0.004 0.0537,-0.006 0.0971,-0.006 0.0674,0 0.0767,-0.008 0.0634,-0.0508 -0.009,-0.0279 -0.0233,-0.0759 -0.0326,-0.10661 -0.0139,-0.0457 0.006,-0.0364 0.10945,0.0508 0.0753,0.0635 0.15224,0.1066 0.19026,0.1066 0.11712,0 0.48343,-0.42126 0.75495,-0.8682 l 0.10342,-0.17023 -0.2598,-0.52418 -0.2598,-0.52419 -0.0168,0.12385 c -0.009,0.0681 -0.0191,0.18093 -0.022,0.25068 l -0.005,0.12684 -0.021,-0.10147 c -0.0115,-0.0558 -0.0217,-0.22405 -0.0224,-0.37387 -6.8e-4,-0.19447 -0.0168,-0.32875 -0.0551,-0.46929 -0.0295,-0.10829 -0.0597,-0.20259 -0.067,-0.20956 -0.008,-0.007 -0.006,0.14491 0.003,0.33753 0.0106,0.22991 0.008,0.34486 -0.009,0.33461 -0.0139,-0.009 -0.026,-0.0463 -0.027,-0.0839 -6.9e-4,-0.0376 -0.0116,-0.0911 -0.0236,-0.11899 -0.0184,-0.0428 -0.0221,-0.038 -0.0236,0.0302 -0.003,0.15314 -0.0525,0.11805 -0.0525,-0.0375 0,-0.17744 -0.0296,-0.61839 -0.0408,-0.60721 -0.004,0.005 -0.0364,0.15442 -0.0715,0.33364 -0.0351,0.17921 -0.0713,0.33284 -0.0806,0.3414 -0.009,0.009 -0.0107,-0.10186 -0.003,-0.24537 0.0131,-0.24849 -0.034,-0.90338 -0.0673,-0.93671 -0.009,-0.009 -0.0166,0.10316 -0.0175,0.24849 -0.002,0.2815 -0.0437,0.2908 -0.0475,0.0106 -0.002,-0.0837 -0.01,-0.19757 -0.0187,-0.25301 l -0.0167,-0.1008 -0.0311,0.1008 -0.0312,0.10081 -0.004,-0.16489 c -0.002,-0.0907 -0.0131,-0.21054 -0.024,-0.26635 -0.018,-0.0917 -0.0214,-0.0954 -0.0363,-0.038 -0.009,0.0349 -0.0194,0.12621 -0.023,0.20294 l -0.007,0.13952 -0.0458,-0.19026 c -0.0253,-0.10464 -0.0584,-0.23591 -0.0737,-0.29171 l -0.0278,-0.10147 -0.0443,0.13951 -0.0443,0.13953 -0.004,-0.49466 -0.004,-0.49466 -0.078,0.20996 c -0.0429,0.11547 -0.0828,0.20519 -0.0886,0.19937 -0.006,-0.006 0.0187,-0.16097 0.0546,-0.34477 0.07,-0.35865 0.12577,-0.80613 0.10994,-0.88105 -0.005,-0.0253 -0.0586,0.0996 -0.11842,0.27745 -0.0598,0.17788 -0.11515,0.32342 -0.12303,0.32342 -0.0429,0 0.051,-0.66976 0.13461,-0.96033 0.0488,-0.16951 0.0329,-0.19566 -0.0257,-0.0422 -0.0421,0.11018 -0.0972,0.16209 -0.0747,0.0703 0.021,-0.0857 0.0779,-0.53904 0.0676,-0.53904 -0.005,0 -0.0559,0.0984 -0.11142,0.21865 -0.0555,0.12026 -0.10609,0.21359 -0.11229,0.20739 -0.006,-0.006 0.005,-0.0732 0.0239,-0.1489 0.0194,-0.0757 0.0359,-0.19076 0.0369,-0.25569 0.002,-0.10289 0.0726,-0.49957 0.12174,-0.67862 0.0118,-0.0429 0.008,-0.0557 -0.0126,-0.0429 -0.0375,0.0231 -0.037,0.018 0.009,-0.11245 0.021,-0.0597 0.0341,-0.11283 0.029,-0.11799 -0.005,-0.005 -0.0583,0.054 -0.11801,0.13144 -0.0598,0.0774 -0.11373,0.13571 -0.11996,0.12948 -0.0274,-0.0274 0.23559,-0.47836 0.39203,-0.67224 0.1963,-0.24329 0.29441,-0.38318 0.27931,-0.39829 -0.005,-0.006 -0.13214,0.11439 -0.2809,0.26693 -0.14876,0.15255 -0.27048,0.27096 -0.27048,0.26313 0,-0.0267 0.26257,-0.47649 0.38508,-0.65962 0.0673,-0.10052 0.12227,-0.1902 0.12227,-0.19928 0,-0.009 -0.092,0.0675 -0.20453,0.17008 -0.11249,0.10263 -0.24634,0.22084 -0.29744,0.2627 l -0.0929,0.0761 0.0623,-0.0888 c 0.0343,-0.0488 0.18292,-0.22577 0.33037,-0.39319 0.14746,-0.16742 0.32171,-0.3786 0.38722,-0.46929 0.0655,-0.0907 0.14465,-0.19857 0.17585,-0.23975 0.0313,-0.0413 0.0399,-0.0649 0.0192,-0.0528 -0.1381,0.0813 -0.28674,0.19772 -0.44779,0.35069 -0.10223,0.0971 -0.18587,0.16496 -0.18587,0.15077 0,-0.0526 0.24183,-0.35425 0.42867,-0.53478 0.18478,-0.17855 0.18859,-0.18451 0.0914,-0.14311 -0.18889,0.0804 -0.20905,0.0721 -0.0888,-0.0369 0.0628,-0.0569 0.20026,-0.14832 0.30552,-0.20323 0.18521,-0.0966 0.31956,-0.20418 0.25506,-0.20418 -0.04,0 -0.42099,0.15791 -0.62032,0.25711 -0.1308,0.0651 -0.14748,0.0689 -0.1037,0.0237 0.0287,-0.0297 0.1217,-0.10211 0.20669,-0.16101 0.20955,-0.1452 0.64253,-0.48249 0.63239,-0.49263 -0.0173,-0.0172 -0.23348,0.0729 -0.41413,0.17261 -0.10371,0.0572 -0.19446,0.0982 -0.20168,0.091 -0.0289,-0.0289 0.34625,-0.30654 0.54402,-0.40274 0.11587,-0.0564 0.20486,-0.10827 0.19778,-0.11536 -0.0282,-0.0282 -0.24121,0.0243 -0.42747,0.10536 -0.10812,0.047 -0.19658,0.0753 -0.19658,0.0628 0,-0.0125 0.009,-0.0232 0.019,-0.0238 0.0104,-5e-4 0.059,-0.0352 0.10782,-0.077 l 0.0888,-0.076 -0.1522,0.0171 c -0.0837,0.009 -0.14585,0.0101 -0.13808,0.002 0.008,-0.009 0.15857,-0.0601 0.33511,-0.11458 0.20092,-0.062 0.35056,-0.12392 0.40004,-0.16556 0.0947,-0.0797 0.0753,-0.0881 -0.0303,-0.013 -0.12304,0.0876 -0.109,0.0377 0.0293,-0.10433 l 0.12944,-0.13289 -0.0901,0.0169 c -0.12473,0.0234 -0.11294,-0.0144 0.036,-0.11542 0.0694,-0.0471 0.12648,-0.0916 0.12684,-0.0989 2.5e-4,-0.007 -0.0479,-0.01 -0.10715,-0.005 -0.0806,0.006 -0.0982,0.002 -0.0697,-0.018 0.021,-0.0146 0.0552,-0.0269 0.0761,-0.0274 0.021,-4.9e-4 0.12861,-0.0634 0.23928,-0.1399 0.20311,-0.14032 0.232,-0.17415 0.0829,-0.0971 -0.0756,0.039 -0.0788,0.039 -0.0464,0 0.0296,-0.0357 0.0294,-0.042 -0.002,-0.042 -0.0198,0 -0.0469,0.0102 -0.0602,0.0228 -0.0293,0.0277 -0.5821,0.2679 -0.67095,0.29158 -0.0349,0.009 0.0964,-0.0644 0.29171,-0.1637 0.19533,-0.0993 0.38159,-0.20511 0.41392,-0.23506 0.0323,-0.03 0.077,-0.0546 0.0993,-0.0548 0.0223,-1.8e-4 0.0462,-0.0174 0.0531,-0.0384 0.0108,-0.0326 0.007,-0.0331 -0.0296,-0.003 -0.0939,0.0775 -0.0338,-0.0256 0.0867,-0.14859 0.0709,-0.0724 0.12398,-0.13649 0.11801,-0.14246 -0.006,-0.006 -0.0617,0.0176 -0.12388,0.0523 -0.13814,0.0772 -0.43806,0.20202 -0.54155,0.22536 -0.0419,0.009 0.0266,-0.0333 0.15221,-0.0949 0.17461,-0.0857 0.26862,-0.15288 0.39977,-0.28557 0.0943,-0.0954 0.15957,-0.17746 0.14502,-0.18231 -0.0145,-0.005 0.0258,-0.0548 0.0896,-0.11102 0.0638,-0.0562 0.10968,-0.10861 0.10185,-0.11645 -0.008,-0.008 -0.0568,0.0252 -0.10892,0.0734 -0.21894,0.20279 -0.23259,0.19711 -0.0313,-0.013 0.17305,-0.1806 0.19684,-0.21386 0.1205,-0.16845 -0.0917,0.0546 -0.12754,0.0443 -0.0647,-0.0186 0.0528,-0.0528 -0.01,-0.033 -0.0915,0.029 -0.0432,0.0327 -0.12986,0.0904 -0.19265,0.12825 -0.13172,0.0794 -0.12612,0.0738 0.23488,-0.23337 0.11968,-0.10184 0.2328,-0.2037 0.25138,-0.22636 0.03,-0.0366 0.0267,-0.0391 -0.0296,-0.0223 -0.0349,0.0104 -0.0872,0.0226 -0.1162,0.0271 -0.029,0.005 -0.0999,0.0322 -0.15753,0.0616 -0.16452,0.0839 -0.15236,0.0633 0.0363,-0.0619 0.13723,-0.091 0.2007,-0.156 0.30077,-0.30815 0.0697,-0.10607 0.13105,-0.20381 0.1362,-0.21722 0.005,-0.0134 -0.0577,0.0282 -0.13951,0.0925 -0.15061,0.11824 -0.22905,0.15475 -0.15381,0.0716 0.0226,-0.0249 0.10026,-0.15905 0.17269,-0.29806 0.0724,-0.13901 0.15978,-0.2974 0.19413,-0.35198 0.14486,-0.23013 0.27983,-0.84956 0.21459,-0.98488 -0.0272,-0.0563 -0.0277,-0.056 -0.0294,0.0138 -0.002,0.0912 -0.043,0.067 -0.067,-0.0398 -0.0181,-0.08 -0.0194,-0.0784 -0.0521,0.0639 -0.0328,0.14239 -0.10485,0.31227 -0.12423,0.29289 -0.005,-0.005 0.006,-0.0549 0.0261,-0.11017 0.0396,-0.11124 0.0508,-0.32698 0.0157,-0.30535 -0.0123,0.008 -0.0284,-0.046 -0.0359,-0.119 -0.0333,-0.32495 -0.091,-0.43475 -0.0963,-0.18349 l -0.003,0.17757 -0.0215,-0.12848 c -0.0299,-0.17831 -0.0842,-0.32913 -0.11642,-0.3229 -0.0149,0.003 -0.0479,-0.0411 -0.0735,-0.0978 -0.0376,-0.0833 -0.0496,-0.0941 -0.0627,-0.0565 -0.0117,0.0333 -0.0329,-0.004 -0.0749,-0.12943 -0.0496,-0.149 -0.0618,-0.16736 -0.0793,-0.11991 -0.0301,0.0812 -0.0434,0.0703 -0.077,-0.0633 -0.0272,-0.10773 -0.0325,-0.11388 -0.055,-0.0634 -0.0137,0.0307 -0.0327,0.0559 -0.0424,0.0559 -0.0248,0 -0.0697,-0.10582 -0.0933,-0.2197 l -0.0201,-0.0974 -0.0147,0.11415 c -0.0141,0.10891 -0.016,0.11124 -0.0432,0.0507 -0.0272,-0.0604 -0.0286,-0.0608 -0.0302,-0.008 -6.8e-4,0.0306 -0.0123,0.0622 -0.0253,0.0703 -0.0313,0.0193 -0.0621,-0.18149 -0.0628,-0.410053 -2.5e-4,-0.100519 -0.009,-0.169009 -0.02,-0.152203 -0.0108,0.01681 -0.0196,-0.04966 -0.0198,-0.147707 -2.4e-4,-0.122965 0.0122,-0.196263 0.0403,-0.236283 0.0223,-0.03191 0.0344,-0.06427 0.0267,-0.07192 -0.008,-0.0077 -0.0373,0.02448 -0.0659,0.0714 -0.0405,0.06633 -0.052,0.07402 -0.0519,0.03457 8e-5,-0.05918 0.0604,-0.156556 0.15652,-0.252551 0.0694,-0.06939 0.53261,-0.292492 0.60767,-0.292715 0.0694,-2.06e-4 0.17813,-0.0684 0.22649,-0.142134 0.0404,-0.06157 0.0415,-0.07588 0.009,-0.121729 -0.0277,-0.03957 -0.0364,-0.143418 -0.0364,-0.435563 v -0.383611 l 0.0984,-0.149793 c 0.11558,-0.175905 0.4023,-0.498821 0.56255,-0.633545 0.062,-0.05213 0.17428,-0.123146 0.24953,-0.157825 0.12279,-0.05659 0.14907,-0.06022 0.25651,-0.03542 0.0658,0.0152 0.19132,0.0696 0.27883,0.120888 0.0875,0.05129 0.2537,0.136954 0.3693,0.190362 0.18536,0.08564 0.22734,0.11835 0.35551,0.276969 0.0799,0.09893 0.19498,0.208968 0.25568,0.244543 0.12551,0.07355 0.14031,0.09824 0.0445,0.07419 -0.059,-0.01482 -0.0491,0.0052 0.0951,0.192799 0.22606,0.293897 0.4682,0.54593 0.597,0.62142 0.16027,0.09392 0.32982,0.153458 0.75541,0.265262 0.47335,0.124352 0.62446,0.192662 0.79563,0.359678 0.18032,0.17594 0.24163,0.304725 0.36033,0.756909 0.055,0.209552 0.1071,0.392452 0.11575,0.406442 0.009,0.014 0.0516,0.0482 0.0954,0.0761 0.0707,0.045 0.0726,0.0488 0.0162,0.0346 l -0.0634,-0.0161 0.0712,0.0648 c 0.0392,0.0357 0.0876,0.0648 0.10781,0.0648 0.0202,0 0.0366,0.0159 0.0366,0.0353 0,0.0194 0.0197,0.0429 0.0437,0.0521 0.0344,0.0132 0.0365,0.0212 0.01,0.0376 -0.0764,0.0472 0.1633,0.12045 0.55051,0.16817 0.32753,0.0404 0.56062,0.10532 0.64187,0.17886 0.0256,0.0232 0.16379,0.18023 0.30711,0.34905 0.35323,0.41607 0.51849,0.5786 0.72233,0.71038 0.17632,0.114 0.45721,0.2442 0.52681,0.2442 0.0867,0 0.0316,0.0523 -0.29095,0.27585 -0.23211,0.16088 -0.41319,0.2299 -0.74225,0.28292 -0.31305,0.0504 -0.54026,0.0106 -0.78716,-0.1381 -0.15706,-0.0946 -0.18008,-0.086 -0.082,0.0306 0.0693,0.0824 0.24313,0.16604 0.49524,0.23837 l 0.16489,0.0473 -0.12683,-0.0121 c -0.0697,-0.007 -0.16679,-0.0192 -0.21562,-0.0279 -0.0877,-0.0157 -0.0881,-0.0153 -0.0367,0.0304 0.0286,0.0254 0.08,0.066 0.11416,0.0902 l 0.062,0.0439 -0.0712,-0.0249 c -0.13136,-0.0458 -0.0453,0.0192 0.12164,0.0919 0.17088,0.0744 0.20678,0.1114 0.1082,0.1114 -0.0462,0 -0.0337,0.0166 0.0666,0.0879 0.0933,0.0663 0.16027,0.092 0.27318,0.10481 0.17054,0.0193 0.24161,0.0728 0.0756,0.0569 -0.22472,-0.0214 -0.0507,0.0613 0.2973,0.14126 0.20432,0.047 0.22265,0.0656 0.0651,0.0661 -0.0686,2.1e-4 -0.14184,0.0114 -0.16276,0.025 -0.0263,0.017 0.0321,0.0262 0.19025,0.0297 l 0.2283,0.005 -0.21562,0.0143 c -0.26265,0.0174 -0.21101,0.0511 0.0845,0.0552 l 0.20719,0.003 -0.13942,0.0294 -0.13942,0.0294 0.13438,0.0578 c 0.0966,0.0415 0.21426,0.0636 0.41846,0.0783 l 0.28409,0.0205 -0.21562,0.009 c -0.1186,0.005 -0.25273,0.009 -0.29808,0.01 -0.0454,5e-4 -0.0825,0.008 -0.0825,0.0159 3e-5,0.0183 0.47973,0.13392 0.82445,0.19874 0.13951,0.0262 0.21942,0.0488 0.17757,0.0501 -0.13494,0.004 -0.65514,-0.0502 -0.8054,-0.0843 -0.0802,-0.0182 -0.14587,-0.0292 -0.14587,-0.0244 0,0.0321 0.24421,0.12108 0.48685,0.17748 0.34835,0.081 0.38728,0.0983 0.29953,0.13347 -0.0518,0.0208 -0.0285,0.0263 0.12683,0.0302 l 0.19026,0.005 -0.16205,0.0248 c -0.16817,0.0258 -0.17386,0.069 -0.009,0.0698 0.0523,2.5e-4 0.0801,0.012 0.0761,0.0321 -0.005,0.0245 0.1074,0.0317 0.49468,0.0317 0.27556,0 0.50101,0.002 0.501,0.005 -6e-5,0.011 -0.19644,0.0549 -0.38053,0.0851 l -0.19026,0.0312 0.20294,0.0704 c 0.25353,0.0879 0.20211,0.0928 -0.11415,0.0109 -0.13254,-0.0343 -0.26952,-0.0621 -0.3044,-0.0617 -0.0527,5e-4 -0.0429,0.0114 0.0577,0.0637 0.0874,0.0455 0.25661,0.0857 0.60881,0.14468 l 0.48774,0.0817 -0.32806,0.0127 -0.32807,0.0127 0.1505,0.0909 c 0.14203,0.0857 0.16975,0.0925 0.49295,0.12062 0.18835,0.0164 0.43948,0.0528 0.55807,0.0809 0.24448,0.058 0.67546,0.2172 0.70139,0.25917 0.0117,0.0189 0.002,0.0213 -0.0313,0.008 -0.24351,-0.10159 -0.83221,-0.21784 -1.09186,-0.21561 l -0.12357,0.001 0.0888,0.0486 c 0.0831,0.0455 0.0847,0.0487 0.0254,0.0501 -0.084,0.002 -0.0324,0.0359 0.13952,0.092 0.15607,0.0509 0.62596,0.26775 0.61153,0.28219 -0.005,0.006 -0.087,-0.0131 -0.18052,-0.042 -0.0935,-0.0289 -0.1866,-0.0525 -0.20688,-0.0525 -0.0584,0 -0.016,0.0434 0.061,0.0625 0.1834,0.0456 1.06077,0.41377 1.03867,0.43587 -0.005,0.005 -0.0931,-0.0192 -0.19675,-0.0528 -0.10367,-0.0336 -0.31405,-0.0967 -0.46753,-0.14036 -0.15346,-0.0436 -0.29491,-0.0848 -0.31432,-0.0914 -0.0289,-0.01 -0.0295,-0.005 -0.003,0.0266 0.0176,0.0212 0.0597,0.0386 0.0934,0.0386 0.0728,0 0.22657,0.0749 0.3286,0.16013 0.0402,0.0336 0.13934,0.0933 0.22024,0.13276 0.0809,0.0394 0.18934,0.10944 0.24099,0.15559 l 0.0939,0.0839 -0.15071,-0.0886 c -0.0829,-0.0487 -0.16242,-0.0886 -0.17673,-0.0886 -0.0223,0 0.22572,0.1853 0.47964,0.35839 l 0.0761,0.0519 -0.17122,-0.012 c -0.0942,-0.007 -0.17123,-0.002 -0.17123,0.009 0,0.0118 0.0488,0.05 0.1086,0.085 0.10997,0.0645 0.27457,0.21754 0.23389,0.21754 -0.0121,0 -0.0508,-0.0257 -0.0859,-0.0571 l -0.0638,-0.0571 0.0437,0.0698 c 0.0308,0.0491 0.0344,0.0698 0.0121,0.0698 -0.0174,0 0.0423,0.0759 0.13259,0.16877 0.0976,0.10033 0.1317,0.14663 0.0841,0.11416 -0.044,-0.0301 -0.0864,-0.0546 -0.0941,-0.0546 -0.008,0 0.0429,0.0753 0.1125,0.16724 0.14318,0.18917 0.26632,0.4162 0.22573,0.4162 -0.0149,0 0.006,0.0485 0.0468,0.10781 0.0407,0.0593 0.10527,0.17059 0.14361,0.24732 0.0383,0.0767 0.10836,0.2038 0.15561,0.28236 0.11338,0.18849 0.10839,0.20658 -0.0194,0.0707 -0.0589,-0.0626 -0.097,-0.0897 -0.0865,-0.0613 0.0104,0.0279 0.0362,0.13635 0.0573,0.24098 0.0211,0.10464 0.0657,0.24021 0.0992,0.30127 0.0819,0.14961 0.0765,0.17755 -0.0154,0.0792 -0.0419,-0.0448 -0.0761,-0.0899 -0.0761,-0.10022 0,-0.0103 -0.0229,-0.0394 -0.0508,-0.0647 -0.0279,-0.0253 -0.0507,-0.0391 -0.0507,-0.0307 0,0.008 0.0622,0.13284 0.13831,0.27662 0.13593,0.25691 0.24413,0.51714 0.27744,0.66729 0.009,0.0426 -0.0344,-0.0187 -0.0997,-0.13952 -0.0641,-0.11859 -0.1529,-0.27257 -0.19728,-0.34217 -0.068,-0.10655 -0.082,-0.11776 -0.0887,-0.071 -0.004,0.0306 0.022,0.13877 0.0588,0.24043 0.09,0.24952 0.15788,0.55134 0.17573,0.78149 l 0.0148,0.19025 -0.0732,-0.27903 c -0.0711,-0.27116 -0.19787,-0.62149 -0.22491,-0.62149 -0.0244,0 0.0204,1.24956 0.0577,1.6108 0.12834,1.24147 0.4587,2.38588 1.0109,3.5019 0.33395,0.67493 0.35935,0.7073 0.97044,1.23686 0.65458,0.56724 0.86073,0.75318 0.83499,0.75318 -0.0109,0 -0.1698,-0.10951 -0.35311,-0.24337 l -0.3333,-0.24337 0.33145,0.32581 c 0.1823,0.1792 0.41602,0.3829 0.51936,0.45265 0.19412,0.13104 0.67556,0.58755 0.64834,0.61477 -0.008,0.008 -0.041,-0.008 -0.0724,-0.0369 -0.0953,-0.0874 -0.40512,-0.31155 -0.43062,-0.31155 -0.0457,0 0.13638,0.21749 0.44697,0.53376 0.37896,0.38589 0.45779,0.50583 0.18319,0.27869 -0.10669,-0.0883 -0.20013,-0.15432 -0.20764,-0.14681 -0.008,0.008 0.056,0.092 0.14121,0.18769 0.0852,0.0957 0.23135,0.27283 0.32484,0.39358 0.16544,0.21367 0.17558,0.22175 0.37927,0.30169 0.11509,0.0452 0.20927,0.0874 0.20927,0.0937 0,0.006 -0.07,0.003 -0.15547,-0.006 -0.16901,-0.0196 -0.16518,-0.027 -0.0665,0.12722 0.0295,0.0461 0.005,0.0283 -0.0612,-0.045 -0.0819,-0.0903 -0.13413,-0.12501 -0.20504,-0.13649 -0.0523,-0.008 -0.0951,-0.005 -0.095,0.007 2.4e-4,0.0645 0.11916,0.19856 0.29597,0.33379 0.10922,0.0835 0.22712,0.1833 0.262,0.22171 0.0633,0.0697 0.0633,0.0698 0.004,0.039 -0.0326,-0.017 -0.0627,-0.0271 -0.0671,-0.0225 -0.004,0.005 0.065,0.099 0.15394,0.20966 0.089,0.1107 0.15712,0.20597 0.15137,0.21172 -0.005,0.005 -0.11454,-0.0791 -0.24175,-0.18858 -0.12721,-0.10947 -0.24345,-0.20327 -0.2583,-0.20844 -0.0432,-0.0151 0.3815,0.79936 0.54319,1.04172 0.16452,0.24663 0.28193,0.35826 0.49779,0.47331 0.22292,0.11882 0.40496,0.15674 0.76412,0.15917 0.36048,0.002 0.63108,-0.0382 1.14722,-0.17213 l 0.34817,-0.0904 0.12112,0.0704 c 0.0666,0.0387 0.25903,0.15973 0.42758,0.26892 l 0.30647,0.19853 0.0438,0.29828 c 0.0241,0.16405 0.0491,0.32111 0.0556,0.34901 0.007,0.0279 -0.0502,-0.0697 -0.12599,-0.21696 -0.0758,-0.14723 -0.15775,-0.28421 -0.18208,-0.3044 -0.0683,-0.0567 -0.26052,-0.0455 -0.39157,0.0227 -0.21109,0.10995 -0.38319,0.25727 -0.43357,0.37112 -0.0792,0.17898 -0.0501,0.76848 0.0568,1.15343 0.14705,0.52944 0.2622,0.71208 0.44851,0.71134 0.0897,-2.5e-4 0.26436,-0.0502 0.36527,-0.10417 0.064,-0.0343 0.1972,-0.24634 0.1972,-0.31413 0,-0.0295 0.0153,-0.0745 0.034,-0.10005 0.029,-0.0397 0.0364,0.0203 0.0512,0.41318 l 0.0173,0.45961 -0.1377,0.27455 c -0.0757,0.151 -0.15299,0.28629 -0.1717,0.30065 -0.0324,0.0249 -0.50236,0.13633 -0.59752,0.14172 -0.0443,0.002 -0.19581,-0.0813 -0.45302,-0.25063 -0.23649,-0.15569 -0.26518,-0.122 -0.23965,0.28141 0.0186,0.29355 0.0168,0.30968 -0.0568,0.53271 -0.0419,0.12649 -0.0838,0.2387 -0.0934,0.24935 -0.01,0.0107 -0.1389,0.0654 -0.28746,0.12149 l -0.27011,0.10213 -0.13631,-0.0396 c -0.13708,-0.0399 -0.19646,-0.0888 -0.33135,-0.27314 -0.14239,-0.19458 -0.26226,-0.20833 -0.60834,-0.0697 -0.21374,0.0856 -0.40539,0.0994 -0.52438,0.0379 -0.0407,-0.021 -0.13714,-0.11749 -0.21447,-0.21439 -0.11618,-0.14562 -0.1756,-0.19441 -0.34261,-0.28129 -0.27872,-0.14501 -0.33405,-0.23149 -0.39194,-0.61271 -0.17693,-1.16513 -0.49818,-1.94449 -1.02643,-2.4901 -0.16777,-0.17328 -0.58202,-0.52349 -0.61924,-0.52349 -0.007,0 0.008,0.0542 0.0324,0.1205 0.10481,0.27864 0.0779,0.29379 -0.0564,0.0317 l -0.13642,-0.26636 -0.30286,-0.20799 c -0.16657,-0.1144 -0.31264,-0.20858 -0.32459,-0.20928 -0.0356,-0.002 0.003,0.0733 0.17838,0.34877 0.0915,0.1437 0.16093,0.26673 0.15426,0.27339 -0.007,0.007 -0.16495,-0.16216 -0.35176,-0.37517 l -0.33964,-0.38727 -0.0202,0.18999 c -0.0346,0.32507 -0.0467,0.4106 -0.0568,0.40053 -0.005,-0.005 -0.0229,-0.0949 -0.0389,-0.19892 -0.0161,-0.10405 -0.038,-0.19489 -0.0487,-0.20187 -0.0108,-0.007 -0.0505,-0.12226 -0.0883,-0.25619 -0.0753,-0.26631 -0.16048,-0.4414 -0.2146,-0.4414 -0.019,0 -0.0436,-0.0228 -0.0545,-0.0508 -0.0108,-0.0279 -0.0206,-0.0375 -0.0216,-0.0213 -6.8e-4,0.0162 0.0482,0.18457 0.10937,0.37417 0.11166,0.34625 0.12035,0.42345 0.0284,0.25287 -0.0778,-0.14444 -0.2574,-0.39077 -0.27332,-0.37485 -0.008,0.008 -0.0608,-0.0694 -0.11761,-0.17166 l -0.10319,-0.18608 -6.8e-4,0.1522 c -0.002,0.20779 -0.0365,0.13823 -0.0903,-0.17926 -0.029,-0.17193 -0.0699,-0.30637 -0.12849,-0.42321 -0.0472,-0.0942 -0.0905,-0.17122 -0.0963,-0.17122 -0.005,0 0.0124,0.0804 0.0401,0.17861 0.0825,0.29155 0.0399,0.25905 -0.10255,-0.0782 -0.14423,-0.34151 -0.28059,-0.78038 -0.29438,-0.94743 -0.005,-0.0573 -0.0703,-0.24122 -0.14584,-0.40864 -0.0755,-0.16742 -0.16405,-0.36989 -0.19682,-0.44995 -0.0327,-0.08 -0.064,-0.14112 -0.0694,-0.1357 -0.005,0.005 0.0421,0.19003 0.10554,0.41025 0.0634,0.22022 0.11107,0.40472 0.1058,0.40999 -0.0299,0.0299 -0.42684,-1.07671 -0.58915,-1.64246 -0.18956,-0.66065 -0.71832,-1.62054 -1.54389,-2.80267 -0.2039,-0.29197 -0.40145,-0.58556 -0.43901,-0.65243 -0.076,-0.13535 -0.0989,-0.14864 -0.11109,-0.0646 -0.005,0.0329 -0.0341,-0.0396 -0.0693,-0.17123 -0.0336,-0.12557 -0.0815,-0.26825 -0.10651,-0.31708 l -0.0455,-0.0888 -0.002,0.19809 c -0.002,0.28935 -0.0423,0.21669 -0.0638,-0.11388 -0.0106,-0.16378 -0.027,-0.26906 -0.0385,-0.24787 -0.0111,0.0203 -0.0406,0.18494 -0.0657,0.36597 -0.0525,0.37949 -0.0581,0.37119 -0.12646,-0.18963 l -0.048,-0.39318 -0.0287,0.26635 c -0.0519,0.48163 -0.1149,0.67744 -0.15441,0.47992 -0.0173,-0.0861 -0.0581,-0.0551 -0.0588,0.0446 -2e-4,0.0304 -0.0157,0.0707 -0.0346,0.0895 -0.0188,0.0188 -0.0482,0.0767 -0.0654,0.12865 -0.0384,0.11635 -0.0627,0.12367 -0.0396,0.012 0.009,-0.0453 0.0218,-0.11098 0.0278,-0.14586 0.0233,-0.13674 -0.0362,0.0377 -0.0805,0.23605 -0.0439,0.19647 -0.0837,0.22152 -0.0884,0.0557 -0.002,-0.0621 -0.005,-0.067 -0.0215,-0.0267 -0.018,0.0461 -0.0207,0.0452 -0.0408,-0.0127 -0.0175,-0.0504 -0.0233,-0.0347 -0.0309,0.0838 -0.005,0.0802 -0.0192,0.14585 -0.0312,0.14585 -0.012,0 -0.0187,-0.0282 -0.015,-0.0627 0.004,-0.0345 -0.003,-0.0567 -0.015,-0.0492 -0.012,0.008 -0.022,0.0556 -0.0222,0.1071 -2.5e-4,0.0698 -0.007,0.0839 -0.025,0.0556 -0.0135,-0.0209 -0.0247,-0.0751 -0.025,-0.12049 -2.1e-4,-0.0453 -0.0118,-0.0824 -0.0257,-0.0824 -0.014,0 -0.0255,0.0371 -0.0258,0.0824 -2.3e-4,0.0453 -0.0114,0.0996 -0.0247,0.12049 -0.0164,0.0256 -0.0199,-0.008 -0.0107,-0.10146 0.0119,-0.12139 0.009,-0.13293 -0.0197,-0.0888 -0.0187,0.0283 -0.0391,0.15715 -0.0463,0.29172 l -0.013,0.24099 -0.0564,-0.16489 -0.0564,-0.16488 0.009,0.17757 c 0.005,0.0977 0.0187,0.2004 0.0297,0.2283 0.0177,0.0445 0.0151,0.0466 -0.0211,0.0171 -0.0227,-0.0185 -0.0715,-0.12408 -0.1083,-0.23465 -0.0369,-0.11057 -0.0734,-0.20103 -0.0813,-0.20103 -0.008,0 -0.008,0.10558 -2.5e-4,0.23465 0.008,0.13192 0.005,0.20688 -0.006,0.17122 l -0.0204,-0.0634 -0.003,0.0613 c -0.004,0.0931 -0.0293,0.0482 -0.0958,-0.16863 l -0.0604,-0.19708 0.0143,0.30441 c 0.008,0.16742 0.0321,0.44506 0.0539,0.61697 0.0218,0.17192 0.0343,0.31801 0.0276,0.32465 -0.0157,0.0156 -0.13572,-0.31396 -0.19625,-0.53857 l -0.0471,-0.17475 -2.5e-4,0.25367 c -2.4e-4,0.21363 0.0132,0.29971 0.0849,0.54539 0.0468,0.16045 0.0813,0.2957 0.0766,0.30058 -0.005,0.005 -0.0382,-0.0498 -0.0746,-0.12143 -0.0363,-0.0717 -0.0759,-0.12423 -0.0878,-0.11682 -0.012,0.008 -0.0458,-0.0692 -0.075,-0.17029 l -0.0532,-0.18377 0.008,0.1522 c 0.008,0.14724 0.0984,0.40785 0.27954,0.80541 0.0366,0.0802 0.0624,0.14586 0.0575,0.14586 -0.0224,0 -0.16491,-0.23904 -0.28731,-0.48198 -0.0738,-0.14649 -0.13421,-0.24616 -0.13424,-0.22149 -4e-5,0.0247 0.0571,0.15859 0.12678,0.29759 0.0697,0.13902 0.12635,0.26724 0.12575,0.28492 -5e-4,0.0177 -0.0462,-0.0192 -0.10139,-0.082 -0.12414,-0.14126 -0.12722,-0.11762 -0.0107,0.0813 0.0494,0.0843 0.085,0.15817 0.079,0.16412 -0.006,0.006 -0.0464,-0.0323 -0.0898,-0.085 l -0.079,-0.0959 v 0.095 c 0,0.0634 0.0422,0.17918 0.12707,0.34823 0.0699,0.13927 0.11672,0.25321 0.1041,0.25321 -0.0126,0 -0.0581,-0.0399 -0.10093,-0.0888 -0.0428,-0.0488 -0.0842,-0.0888 -0.0918,-0.0888 -0.0432,0 0.30778,0.59464 0.54158,0.91759 0.19775,0.27315 0.20281,0.278 0.47877,0.45945 0.12888,0.0847 0.23013,0.15827 0.225,0.1634 -0.005,0.005 -0.11058,-0.0373 -0.23432,-0.0944 -0.24867,-0.11464 -0.24743,-0.11239 0.10477,0.19048 0.27585,0.23721 0.50035,0.44648 0.48974,0.45651 -0.004,0.004 -0.11621,-0.0663 -0.24876,-0.15623 -0.30892,-0.20968 -0.3708,-0.24231 -0.2283,-0.12039 0.19403,0.16603 0.43124,0.39744 0.43124,0.42071 0,0.0122 -0.0599,-0.0218 -0.13318,-0.0754 -0.25635,-0.18782 -0.27184,-0.21382 0.21813,0.36627 0.3525,0.41734 0.73801,0.92556 1.00721,1.32782 0.2305,0.34444 0.4341,0.57927 0.96444,1.11244 0.29174,0.29331 0.58157,0.65607 0.58157,0.72795 0,0.0109 -0.086,-0.0727 -0.19108,-0.18583 -0.20422,-0.21983 -0.39237,-0.38212 -0.39237,-0.33845 0,0.0147 0.0507,0.0837 0.11257,0.15341 0.12694,0.1429 0.28965,0.37625 0.35502,0.5091 0.0396,0.0806 0.0317,0.076 -0.0863,-0.0508 -0.13457,-0.14441 -0.13176,-0.10412 0.007,0.099 0.0419,0.0614 0.0631,0.10358 0.0469,0.0936 -0.0524,-0.0323 -0.0316,0.051 0.0619,0.24775 0.0976,0.20548 0.10786,0.33416 0.0114,0.14302 -0.0673,-0.13333 -0.25399,-0.38978 -0.27125,-0.37253 -0.007,0.006 0.03,0.0773 0.0812,0.15727 0.0512,0.08 0.12017,0.20963 0.15336,0.28815 0.0642,0.15195 0.0596,0.14673 -0.11525,-0.13059 -0.11141,-0.17668 -0.16872,-0.20064 -0.0922,-0.0386 0.0554,0.11737 0.19232,0.52873 0.19232,0.57775 0,0.0224 0.0675,0.20575 0.15006,0.40745 0.0825,0.2017 0.14531,0.37149 0.13951,0.3773 -0.0128,0.0128 0.008,0.0419 -0.20061,-0.27555 -0.0959,-0.14574 -0.17911,-0.25094 -0.18483,-0.23377 -0.005,0.0171 0.0373,0.10432 0.0954,0.19368 0.11111,0.17053 0.27942,0.53182 0.27804,0.59679 -5e-4,0.0209 -0.0234,-0.005 -0.0511,-0.0571 -0.0276,-0.0523 -0.0551,-0.0951 -0.0609,-0.0951 -0.0184,0 0.0789,0.25741 0.17434,0.46128 0.0502,0.10721 0.0912,0.20973 0.0912,0.2278 0,0.018 -0.10225,-0.12386 -0.22722,-0.31543 -0.12498,-0.19156 -0.23313,-0.34829 -0.24035,-0.34829 -0.007,0 0.0217,0.0942 0.0644,0.20928 0.19282,0.51997 0.22098,0.60247 0.2057,0.60247 -0.009,0 -0.0669,-0.0485 -0.12876,-0.10781 -0.13241,-0.12696 -0.13892,-0.14842 0.12353,0.40772 0.11406,0.24169 0.2021,0.44472 0.19564,0.45117 -0.006,0.006 -0.0666,-0.0685 -0.13359,-0.16659 -0.067,-0.0981 -0.12575,-0.17442 -0.13053,-0.16964 -0.005,0.005 0.0207,0.13313 0.0565,0.28522 0.0577,0.24478 0.11455,0.37647 0.49438,1.14636 0.38277,0.7759 0.44388,0.88458 0.56583,1.00654 0.17624,0.17624 0.26002,0.19532 0.46487,0.10584 0.35696,-0.15593 0.46062,-0.0871 0.66715,0.44287 0.17119,0.43928 0.22899,0.54755 0.36027,0.67485 0.19602,0.19007 0.36115,0.22494 0.63245,0.13355 0.10204,-0.0344 0.18207,-0.0462 0.24006,-0.0353 0.21013,0.0394 0.46288,0.29005 0.77826,0.77173 0.16512,0.25218 0.58422,1.08023 2.13127,4.21091 0.32059,0.64877 0.60437,1.24129 0.63062,1.31672 0.0907,0.26082 0.0512,0.53719 -0.0995,0.69588 -0.14585,0.15355 -0.25973,0.17309 -0.59222,0.10165 -0.24072,-0.0518 -0.3288,-0.0263 -0.38334,0.1104 l -0.0356,0.0891 -0.0933,-0.10897 c -0.0513,-0.0599 -0.11315,-0.15217 -0.13745,-0.20497 -0.0436,-0.0948 -0.0894,-0.12189 -0.12064,-0.0713 -0.0273,0.0442 -0.30895,0.17562 -0.46141,0.21533 -0.19753,0.0515 -0.3929,0.0475 -0.62902,-0.013 -0.27871,-0.0713 -0.3399,-0.0667 -0.45838,0.0341 -0.0548,0.0467 -0.12462,0.098 -0.1551,0.11415 -0.0631,0.0334 -0.22183,0.034 -0.38736,0.002 z m -5.45343,-5.71156 c -0.0297,-0.0453 -0.1224,-0.20298 -0.20588,-0.3503 -0.0869,-0.15332 -0.20213,-0.31602 -0.26955,-0.3805 l -0.11776,-0.11265 0.0833,0.1522 c 0.13006,0.23769 0.5124,0.77369 0.5519,0.77369 0.007,0 -0.0122,-0.0371 -0.0419,-0.0824 z m -2.49842,-2.55986 c -0.0269,-0.20285 -0.15983,-0.59068 -0.22108,-0.64504 -0.039,-0.0346 -0.0505,-0.0376 -0.0403,-0.0104 0.008,0.0209 0.0694,0.20621 0.13688,0.41174 0.0675,0.20553 0.12699,0.37391 0.13228,0.37417 0.005,2.4e-4 0.002,-0.0584 -0.008,-0.13051 z m -0.36253,-1.00694 c -0.0512,-0.09 -0.1009,-0.11029 -0.0554,-0.0226 0.0392,0.0756 0.0785,0.12404 0.0907,0.11186 0.005,-0.005 -0.0104,-0.0455 -0.0353,-0.0892 z m 10.33139,-8.38818 c -0.0499,-0.0378 -0.0903,-0.0484 -0.0903,-0.0237 0,0.0123 0.0969,0.0583 0.12684,0.0602 0.007,4.9e-4 -0.01,-0.016 -0.0366,-0.0364 z m -0.0903,-0.1221 c 0,-0.005 -0.0245,-0.0305 -0.0544,-0.0571 -0.0541,-0.0481 -0.0542,-0.048 -0.0245,0.009 0.0247,0.0472 0.0789,0.0803 0.0789,0.0483 z m -9.1484,-1.31667 c -0.0201,-0.0331 -0.27624,-0.34281 -0.3199,-0.38685 -0.0807,-0.0814 0.0614,0.1274 0.17698,0.26001 0.1293,0.1484 0.18742,0.19998 0.14292,0.12684 z m 1.04855,-4.37532 c -0.006,-0.0246 -0.0121,-0.0106 -0.0126,0.0313 -5e-4,0.0419 0.005,0.0621 0.0117,0.0448 0.007,-0.0172 0.008,-0.0514 6.9e-4,-0.0761 z m 4.14393,-4.18603 c -0.0404,-0.0694 -0.0941,-0.13318 -0.11216,-0.13318 -0.009,0 0.009,0.0398 0.0409,0.0885 0.0576,0.0889 0.11965,0.12779 0.0713,0.0447 z m -0.88917,-2.12588 c 0,-0.0213 -0.28035,-0.14526 -0.29509,-0.13051 -0.007,0.007 0.0479,0.0415 0.12212,0.0766 0.14234,0.0673 0.17297,0.0768 0.17297,0.0539 z m -1.17956,-0.91273 c -0.0419,-0.0192 -0.0989,-0.0345 -0.12683,-0.0341 -0.0329,5e-4 -0.0196,0.0128 0.0381,0.035 0.11624,0.0448 0.18695,0.044 0.0888,-0.001 z m -9.22151,-6.283739 c -5e-4,-0.02792 -0.0209,-0.129426 -0.0635,-0.317088 -0.0192,-0.08453 -0.13883,-0.08086 -0.13883,0.0043 0,0.03374 -0.008,0.08225 -0.0174,0.107811 -0.015,0.03989 -0.0118,0.04183 0.023,0.01369 0.0351,-0.0285 0.0481,-0.01622 0.0999,0.09408 0.0574,0.122326 0.0983,0.163299 0.0969,0.09724 z m 0.20279,-0.202936 c -5e-4,-0.08406 -0.006,-0.09824 -0.026,-0.06437 -0.0224,0.03831 -0.009,0.172186 0.0169,0.172186 0.005,0 0.01,-0.04851 0.009,-0.107811 z m -0.64411,-0.202825 c 0.0171,-0.05396 -0.0883,-0.501107 -0.11819,-0.501107 -0.01,0 -0.007,0.04851 0.007,0.107809 0.0138,0.05929 0.0181,0.20395 0.009,0.321457 -0.0155,0.212225 -0.0152,0.213341 0.035,0.16788 0.0278,-0.02517 0.0577,-0.06839 0.0665,-0.09604 z m -0.42214,-0.497873 c -0.002,-0.322872 -0.0343,-0.278193 -0.0613,0.08461 -0.0171,0.230629 -0.0152,0.249771 0.022,0.218853 0.033,-0.02742 0.0406,-0.08528 0.0392,-0.303468 z m -0.26515,-0.532115 c -0.0223,-0.02229 -0.0875,0.08336 -0.0743,0.12041 0.007,0.01949 0.0206,0.122233 0.0303,0.228302 l 0.0177,0.192852 0.0196,-0.264378 c 0.0108,-0.14541 0.0137,-0.270144 0.007,-0.277186 z"
                } ,
            "hispo":{
                "attributes_mods":[3,2,3,-3,0],
                "diff":"7",
                "path":"m -10,0 c -0.47967,-0.0486 -0.61294,-0.30745 -0.40929,-0.79484 0.0791,-0.18935 0.18935,-0.27697 0.59097,-0.46976 0.27154,-0.13035 0.62244,-0.26881 0.77977,-0.30772 0.17242,-0.0426 0.37368,-0.16132 0.50655,-0.29873 0.27141,-0.28064 0.64,-0.88306 0.77628,-1.26877 0.21583,-0.61081 0.33912,-4.91842 0.1595,-5.57296 -0.0686,-0.25003 -0.14375,-0.33059 -0.58768,-0.63015 -0.72422,-0.4887 -1.10458,-1.13179 -1.41511,-2.39262 l -0.0498,-0.20262 -0.062,0.29028 -0.062,0.29029 -0.1368,-0.1739 c -0.0752,-0.0956 -0.1605,-0.25666 -0.18949,-0.35782 l -0.0528,-0.18393 -0.076,0.18981 c -0.1004,0.25097 -0.18608,0.18613 -0.41907,-0.31712 l -0.19123,-0.413 -0.005,0.30393 c -0.005,0.28906 -0.0104,0.29732 -0.11162,0.16885 -0.0584,-0.0743 -0.15486,-0.24146 -0.21411,-0.37147 -0.10365,-0.22741 -0.10875,-0.22998 -0.13435,-0.0675 -0.0534,0.33912 -0.28319,0.46175 -0.28474,0.15196 -0.002,-0.2534 -0.0698,-0.48966 -0.14203,-0.48966 -0.0328,0 -0.0597,0.0575 -0.0597,0.12785 0,0.0704 -0.0455,0.14536 -0.10132,0.16674 -0.0731,0.028 -0.1013,-0.008 -0.1013,-0.12679 0,-0.0922 -0.0922,-0.26355 -0.20774,-0.38623 l -0.20775,-0.22058 0.0319,0.28239 c 0.0315,0.2794 0.0301,0.28158 -0.13502,0.20635 -0.17712,-0.0807 -0.35868,-0.36776 -0.36039,-0.56981 -0.002,-0.19607 -0.13131,0.0439 -0.13499,0.24992 l -0.003,0.16885 -0.19988,-0.21971 c -0.12114,-0.13317 -0.21748,-0.32984 -0.24458,-0.49929 l -0.0447,-0.27958 -0.1143,0.22105 c -0.14649,0.28327 -0.20306,0.1612 -0.20306,-0.43818 0,-0.60241 -0.0407,-0.6803 -0.23663,-0.45269 -0.2052,0.23841 -0.25716,0.17249 -0.17014,-0.21585 0.0807,-0.35993 0.029,-0.6735 -0.10251,-0.623 -0.1115,0.0428 -0.16611,-0.10118 -0.16611,-0.43792 0,-0.22371 -0.0277,-0.27684 -0.17325,-0.33217 -0.27789,-0.10565 -0.66359,-0.0776 -1.46249,0.10639 -0.69358,0.15973 -0.78168,0.16602 -1.21137,0.0866 -0.40431,-0.0748 -1.41832,0.26724 -1.78617,-0.0452 -0.23187,-0.19699 -0.45959,-0.38911 -0.50602,-0.42692 -0.21709,-0.17677 0.8117,-0.78527 1.56293,-1.48714 0.41038,-0.38343 0.63381,-0.81568 0.68714,-0.89701 0.0534,-0.0813 0.16421,-0.52686 0.27079,-0.85103 0.34372,-1.04546 0.59723,-1.57587 1.60453,-2.29504 0.64955,-0.46374 1.25407,-0.78105 1.79606,-0.94269 0.20396,-0.0608 0.30877,-0.14381 0.40326,-0.31926 0.16266,-0.30205 0.49796,-0.55889 0.7296,-0.55889 0.13355,0 0.22778,0.069 0.36509,0.2676 l 0.1851,0.26759 0.50654,0.003 c 0.27861,0.002 0.66613,0.0224 0.86117,0.0458 0.31311,0.0376 0.34078,0.0531 0.23638,0.13234 -0.10359,0.0786 -0.078,0.09 0.20703,0.0919 0.17889,7.7e-4 0.3905,-0.0328 0.47026,-0.0755 0.14058,-0.0753 0.14176,-0.0727 0.0388,0.0844 l -0.10619,0.16204 0.27757,-0.022 c 0.15266,-0.0121 0.36874,0.0131 0.48019,0.0561 l 0.20261,0.0781 -0.18573,0.0981 c -0.26683,0.14086 -0.22959,0.18318 0.11562,0.13142 0.18764,-0.0281 0.35744,-0.0152 0.44997,0.0343 0.14614,0.0782 0.14497,0.0811 -0.0697,0.17134 -0.12009,0.0505 -0.19921,0.12277 -0.17583,0.16061 0.0535,0.0866 0.53798,0.0893 0.83287,0.005 0.19282,-0.0553 0.22034,-0.0485 0.20135,0.0502 -0.0121,0.0628 -0.1128,0.15846 -0.22378,0.21256 l -0.2018,0.0984 0.49776,0.0847 c 0.27379,0.0466 0.5151,0.10203 0.53626,0.12319 0.0211,0.0211 -0.0357,0.091 -0.12632,0.15511 -0.16286,0.11529 -0.15857,0.11704 0.37022,0.15041 0.34238,0.0216 0.54501,0.0642 0.56282,0.1182 0.0174,0.0529 -0.0372,0.0844 -0.14663,0.0844 -0.30205,0 -0.18935,0.12036 0.15733,0.16805 0.19937,0.0274 0.38632,0.0164 0.46834,-0.0274 0.23365,-0.12505 0.30685,-0.0896 0.18832,0.0913 l -0.1077,0.16438 0.23124,-0.0376 c 0.28611,-0.0465 0.72936,0.0306 0.67568,0.11742 -0.0218,0.0353 -0.0968,0.0641 -0.16673,0.0641 -0.0699,0 -0.14471,0.0285 -0.16618,0.0632 -0.0238,0.0385 0.20575,0.0493 0.58696,0.0276 l 0.62609,-0.0356 -0.2364,0.15811 -0.23638,0.15811 0.43901,0.039 c 0.24147,0.0214 0.40102,0.0442 0.35458,0.0507 -0.0465,0.006 -0.0844,0.0441 -0.0844,0.0837 0,0.0396 0.0531,0.0571 0.1182,0.0386 0.065,-0.0184 0.28235,-0.0543 0.48298,-0.0798 0.31425,-0.0399 0.35916,-0.0318 0.32432,0.0591 -0.0317,0.0826 0.026,0.1154 0.26678,0.15151 0.19586,0.0294 0.27542,0.0657 0.21951,0.10027 -0.0602,0.0373 -0.0254,0.0671 0.11138,0.0952 0.1095,0.0225 0.39666,0.0996 0.63809,0.17127 0.64548,0.19155 0.91181,0.22508 1.07867,0.13579 0.13786,-0.0738 0.14222,-0.0694 0.0681,0.0691 l -0.0792,0.14795 0.69881,-0.0496 c 0.38436,-0.0273 0.91157,-0.10605 1.1716,-0.17501 0.26003,-0.069 0.56395,-0.12337 0.67541,-0.1209 l 0.2026,0.005 -0.22691,0.0653 c -0.38214,0.10996 -0.20245,0.12717 0.56964,0.0545 0.65824,-0.0619 0.96428,-0.11544 1.41278,-0.24708 0.11833,-0.0347 0.12343,-0.0261 0.0424,0.0716 -0.0843,0.10158 -0.0428,0.11106 0.4862,0.11106 0.51919,0 0.79648,0.0744 0.56989,0.15294 -0.16717,0.0579 0.34003,0.11052 1.53613,0.15927 0.66863,0.0273 1.1245,0.0681 1.01307,0.0908 l -0.20261,0.0412 0.16883,0.0472 c 0.0929,0.026 0.27833,0.0475 0.41213,0.0481 0.25543,7.7e-4 1.57498,0.31132 1.74914,0.41139 0.0738,0.0424 0.0469,0.0588 -0.0994,0.0603 -0.17033,0.002 -0.12932,0.0362 0.27069,0.22797 0.59871,0.28691 1.01347,0.73406 1.53958,1.65977 0.53686,0.94464 1.10829,1.81192 1.24725,1.89294 0.10749,0.0627 0.10729,0.0671 -0.003,0.0691 -0.095,0.002 -0.0714,0.0627 0.12202,0.31615 0.25242,0.33071 0.53304,0.83407 0.46493,0.83407 -0.0734,0 0.39082,0.77199 0.66238,1.10144 0.14721,0.17861 0.25036,0.34204 0.22921,0.36318 -0.0591,0.0591 0.32302,0.58127 0.61079,0.83463 0.14146,0.12457 0.24794,0.25593 0.23658,0.29191 -0.0111,0.036 0.16045,0.25032 0.3818,0.47628 0.39115,0.39937 0.91421,1.13916 0.85047,1.20291 -0.0174,0.0174 0.0425,0.19581 0.13302,0.39649 0.22178,0.49148 0.28186,1.14199 0.146,1.58057 -0.0576,0.18574 -0.10496,0.39653 -0.10535,0.46843 0,0.0719 -0.0668,0.20107 -0.14756,0.28705 -0.0808,0.086 -0.11119,0.15631 -0.0675,0.15631 0.18418,0 0.0565,0.13258 -0.23467,0.24382 -0.30753,0.11744 -0.31932,0.11698 -0.57409,-0.0226 -0.14307,-0.0784 -0.2601,-0.11254 -0.2601,-0.076 0,0.0881 -0.36613,-0.16589 -0.73582,-0.51036 -0.16322,-0.15211 -0.27173,-0.23258 -0.24108,-0.17885 0.13853,0.24291 -0.3951,-0.24244 -0.67295,-0.61207 -0.19818,-0.26363 -0.30898,-0.36606 -0.30926,-0.28592 0,0.17367 -0.20028,-0.13083 -0.54901,-0.83725 -0.15119,-0.30629 -0.29851,-0.54231 -0.32731,-0.5245 -0.0289,0.0178 -0.18335,-0.25627 -0.34335,-0.60908 -0.16001,-0.35282 -0.34605,-0.69136 -0.41342,-0.75234 -0.14575,-0.1319 -0.15492,-0.0538 -0.0211,0.18024 0.11049,0.19328 0.1429,0.77673 0.0338,0.60786 -0.0461,-0.0712 -0.0657,0.0279 -0.0665,0.33373 0,0.40451 -0.008,0.42583 -0.10583,0.30392 -0.10338,-0.1293 -0.10434,-0.12924 -0.0716,0.004 0.0181,0.0743 0.068,0.37822 0.11066,0.6754 0.10275,0.71633 0.24039,1.00653 0.68999,1.45482 0.47057,0.46924 0.53759,0.68051 0.77055,2.4287 0.29968,2.24885 0.242,3.21989 -0.21691,3.651 -0.1529,0.14365 -0.25386,0.1639 -1.02828,0.20627 -1.01987,0.0558 -1.17227,0.0333 -1.43522,-0.21238 -0.23271,-0.21738 -0.2524,-0.41788 -0.0704,-0.71648 0.10029,-0.16446 0.22992,-0.24564 0.57647,-0.36096 0.54089,-0.18 0.63591,-0.3051 0.71598,-0.94286 0.0511,-0.40705 0.0365,-0.56579 -0.10294,-1.11538 -0.22925,-0.90365 -0.27413,-0.96079 -0.37004,-0.47081 -0.21156,1.08084 -0.63514,2.12681 -1.04504,2.58054 -0.13702,0.15167 -0.39457,0.36908 -0.57231,0.48314 -0.36424,0.23373 -0.60838,0.25335 -1.7632,0.1417 -0.72911,-0.0705 -0.87825,-0.17163 -0.87825,-0.59561 0,-0.19972 0.0535,-0.29096 0.31241,-0.53199 0.3688,-0.34346 0.6238,-0.42842 1.07674,-0.35879 0.3909,0.0601 0.50983,0.0107 0.69212,-0.28754 0.37799,-0.61847 0.47089,-1.78179 0.19046,-2.38409 -0.3071,-0.65946 -1.55831,-1.78973 -2.46397,-2.22581 -0.41637,-0.20047 -0.90021,-0.63112 -1.26835,-1.12888 l -0.23507,-0.31786 -0.20478,0.21655 c -0.11262,0.11911 -0.18475,0.17783 -0.16026,0.13049 0.0573,-0.11085 -0.0246,-0.48802 -0.10592,-0.48802 -0.0342,0 -0.0621,0.0854 -0.0621,0.18971 0,0.10435 -0.0446,0.24871 -0.0992,0.32081 -0.0953,0.12606 -0.0993,0.12429 -0.10132,-0.0461 -0.003,-0.0975 -0.0216,-0.27472 -0.0455,-0.3938 -0.0531,-0.26556 -0.15674,-0.14593 -0.15828,0.18274 -0.003,0.26829 -0.0796,0.27792 -0.27488,0.0338 l -0.14858,-0.18573 0.0328,0.20262 c 0.0179,0.11144 0.0547,0.25359 0.0814,0.31588 0.0871,0.20278 -0.2329,0.0576 -0.37002,-0.16786 l -0.12413,-0.20409 -0.0472,0.19688 c -0.0825,0.34445 -0.17188,0.39663 -0.28372,0.16566 -0.0547,-0.11284 -0.12599,-0.20516 -0.1585,-0.20516 -0.0887,0 -0.0711,0.36616 0.0221,0.45927 0.063,0.063 0.0403,0.081 -0.10232,0.081 -0.13211,0 -0.21847,-0.0577 -0.30907,-0.20674 l -0.12572,-0.20675 -0.0448,0.17872 c -0.0247,0.0983 -0.0264,0.23692 -0.004,0.30805 0.0226,0.0711 0.0144,0.12934 -0.0184,0.12934 -0.10424,0 -0.355,-0.27143 -0.355,-0.38423 0,-0.0621 -0.0873,0.0117 -0.20303,0.17148 -0.19775,0.27293 -0.4119,0.40162 -0.28193,0.16939 0.0341,-0.061 0.0474,-0.16679 0.0296,-0.2351 -0.0293,-0.11192 -0.0566,-0.1043 -0.27669,0.0771 -0.27789,0.22906 -0.37427,0.25407 -0.32039,0.0831 0.0206,-0.0651 0.0137,-0.20605 -0.0151,-0.31344 l -0.0525,-0.19524 -0.10765,0.16429 c -0.0592,0.0904 -0.11869,0.22164 -0.13218,0.29174 -0.0388,0.20143 -0.15294,0.15779 -0.23268,-0.089 -0.067,-0.20736 -0.082,-0.2171 -0.18133,-0.11779 -0.0596,0.0595 -0.12763,0.16929 -0.1513,0.2439 -0.0238,0.0746 -0.0713,0.11823 -0.10573,0.0969 -0.0844,-0.0521 -0.0795,-0.34598 0.008,-0.51029 0.0497,-0.0927 -0.0236,-0.0607 -0.24155,0.10575 -0.37658,0.28745 -0.45424,0.29785 -0.39544,0.053 l 0.0445,-0.18573 -0.16149,0.14191 c -0.29053,0.25534 -0.35227,0.26526 -0.23459,0.0377 0.16373,-0.31663 0.12573,-0.40808 -0.0676,-0.16275 -0.22572,0.28641 -0.30359,0.2782 -0.22036,-0.0232 0.0369,-0.1335 0.0475,-0.26221 0.0238,-0.28604 -0.0704,-0.0704 -0.30092,0.27796 -0.30513,0.46122 l -0.004,0.16885 -0.0923,-0.16668 c -0.0511,-0.0921 -0.0789,-0.27339 -0.0625,-0.40524 0.0324,-0.25978 0.0489,-0.27238 -0.27944,0.21442 -0.0743,0.11016 -0.23703,0.26345 -0.36162,0.34064 l -0.22651,0.14033 0.13521,-0.26505 c 0.11475,-0.22496 0.12303,-0.29487 0.0547,-0.46222 l -0.0806,-0.19717 -0.14355,0.24326 c -0.11337,0.19214 -0.42445,0.46618 -0.42445,0.3739 0,-0.0108 0.0273,-0.11478 0.0606,-0.23099 0.0333,-0.11622 0.0394,-0.31357 0.0134,-0.43857 l -0.0472,-0.22727 -0.17468,0.37989 c -0.0961,0.20893 -0.19546,0.57364 -0.22085,0.81047 -0.0254,0.23682 -0.122,0.8257 -0.21471,1.30861 -0.22138,1.15315 -0.21679,1.40466 0.0428,2.3448 l 0.2185,0.79138 -0.10612,0.4581 c -0.0584,0.25196 -0.14154,0.68605 -0.18484,0.96464 -0.11006,0.70853 -0.29447,1.16022 -0.60388,1.47903 -0.32265,0.33248 -0.50245,0.38412 -0.99382,0.28544 -0.20808,-0.0418 -0.60898,-0.076 -0.89092,-0.076 -0.28195,0 -0.61641,-0.0298 -0.74327,-0.0661 -0.21851,-0.0627 -0.24288,-0.0519 -0.4627,0.20494 -0.38876,0.45417 -0.63169,0.5384 -1.51499,0.52525 -0.41937,-0.006 -0.88408,-0.0237 -1.03267,-0.0388 z m 4.25663,-2.07224 c 0.27797,-0.18213 0.37956,-0.41393 0.48277,-1.10141 0.091,-0.60622 0.0895,-0.69145 -0.0184,-1.05028 -0.0645,-0.21478 -0.13699,-0.36674 -0.161,-0.33769 -0.0539,0.0652 -0.37938,1.24612 -0.43578,1.58125 -0.0227,0.13486 -0.16424,0.43548 -0.31456,0.66804 l -0.27329,0.42284 0.27741,-0.0373 c 0.15258,-0.0204 0.35181,-0.086 0.44275,-0.14554 z",
                "pathx":2.5,
                "pathy":4.5,
                } ,
            "lupus":{
                "attributes_mods":[1,2,2,-3,0],
                "diff":"6",
                "path":"m 5,0 c -0.003,-0.005 -0.0141,-0.01 -0.0238,-0.01 -0.01,0 -0.0303,-0.006 -0.0456,-0.0145 -0.0154,-0.008 -0.0345,-0.0147 -0.0425,-0.0149 -0.008,-1.7e-4 -0.0474,-0.0177 -0.0876,-0.039 -0.0401,-0.0213 -0.0775,-0.0387 -0.083,-0.0387 -0.0129,0 -0.17037,-0.15791 -0.17037,-0.17085 0,-0.005 -0.0187,-0.0348 -0.0414,-0.0654 -0.04,-0.0538 -0.0541,-0.0787 -0.12784,-0.22849 -0.0191,-0.0386 -0.0386,-0.0781 -0.0435,-0.0877 -0.0126,-0.025 -0.0308,-0.0845 -0.0308,-0.10146 0,-0.008 -0.005,-0.0197 -0.0119,-0.0263 -0.006,-0.006 -0.0107,-0.0267 -0.009,-0.0448 0.003,-0.0181 -0.003,-0.0358 -0.008,-0.0393 -0.005,-0.004 -0.0104,-0.0238 -0.0104,-0.0452 0,-0.0254 -0.005,-0.0406 -0.0146,-0.0443 -0.0104,-0.004 -0.0146,-0.0204 -0.0146,-0.0581 0,-0.0289 -0.005,-0.0525 -0.01,-0.0525 -0.005,0 -0.01,-0.0307 -0.01,-0.0725 0,-0.0399 -0.005,-0.0752 -0.01,-0.0785 -0.005,-0.003 -0.01,-0.0315 -0.01,-0.0627 0,-0.0385 -0.005,-0.0606 -0.0146,-0.0688 -0.0101,-0.008 -0.0146,-0.0309 -0.0146,-0.0743 0,-0.0342 -0.004,-0.0621 -0.009,-0.0621 -0.005,0 -0.0114,-0.0318 -0.0141,-0.0706 -0.003,-0.0389 -0.0101,-0.10788 -0.0159,-0.15343 -0.006,-0.0455 -0.0129,-0.12553 -0.0157,-0.17776 -0.003,-0.0522 -0.009,-0.095 -0.0141,-0.095 -0.005,0 -0.009,-0.0323 -0.009,-0.0719 0,-0.052 -0.004,-0.0752 -0.0146,-0.084 -0.0104,-0.009 -0.0146,-0.0314 -0.0146,-0.0785 0,-0.0366 -0.005,-0.0691 -0.01,-0.0724 -0.005,-0.003 -0.01,-0.0342 -0.01,-0.0687 0,-0.0353 -0.004,-0.0627 -0.01,-0.0627 -0.005,0 -0.01,-0.0261 -0.01,-0.0588 0,-0.0379 -0.005,-0.0674 -0.0159,-0.083 -0.0112,-0.0169 -0.0144,-0.0372 -0.0109,-0.0674 0.006,-0.0525 -0.0117,-0.0733 -0.0622,-0.0733 -0.0246,0 -0.0407,-0.008 -0.0585,-0.0268 -0.0371,-0.0405 -0.0597,-0.0968 -0.0531,-0.13245 0.003,-0.0187 2e-5,-0.0416 -0.009,-0.0586 -0.0167,-0.0316 -0.0196,-0.0994 -0.005,-0.10846 0.005,-0.004 0.01,-0.0595 0.01,-0.13509 0,-0.0984 0.003,-0.13356 0.0144,-0.14797 0.0198,-0.0263 0.0193,-0.0882 0,-0.0959 -0.0126,-0.005 -0.0144,-0.0144 -0.009,-0.0482 0.005,-0.0323 0.003,-0.0452 -0.009,-0.055 -0.0107,-0.009 -0.0137,-0.0213 -0.009,-0.0404 0.003,-0.0169 10e-5,-0.0395 -0.009,-0.0584 -0.008,-0.017 -0.0154,-0.0452 -0.0154,-0.0628 0,-0.0176 -0.005,-0.0347 -0.01,-0.038 -0.005,-0.003 -0.01,-0.023 -0.01,-0.0438 0,-0.0208 -0.005,-0.0405 -0.01,-0.0438 -0.005,-0.003 -0.01,-0.02 -0.01,-0.0371 -1.8e-4,-0.0171 -0.007,-0.0396 -0.0147,-0.05 -0.008,-0.0104 -0.0144,-0.0332 -0.0144,-0.0505 0,-0.0174 -0.005,-0.0343 -0.01,-0.0377 -0.005,-0.003 -0.01,-0.0384 -0.01,-0.0779 0,-0.0396 -0.005,-0.0746 -0.01,-0.0779 -0.005,-0.003 -0.01,-0.0405 -0.01,-0.0828 0,-0.0422 -0.005,-0.0795 -0.01,-0.0828 -0.005,-0.003 -0.01,-0.0299 -0.01,-0.0591 v -0.053 h -0.11203 -0.11202 v -0.0488 c 0,-0.0269 -0.005,-0.0573 -0.0117,-0.0676 -0.009,-0.0142 -0.009,-0.0242 0,-0.0412 0.006,-0.0124 0.0131,-0.0401 0.0158,-0.0614 0.007,-0.0589 0.0171,-0.0958 0.0308,-0.11202 0.0241,-0.0285 0.0419,-0.21722 0.0228,-0.24015 -0.007,-0.008 -0.0114,-0.0302 -0.01,-0.0483 0.003,-0.0217 -0.003,-0.0349 -0.0112,-0.0383 -0.008,-0.003 -0.0121,-0.0141 -0.01,-0.0273 0.003,-0.0126 -0.003,-0.0275 -0.0112,-0.0348 -0.0101,-0.008 -0.0154,-0.0288 -0.0154,-0.0597 0,-0.0258 -0.005,-0.0496 -0.01,-0.053 -0.005,-0.003 -0.01,-0.0145 -0.01,-0.0249 0,-0.0151 -0.007,-0.0189 -0.0338,-0.0189 -0.0445,0 -0.0539,-0.0193 -0.0539,-0.11081 0,-0.0402 -0.005,-0.0758 -0.01,-0.0791 -0.005,-0.004 -0.01,-0.0663 -0.01,-0.15524 0,-0.1146 -0.003,-0.15178 -0.0134,-0.16031 -0.0107,-0.009 -0.0124,-0.0382 -0.008,-0.14221 0.005,-0.11546 0.003,-0.13184 -0.0109,-0.13725 -0.0129,-0.005 -0.0159,-0.0204 -0.0159,-0.0776 0,-0.0393 -0.005,-0.0742 -0.01,-0.0775 -0.005,-0.003 -0.01,-0.0318 -0.01,-0.0633 0,-0.0315 -0.005,-0.06 -0.01,-0.0633 -0.005,-0.003 -0.01,-0.034 -0.01,-0.0683 0,-0.0478 -0.003,-0.0644 -0.0161,-0.0713 -0.0129,-0.007 -0.0149,-0.018 -0.01,-0.0537 0.005,-0.0329 0.003,-0.0467 -0.008,-0.0524 -0.009,-0.005 -0.0154,-0.0324 -0.0188,-0.0758 -0.008,-0.10289 -0.0161,-0.16345 -0.0249,-0.18508 -0.0121,-0.0301 -0.03,-0.10977 -0.03,-0.13464 0,-0.0123 -0.006,-0.0309 -0.0144,-0.0412 -0.008,-0.0104 -0.0144,-0.0285 -0.0146,-0.0402 -1.7e-4,-0.0118 -0.005,-0.024 -0.0101,-0.0274 -0.005,-0.003 -0.01,-0.0256 -0.01,-0.0494 0,-0.0239 -0.004,-0.051 -0.009,-0.0603 -0.005,-0.009 -0.0139,-0.0345 -0.0206,-0.0559 -0.007,-0.0214 -0.0176,-0.0521 -0.0243,-0.0682 -0.007,-0.0161 -0.0176,-0.0489 -0.0243,-0.073 -0.006,-0.0241 -0.0159,-0.0515 -0.0208,-0.0608 -0.005,-0.009 -0.009,-0.026 -0.009,-0.0372 0,-0.0111 -0.0109,-0.0346 -0.0243,-0.0522 -0.0134,-0.0176 -0.0243,-0.0404 -0.0243,-0.0508 0,-0.0104 -0.0285,-0.0764 -0.0633,-0.1468 -0.0348,-0.0704 -0.0633,-0.13258 -0.0633,-0.13827 0,-0.005 -0.0109,-0.0175 -0.0243,-0.0263 -0.0134,-0.009 -0.0243,-0.0234 -0.0243,-0.0325 0,-0.009 -0.0132,-0.0291 -0.0292,-0.0445 -0.0184,-0.0176 -0.0292,-0.0378 -0.0292,-0.0543 0,-0.0219 -0.005,-0.027 -0.0297,-0.0306 -0.0164,-0.002 -0.0318,-7.7e-4 -0.0344,0.003 -0.003,0.004 -0.0682,0.0386 -0.14571,0.0763 -0.0775,0.0377 -0.15916,0.0818 -0.18137,0.0979 -0.0224,0.0161 -0.0449,0.0293 -0.0502,0.0293 -0.005,0 -0.0241,0.011 -0.0418,0.0243 -0.0176,0.0134 -0.0355,0.0245 -0.0399,0.0247 -0.005,2.2e-4 -0.0226,0.0129 -0.0405,0.0282 l -0.0325,0.0278 -0.0601,-0.0392 c -0.0617,-0.0402 -0.18177,-0.15069 -0.18177,-0.16717 0,-0.005 -0.006,-0.0164 -0.0141,-0.025 -0.0254,-0.028 -0.0749,-0.12875 -0.0698,-0.14198 0.003,-0.007 -0.003,-0.0181 -0.009,-0.0245 -0.009,-0.008 -0.0141,-0.0303 -0.0141,-0.064 0,-0.0488 -0.003,-0.0524 -0.0233,-0.0524 -0.0129,0 -0.0462,0.0154 -0.074,0.0341 -0.0278,0.0187 -0.0532,0.0341 -0.0564,0.0341 -0.003,0 -0.0149,0.008 -0.0258,0.0183 -0.0357,0.0324 -0.25421,0.13757 -0.2859,0.13757 -0.0167,0 -0.0329,0.005 -0.0362,0.01 -0.003,0.005 -0.0226,0.01 -0.043,0.01 -0.0429,0 -0.10585,-0.0381 -0.0983,-0.0594 0.003,-0.008 0.006,-0.0761 0.008,-0.15246 0.003,-0.11158 0,-0.1388 -0.0101,-0.1388 -0.007,0 -0.0174,0.004 -0.0223,0.009 -0.005,0.005 -0.0268,0.0139 -0.0482,0.0202 -0.10362,0.0301 -0.15232,0.0386 -0.22465,0.0389 -0.0742,2.4e-4 -0.08,-0.002 -0.10565,-0.028 -0.0246,-0.0256 -0.0267,-0.0332 -0.0221,-0.0804 0.008,-0.0751 0.0171,-0.11754 0.0323,-0.13945 0.007,-0.0106 0.0131,-0.0255 0.0131,-0.0332 0,-0.0118 -0.003,-0.0116 -0.0171,7.7e-4 -0.0283,0.0246 -0.0691,0.0307 -0.20872,0.0314 -0.14803,7.5e-4 -0.1642,-0.005 -0.21012,-0.0724 -0.0187,-0.0275 -0.0218,-0.045 -0.0218,-0.11957 0,-0.0861 -2.5e-4,-0.0873 -0.0218,-0.0807 -0.0121,0.004 -0.0359,0.0102 -0.053,0.0146 -0.0171,0.005 -0.0462,0.0172 -0.0645,0.0286 -0.0184,0.0114 -0.0449,0.0207 -0.059,0.0207 -0.0141,0 -0.0257,0.004 -0.0257,0.009 0,0.009 -0.0532,0.0171 -0.18171,0.0263 l -0.0794,0.006 -0.005,0.0307 c -0.003,0.0169 -0.0117,0.0561 -0.0204,0.0872 -0.009,0.0311 -0.0159,0.0799 -0.0159,0.10854 0,0.0352 -0.005,0.0537 -0.0134,0.0572 -0.008,0.003 -0.0159,0.0274 -0.0196,0.0619 -0.0114,0.10763 -0.0179,0.14448 -0.0266,0.1537 -0.005,0.005 -0.009,0.023 -0.009,0.0399 0,0.0168 -0.007,0.0442 -0.0151,0.0608 -0.008,0.0166 -0.0176,0.0677 -0.0208,0.11353 -0.003,0.0518 -0.0109,0.0875 -0.0191,0.0943 -0.007,0.006 -0.0132,0.0214 -0.0132,0.0343 0,0.0128 -0.004,0.0309 -0.009,0.0402 -0.005,0.009 -0.0144,0.0432 -0.0211,0.0753 -0.007,0.0321 -0.0174,0.0651 -0.0236,0.073 -0.006,0.008 -0.0174,0.04 -0.0243,0.071 -0.007,0.031 -0.0166,0.0588 -0.0211,0.0614 -0.005,0.003 -0.008,0.0141 -0.008,0.0253 0,0.0112 -0.024,0.0653 -0.0535,0.12019 -0.0295,0.0549 -0.0535,0.11061 -0.0535,0.12372 0,0.0131 -0.008,0.031 -0.0176,0.0399 -0.01,0.009 -0.0273,0.0353 -0.0391,0.0589 -0.0117,0.0236 -0.0279,0.0482 -0.0358,0.0548 -0.008,0.007 -0.0144,0.0161 -0.0144,0.0212 0,0.005 -0.0101,0.0231 -0.0226,0.0402 -0.0903,0.12367 -0.13446,0.18028 -0.15648,0.20073 -0.0139,0.013 -0.0254,0.0284 -0.0254,0.0342 0,0.0128 -0.31302,0.32695 -0.32576,0.32695 -0.005,0 -0.0453,0.034 -0.0897,0.0755 -0.12665,0.11837 -0.18232,0.16619 -0.23122,0.19858 -0.0249,0.0165 -0.0495,0.0379 -0.0547,0.0475 -0.005,0.01 -0.0324,0.0339 -0.0607,0.054 -0.0638,0.0454 -0.76724,0.74451 -0.76724,0.76245 0,0.007 -0.023,0.0357 -0.0513,0.0634 -0.0282,0.0276 -0.0619,0.0657 -0.0748,0.0844 -0.0129,0.0187 -0.0435,0.057 -0.068,0.0849 -0.084,0.0958 -0.10783,0.1269 -0.10783,0.1404 0,0.008 -0.009,0.019 -0.0193,0.0257 -0.0107,0.007 -0.0311,0.0307 -0.0454,0.0534 -0.0144,0.0227 -0.0337,0.0468 -0.0431,0.0535 -0.009,0.007 -0.0316,0.0352 -0.0492,0.0633 -0.0176,0.0282 -0.0367,0.0583 -0.0423,0.067 -0.005,0.009 -0.0369,0.0551 -0.0697,0.10309 -0.0513,0.0751 -0.13501,0.22758 -0.15933,0.29018 -0.004,0.0107 -0.0124,0.0317 -0.0187,0.0467 -0.006,0.015 -0.0109,0.0419 -0.0109,0.0597 0,0.0179 -0.006,0.0378 -0.0144,0.0443 -0.008,0.007 -0.0137,0.0264 -0.0131,0.0454 0,0.0184 -0.003,0.0386 -0.0101,0.0449 -0.006,0.006 -0.0114,0.0323 -0.0114,0.0581 0,0.0257 -0.005,0.0468 -0.0101,0.0468 -0.007,0 -0.009,0.0821 -0.005,0.25082 0.005,0.27483 0.0101,0.34249 0.031,0.38859 0.009,0.0189 0.0117,0.0427 0.008,0.0621 -0.005,0.0237 -0.003,0.0337 0.01,0.0405 0.0114,0.006 0.0161,0.0225 0.0161,0.0566 0,0.0262 0.005,0.0504 0.01,0.0537 0.005,0.003 0.01,0.0318 0.01,0.0633 0,0.0315 0.005,0.06 0.01,0.0634 0.005,0.003 0.01,0.023 0.01,0.0438 0,0.0208 0.005,0.0406 0.01,0.0439 0.005,0.003 0.01,0.019 0.01,0.0349 0,0.0167 0.006,0.0313 0.0146,0.0346 0.009,0.003 0.0146,0.018 0.0146,0.0363 0,0.0169 0.009,0.0548 0.0196,0.0841 0.0107,0.0293 0.0196,0.0655 0.0196,0.0804 0,0.0149 0.0109,0.0445 0.0243,0.0657 0.0134,0.0212 0.0243,0.0454 0.0243,0.0538 0,0.008 0.009,0.0324 0.0196,0.0534 0.0107,0.021 0.0196,0.0441 0.0196,0.0514 0,0.0193 0.11493,0.24218 0.13705,0.26582 0.0104,0.0111 0.0188,0.027 0.0188,0.0353 0,0.008 0.007,0.021 0.0154,0.028 0.008,0.007 0.0255,0.0328 0.038,0.0572 0.0124,0.0244 0.034,0.0551 0.048,0.068 0.0139,0.013 0.0253,0.0297 0.0253,0.0373 0,0.0154 0.18651,0.1978 0.23797,0.23277 0.0184,0.0124 0.0668,0.0402 0.10759,0.0617 0.0593,0.0313 0.0845,0.0391 0.12538,0.0391 0.0281,0 0.0553,0.004 0.0604,0.009 0.005,0.005 0.0728,0.0116 0.15052,0.0146 0.0776,0.003 0.20478,0.008 0.28247,0.0108 0.0777,0.003 0.1454,0.01 0.15048,0.0147 0.005,0.005 0.0297,0.009 0.0548,0.009 0.0286,0 0.0501,0.005 0.0577,0.0146 0.007,0.008 0.0234,0.0146 0.037,0.0146 0.0731,0 0.20262,0.0652 0.26491,0.13334 0.0268,0.0293 0.0487,0.0595 0.0487,0.0671 0,0.008 0.005,0.0138 0.01,0.0138 0.005,0 0.01,0.0129 0.01,0.0286 0,0.0157 0.005,0.0313 0.01,0.0346 0.005,0.004 0.01,0.0663 0.01,0.15523 0,0.17367 0,0.17556 -0.0829,0.17224 -0.0323,-0.002 -0.0638,0.004 -0.0818,0.013 -0.0161,0.008 -0.0389,0.0151 -0.0509,0.0151 -0.0278,0 -0.0806,0.0168 -0.13025,0.0412 -0.0604,0.0298 -0.12186,0.0459 -0.15227,0.0399 -0.0176,-0.004 -0.0368,4.9e-4 -0.0524,0.0106 -0.0223,0.0147 -0.0267,0.0147 -0.0462,0.002 -0.0119,-0.008 -0.0248,-0.015 -0.029,-0.015 -0.0139,0 -0.008,0.0656 0.007,0.0779 0.01,0.008 0.0146,0.0303 0.0146,0.0694 v 0.0572 h -0.0299 c -0.0164,0 -0.0358,-0.006 -0.043,-0.0131 -0.0141,-0.014 -0.15847,-0.0411 -0.16809,-0.0315 -0.003,0.003 -0.0129,-7.5e-4 -0.0213,-0.009 -0.0124,-0.0112 -0.0582,-0.0151 -0.21509,-0.0183 -0.19907,-0.004 -0.23002,-0.007 -0.33087,-0.028 -0.0728,-0.0154 -0.0968,-0.0336 -0.20614,-0.15626 -0.0274,-0.0308 -0.0558,-0.056 -0.0629,-0.056 -0.007,0 -0.0273,-0.009 -0.0448,-0.0194 -0.029,-0.0177 -0.0492,-0.0194 -0.22857,-0.0195 -0.12058,-2e-5 -0.19901,-0.004 -0.2027,-0.01 -0.003,-0.005 -0.0183,-0.01 -0.0336,-0.01 -0.0194,0 -0.0366,-0.0101 -0.0576,-0.0341 -0.0164,-0.0187 -0.0366,-0.0341 -0.0448,-0.0341 -0.008,0 -0.0149,-0.008 -0.0149,-0.0189 0,-0.0104 -0.008,-0.0247 -0.0179,-0.0316 -0.0216,-0.0153 -0.099,-0.16612 -0.099,-0.19261 0,-0.0103 -0.005,-0.0214 -0.01,-0.0247 -0.005,-0.003 -0.01,-0.0233 -0.01,-0.0444 0,-0.0211 -0.005,-0.0384 -0.01,-0.0384 -0.005,0 -0.01,-0.0167 -0.01,-0.037 0,-0.0203 -0.005,-0.0419 -0.0109,-0.048 -0.006,-0.006 -0.0107,-0.0321 -0.01,-0.0578 0,-0.0374 -0.008,-0.0643 -0.0426,-0.13253 -0.0238,-0.0471 -0.0435,-0.096 -0.0435,-0.10864 0,-0.0127 -0.006,-0.0255 -0.0146,-0.0286 -0.008,-0.003 -0.0146,-0.014 -0.0146,-0.0242 0,-0.0102 -0.007,-0.0246 -0.0159,-0.0318 -0.009,-0.008 -0.0352,-0.0528 -0.0588,-0.10103 -0.0236,-0.0483 -0.0577,-0.10754 -0.0759,-0.13164 -0.0324,-0.0431 -0.0831,-0.13535 -0.0831,-0.15133 0,-0.005 -0.008,-0.0172 -0.0188,-0.0283 -0.0104,-0.0111 -0.0306,-0.0442 -0.0451,-0.0736 -0.0146,-0.0295 -0.0363,-0.067 -0.0485,-0.0833 -0.0121,-0.0164 -0.0381,-0.063 -0.0577,-0.10364 -0.0196,-0.0407 -0.0441,-0.0817 -0.0546,-0.0911 -0.0104,-0.009 -0.0191,-0.0216 -0.0191,-0.0269 0,-0.0182 -0.0501,-0.11218 -0.0689,-0.12918 -0.0104,-0.009 -0.0188,-0.0248 -0.0188,-0.0344 0,-0.01 -0.008,-0.0231 -0.0174,-0.0302 -0.01,-0.007 -0.0345,-0.0478 -0.0553,-0.0907 -0.0208,-0.0429 -0.0478,-0.0911 -0.0597,-0.10715 -0.0121,-0.0161 -0.0416,-0.071 -0.0658,-0.12207 -0.0243,-0.0511 -0.0524,-0.10367 -0.0628,-0.11689 -0.0218,-0.028 -0.16057,-0.30314 -0.18879,-0.37471 -0.0107,-0.0268 -0.0253,-0.0618 -0.0326,-0.0779 -0.008,-0.0161 -0.0199,-0.0468 -0.0274,-0.0682 -0.008,-0.0214 -0.0235,-0.063 -0.0351,-0.0925 -0.0273,-0.0695 -0.0334,-0.12864 -0.0314,-0.30683 0,-0.11736 0.005,-0.14824 0.0164,-0.15693 0.008,-0.006 0.0146,-0.0203 0.0146,-0.0319 0,-0.0274 0.064,-0.15159 0.10192,-0.19792 0.0396,-0.0484 0.10441,-0.12939 0.14634,-0.18306 0.0188,-0.0241 0.0648,-0.0899 0.10205,-0.14612 0.0373,-0.0562 0.0767,-0.11392 0.0877,-0.12816 0.0109,-0.0142 0.0198,-0.0323 0.0198,-0.0402 0,-0.008 0.007,-0.02 0.0154,-0.027 0.008,-0.007 0.0257,-0.033 0.0382,-0.0578 0.0126,-0.0247 0.0297,-0.0508 0.0383,-0.0578 0.008,-0.007 0.0154,-0.0208 0.0154,-0.0307 0,-0.01 0.009,-0.0226 0.0193,-0.0283 0.0107,-0.005 0.022,-0.0212 0.0254,-0.0344 0.003,-0.0132 0.01,-0.0241 0.0146,-0.0241 0.005,0 0.009,-0.009 0.009,-0.0189 0,-0.0104 0.005,-0.0217 0.0101,-0.0252 0.0146,-0.009 0.0581,-0.0799 0.0581,-0.0946 0,-0.007 0.009,-0.0179 0.0196,-0.0246 0.0107,-0.007 0.0196,-0.0202 0.0196,-0.03 0,-0.01 0.009,-0.0263 0.0208,-0.0365 0.0114,-0.0102 0.0336,-0.0468 0.0492,-0.0812 0.0156,-0.0345 0.0369,-0.0687 0.0474,-0.076 0.0104,-0.008 0.0191,-0.0191 0.0191,-0.026 0,-0.0197 0.0272,-0.069 0.0487,-0.0885 0.0107,-0.01 0.0196,-0.0249 0.0196,-0.0337 0,-0.009 0.004,-0.0202 0.009,-0.0253 0.008,-0.009 0.11921,-0.22817 0.15187,-0.30042 0.009,-0.0209 0.0193,-0.0552 0.0223,-0.0763 0.003,-0.0211 0.0112,-0.0407 0.0183,-0.0435 0.007,-0.003 0.0132,-0.0131 0.0132,-0.023 0,-0.01 0.003,-0.0201 0.008,-0.0229 0.005,-0.003 0.0139,-0.0304 0.0211,-0.0614 0.007,-0.031 0.0188,-0.0634 0.026,-0.0718 0.007,-0.008 0.0129,-0.0312 0.0129,-0.0505 0,-0.0194 0.005,-0.0379 0.01,-0.0412 0.005,-0.003 0.01,-0.0164 0.01,-0.0292 0,-0.0127 0.005,-0.0259 0.01,-0.0293 0.005,-0.003 0.01,-0.0224 0.01,-0.0425 0,-0.02 0.004,-0.0406 0.009,-0.0457 0.0104,-0.0109 0.0188,-0.067 0.0267,-0.17484 0.003,-0.0515 0.0101,-0.0806 0.0193,-0.0857 0.0104,-0.006 0.0137,-0.0336 0.0137,-0.11445 0,-0.0587 -0.003,-0.10667 -0.008,-0.10667 -0.0134,0 -0.0602,0.0538 -0.0602,0.0694 0,0.008 -0.0129,0.0242 -0.0286,0.0358 -0.0156,0.0116 -0.0443,0.0449 -0.0637,0.074 -0.0193,0.0291 -0.0503,0.0644 -0.0688,0.0786 -0.0187,0.0141 -0.0338,0.033 -0.0338,0.0419 0,0.0161 -0.074,0.0964 -0.38232,0.41434 -0.0897,0.0926 -0.16316,0.17512 -0.16316,0.18346 0,0.008 -0.0154,0.0234 -0.0341,0.0336 -0.0194,0.0104 -0.0341,0.0259 -0.0341,0.0356 0,0.0108 -0.008,0.0173 -0.0196,0.0173 -0.0173,0 -0.0196,0.006 -0.0196,0.0623 0,0.0449 -0.004,0.0637 -0.0139,0.0676 -0.01,0.004 -0.0154,0.0292 -0.0188,0.0911 -0.006,0.10607 -0.0154,0.16706 -0.0268,0.17411 -0.005,0.003 -0.009,0.0153 -0.009,0.0275 0,0.0121 -0.0109,0.0324 -0.0243,0.0449 -0.0134,0.0126 -0.0243,0.0305 -0.0243,0.0398 0,0.018 -0.0479,0.063 -0.085,0.0798 -0.0218,0.01 -0.022,0.0127 -0.022,0.17843 0,0.10171 -0.004,0.1707 -0.01,0.17434 -0.005,0.003 -0.01,0.0315 -0.01,0.0627 0,0.0385 -0.005,0.0606 -0.0146,0.0688 -0.008,0.007 -0.0146,0.0271 -0.0146,0.0455 0,0.0362 -0.0188,0.0799 -0.0432,0.10006 -0.008,0.007 -0.0154,0.0209 -0.0154,0.0309 0,0.0113 -0.007,0.0183 -0.0179,0.0183 -0.01,0 -0.026,0.009 -0.0356,0.0195 -0.0141,0.0156 -0.03,0.0195 -0.0794,0.0195 h -0.0618 v 0.34092 c 0,0.28567 -0.003,0.34093 -0.0137,0.34093 -0.008,0 -0.0371,-0.0158 -0.0657,-0.0352 l -0.0522,-0.0352 -0.003,0.0319 c -0.003,0.0214 0.003,0.0347 0.0121,0.0405 0.0216,0.012 0.0226,0.27644 0.003,0.32273 -0.008,0.0169 -0.0161,0.0592 -0.0188,0.094 -0.007,0.0968 -0.0164,0.13653 -0.0415,0.18161 -0.0126,0.0227 -0.023,0.0489 -0.023,0.0584 0,0.0186 -0.0725,0.0912 -0.0911,0.0912 -0.006,0 -0.0284,0.0114 -0.049,0.0255 -0.0354,0.024 -0.0372,0.0276 -0.0322,0.0652 0.003,0.0246 -1.8e-4,0.0529 -0.009,0.0743 -0.008,0.019 -0.0121,0.0435 -0.009,0.0545 0.003,0.011 -0.003,0.0323 -0.009,0.0475 -0.008,0.0151 -0.0144,0.0402 -0.0144,0.0557 0,0.0155 -0.004,0.0359 -0.009,0.0452 -0.005,0.009 -0.0141,0.041 -0.0206,0.0705 -0.006,0.0295 -0.0179,0.0633 -0.0254,0.0752 -0.008,0.0119 -0.0137,0.0316 -0.0137,0.044 0,0.0124 -0.0117,0.0396 -0.0258,0.0605 l -0.0259,0.038 -0.0746,-0.0796 c -0.0743,-0.0792 -0.10307,-0.095 -0.11376,-0.0625 -0.003,0.009 -0.0124,0.0324 -0.0208,0.0512 -0.008,0.0187 -0.0184,0.0495 -0.0223,0.0682 -0.004,0.0187 -0.0141,0.0595 -0.0226,0.0906 -0.008,0.031 -0.0156,0.0652 -0.0156,0.0758 0,0.0106 -0.007,0.0218 -0.0146,0.0249 -0.01,0.004 -0.0146,0.0192 -0.0146,0.0468 0,0.0339 -0.004,0.0435 -0.0243,0.0541 -0.0206,0.0111 -0.0269,0.0108 -0.0414,-0.002 -0.009,-0.008 -0.031,-0.0201 -0.0481,-0.0268 -0.0171,-0.007 -0.0386,-0.0206 -0.0478,-0.0308 -0.009,-0.0102 -0.0211,-0.0186 -0.0263,-0.0186 -0.005,0 -0.0254,-0.0134 -0.0448,-0.0298 -0.0193,-0.0163 -0.0588,-0.0476 -0.0875,-0.0693 l -0.0522,-0.0395 0.006,0.0425 c 0.003,0.0234 0.009,0.0763 0.0118,0.11767 0.003,0.0464 0.0109,0.0794 0.0194,0.0864 0.008,0.006 0.0137,0.0282 0.0137,0.0489 0,0.0404 0.0164,0.11976 0.0303,0.14736 0.005,0.009 0.009,0.0319 0.009,0.0501 0,0.0197 0.005,0.0353 0.0139,0.0385 0.009,0.004 0.0154,0.0271 0.0188,0.0717 0.008,0.0967 0.0168,0.14916 0.0268,0.14916 0.005,0 0.009,0.011 0.009,0.0245 0,0.0134 0.004,0.0321 0.009,0.0414 0.005,0.009 0.0141,0.041 0.0206,0.0705 0.006,0.0295 0.0179,0.0633 0.0253,0.0751 0.008,0.0118 0.0137,0.0394 0.0137,0.0611 0,0.06 0.0476,0.14714 0.0918,0.16824 0.0196,0.009 0.0447,0.0169 0.056,0.0169 0.027,0 0.13517,0.0386 0.15485,0.0552 0.008,0.007 0.0243,0.013 0.0351,0.013 0.0304,0 0.11081,0.046 0.15446,0.0884 0.0216,0.021 0.0436,0.0382 0.0488,0.0382 0.0117,0 0.28684,0.27459 0.28684,0.2863 0,0.005 0.0144,0.0252 0.0316,0.0456 0.0601,0.0707 0.0755,0.095 0.0755,0.11955 0,0.0136 0.005,0.0274 0.01,0.0307 0.005,0.003 0.01,0.0191 0.01,0.035 0,0.016 0.007,0.0399 0.0159,0.0532 0.0146,0.0224 0.0146,0.0256 0,0.0419 -0.009,0.01 -0.0159,0.0317 -0.0159,0.0489 0,0.046 -0.0233,0.0838 -0.079,0.12777 -0.0437,0.0345 -0.0553,0.039 -0.10149,0.039 -0.0286,0 -0.0548,-0.005 -0.0581,-0.01 -0.003,-0.005 -0.0151,-0.01 -0.0259,-0.01 -0.0109,0 -0.0337,-0.0116 -0.0505,-0.0258 l -0.0306,-0.0258 -0.003,0.0571 c -0.003,0.0314 -0.008,0.0628 -0.0134,0.0696 -0.007,0.008 -0.037,0.0125 -0.09,0.0125 -0.0438,0 -0.0844,0.005 -0.0901,0.0104 -0.0154,0.0154 -0.17451,0.0168 -0.18966,0.002 -0.007,-0.007 -0.029,-0.0122 -0.0495,-0.0122 -0.0206,0 -0.0645,-0.009 -0.0979,-0.0201 -0.0496,-0.0165 -0.0733,-0.0327 -0.13052,-0.0892 l -0.07,-0.0691 -0.0262,0.0311 c -0.0144,0.0171 -0.0416,0.0376 -0.0602,0.0454 -0.0455,0.019 -0.22542,0.019 -0.285,1.1e-4 -0.0531,-0.0169 -0.15391,-0.0586 -0.16256,-0.0673 -0.003,-0.004 -0.0141,-0.006 -0.0236,-0.006 -0.009,0 -0.023,-0.008 -0.0303,-0.0184 -0.007,-0.0101 -0.0303,-0.0257 -0.0513,-0.0345 -0.021,-0.009 -0.0463,-0.0232 -0.0559,-0.0319 -0.01,-0.009 -0.0256,-0.0206 -0.0355,-0.0264 -0.0689,-0.0405 -0.11475,-0.0773 -0.1937,-0.15515 -0.0495,-0.0488 -0.0901,-0.0943 -0.0901,-0.10088 0,-0.007 -0.0117,-0.033 -0.026,-0.0587 -0.0383,-0.0687 -0.0616,-0.13833 -0.0616,-0.18471 0,-0.0225 -0.005,-0.0437 -0.01,-0.047 -0.005,-0.003 -0.01,-0.0164 -0.01,-0.0293 0,-0.0128 -0.005,-0.0259 -0.01,-0.0292 -0.005,-0.003 -0.01,-0.0271 -0.01,-0.053 0,-0.0299 -0.005,-0.0514 -0.0146,-0.0591 -0.01,-0.008 -0.0141,-0.0271 -0.0132,-0.0551 0,-0.0237 -0.003,-0.0481 -0.01,-0.0543 -0.007,-0.007 -0.0114,-0.0435 -0.0114,-0.0916 0,-0.0442 -0.005,-0.083 -0.01,-0.0863 -0.006,-0.004 -0.01,-0.0827 -0.01,-0.20455 0,-0.12185 -0.003,-0.20086 -0.01,-0.20455 -0.006,-0.004 -0.01,-0.0976 -0.01,-0.24928 0,-0.18736 -0.003,-0.25082 -0.0137,-0.27615 -0.0109,-0.0259 -0.0132,-0.0803 -0.0107,-0.25538 0.003,-0.1783 0,-0.22675 -0.0107,-0.24396 -0.0121,-0.019 -0.0117,-0.0226 0.003,-0.031 0.0161,-0.009 0.0161,-0.01 -7e-5,-0.0161 -0.0149,-0.005 -0.0171,-0.021 -0.0171,-0.12184 0,-0.0664 -0.004,-0.11783 -0.01,-0.12129 -0.005,-0.003 -0.01,-0.0318 -0.01,-0.0633 0,-0.0315 -0.005,-0.06 -0.01,-0.0633 -0.005,-0.003 -0.01,-0.0338 -0.01,-0.0677 0,-0.0458 -0.003,-0.0631 -0.0146,-0.0673 -0.009,-0.003 -0.0146,-0.0181 -0.0146,-0.0377 0,-0.0177 -0.009,-0.0561 -0.0196,-0.0854 -0.0107,-0.0293 -0.0196,-0.0676 -0.0196,-0.0851 0,-0.0175 -0.005,-0.0318 -0.01,-0.0318 -0.005,0 -0.01,-0.0252 -0.0101,-0.056 -2e-4,-0.0308 -0.007,-0.067 -0.0141,-0.0804 -0.0208,-0.0364 -0.0208,-0.33915 0,-0.34715 0.008,-0.003 0.0146,-0.0157 0.0146,-0.0279 0,-0.0375 0.053,-0.15502 0.10077,-0.22341 0.025,-0.0356 0.0453,-0.0684 0.0453,-0.0728 0,-0.005 0.0243,-0.0333 0.0541,-0.0642 0.0296,-0.0309 0.0599,-0.0677 0.0672,-0.0817 0.007,-0.014 0.0685,-0.0794 0.13615,-0.14535 0.0676,-0.066 0.12079,-0.12339 0.11817,-0.12766 -0.003,-0.005 0.006,-0.0179 0.0194,-0.0303 0.029,-0.0273 0.0299,-0.0455 0.005,-0.0997 -0.0505,-0.1107 -0.0493,-0.10071 -0.0493,-0.39652 0,-0.23703 0.003,-0.28457 0.0156,-0.31105 0.0104,-0.021 0.0134,-0.0425 0.009,-0.0656 -0.004,-0.0221 -0.003,-0.0395 0.006,-0.0491 0.007,-0.008 0.0161,-0.0396 0.0204,-0.0699 0.005,-0.0303 0.0107,-0.0715 0.0137,-0.0916 0.003,-0.0201 0.009,-0.039 0.0141,-0.0419 0.005,-0.003 0.009,-0.0216 0.009,-0.0413 1.6e-4,-0.0198 0.007,-0.0445 0.0146,-0.0548 0.008,-0.0108 0.0144,-0.0399 0.0144,-0.0676 0,-0.0513 0.0163,-0.15327 0.0299,-0.18623 0.005,-0.0107 0.0101,-0.037 0.0129,-0.0584 0.003,-0.0214 0.008,-0.0631 0.0114,-0.0925 0.003,-0.0295 0.0126,-0.0605 0.02,-0.069 0.009,-0.0101 0.0114,-0.0262 0.008,-0.0461 -0.004,-0.0202 0,-0.0385 0.009,-0.0535 0.008,-0.0126 0.0174,-0.0552 0.0204,-0.0951 0.01,-0.13209 0.0174,-0.18902 0.0263,-0.19836 0.005,-0.005 0.009,-0.0408 0.009,-0.0793 0,-0.0518 0.003,-0.0714 0.0138,-0.0754 0.0188,-0.007 0.0249,-0.11797 0.0306,-0.55609 0.003,-0.23205 0.003,-0.35331 -0.005,-0.35993 -0.005,-0.006 -0.01,-0.0606 -0.01,-0.1286 0,-0.0936 -0.003,-0.12118 -0.0147,-0.13074 -0.0114,-0.009 -0.0146,-0.0358 -0.0146,-0.11808 0,-0.0641 -0.003,-0.10596 -0.01,-0.10596 -0.006,0 -0.01,-0.0452 -0.01,-0.11632 0,-0.067 -0.004,-0.11886 -0.01,-0.12233 -0.0134,-0.008 -0.0134,-1.06321 0,-1.07148 0.005,-0.003 0.01,-0.0318 0.01,-0.0633 0,-0.0315 0.005,-0.06 0.01,-0.0633 0.005,-0.003 0.01,-0.0224 0.01,-0.0425 0,-0.02 0.005,-0.0417 0.0117,-0.0481 0.006,-0.006 0.0149,-0.0347 0.0187,-0.0628 0.0139,-0.10131 0.021,-0.13397 0.0294,-0.13397 0.005,0 0.008,-0.0139 0.008,-0.031 0,-0.0303 0.0106,-0.071 0.0341,-0.12976 0.006,-0.016 0.0174,-0.0445 0.0246,-0.0633 0.007,-0.0187 0.0164,-0.0383 0.0208,-0.0433 0.005,-0.005 0.008,-0.0259 0.008,-0.0462 0,-0.0204 0.005,-0.037 0.01,-0.037 0.005,0 0.01,-0.0173 0.01,-0.0384 0,-0.0211 0.003,-0.0407 0.008,-0.0435 0.005,-0.003 0.0141,-0.0261 0.0208,-0.0517 0.007,-0.0256 0.0179,-0.0531 0.0246,-0.0611 0.0126,-0.0157 0.0226,-0.0509 0.0309,-0.10964 0.003,-0.0201 0.009,-0.039 0.0139,-0.042 0.005,-0.003 0.009,-0.0177 0.009,-0.0329 0,-0.0151 0.007,-0.0329 0.0146,-0.0395 0.008,-0.007 0.0146,-0.0181 0.0146,-0.0253 0,-0.0162 0.0366,-0.13435 0.0541,-0.17435 0.007,-0.0161 0.0179,-0.0502 0.0243,-0.0756 0.006,-0.0256 0.0157,-0.0488 0.0204,-0.0517 0.005,-0.003 0.008,-0.0182 0.008,-0.0339 0,-0.0157 0.005,-0.0286 0.01,-0.0286 0.005,0 0.01,-0.0129 0.01,-0.0286 0,-0.0157 0.005,-0.0313 0.01,-0.0346 0.005,-0.003 0.01,-0.0187 0.01,-0.0342 0,-0.0155 0.006,-0.0316 0.0132,-0.0359 0.007,-0.005 0.0157,-0.0243 0.0188,-0.0446 0.003,-0.0203 0.0126,-0.0505 0.0208,-0.0673 0.008,-0.0168 0.0151,-0.0358 0.0151,-0.0423 0,-0.006 0.007,-0.0176 0.0151,-0.0244 0.008,-0.007 0.0126,-0.019 0.009,-0.027 -0.003,-0.008 0.003,-0.0224 0.0104,-0.0322 0.009,-0.01 0.0139,-0.0264 0.0109,-0.0372 -0.003,-0.0107 0,-0.0245 0.008,-0.0307 0.008,-0.006 0.0137,-0.0192 0.0137,-0.0288 0,-0.01 0.006,-0.0299 0.0146,-0.0451 0.0198,-0.0374 0.0926,-0.22817 0.0926,-0.24246 0,-0.006 0.0198,-0.0491 0.0438,-0.0952 0.0241,-0.0461 0.0438,-0.0924 0.0438,-0.10299 0,-0.0106 0.005,-0.0219 0.01,-0.0252 0.005,-0.003 0.01,-0.0168 0.01,-0.03 0,-0.0132 0.0109,-0.0413 0.0243,-0.0625 0.0134,-0.0212 0.0243,-0.0429 0.0243,-0.0481 0,-0.005 0.0131,-0.0318 0.0293,-0.0591 0.0161,-0.0273 0.0292,-0.0567 0.0292,-0.0654 0,-0.0178 0.22812,-0.47668 0.2483,-0.49952 0.007,-0.008 0.0328,-0.0545 0.0571,-0.10313 0.0243,-0.0487 0.0511,-0.0941 0.0594,-0.10104 0.008,-0.007 0.0151,-0.0171 0.0151,-0.0228 0,-0.005 0.0171,-0.0369 0.0379,-0.0694 0.0208,-0.0325 0.0408,-0.0688 0.0443,-0.0806 0.003,-0.0118 0.0194,-0.0323 0.0351,-0.0456 0.0159,-0.0133 0.0287,-0.0289 0.0287,-0.0349 0,-0.0147 0.0273,-0.0577 0.0591,-0.0928 0.0146,-0.0161 0.0293,-0.0391 0.033,-0.0512 0.003,-0.0121 0.0151,-0.0264 0.0254,-0.032 0.0104,-0.005 0.0188,-0.0185 0.0188,-0.0288 0,-0.0103 0.0154,-0.031 0.0341,-0.0459 0.0188,-0.015 0.0341,-0.0333 0.0341,-0.0409 0,-0.0141 0.0362,-0.0581 0.14754,-0.17902 0.0356,-0.0387 0.0663,-0.0769 0.0682,-0.085 0.006,-0.0254 0.37404,-0.37015 0.39514,-0.37015 0.005,0 0.0218,-0.0134 0.0374,-0.0297 0.0337,-0.0352 0.15133,-0.11633 0.21644,-0.14936 0.0254,-0.0128 0.0545,-0.0326 0.0646,-0.0439 0.0101,-0.0113 0.0226,-0.0205 0.0278,-0.0205 0.005,0 0.0646,-0.0277 0.13241,-0.0616 0.0678,-0.0339 0.16928,-0.0757 0.22551,-0.0931 0.0563,-0.0174 0.11471,-0.0379 0.12986,-0.0456 0.0151,-0.008 0.0417,-0.0141 0.059,-0.0141 0.0171,0 0.0355,-0.004 0.0406,-0.009 0.0104,-0.01 0.0872,-0.019 0.24015,-0.0286 0.062,-0.004 0.10917,-0.0115 0.11639,-0.0187 0.018,-0.0182 0.26791,-0.0162 0.30047,0.002 0.0204,0.0117 0.13442,0.014 0.71352,0.0143 0.50285,2.4e-4 0.68914,0.003 0.68914,0.0113 0,0.008 0.004,0.008 0.0139,-7.6e-4 0.0101,-0.008 0.0193,-0.009 0.0334,-0.002 0.0107,0.006 0.0656,0.0104 0.12183,0.0104 0.0578,0 0.10496,0.004 0.10835,0.01 0.003,0.005 0.0322,0.01 0.0642,0.01 0.0328,0 0.0676,0.006 0.0798,0.0135 0.0243,0.0151 0.13088,0.0285 0.21026,0.0263 0.0361,-7.7e-4 0.0558,0.003 0.0633,0.013 0.0114,0.0148 0.0595,0.019 0.35193,0.0303 0.0697,0.003 0.13545,0.009 0.14621,0.0148 0.023,0.0117 0.35835,0.005 0.53563,-0.01 0.0643,-0.005 0.1717,-0.0126 0.23867,-0.0156 0.067,-0.003 0.13236,-0.0108 0.14532,-0.0173 0.0324,-0.0161 0.58116,-0.0148 0.59741,0.002 0.008,0.008 0.13982,0.0112 0.48049,0.0112 0.40525,0 0.47094,-0.002 0.4814,-0.0146 0.007,-0.008 0.0216,-0.0146 0.033,-0.0146 0.0226,0 0.11711,-0.0323 0.13581,-0.0465 0.006,-0.005 0.0311,-0.0142 0.0553,-0.021 0.0241,-0.007 0.0504,-0.0178 0.0584,-0.0244 0.024,-0.0197 0.16787,-0.0729 0.22975,-0.0849 0.0317,-0.006 0.0646,-0.017 0.073,-0.0243 0.008,-0.008 0.0356,-0.0132 0.0603,-0.0132 0.0247,0 0.0476,-0.005 0.051,-0.01 0.003,-0.005 0.0274,-0.01 0.0535,-0.01 0.0261,0 0.0503,-0.005 0.0535,-0.01 0.003,-0.005 0.0315,-0.01 0.0627,-0.01 0.0385,0 0.0606,-0.005 0.0688,-0.0146 0.01,-0.0116 0.0379,-0.0146 0.13698,-0.0146 0.0727,0 0.12737,-0.004 0.13089,-0.01 0.003,-0.005 0.0188,-0.01 0.0346,-0.01 0.0246,0 0.0286,-0.004 0.0286,-0.0263 0,-0.015 -0.0109,-0.0376 -0.0254,-0.0528 -0.0252,-0.0263 -0.0253,-0.0267 -0.007,-0.0514 0.0144,-0.0198 0.0266,-0.0249 0.0595,-0.0251 0.0228,-1.6e-4 0.0414,-0.005 0.0414,-0.009 0,-0.009 0.0381,-0.0155 0.14609,-0.0267 0.0295,-0.003 0.058,-0.009 0.0633,-0.013 0.005,-0.004 0.033,-0.0104 0.0613,-0.014 0.0283,-0.004 0.0627,-0.0108 0.0764,-0.0161 0.023,-0.009 0.0246,-0.0131 0.0204,-0.0556 -0.003,-0.0254 -0.009,-0.0626 -0.0146,-0.0827 l -0.01,-0.0365 h 0.12988 c 0.0761,0 0.1324,0.004 0.13593,0.01 0.003,0.005 0.0551,0.01 0.12177,0.01 0.0667,0 0.11828,0.004 0.12174,0.01 0.003,0.005 0.0389,0.01 0.0791,0.01 0.0402,0 0.0707,-0.004 0.0677,-0.009 -0.003,-0.005 0,-0.0219 0.005,-0.0381 0.008,-0.0233 0.02,-0.0326 0.0578,-0.0449 0.0261,-0.009 0.0644,-0.0155 0.0851,-0.0155 0.0206,0 0.0419,-0.005 0.0473,-0.01 0.005,-0.005 0.0873,-0.0126 0.18215,-0.0161 l 0.1725,-0.007 v -0.0231 c 0,-0.0469 0.0597,-0.11988 0.0981,-0.11988 0.0146,0 0.0288,-0.006 0.0316,-0.0135 0.007,-0.0182 0.15118,-0.0193 0.1722,-0.002 0.008,0.007 0.0388,0.0153 0.0682,0.0187 0.12481,0.0147 0.14678,0.0185 0.15177,0.0266 0.009,0.0144 0.0392,0.009 0.0561,-0.009 0.0109,-0.0122 0.0161,-0.0353 0.0161,-0.073 0,-0.0488 0.003,-0.0552 0.0196,-0.0552 0.0106,0 0.0196,0.005 0.0196,0.01 0,0.012 0.14551,0.0129 0.1642,7.7e-4 0.009,-0.006 0.01,-0.0104 0.003,-0.0151 -0.006,-0.004 -0.0107,-0.0188 -0.0107,-0.0336 0,-0.0148 -0.0109,-0.0485 -0.0243,-0.0749 -0.0134,-0.0263 -0.0243,-0.0512 -0.0243,-0.0552 -8e-5,-0.0139 0.0324,-0.007 0.0845,0.0174 0.0302,0.0143 0.079,0.0273 0.11541,0.0306 l 0.0631,0.006 v -0.0306 c 0,-0.0291 0.003,-0.0306 0.0377,-0.0306 0.0208,0 0.0564,-0.006 0.0792,-0.0146 0.05,-0.0177 0.11048,-0.0189 0.13943,-0.003 0.0117,0.006 0.0475,0.0151 0.0797,0.0191 0.11691,0.0146 0.16615,0.0248 0.19479,0.0405 0.0389,0.0214 0.0508,0.0204 0.064,-0.006 0.0161,-0.0315 0.0969,-0.11356 0.12779,-0.12983 0.0144,-0.008 0.037,-0.0138 0.0499,-0.0138 0.0131,0 0.029,-0.006 0.0357,-0.0146 0.007,-0.008 0.0247,-0.0146 0.0402,-0.0146 0.0154,0 0.028,-0.004 0.028,-0.009 0,-0.01 0.0492,-0.0183 0.15587,-0.0267 0.0498,-0.004 0.0757,-0.0104 0.0814,-0.0203 0.007,-0.0121 0.0335,-0.014 0.16164,-0.0111 0.10754,0.002 0.15743,2e-5 0.16707,-0.008 0.008,-0.006 0.0532,-0.0134 0.10137,-0.0159 0.0481,-0.002 0.10729,-0.009 0.13138,-0.0147 0.10706,-0.025 0.1928,-0.041 0.22741,-0.0424 0.0211,-7.6e-4 0.0396,-0.008 0.0425,-0.0145 0.003,-0.009 0.0228,-0.013 0.0575,-0.013 0.029,0 0.0525,-0.003 0.0525,-0.008 0,-0.008 0.10995,-0.0314 0.14465,-0.0314 0.0101,0 0.024,-0.006 0.0307,-0.0146 0.007,-0.008 0.0282,-0.0146 0.0498,-0.0146 0.0208,0 0.0378,-0.005 0.0378,-0.01 0,-0.005 0.0191,-0.01 0.0422,-0.01 0.0544,0 0.1526,-0.0197 0.1526,-0.0306 0,-0.005 0.0129,-0.008 0.0286,-0.008 0.0157,0 0.0313,-0.005 0.0346,-0.01 0.003,-0.005 0.0129,-0.01 0.0216,-0.01 0.008,0 0.0379,-0.0105 0.0651,-0.0232 0.0795,-0.0372 0.12167,-0.0482 0.13664,-0.0358 0.009,0.008 0.0208,0.008 0.0392,7.5e-4 0.0144,-0.005 0.0385,-0.01 0.0535,-0.01 0.0151,0 0.0325,-0.006 0.0386,-0.0135 0.0126,-0.0153 0.0494,-0.0246 0.1269,-0.032 0.0409,-0.004 0.0555,-0.002 0.0641,0.01 0.009,0.0129 0.0211,0.005 0.0783,-0.0525 0.0369,-0.0373 0.0719,-0.0677 0.0776,-0.0677 0.005,0 0.0297,-0.0197 0.0534,-0.0439 0.0236,-0.0241 0.0504,-0.0438 0.0593,-0.0438 0.009,0 0.0216,-0.006 0.0281,-0.0142 0.0188,-0.0227 0.15536,-0.0929 0.18065,-0.0929 0.0126,0 0.0257,-0.005 0.0291,-0.01 0.003,-0.005 0.0394,-0.01 0.0802,-0.01 0.12342,0 0.17232,0.022 0.27651,0.12404 0.0453,0.0444 0.0769,0.0686 0.081,0.0621 0.003,-0.006 0.0169,-0.0108 0.0292,-0.0108 0.0124,0 0.028,-0.006 0.0347,-0.0146 0.007,-0.008 0.027,-0.0146 0.045,-0.0146 0.0343,0 0.25423,-0.10479 0.27668,-0.13185 0.006,-0.008 0.0179,-0.0143 0.0253,-0.0143 0.008,0 0.023,-0.011 0.0346,-0.0243 0.0117,-0.0134 0.0267,-0.0243 0.0336,-0.0243 0.007,0 0.0226,-0.01 0.0351,-0.022 0.023,-0.0222 0.10216,-0.0809 0.13643,-0.10113 0.0101,-0.006 0.0327,-0.0247 0.0499,-0.0414 0.0174,-0.0167 0.0358,-0.0303 0.0412,-0.0303 0.005,0 0.0248,-0.0154 0.0429,-0.0341 0.0181,-0.0187 0.0407,-0.0341 0.0501,-0.0341 0.009,0 0.0336,-0.0197 0.0538,-0.0439 0.02,-0.0241 0.0437,-0.0439 0.0523,-0.0439 0.009,0 0.0282,-0.0131 0.0436,-0.0292 0.0154,-0.0161 0.0329,-0.0292 0.0389,-0.0292 0.006,0 0.0257,-0.0153 0.0439,-0.0341 0.0181,-0.0187 0.0392,-0.0341 0.0468,-0.0341 0.008,0 0.0223,-0.011 0.0329,-0.0243 0.0104,-0.0134 0.027,-0.0243 0.0367,-0.0243 0.01,0 0.0233,-0.007 0.0305,-0.0156 0.007,-0.009 0.0657,-0.0418 0.13027,-0.0738 0.0645,-0.032 0.12423,-0.0644 0.13268,-0.0721 0.008,-0.008 0.0285,-0.0138 0.0446,-0.0138 0.0498,0 0.0532,0.0183 0.0486,0.2679 -0.005,0.23593 -0.0139,0.34387 -0.0322,0.36632 -0.0114,0.014 -0.0213,0.0801 -0.0263,0.17696 -0.003,0.031 -0.008,0.0614 -0.0144,0.0677 -0.006,0.006 -0.0114,0.0276 -0.0114,0.0474 0,0.0229 -0.005,0.038 -0.0146,0.0415 -0.008,0.003 -0.0141,0.0156 -0.0134,0.0278 0,0.0123 -0.0126,0.0617 -0.0296,0.10991 -0.0169,0.0482 -0.0352,0.10301 -0.0406,0.12177 -0.005,0.0187 -0.0248,0.067 -0.0431,0.10714 -0.0181,0.0402 -0.0355,0.084 -0.0383,0.0974 -0.003,0.0134 -0.0283,0.059 -0.0566,0.10126 -0.0283,0.0423 -0.0588,0.0901 -0.0679,0.10613 -0.009,0.016 -0.0307,0.0438 -0.048,0.0617 l -0.0315,0.0326 0.0383,0.0343 c 0.021,0.0189 0.0503,0.0409 0.065,0.049 0.0146,0.008 0.0329,0.0266 0.0406,0.0412 0.008,0.0147 0.0296,0.0417 0.0489,0.0602 0.0193,0.0185 0.0349,0.0389 0.0349,0.0455 0,0.006 0.01,0.0243 0.0218,0.0395 0.0313,0.0393 0.0462,0.0683 0.0462,0.0893 0,0.0101 0.0114,0.0349 0.0251,0.0552 0.0139,0.0204 0.023,0.0449 0.0206,0.0546 -0.003,0.01 0.003,0.023 0.01,0.0296 0.008,0.007 0.0126,0.0218 0.01,0.0352 -0.003,0.0141 0,0.0253 0.009,0.0284 0.008,0.003 0.0134,0.0197 0.0134,0.0425 0,0.0205 0.005,0.0401 0.01,0.0434 0.005,0.003 0.01,0.047 0.01,0.0974 0,0.0504 0.005,0.0941 0.01,0.0974 0.005,0.003 0.01,0.0425 0.01,0.087 0,0.0601 0.003,0.0842 0.0146,0.0932 0.0104,0.009 0.0146,0.0313 0.0146,0.0772 0,0.0358 0.004,0.0692 0.009,0.0743 0.005,0.005 0.0111,0.0356 0.0139,0.0677 0.005,0.0529 0.0141,0.11353 0.0303,0.19481 0.0228,0.11335 0.0293,0.13803 0.0397,0.15098 0.006,0.008 0.0213,0.0409 0.0333,0.073 0.0289,0.0785 0.1339,0.28726 0.15717,0.31233 0.0101,0.0111 0.0187,0.0273 0.0187,0.036 0,0.009 0.006,0.0195 0.0141,0.0239 0.008,0.005 0.0431,0.0471 0.0782,0.0948 0.0352,0.0478 0.0825,0.1083 0.10511,0.1345 0.0731,0.0848 0.44925,0.465 0.46004,0.465 0.005,0 0.0298,0.0197 0.0535,0.0438 0.0235,0.0241 0.0486,0.0439 0.0555,0.0439 0.007,0 0.0238,0.0125 0.0374,0.0279 0.0137,0.0154 0.0476,0.0431 0.0756,0.0617 0.19207,0.12786 0.2298,0.15405 0.23573,0.16365 0.003,0.005 0.0141,0.01 0.0238,0.01 0.01,0 0.023,0.006 0.0295,0.0141 0.006,0.008 0.0344,0.0275 0.0621,0.0439 0.0277,0.0164 0.0588,0.0352 0.069,0.0418 0.0101,0.007 0.0527,0.0341 0.0943,0.0609 0.0416,0.0268 0.10265,0.0663 0.13565,0.0877 0.033,0.0214 0.0743,0.0463 0.0917,0.0554 0.0173,0.009 0.039,0.0276 0.048,0.0414 0.009,0.0138 0.0235,0.025 0.0321,0.025 0.009,0 0.0347,0.0164 0.0579,0.0365 0.023,0.0201 0.0646,0.0541 0.0921,0.0755 0.11588,0.0903 0.27211,0.27458 0.27211,0.32096 0,0.0131 0.005,0.0268 0.0112,0.0306 0.008,0.005 0.009,0.0351 0.005,0.0983 -0.005,0.074 -0.0101,0.0994 -0.0302,0.13358 -0.0386,0.0658 -0.11094,0.1501 -0.13511,0.15738 -0.0121,0.004 -0.0351,0.0186 -0.0511,0.0332 -0.0356,0.0323 -0.33596,0.18558 -0.36375,0.18558 -0.0109,0 -0.0226,0.005 -0.0259,0.01 -0.003,0.005 -0.0184,0.01 -0.0335,0.01 -0.0151,0 -0.0329,0.006 -0.0395,0.0146 -0.007,0.008 -0.0193,0.0146 -0.0281,0.0146 -0.009,0 -0.04,0.009 -0.0693,0.0195 -0.0293,0.0107 -0.0651,0.0195 -0.0796,0.0195 -0.0146,0 -0.029,0.005 -0.0323,0.01 -0.003,0.005 -0.0187,0.01 -0.0341,0.01 -0.0154,0 -0.0308,0.005 -0.0341,0.01 -0.003,0.005 -0.0184,0.01 -0.0336,0.01 -0.0157,0 -0.03,0.006 -0.0332,0.0146 -0.003,0.008 -0.0156,0.0147 -0.0278,0.0148 -0.0241,1.6e-4 -0.0907,0.0213 -0.10158,0.0321 -0.003,0.004 -0.0228,0.007 -0.0428,0.007 -0.0198,0 -0.0412,0.006 -0.0473,0.0134 -0.006,0.008 -0.0319,0.0161 -0.0572,0.0195 -0.0913,0.0121 -0.11914,0.0181 -0.11914,0.0258 0,0.0137 -0.12464,0.021 -0.35554,0.0207 -0.26551,-2.5e-4 -0.41357,-0.008 -0.43197,-0.0237 -0.008,-0.006 -0.0425,-0.0123 -0.078,-0.0137 -0.13404,-0.005 -0.19735,-0.0142 -0.20273,-0.0282 -0.004,-0.0101 -0.024,-0.0137 -0.0753,-0.0137 -0.0386,0 -0.0743,-0.004 -0.0793,-0.009 -0.005,-0.005 -0.029,-0.0111 -0.0531,-0.014 -0.0769,-0.009 -0.11183,-0.0184 -0.1198,-0.0321 -0.005,-0.008 -0.0246,-0.0134 -0.0487,-0.0135 -0.0255,-1.3e-4 -0.0501,-0.008 -0.0652,-0.0193 -0.0139,-0.0109 -0.0397,-0.0191 -0.0603,-0.0193 -0.0199,-1.1e-4 -0.0387,-0.005 -0.0419,-0.01 -0.003,-0.005 -0.0187,-0.01 -0.0341,-0.01 -0.0154,0 -0.0308,-0.005 -0.0341,-0.01 -0.003,-0.005 -0.0228,-0.01 -0.0434,-0.01 -0.0243,0 -0.0393,-0.005 -0.043,-0.0146 -0.003,-0.01 -0.0188,-0.0146 -0.0443,-0.0146 -0.0213,0 -0.0414,-0.005 -0.0447,-0.01 -0.003,-0.005 -0.0319,-0.01 -0.0637,-0.01 -0.0534,0 -0.0587,0.002 -0.0718,0.0275 -0.008,0.0151 -0.0211,0.0332 -0.0295,0.0402 -0.008,0.007 -0.0154,0.0198 -0.0154,0.0285 -1.2e-4,0.009 -0.009,0.0268 -0.0194,0.0402 -0.0107,0.0135 -0.0191,0.0397 -0.0194,0.0589 -1.2e-4,0.019 -0.005,0.0395 -0.0111,0.0455 -0.0114,0.0114 -0.0151,0.0455 -0.024,0.217 -0.004,0.0742 -0.009,0.10441 -0.0194,0.11006 -0.009,0.005 -0.0139,0.0243 -0.0139,0.0555 0,0.0262 -0.005,0.0504 -0.01,0.0537 -0.005,0.003 -0.01,0.0187 -0.01,0.0341 0,0.0154 -0.005,0.0308 -0.01,0.0341 -0.005,0.003 -0.01,0.0189 -0.01,0.0346 0,0.0157 -0.003,0.0286 -0.008,0.0286 -0.004,0 -0.0204,0.0274 -0.0358,0.0609 -0.0293,0.0632 -0.0511,0.095 -0.0652,0.095 -0.005,0 -0.0252,-0.0153 -0.0458,-0.034 -0.0208,-0.0187 -0.0531,-0.0405 -0.0721,-0.0485 l -0.0345,-0.0144 -0.005,0.0412 c -0.009,0.0727 -0.0184,0.10896 -0.031,0.12392 -0.007,0.008 -0.0268,0.0453 -0.0442,0.0828 -0.0176,0.0375 -0.0456,0.0857 -0.0624,0.10714 -0.0168,0.0214 -0.0369,0.0482 -0.0446,0.0597 -0.008,0.0114 -0.0327,0.0451 -0.0554,0.0751 -0.0228,0.0299 -0.0414,0.0611 -0.0414,0.0694 0,0.0285 -0.0374,0.0165 -0.0517,-0.0167 -0.0288,-0.0669 -0.0555,-0.13969 -0.0555,-0.15117 0,-0.007 -0.003,-0.012 -0.008,-0.012 -0.008,0 -0.17756,0.16784 -0.17756,0.17621 0,0.003 -0.0241,0.042 -0.0535,0.0868 -0.0295,0.0448 -0.0535,0.0913 -0.0535,0.10346 0,0.0121 -0.003,0.0243 -0.008,0.0273 -0.005,0.003 -0.0114,0.027 -0.0149,0.0538 -0.003,0.0266 -0.01,0.0504 -0.0134,0.0528 -0.004,0.002 -0.0272,-0.01 -0.0518,-0.0264 -0.0246,-0.0168 -0.0751,-0.0509 -0.11203,-0.0758 -0.0369,-0.0249 -0.0755,-0.0544 -0.0857,-0.0657 -0.0101,-0.0113 -0.0266,-0.0206 -0.0363,-0.0206 -0.0198,0 -0.0516,0.053 -0.0439,0.0732 0.003,0.007 0,0.0183 -0.009,0.0246 -0.008,0.006 -0.0141,0.024 -0.0141,0.0391 0,0.0151 -0.004,0.0299 -0.009,0.0331 -0.0131,0.008 -0.0591,0.11149 -0.0591,0.13307 0,0.0144 -0.007,0.0183 -0.0332,0.0183 -0.0274,0 -0.0323,-0.003 -0.0285,-0.018 0.003,-0.0128 -0.0141,-0.0352 -0.0613,-0.0784 l -0.0659,-0.0604 -0.0117,0.0321 c -0.006,0.0177 -0.0171,0.0507 -0.0241,0.0733 -0.007,0.0226 -0.0208,0.0488 -0.0311,0.0582 -0.0104,0.009 -0.0272,0.0357 -0.0376,0.0586 -0.0159,0.0349 -0.0236,0.0416 -0.0468,0.0416 -0.0208,0 -0.0293,-0.005 -0.0334,-0.0219 -0.003,-0.0121 -0.0254,-0.0415 -0.0498,-0.0654 l -0.0443,-0.0435 -0.056,0.0545 c -0.0628,0.0613 -0.0872,0.0763 -0.12381,0.0763 -0.0139,0 -0.0278,0.006 -0.0309,0.0146 -0.003,0.008 -0.0151,0.0146 -0.0265,0.0145 -0.0114,-6e-5 -0.0472,0.009 -0.0793,0.0207 -0.0549,0.0195 -0.06,0.0241 -0.0852,0.0757 -0.0146,0.0302 -0.0268,0.0623 -0.0268,0.0713 0,0.009 -0.005,0.019 -0.01,0.0223 -0.005,0.003 -0.01,0.0187 -0.01,0.0341 0,0.0154 -0.005,0.0308 -0.01,0.0341 -0.005,0.003 -0.01,0.023 -0.01,0.0438 0,0.0208 -0.005,0.0405 -0.01,0.0439 -0.005,0.003 -0.01,0.0162 -0.01,0.0286 0,0.0124 -0.007,0.028 -0.0146,0.0347 -0.008,0.007 -0.0146,0.0247 -0.0146,0.0402 0,0.0154 -0.005,0.028 -0.01,0.028 -0.005,0 -0.01,0.0129 -0.01,0.0286 0,0.0157 -0.005,0.0313 -0.01,0.0346 -0.005,0.003 -0.01,0.0271 -0.01,0.053 0,0.0307 -0.005,0.0513 -0.0154,0.0596 -0.009,0.008 -0.0132,0.021 -0.01,0.0342 0.003,0.0141 0,0.0236 -0.009,0.0272 -0.008,0.003 -0.0146,0.0164 -0.0146,0.0298 0,0.0133 -0.005,0.0365 -0.0109,0.0515 -0.022,0.0548 -0.0263,0.0673 -0.0426,0.12219 -0.009,0.0308 -0.0204,0.0585 -0.0253,0.0614 -0.005,0.003 -0.009,0.0156 -0.009,0.028 0,0.0237 -0.0658,0.16404 -0.0796,0.16958 -0.005,0.002 -0.008,0.0154 -0.008,0.0302 0,0.0148 -0.0109,0.0419 -0.0241,0.0601 -0.0132,0.0182 -0.0289,0.0441 -0.0347,0.0574 -0.006,0.0134 -0.0184,0.0331 -0.0277,0.0439 -0.009,0.0108 -0.0352,0.0505 -0.0572,0.0884 -0.022,0.0379 -0.0469,0.0747 -0.0553,0.0816 -0.008,0.007 -0.0151,0.0189 -0.0151,0.0267 0,0.008 -0.0109,0.0258 -0.0241,0.0402 -0.0407,0.0442 -0.11227,0.13743 -0.11227,0.14628 0,0.005 -0.009,0.0163 -0.0196,0.026 -0.0107,0.01 -0.0196,0.024 -0.0196,0.0318 0,0.008 -0.0109,0.0227 -0.0243,0.0333 -0.0134,0.0105 -0.0243,0.0274 -0.0243,0.0376 0,0.0101 -0.009,0.0231 -0.0196,0.0289 -0.0107,0.006 -0.0196,0.0176 -0.0196,0.0263 0,0.009 -0.006,0.0231 -0.0144,0.0319 -0.0418,0.0461 -0.2291,0.39529 -0.2291,0.42699 0,0.006 -0.003,0.0194 -0.008,0.0287 -0.0126,0.0252 -0.0304,0.0843 -0.0304,0.10164 0,0.008 -0.006,0.0206 -0.0146,0.0272 -0.009,0.008 -0.0124,0.0206 -0.009,0.0352 0.004,0.0161 0,0.025 -0.01,0.0292 -0.009,0.004 -0.0157,0.0172 -0.0157,0.0336 0,0.0152 -0.005,0.0303 -0.01,0.0336 -0.005,0.003 -0.01,0.023 -0.01,0.0439 0,0.0208 -0.005,0.0405 -0.01,0.0438 -0.005,0.003 -0.01,0.0231 -0.01,0.0439 0,0.022 -0.005,0.0412 -0.0134,0.0457 -0.008,0.005 -0.0161,0.0264 -0.0196,0.0492 -0.0154,0.10553 -0.0184,0.11979 -0.0266,0.12484 -0.005,0.003 -0.009,0.0272 -0.009,0.0538 0,0.0359 -0.004,0.05 -0.0159,0.0545 -0.0144,0.005 -0.0141,0.008 0.003,0.0192 0.0139,0.0101 0.0154,0.0157 0.006,0.0247 -0.007,0.007 -0.0117,0.0416 -0.0117,0.0871 0,0.0415 -0.005,0.0781 -0.01,0.0814 -0.005,0.003 -0.01,0.0468 -0.01,0.0968 0,0.0688 -0.003,0.0937 -0.0146,0.10289 -0.0117,0.01 -0.0147,0.04 -0.0147,0.15647 0,0.0857 -0.004,0.14679 -0.01,0.15037 -0.006,0.004 -0.01,0.13141 -0.01,0.35066 0,0.21926 0.003,0.34684 0.01,0.35067 0.006,0.004 0.01,0.0711 0.01,0.16985 0,0.13427 0.003,0.16602 0.0147,0.17604 0.0132,0.0108 0.0129,0.0134 0,0.0237 -0.0141,0.0104 -0.0141,0.0125 -1.3e-4,0.0243 0.0124,0.0104 0.0154,0.0342 0.0154,0.12311 0,0.063 0.004,0.11283 0.01,0.11626 0.005,0.004 0.01,0.0531 0.01,0.11552 0,0.0745 0.004,0.11344 0.0121,0.12185 0.01,0.01 0.008,0.0151 -0.006,0.026 -0.0167,0.0123 -0.0168,0.0143 -0.003,0.0199 0.0137,0.005 0.0161,0.0226 0.0161,0.11228 0,0.0643 0.003,0.10611 0.01,0.10611 0.005,0 0.01,0.0339 0.01,0.0822 0,0.0452 0.005,0.0849 0.01,0.0882 0.005,0.003 0.01,0.0468 0.01,0.0968 0,0.0688 0.003,0.0937 0.0146,0.1029 0.0112,0.009 0.0146,0.0341 0.0146,0.10289 0,0.05 0.005,0.0935 0.01,0.0968 0.005,0.004 0.01,0.0616 0.01,0.14124 0,0.0796 0.004,0.1377 0.01,0.14125 0.005,0.003 0.01,0.0428 0.01,0.0877 0,0.0449 0.005,0.0844 0.01,0.0877 0.005,0.003 0.01,0.0428 0.01,0.0878 0,0.06 0.003,0.0838 0.0137,0.0895 0.008,0.005 0.0159,0.0313 0.0193,0.0663 0.003,0.0322 0.008,0.0847 0.0111,0.11689 0.003,0.0322 0.01,0.0672 0.0144,0.0779 0.005,0.0107 0.0112,0.0524 0.0137,0.0925 0.008,0.12777 0.0171,0.17996 0.0309,0.18799 0.009,0.005 0.0137,0.0256 0.0137,0.0609 0,0.0292 0.004,0.0531 0.009,0.0531 0.008,0 0.0129,0.0303 0.0263,0.17046 0.003,0.0322 0.0124,0.066 0.0206,0.0753 0.0112,0.0126 0.0137,0.0291 0.009,0.065 -0.004,0.0355 -0.003,0.0512 0.008,0.0598 0.009,0.007 0.0141,0.0296 0.0141,0.0586 0,0.0258 0.005,0.0496 0.01,0.053 0.005,0.003 0.01,0.0233 0.01,0.0444 0,0.0211 0.005,0.0384 0.01,0.0384 0.005,0 0.01,0.0129 0.01,0.0286 0,0.0157 0.005,0.0313 0.01,0.0346 0.005,0.003 0.01,0.0271 0.01,0.053 0,0.0298 0.005,0.0514 0.0146,0.0591 0.008,0.007 0.0146,0.0247 0.0146,0.0402 0,0.0154 0.003,0.028 0.008,0.028 0.004,0 0.0137,0.0208 0.021,0.0462 0.0168,0.0579 0.0816,0.1888 0.12042,0.24342 0.0316,0.0444 0.0932,0.0805 0.13747,0.0805 0.0149,0 0.0398,-0.01 0.0552,-0.0219 0.0864,-0.0675 0.084,-0.0663 0.11099,-0.0561 0.0141,0.005 0.0422,0.01 0.0621,0.01 0.0201,0 0.0413,0.005 0.0473,0.0109 0.006,0.006 0.0387,0.0145 0.0726,0.019 0.0339,0.005 0.0836,0.0129 0.11034,0.0187 0.0268,0.006 0.0619,0.013 0.0779,0.0158 0.0963,0.017 0.21917,0.12191 0.21917,0.18712 0,0.0103 0.006,0.0243 0.0146,0.0309 0.008,0.007 0.0146,0.0245 0.0146,0.0395 0,0.0151 0.005,0.0302 0.01,0.0335 0.005,0.003 0.01,0.0142 0.01,0.0243 0,0.0395 0.12268,0.19491 0.15385,0.19491 0.0238,0 0.18478,0.14665 0.23497,0.21404 0.0191,0.0257 0.023,0.0419 0.0216,0.0866 0,0.0303 -0.007,0.0673 -0.0129,0.0823 -0.0121,0.0303 -0.131,0.11387 -0.16192,0.11387 -0.0168,0 -0.0615,0.0174 -0.0994,0.0386 -0.0107,0.006 -0.0286,-0.005 -0.0657,-0.0417 l -0.0512,-0.0498 v 0.0341 c 0,0.0684 -0.14638,0.17432 -0.24106,0.17453 -0.0228,6e-5 -0.0414,0.005 -0.0414,0.01 0,0.006 -0.0714,0.01 -0.19482,0.01 h -0.19482 v -0.0277 c 0,-0.0378 -0.0306,-0.0651 -0.057,-0.051 -0.0249,0.0134 -0.20278,0.0139 -0.21093,7.5e-4 -0.004,-0.006 -0.0134,-0.005 -0.0262,0.005 -0.0176,0.0124 -0.023,0.0122 -0.0436,-0.002 -0.0184,-0.012 -0.0394,-0.0141 -0.0954,-0.01 -0.0531,0.004 -0.0766,0.002 -0.0897,-0.008 -0.01,-0.008 -0.0401,-0.0137 -0.0675,-0.0138 -0.0273,-1.7e-4 -0.0636,-0.007 -0.0806,-0.0157 -0.0211,-0.0105 -0.0428,-0.0134 -0.0684,-0.009 -0.0374,0.006 -0.13178,-0.0168 -0.14307,-0.0351 -0.003,-0.005 -0.018,-0.009 -0.0339,-0.009 -0.0157,0 -0.0286,-0.005 -0.0286,-0.01 0,-0.005 -0.009,-0.01 -0.0198,-0.01 -0.0427,0 -0.24091,-0.11465 -0.28862,-0.16695 -0.0412,-0.0452 -0.0792,-0.12267 -0.0859,-0.1751 -0.008,-0.0626 -0.008,-0.19192 1.2e-4,-0.32365 0.005,-0.0743 0.003,-0.10279 -0.009,-0.12662 -0.008,-0.017 -0.0121,-0.0426 -0.009,-0.0569 0.003,-0.0157 0,-0.0351 -0.0104,-0.0485 -0.009,-0.0123 -0.0156,-0.0343 -0.0156,-0.0491 0,-0.0147 -0.0146,-0.0543 -0.0327,-0.0879 -0.0179,-0.0336 -0.0355,-0.0757 -0.0389,-0.0935 -0.003,-0.0178 -0.0121,-0.0463 -0.0196,-0.0633 -0.0287,-0.0667 -0.0553,-0.1592 -0.0552,-0.19217 8e-5,-0.0191 -0.006,-0.0432 -0.0141,-0.0536 -0.009,-0.0124 -0.0144,-0.0428 -0.0146,-0.0889 -1.5e-4,-0.0386 -0.005,-0.0727 -0.0101,-0.076 -0.006,-0.004 -0.01,-0.0973 -0.01,-0.24838 0,-0.15108 -0.003,-0.24464 -0.01,-0.24839 -0.005,-0.003 -0.01,-0.0293 -0.01,-0.0579 0,-0.0286 -0.006,-0.0638 -0.0139,-0.0785 -0.008,-0.0146 -0.0167,-0.0521 -0.0204,-0.0832 -0.004,-0.0349 -0.0119,-0.0587 -0.0204,-0.0619 -0.008,-0.003 -0.0139,-0.0174 -0.0139,-0.0324 -1.1e-4,-0.0149 -0.009,-0.038 -0.0194,-0.0515 -0.0104,-0.0134 -0.0191,-0.0381 -0.0193,-0.0549 -1.5e-4,-0.0217 -0.007,-0.0352 -0.0246,-0.0465 -0.0134,-0.009 -0.0243,-0.0243 -0.0243,-0.0346 0,-0.0103 -0.005,-0.0214 -0.01,-0.0247 -0.005,-0.003 -0.01,-0.0184 -0.01,-0.0336 0,-0.0156 -0.006,-0.03 -0.0146,-0.0333 -0.008,-0.003 -0.0146,-0.0165 -0.0146,-0.0299 0,-0.0134 -0.009,-0.0482 -0.0198,-0.0776 -0.0181,-0.0483 -0.0193,-0.0687 -0.0151,-0.2171 0.008,-0.26432 0.0147,-0.33765 0.0316,-0.35065 0.0107,-0.008 0.0131,-0.02 0.008,-0.0414 -0.006,-0.0295 -0.008,-0.0299 -0.0671,-0.0299 -0.0341,0 -0.0657,-0.005 -0.0723,-0.0117 -0.008,-0.009 -0.0117,-0.0868 -0.0117,-0.29118 0,-0.23848 -0.003,-0.28031 -0.0144,-0.28505 -0.0117,-0.005 -0.0132,-0.0173 -0.008,-0.0644 l 0.006,-0.0588 h -0.0705 c -0.0555,0 -0.0756,-0.004 -0.0951,-0.0194 -0.0208,-0.0163 -0.022,-0.0203 -0.009,-0.0254 0.0124,-0.005 0.0156,-0.0207 0.0156,-0.0775 0,-0.0393 0.005,-0.0742 0.01,-0.0775 0.006,-0.004 0.01,-0.16713 0.01,-0.45781 0,-0.2907 -0.003,-0.45395 -0.01,-0.45782 -0.005,-0.003 -0.01,-0.0428 -0.01,-0.0877 0,-0.0449 -0.005,-0.0844 -0.01,-0.0877 -0.005,-0.003 -0.01,-0.0384 -0.01,-0.0779 0,-0.0396 -0.005,-0.0747 -0.01,-0.0779 -0.005,-0.003 -0.01,-0.0315 -0.01,-0.0627 0,-0.0385 -0.005,-0.0606 -0.0146,-0.0688 -0.01,-0.008 -0.0146,-0.0303 -0.0146,-0.0688 0,-0.0312 -0.005,-0.0594 -0.01,-0.0627 -0.005,-0.003 -0.01,-0.0318 -0.01,-0.0633 0,-0.0315 -0.005,-0.06 -0.01,-0.0633 -0.005,-0.003 -0.01,-0.0213 -0.01,-0.0399 0,-0.0186 -0.006,-0.0435 -0.0137,-0.0554 -0.008,-0.0119 -0.0188,-0.0446 -0.0253,-0.0727 -0.006,-0.0282 -0.0159,-0.0536 -0.0206,-0.0566 -0.005,-0.003 -0.009,-0.0204 -0.009,-0.0387 0,-0.0183 -0.009,-0.0476 -0.0194,-0.0652 -0.0107,-0.0175 -0.0193,-0.0416 -0.0196,-0.0534 -1e-5,-0.0118 -0.0109,-0.0376 -0.0243,-0.0574 -0.0134,-0.0197 -0.0243,-0.046 -0.0243,-0.0583 0,-0.0123 -0.005,-0.0251 -0.01,-0.0284 -0.005,-0.003 -0.01,-0.0187 -0.01,-0.0341 0,-0.0154 -0.003,-0.0304 -0.008,-0.0333 -0.0109,-0.007 -0.0988,-0.18518 -0.0988,-0.20052 0,-0.006 -0.0149,-0.0409 -0.0329,-0.0766 -0.0372,-0.0732 -0.0645,-0.13311 -0.0645,-0.14155 0,-0.003 -0.0131,-0.0328 -0.0293,-0.066 -0.0161,-0.0332 -0.0292,-0.0677 -0.0292,-0.0767 0,-0.009 -0.0109,-0.0326 -0.0243,-0.0523 -0.0154,-0.0228 -0.0243,-0.0495 -0.0243,-0.0732 0,-0.0469 -0.0216,-0.0689 -0.0465,-0.047 -0.0226,0.0199 -0.14357,0.0795 -0.19222,0.0947 -0.0213,0.007 -0.0572,0.0226 -0.0795,0.0353 -0.0223,0.0128 -0.064,0.0281 -0.0925,0.0342 -0.0777,0.0164 -0.0861,0.023 -0.0861,0.0677 0,0.0256 -0.005,0.0409 -0.0146,0.0445 -0.0213,0.008 -0.0216,0.27136 0,0.28325 0.0114,0.006 0.0151,0.0455 0.0193,0.19773 0.0119,0.43356 0.0166,0.53113 0.0253,0.53995 0.005,0.005 0.009,0.0677 0.009,0.13916 0,0.10427 0.003,0.13473 0.0161,0.15441 0.0137,0.0208 0.0151,0.0435 0.0104,0.14988 -0.005,0.10542 -0.003,0.12626 0.009,0.13092 0.0114,0.005 0.0141,0.0235 0.0126,0.0939 -0.003,0.0556 0.003,0.0925 0.009,0.0994 0.006,0.006 0.0112,0.0443 0.0112,0.0914 0,0.0442 0.005,0.083 0.01,0.0863 0.005,0.003 0.01,0.0362 0.01,0.073 0,0.0369 0.005,0.0697 0.01,0.073 0.005,0.003 0.01,0.0513 0.01,0.11016 5e-5,0.0733 0.005,0.11239 0.0146,0.13203 0.008,0.0154 0.0146,0.0512 0.0146,0.0798 0,0.0286 0.005,0.0546 0.01,0.0579 0.005,0.003 0.01,0.0318 0.01,0.0633 0,0.0315 0.005,0.06 0.01,0.0633 0.005,0.003 0.01,0.0388 0.01,0.0788 0,0.0569 0.003,0.074 0.0151,0.0786 0.0124,0.005 0.0139,0.0157 0.009,0.0585 -0.005,0.0407 -0.003,0.0565 0.008,0.0693 0.0111,0.0123 0.0151,0.0392 0.0151,0.10324 10e-5,0.0478 0.005,0.0912 0.0107,0.0969 0.005,0.005 0.0104,0.0355 0.0104,0.0663 0,0.0308 0.005,0.0586 0.01,0.0619 0.005,0.003 0.01,0.0274 0.01,0.0536 0,0.0262 0.005,0.0502 0.01,0.0536 0.005,0.003 0.01,0.0353 0.0101,0.0712 2e-4,0.038 0.006,0.0753 0.0144,0.0895 0.008,0.0134 0.0141,0.0474 0.0141,0.0755 1.9e-4,0.0281 0.005,0.0512 0.0101,0.0512 0.005,0 0.01,0.0351 0.01,0.0857 0,0.0472 0.004,0.0899 0.009,0.095 0.005,0.005 0.0112,0.0333 0.0139,0.0628 0.003,0.0295 0.01,0.0799 0.0154,0.11202 0.005,0.0322 0.0149,0.0903 0.02,0.12932 0.005,0.0389 0.0139,0.0792 0.0193,0.0895 0.005,0.0102 0.01,0.0399 0.01,0.066 0,0.0261 0.004,0.0515 0.009,0.0567 0.005,0.005 0.0114,0.0487 0.0146,0.0969 0.0154,0.24811 0.0171,0.26327 0.032,0.27986 0.0109,0.0122 0.0137,0.0284 0.01,0.0585 -0.003,0.025 0,0.0571 0.008,0.0805 0.008,0.0214 0.0139,0.0661 0.0139,0.0993 9e-5,0.0332 0.005,0.063 0.01,0.0663 0.005,0.003 0.01,0.0305 0.01,0.0604 0,0.0299 0.004,0.0702 0.009,0.0895 0.005,0.0193 0.0141,0.0615 0.0204,0.0937 0.006,0.0322 0.0176,0.0681 0.025,0.08 0.008,0.0119 0.0137,0.0368 0.0137,0.0555 0,0.0186 0.005,0.0365 0.01,0.0399 0.005,0.003 0.01,0.0164 0.01,0.0292 0,0.0128 0.005,0.0259 0.01,0.0292 0.005,0.003 0.01,0.014 0.01,0.0238 0,0.0231 0.0876,0.19875 0.12422,0.24897 0.0587,0.0806 0.13347,0.15256 0.22234,0.21409 0.0505,0.0349 0.0947,0.0635 0.0983,0.0635 0.003,0 0.0146,0.008 0.0243,0.0162 0.01,0.009 0.026,0.021 0.0357,0.0268 0.041,0.0243 0.15737,0.11593 0.15737,0.12382 0,0.005 0.008,0.009 0.0164,0.009 0.0151,0 0.11691,0.0893 0.23198,0.20374 0.1043,0.10368 0.23562,0.27091 0.24462,0.31146 0.003,0.014 0.0139,0.0436 0.0238,0.0657 0.01,0.0222 0.021,0.0518 0.0246,0.0658 0.003,0.014 0.0104,0.028 0.0151,0.0309 0.0119,0.008 0.0109,0.1867 0,0.19415 -0.005,0.003 -0.01,0.0166 -0.01,0.0296 0,0.027 -0.0316,0.0467 -0.0925,0.0577 -0.0213,0.004 -0.0594,0.0157 -0.0842,0.0264 -0.0393,0.0168 -0.0625,0.019 -0.17533,0.0162 -0.11445,-0.003 -0.13357,-0.005 -0.15941,-0.0242 -0.0287,-0.0204 -0.0299,-0.0205 -0.0516,-0.003 -0.0121,0.01 -0.0418,0.0209 -0.0657,0.0245 -0.024,0.004 -0.0459,0.0104 -0.0488,0.0151 -0.003,0.005 -0.05,0.009 -0.1046,0.009 -0.0862,-3e-5 -0.10549,-0.003 -0.14664,-0.0241 -0.026,-0.0132 -0.0532,-0.0289 -0.0602,-0.0347 -0.0183,-0.0151 -0.0513,0.005 -0.059,0.0348 -0.003,0.0143 -0.0131,0.0241 -0.0233,0.0241 -0.009,0 -0.0226,0.006 -0.029,0.0141 -0.006,0.008 -0.0354,0.0275 -0.0643,0.0439 -0.0526,0.0296 -0.0528,0.0297 -0.20806,0.0297 -0.0931,0 -0.15785,-0.004 -0.16145,-0.01 z",
                "pathx":2.5,
                "pathy":4.5,
                } ,
            }
        if (me.data['creature'] == 'garou') {
//             let sex = me.data['sex']
            let idx = 0
            let form_width = 4
            let form_height = 5



//              me.character.append("svg:image")
//                   .attr("xlink:href", me.data['sex'] ? 'static/collector/forms/many_forms_male.svg' : 'static/collector/forms/many_forms_female.svg')
//                   .attr("x",me.stepx*3)
//                   .attr("y",me.stepy*29)
//                   .attr("width",me.stepx*19)


            _.forEach(FORMS,(v,k)=> {
                let ox =  (1.5+idx*(form_width+0.25))*me.stepx
                let oy = (basey)+me.stepy
                let form_group = me.character.append("g")
                    .attr('class',"form_group")
                    .attr("transform",`translate(${ox},${oy})`)
                let sil = form_group.append("g")
                    .attr("transform",`translate(${v.pathx*me.stepx},${v.pathy*me.stepy})scale(9)`)

                sil.append("path")
                    .attr("d", ["homid","glabro"].includes(k) ? (me.data["sex"] ? v.path: v.path_f) : v.path)
                    .style("fill","#C0C0C0")
                    .style("stroke","#FFFFFF")
                    .style("stroke-width","0.15pt")

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
                me.title(k, 2*me.stepx , 1*me.stepy, form_group);
                _.forEach(v.attributes_mods, (w,l) => {
                    let val = parseInt(w) + parseInt(me.data["attribute"+l])
                    if (val < 0){
                        val = 0
                    }
                    if (me.blank){
                        val = "__"
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
                    .style("font-size",(me.small_font_size*0.8)+"pt")
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

        if (me.blank){
            ["","","","","","","","","","","","","",""].forEach(function (d, idx) {
                let x = ox + me.stepx * 2;
                let y = oy + 0.5 * me.stepy * (idx);
                me.statText(d, "", x, y, "stat", `stat${idx}`, me.character);
            })
        }else{

        me.config['specialities'].forEach(function (d, idx) {
            let x = ox + me.stepx * 2;
            let y = oy + 0.5 * me.stepy * (idx);
            console.log(">>>>>>>",me.config["specialities"])
            if (me.blank) {
                me.statText(".", "", x, y, stat, stat + idx, me.character);
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
        }
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
                me.statText("", "", x, y, stat, stat + idx, me.character);
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
        if (me.blank){
            me.data['rid']  = "blank"
            //me.data.creature = "ADV_CREATURE"
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


