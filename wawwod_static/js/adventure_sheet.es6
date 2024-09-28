class AdventureSheet extends WawwodSheet {
    constructor(data, parent, collector) {
        super(data, parent, collector)
        this.disposition = "paysage"
        this.init();
//         this.adventure_data = [
//             {'label': '', 'text': data.adventure.epic_name},
//             {'label': '', 'text': ''},
//             {'label': 'Title', 'text': data.adventure.name.toUpperCase()},
//             {'label': '', 'text': ''},
//             {'label': 'Session Part', 'text': data.adventure.full_id},
//             {'label': 'Memorandum', 'text': data.adventure.abstract},
//             {'label': 'Ingame date', 'text': data.adventure.date_str},
//             {'label': '', 'text': ''},
//             {'label': 'Session Date', 'text': data.adventure.session_date_str},
//             {'label': 'Gamemaster', 'text': data.adventure.gamemaster},
//             {'label': '', 'text': ''},
//             {'label': 'Max XP Award', 'text': data.adventure.experience}
//         ]
    }

    init() {
        super.init();
        let me = this;
        me.figure_width = 5;
        me.figure_height = 10;
        me.setButtonsOrigin(-3, 2)
        me.stokedebris = "2 1"
        me.line_stroke = "#202020"
        me.base_font = "Khand"
        me.version = "0.5"
    }

    drawButtons() {
        let me = this;
        me.addButton(2, 'Save PDF');
        me.addButton(4, 'Recto');
        me.addButton(5, 'Verso');
        // me.addButton(3, 'Close');
    }

    drawPages(page = 0) {
        let me = this;
        super.drawPages(page);
        // Sheet content
        let ox = 8
        let oy = 2
        me.lines = me.back.append('g');
        me.daddy = me.lines;
        let title_text = me.data.adventure.name.toUpperCase();
        me.decorationText(ox/2, 1.0, 0, 'middle', me.title_font, me.fat_font_size, me.draw_fill, me.draw_stroke, 1, title_text, me.back, 1);
        me.decorationText(ox/2, 1.45, 0, 'middle', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "What A Wonderful World Of Darkness - Adventure Sheet", me.back);
        let day = new Date().toString()
        me.decorationText(ox/2, 1.75, 0, 'middle', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.15, day, me.back, 1.0);
        me.decorationText(35.5, 23.25, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, "Adventure Sheet v." + me.version + " - (c)2024 Red Fox Inc. Generated with WaWWoD", me.back)
        me.decorationText(35.5, 23.5, 0, 'end', me.base_font, me.small_font_size*0.5, me.draw_fill, me.draw_stroke, 0.15, "Red Fox Inc. is a subsidiary of Consolidex Worldwide. Tame the dogs. Subscribe Now!", me.back)

        me.characters = me.back.append('g')
            .attr('class', 'session_sheets')
            .attr('transform', "translate(" + (ox * me.stepx) + "," + (oy * me.stepy) + ")")
    }


    drawFigures(ox,oy) {
        let me = this;
        let any = 0
        me.players = me.characters.selectAll('.sheet')
            .append('g')
            .data(me.data.players)
        me.player = me.players.enter()
        me.player_in = me.player.append('g')
            .attr('class', 'sheet')
            .attr('id', (d) => {
                return d.rid
                })
            .attr('transform', (d) => {
                let x = ((d.idx+6) % 5) * (me.figure_width+0.5)  * me.stepx
                let y = Math.floor(d.idx / 5.0) * (me.figure_height+0.5) * me.stepy
                console.log(d.idx,x,y)
                let transform = `translate(${x},${y})`
                return transform
            })
        me.player_in.append('rect')
            .attr("rx", function (d) {
                return me.stepx * 0.25;
            })
            .attr("ry", function (d) {
                return me.stepy * 0.25;
            })
            .attr('width', function (d) {
                return me.stepx * me.figure_width
            })
            .attr('height', function (d) {
                return me.stepy * me.figure_height
            })
            .style('fill', "none")
            .style('stroke', me.line_stroke)
            .style('stroke-width', "0.5mm")
        ;

        me.daddy = me.player_in

        let xfunc = function (x) {
            return (ox + 0.25) * me.stepx;
        }

        let xfunc1 = function (x) {
            return (ox + 2.00) * me.stepx;
        }

        let xfunc2 = function (x) {
            return (ox + 3.75) * me.stepx;
        }

        ox = 0
        oy = 0

        let lh = 0.3
        let ly = lh
        me.sheetEntry(xfunc, ly, ox, oy, "", "name", me.small_font_size)
        ly += lh
        me.sheetEntry(xfunc, ly, ox, oy, "Player", "player")
        ly += lh
        me.sheetEntry(xfunc, ly, ox, oy, "Tribe", "family")
        ly += lh
        me.sheetEntry(xfunc, ly, ox, oy, "Auspice", "auspice")

        ly += lh*2
        me.shortSheetEntry(xfunc, ly, ox, oy, "STR", "attribute0")
        me.shortSheetEntry(xfunc1, ly, ox, oy, "CHA", "attribute3")
        me.shortSheetEntry(xfunc2, ly, ox, oy, "PER", "attribute6")

        ly += lh
        me.shortSheetEntry(xfunc, ly, ox, oy, "DEX", "attribute1")
        me.shortSheetEntry(xfunc1, ly, ox, oy, "MAN", "attribute4")
        me.shortSheetEntry(xfunc2, ly, ox, oy, "INT", "attribute7")

        ly += lh
        me.shortSheetEntry(xfunc, ly, ox, oy, "STA", "attribute2")
        me.shortSheetEntry(xfunc1, ly, ox, oy, "APP", "attribute5")
        me.shortSheetEntry(xfunc2, ly, ox, oy, "WIT", "attribute8")

        ly += lh*2
        me.dottedSheetEntry(xfunc, ly, ox, oy, "Rage", "rage")
        ly += lh
        me.dottedSheetEntry(xfunc, ly, ox, oy, "Gnosis", "gnosis")
        ly += lh
        me.dottedSheetEntry(xfunc, ly, ox, oy, "Willpower", "willpower")
        ly += lh
        let shc = {}
        let shorts = me.daddy.append('g')
            .attr("class","shortcuts")
            .attr("id",(d) => "shortcuts"+d.rid)
            .attr("custom", (d) => {
                console.log(d.shc)
                shc[d.rid] = d.shc
                return d.shc
             })

        _.forEach(shc, (v,k) => {
            let oldly = ly
            me.daddy = d3.selectAll("#shortcuts"+k)
            _.forEach(v, (w,l) => {
                ly += lh
                let words = w.split("=")
                console.log(words)
                me.baseSheetEntry(xfunc,ly, ox,oy,words[0],words[1],0,"direct","",0,4.5,false)
            })
            ly = oldly
        })
    }

    baseSheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', offsetx = 0, offsetx2 = 5, with_dots = false) {
        let me = this;
        if (font_size == 0) {
            font_size = me.tiny_font_size;
        }
        console.log(font_size);
        me.daddy.append('text')
            .attr('x', function (d) {
                return xfunc(d['idx']) + offsetx * me.stepx;
            })
            .attr('y', function (d) {
                return (oy + y) * me.stepy;
            })
            .style('fill', me.draw_fill)
            .style('stroke', me.draw_stroke)
            .style('stroke-width', "0.25pt")
            .style('font-family', me.base_font)
            .style('font-size', font_size+'pt')
            .text(function (d) {
                return proplabel;
            })
        ;
        if (with_dots){
            me.daddy.append('path')
                .attr("transform", (d)=> {
                    let a = xfunc(d['idx']) + (offsetx2-3) * me.stepx;
                    let b = (oy + y-0.1 ) * me.stepy;
                    return "translate("+a+","+b+")"
                })

                .style('fill', me.user_fill)
                .style('stroke', me.user_stroke)

                .attr("d",function (d) {
                    let result = d[prop]
                    if (direct_value != '') {
                        _.forEach(d[prop], function (e) {
                            if (e[direct_prop] == direct_value) {
                                result = e['value'];
                                return false;
                            }
                        })
                    }
                    let path = ""
                    let diam = 6
                    let offsetd = 3
                    for(let s=0; s<10; s++){
                        path += `M ${s*(diam*2+offsetd)} -${diam} m ${diam},0 a ${diam}   ${diam} 0 1 0 0.01 0`
                        path += `M ${s*(diam*2+offsetd)} -${diam} m ${diam},${diam*2} a ${diam-1} ${diam} 1 1 1 0.01 0`
                        if (result>s){
                            path += `M ${s*(diam*2+offsetd)} -${diam-4} m ${diam},0 a ${diam-4}   ${diam-4} 0 1 0 0.01 0`
                        }
                    }
                    return path
                })

        }
        me.daddy.append('text')
            .attr('x', function (d) {
                return xfunc(d['idx']) + offsetx2 * me.stepx;
            })
            .attr('y', function (d) {
                return (oy + y) * me.stepy;
            })
            .style('fill', me.user_fill)
            .style('stroke', me.user_stroke)
            .style('stroke-width', "0.25pt")
            .style('text-anchor', 'end')
            .style('font-family', me.user_font)
            .style('font-size', font_size+'pt')
            .text(function (d) {
                let result = d[prop]
                if (direct_value != '') {
                    _.forEach(d[prop], function (e) {
                        if (e[direct_prop] == direct_value) {
                            result = e['value'];
                            return false;
                        }
                    })
                }else{
                    if (direct_prop == "direct"){
                        return prop
                    }
                }
                return result
            })




    }

    sheetEntryLeft(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '') {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 2.25)
    }

    sheetEntryRight(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '') {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, 2.75 - 0.125, 4.5)
    }

    sheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '') {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 4.5)
    }

    dottedSheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '') {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 4.5,true)
    }

    shortSheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '') {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, 0, 1.0)
    }

    drawGeneric(ox = 0, oy = 0) {
        let me = this;
        me.generic = me.back.append('g')
            .attr('class', "generic");
        me.daddy = me.generic;
        me.drawRect(ox, oy, 7, 21, "transparent", me.shadow_stroke);
        me.adventure_entry = me.generic.selectAll('.adventure_entry')
            .append('g')
            .attr('transform', "translate(" + (ox * me.stepx) + "," + (6 * me.stepy) + ")")
            .data(me.adventure_data)
            .enter();
        let aei = me.adventure_entry.append('g')
            .attr('class', 'adventure_entry')
        aei.append('text')
            .attr('x', function (d, i) {
                return (ox+0.25) * me.stepx;
            })
            .attr('y', function (d, i) {
                return (oy + (i+1) / 2) * me.stepy;
            })
            .style('fill', me.draw_fill)
            .style('stroke', me.draw_stroke)
            .style('stroke-width', "0.5pt")
            .style('font-family', me.base_font)
            .style('font-size', me.small_font_size)
            .text(function (d) {
                return d["label"];
            });
        aei.append('text')
            .attr('x', function (d, i) {
                return (ox+7-0.25) * me.stepx;
            })
            .attr('y', function (d, i) {
                return (oy + (i+1)/2) * me.stepy;
            })
            .style('fill', me.user_fill)
            .style('stroke', me.user_stroke)
            .style('stroke-width', "0.5pt")
            .style('font-family', me.user_font)
            .style('font-size', me.medium_font_size)
            .style('text-anchor', 'end')
            .text(function (d) {
                return d['text'];
            })

        ;


    }


    perform(character_data) {
        let me = this
        me.data = character_data
        console.log(me.data)
        me.drawWatermark()
        me.drawFigures(0.5, 1.5)
        me.drawButtons()
        me.zoomActivate()
    }


}


