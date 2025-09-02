class AdventureSheet extends WawwodSheet {
    constructor(data, parent) {
        super(data, parent)
        this.disposition = "paysage"
        this.init();
    }

    init() {
        super.init()
        this.figure_width = 6;
        this.figure_height = 10;
        //this.setButtonsOrigin(1, 0)
        this.setButtonsOrigin(1, 0)
        this.stokedebris = "2 1"
        this.line_stroke = "#202020"
        this.base_font = "Khand"
        this.version = "0.8"
    }

    drawButtons() {
        this.addButton(2, 'Save PDF');
        this.addButton(3, 'Close');
    }

    drawPages(page = 0) {
        super.drawPages(page);
        // Sheet content
        let ox = 2
        let oy = 2
        this.lines = this.back.append('g');
        this.daddy = this.lines;
        let title_text = this.data.adventure.name.toUpperCase();
        this.decorationText(2, 1.75, 0, 'start', this.title_font, this.fat_font_size, this.draw_fill, this.draw_stroke, 1, title_text, this.back, 1);
        this.decorationText(34, 1.45, 0, 'end', this.base_font, this.medium_font_size, this.draw_fill, this.draw_stroke, 0.5, "What A Wonderful World Of Darkness - Adventure Sheet", this.back);
        let day = new Date().toString()
        this.decorationText(34, 1.75, 0, 'end', this.base_font, this.small_font_size, this.draw_fill, this.draw_stroke, 0.15, day, this.back, 1.0);
        this.decorationText(34, 23.0, 0, 'end', this.base_font, this.small_font_size, this.draw_fill, this.draw_stroke, 0.5, "Adventure Sheet v." + this.version + " - (c)2024 Red Fox Inc. Generated with WaWWoD", this.back)
        this.decorationText(34, 23.15, 0, 'end', this.base_font, this.small_font_size*0.5, this.draw_fill, this.draw_stroke, 0.15, "Red Fox Inc. is a subsidiary of Consolidex Worldwide. Don't think. Vote Trump.", this.back)

        this.characters = this.back.append('g')
            .attr('class', 'session_sheets')
            .attr('transform', "translate(" + (ox * this.stepx) + "," + (oy * this.stepy) + ")")
    }


    drawFigures(ox,oy) {
        let any = 0
        let me = this
        me.players = me.characters.selectAll('.sheet')
            .append('g')
            .data(me.data.players)
        console.debug(me.data.players)
        me.player = me.players.enter()
        me.player_in = me.player.append('g')
            .attr('class', 'sheet')
            .attr('id', (d) => {
                return d.rid
                })
            .attr('transform', (d) => {
                let x = ((d.idx) % 5) * (me.figure_width+0.5)  * me.stepx
                let y = Math.floor(d.idx / 5.0) * (me.figure_height+0.5) * me.stepy
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
                return me.stepy * me.figure_height*2
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
        let ly = lh+0.1
        let options = {"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy}
        options.proplabel = ""
        options.prop = "name"
        options.y = ly
        options.font_size = me.small_font_size
        this.sheetEntryO(options)
        ly += lh*2
        options.proplabel = "Player"
        options.prop = "player"
        options.y = ly
        me.sheetEntryO(options)
        ly += lh
        me.daddy.append('text')
            .attr('x', function (d) {
                return (ox+me.figure_width-0.25)*me.stepx;
            })
            .attr('y', function (d) {
                return (ly) * me.stepy;
            })
            .style('fill', me.user_fill)
            .style('stroke', me.user_stroke)
            .style('stroke-width', "0.25pt")
            .style('font-family', me.user_font)
            .style('text-anchor', "end")
            .style('font-size', me.tiny_font_size+'pt')
            .text(function (d) {
                let str = (d.sex ? "Male" : "Female" )  + " "+ d.breed_name + " " + d.auspice_name + " " + d.family
                return d.entrance
            })
        ly += lh
        options.proplabel = ""
        options.prop = "challenge"
        options.y = ly
        options.font_size = 1
        me.sheetEntryO(options)
        ly += lh*2
        options.y = ly
        options.proplabel = "STR"
        options.prop = "attribute0"
        me.shortSheetEntryO(options)
        options.xfunc = xfunc1
        options.proplabel = "CHA"
        options.prop = "attribute3"
        me.shortSheetEntryO(options)
        options.xfunc = xfunc2
        options.proplabel = "PER"
        options.prop = "attribute6"
        me.shortSheetEntryO(options)
        ly += lh
        options.y = ly
        options.xfunc = xfunc
        options.proplabel = "DEX"
        options.prop = "attribute1"
        me.shortSheetEntryO(options)
        options.xfunc = xfunc1
        options.proplabel = "MAN"
        options.prop = "attribute4"
        me.shortSheetEntryO(options)
        options.xfunc = xfunc2
        options.proplabel = "INT"
        options.prop = "attribute7"
        me.shortSheetEntryO(options)
        ly += lh
        options.y = ly
        options.xfunc = xfunc
        options.proplabel = "STA"
        options.prop = "attribute2"
        me.shortSheetEntryO(options)
        options.xfunc = xfunc1
        options.proplabel = "APP"
        options.prop = "attribute5"
        me.shortSheetEntryO(options)
        options.xfunc = xfunc2
        options.proplabel = "WIT"
        options.prop = "attribute8"
        me.shortSheetEntryO(options)
        ly += lh*2
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Rage", "prop":"rage", "condition":"creature,garou,=="})
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Bloodpool", "prop":"bloodpool", "condition":"creature,kindred,==","max":20})
        ly += lh
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Gnosis", "prop":"gnosis", "condition":"creature,garou,=="})
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Humanity", "prop":"humanity", "condition":"creature,kindred,==","max":10})
        ly += lh
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Willpower", "prop":"willpower", "max":10})
        ly += lh*2
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Conscience", "prop":"virtue0", "condition":"creature,kindred,==","max":5})
        ly += lh
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Self-Control", "prop":"virtue1", "condition":"creature,kindred,==","max":5})
        ly += lh
        me.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Courage", "prop":"virtue2", "condition":"creature,kindred,==","max":5})
        ly += lh

        let backgrounds = {}
        let max_ly = 0
        let bg = me.player_in.append('g')
            .attr("class","backgrounds")
            .attr("id",(d) => "backgrounds"+d.rid)
            .attr("custom", (d) => {
                backgrounds[d.rid] = d.background_notes
                console.debug(backgrounds)
                return "done"
             })
        _.forEach(backgrounds, (v,k) => {
            me.daddy = d3.select("#backgrounds"+k)
            let oldly = ly
            _.forEach(v, (w,l) => {
                ly += lh
                let words = w.item.split(" ")
                console.debug(words)
                let val = words[1].replace("[","").replace("]","")
                console.debug(val)
                me.dottedSheetEntryO({"xfunc":xfunc,"y":ly,"ox":ox,"oy":oy,"proplabel":words[0],"prop":parseInt(val),"font_size":0,"direct_value":"direct","direct_prop":"direct", "max":5})
            })
            if (ly >= max_ly){
                max_ly = ly
            }
            ly = oldly
        })

        ly = max_ly+lh

        let shc = {}
        let shorts = me.player_in.append('g')
            .attr("class","shortcuts")
            .attr("id",(d) => "shortcuts"+d.rid)
            .attr("custom", (d) => {
                shc[d.rid] = d.shc
                return "done"
             })
        _.forEach(shc, (v,k) => {
            let oldly = ly
            me.daddy = d3.select("#shortcuts"+k)
            _.forEach(v, (w,l) => {
                ly += lh
                if (l % 4 == 0){
                    ly += lh/2.0
                }
                let words = w.split("=")
//                 console.log("SHORTCUTS",words)
                let label = ""
                if (words.length == 3){
                    label = words[2]+ " ("+words[0]+")"
                }else{
                    label = words[0]
                }

                me.baseSheetEntryO({"xfunc":xfunc,"y":ly,"ox":ox,"oy":oy,"proplabel":label,"prop":words[1],"font_size":0,"direct_prop":"direct"})
            })
            ly = oldly
        })
        me.daddy = me.player_in
        me.drawHealthCompact(0,18)
    }

    baseSheetEntryO(options={}) {
        let me = this
        let p = this.defaulting(options)
        
        if (p.condition.length > 0){
            let words = p.condition.split(",")
            let param = words[0]
            let value = words[1]
            let test = words[2]
            let stop = true
            this.daddy.append("g")
                .attr("condition", (d) => {
                    if (d.hasOwnProperty(param)){
                        switch (test){
                            case "==":
                                if (d[param]==value){
                                    stop = false
                                }
                                break
                            case "!=":
                                if (d[param]!=value){
                                    stop = false
                                }
                                break
                            default:
                                stop = true
                                break
                        }
                    }
                })
            if (stop){
                return
            }
        }
        let font = this.user_font
        if (p.font_size == 0) {
            p.font_size = this.tiny_font_size
        }else if (p.font_size == 1){
            font = this.mono_font
            p.font_size = this.tiny_font_size*.90
        }
        this.daddy.append('text')
            .attr('x', function (d) {
                return p.xfunc(d['idx']) + p.offsetx * me.stepx;
            })
            .attr('y', function (d) {
                return (p.oy + p.y) * me.stepy;
            })
            .style('fill', this.draw_fill)
            .style('stroke', this.draw_stroke)
            .style('stroke-width', "0.25pt")
            .style('font-family', this.main_font)
            .style('font-size', p.font_size+'pt')
            .text(function (d) {
                return p.proplabel;
            })
        ;
        this.daddy.append('line')
            .attr('x1', function (d) {
                return p.xfunc(d['idx']) + p.offsetx * me.stepx;
            })
            .attr('y1', function (d) {
                return (p.oy + p.y) * me.stepy;
            })
            .attr('x2', function (d) {
                return p.xfunc(d['idx']) + p.offsetx2 * me.stepx;
            })
            .attr('y2', function (d) {
                return (p.oy + p.y) * me.stepy;
            })

            .style('fill', "none")
            .style('stroke', this.shadow_stroke)
            .style('stroke-width', "0.5pt")
            .style('stroke-dasharray', "2 6")


        if (p.with_dots){
            this.daddy.append('path')
                .attr("transform", (d)=> {
                    let a = p.xfunc(d['idx']) + (p.offsetx2-3) * this.stepx;
                    let b = (p.oy + p.y-0.1 ) * me.stepy;
                    return "translate("+a+","+b+")"
                })
                .style('fill', this.user_stroke)
                .style('stroke', this.user_fill)
                .attr("d",function (d) {
                    let result = d[p.prop]
                    if (p.direct_value != '') {
                        _.forEach(d[p.prop], function (e) {
                            if (e[p.direct_prop] == p.direct_value) {
                                result = e['value'];
                                return false;
                            }
                        })
                        if (p.direct_prop == "direct"){
                            result = parseInt(`${p.prop}`)
                        }
                    }
                    console.debug(result)
                    let path = ""
                    let diam = 6
                    let offx = 3
                    let max = p.max
                    let offy = 3
                    for(let s=0; s<p.max; s++){
                        let l = s%10
                        let k = Math.floor(s / 10.0)
                        let gx = l*(diam*2+offx)+k*3
                        let gy = k*(diam*0.5+offy)
                        path += `M ${gx} ${gy} m ${diam},0 a ${diam} ${diam} 0 1 0 0.01 0`
                        path += `M ${gx} ${gy} m ${diam},${diam*2} a ${diam-1} ${diam} 1 1 1 0.01 0`
                        if (result>s){
                             path += `M ${gx} ${gy+3} m ${diam},0 a ${diam-3}   ${diam-3} 0 1 0 0.01 0`
                        }
                    }
                    return path
                })

        }
        this.daddy.append('text')
            .attr('x', function (d) {
                return p.xfunc(d['idx']) + p.offsetx2 * me.stepx;
            })
            .attr('y', function (d) {
                return (p.oy + p.y) * me.stepy;
            })
            .style('fill', this.user_fill)
            .style('stroke', this.user_stroke)
            .style('stroke-width', "0.25pt")
            .style('text-anchor', 'end')
            .style('font-family', font)
            .style('font-size', p.font_size+'pt')
            .text(function (d) {
                let result = d[p.prop]
                if (p.direct_value != '') {
                    _.forEach(d[p.prop], function (e) {
                        if (e[p.direct_prop] == p.direct_value) {
                            result = e['value'];
                            return false;
                        }
                    })
                    if (p.direct_prop == "direct"){
                        result = parseInt(`${p.prop}`)
                    }
                }else{
                    if (p.direct_prop == "direct"){
                        return p.prop
                    }
                }
                return result
            })
    }

    // OPTION functions
    sheetEntryO(options={}) {
        let p = this.defaulting(options)
        p.offsetx = -0.125
        p.offsetx2 = 5.5
        this.baseSheetEntryO(p)
    }


    defaulting(options){
        let p = {
            xfunc : undefined,
            y : 0,
            ox : 0,
            oy : 0,
            proplabel : '',
            prop : '',
            font_size : 0,
            direct_prop : '',
            direct_value : '',
            offsetx : -0.125,
            offsetx2 : 5.5,
            with_dots : false,
            condition : "", 
            max : 0
        }
        for (const key of Object.keys(options)) {
            const val = options[key]
            p[key] = val
        }    
        return p
    }

    dottedSheetEntryO(options={}) {
        let p = this.defaulting(options)
        p.offsetx = -.125
        p.offsetx2 = 5.5
        p.with_dots = true
        this.baseSheetEntryO(p)
    }

    sheetStackedEntryO(options={}) {
        let p = this.defaulting(options)
        p.offsetx = -.125
        p.offsetx2 = 5.5
        this.baseSheetEntryO(p)
    }

    sheetEntryLeftO(options={}) {
        let p = this.defaulting(options)
        p.offsetx = -.125
        p.offsetx2 = 2.25
        this.baseSheetEntryO(p)
    }

    sheetEntryRightO(options={}) {
        let p = this.defaulting(options)
        p.offsetx = 2.75-.125
        p.offsetx2 = 5.5
        this.baseSheetEntryO(p)
    }

    shortSheetEntryO(options={}) {
        let p = this.defaulting(options)
        p.offsetx = 0.125
        p.offsetx2 = 1
        this.baseSheetEntryO(p)
    }

    drawGeneric(ox = 0, oy = 0) {
        this.generic = this.back.append('g')
            .attr('class', "generic");
        this.daddy = this.generic;
        this.drawRect(ox, oy, 7, 21, "transparent", this.shadow_stroke);
        this.adventure_entry = this.generic.selectAll('.adventure_entry')
            .append('g')
            .attr('transform', "translate(" + (ox * this.stepx) + "," + (6 * this.stepy) + ")")
            .data(this.adventure_data)
            .enter();
        let aei = this.adventure_entry.append('g')
            .attr('class', 'adventure_entry')
        aei.append('text')
            .attr('x', function (d, i) {
                return (ox+0.25) * this.stepx;
            })
            .attr('y', function (d, i) {
                return (oy + (i+1) / 2) * this.stepy;
            })
            .style('fill', this.draw_fill)
            .style('stroke', this.draw_stroke)
            .style('stroke-width', "0.5pt")
            .style('font-family', this.base_font)
            .style('font-size', this.small_font_size)
            .text(function (d) {
                return d["label"];
            });
        aei.append('text')
            .attr('x', function (d, i) {
                return (ox+7-0.25) * this.stepx;
            })
            .attr('y', function (d, i) {
                return (oy + (i+1)/2) * this.stepy;
            })
            .style('fill', this.user_fill)
            .style('stroke', this.user_stroke)
            .style('stroke-width', "0.5pt")
            .style('font-family', this.user_font)
            .style('font-size', this.medium_font_size)
            .style('text-anchor', 'end')
            .text(function (d) {
                return d['text'];
            })
    }

    perform(character_data) {
        this.data = character_data
        this.drawWatermark()
        this.drawFigures(0.5, 1.5)
        this.drawButtons()
        this.zoomActivate()
    }
}


