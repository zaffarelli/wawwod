class AdventureSheet extends WawwodSheet {
    constructor(data, parent) {
        super(data, parent)
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
        me.figure_width = 6;
        me.figure_height = 10;
        //me.setButtonsOrigin(1, 0)
        me.setButtonsOrigin(1, 0)
        me.stokedebris = "2 1"
        me.line_stroke = "#202020"
        me.base_font = "Khand"
        me.version = "0.7"
    }

    drawButtons() {
        let me = this;
        me.addButton(2, 'Save PDF');
        //me.addButton(4, 'Recto');
//         me.addButton(5, 'Verso');
        // me.addButton(3, 'Close');
    }

    drawPages(page = 0) {
        let me = this;
        super.drawPages(page);
        // Sheet content
        let ox = 2
        let oy = 2
        me.lines = me.back.append('g');
        me.daddy = me.lines;
        let title_text = me.data.adventure.name.toUpperCase();
        me.decorationText(2, 1.75, 0, 'start', me.title_font, me.fat_font_size, me.draw_fill, me.draw_stroke, 1, title_text, me.back, 1);
        me.decorationText(34, 1.45, 0, 'end', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "What A Wonderful World Of Darkness - Adventure Sheet", me.back);
        let day = new Date().toString()
        me.decorationText(34, 1.75, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.15, day, me.back, 1.0);
        me.decorationText(34, 23.0, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, "Adventure Sheet v." + me.version + " - (c)2024 Red Fox Inc. Generated with WaWWoD", me.back)
        me.decorationText(34, 23.15, 0, 'end', me.base_font, me.small_font_size*0.5, me.draw_fill, me.draw_stroke, 0.15, "Red Fox Inc. is a subsidiary of Consolidex Worldwide. Don't think. Vote Trump.", me.back)

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
        me.sheetEntry(xfunc, ly, ox, oy, "", "name", me.small_font_size)
        ly += lh*2
        me.sheetEntry(xfunc, ly, ox, oy, "Player", "player")
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
        ;
//         me.sheetEntry(xfunc, ly, ox, oy, "", "family")
//         me.sheetEntry(xfunc, ly, ox, oy, "", "auspice_name")
//         me.sheetEntry(xfunc, ly, ox, oy, "", "breed_name")
        ly += lh
//         ly += lh
//         ly += lh
        me.sheetEntry(xfunc, ly, ox, oy, "", "challenge")
//         ly += lh
//         me.sheetEntry(xfunc, ly, ox, oy, "Challenge", "freebies")

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
        this.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Rage", "prop":"rage", "condition":"creature,garou,=="})
        this.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Bloodpool", "prop":"bloodpool", "condition":"creature,kindred,==","max":20})
        ly += lh
        this.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Gnosis", "prop":"gnosis", "condition":"creature,garou,=="})
        this.dottedSheetEntryO({"xfunc": xfunc, "y":ly, "ox":ox, "oy":oy, "proplabel":"Humanity", "prop":"humanity", "condition":"creature,kindred,==","max":10})

        ly += lh
        me.dottedSheetEntry(xfunc, ly, ox, oy, "Willpower", "willpower")
        ly += lh
        let shc = {}
        let shorts = me.daddy.append('g')
            .attr("class","shortcuts")
            .attr("id",(d) => "shortcuts"+d.rid)
            .attr("custom", (d) => {
                console.log("CUSTOM",d.shc)
                shc[d.rid] = d.shc
                return d.shc
             })

        _.forEach(shc, (v,k) => {
            let oldly = ly
            me.daddy = d3.selectAll("#shortcuts"+k)
            _.forEach(v, (w,l) => {
                ly += lh
                if (l % 4 == 0){
                    ly += lh/2.0
                }
                let words = w.split("=")
                console.log("SHORTCUTS",words)
                let label = ""
                if (words.length == 3){
                    label = words[2]+ " ("+words[0]+")"
                }else{
                    label = words[0]
                }

                me.baseSheetEntry(xfunc,ly, ox,oy,label,words[1],0,"direct","",0,5.5,false)
            })
            ly = oldly
        })

        me.daddy = me.player_ins
        me.drawHealthCompact(0,18)


    }

    baseSheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', offsetx = 0, offsetx2 = 5, with_dots = false, condition="") {

        let me = this
        if (condition.length > 0){
            let words = condition.split(",")
            let param = words[0]
            let value = words[1]
            let test = words[2]
            let stop = true
            me.daddy.append("g")
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
        me.daddy.append('line')
            .attr('x1', function (d) {
                return xfunc(d['idx']) + offsetx * me.stepx;
            })
            .attr('y1', function (d) {
                return (oy + y) * me.stepy;
            })
            .attr('x2', function (d) {
                return xfunc(d['idx']) + offsetx2 * me.stepx;
            })
            .attr('y2', function (d) {
                return (oy + y) * me.stepy;
            })

            .style('fill', "none")
            .style('stroke', me.shadow_stroke)
            .style('stroke-width', "0.5pt")
            .style('stroke-dasharray', "2 6")


        if (with_dots){
            me.daddy.append('path')
                .attr("transform", (d)=> {
                    let a = xfunc(d['idx']) + (offsetx2-3) * me.stepx;
                    let b = (oy + y-0.1 ) * me.stepy;
                    return "translate("+a+","+b+")"
                })

                .style('fill', me.user_stroke)
                .style('stroke', me.user_fill)

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
                            path += `M ${s*(diam*2+offsetd)} -${diam-3} m ${diam},0 a ${diam-3}   ${diam-3} 0 1 0 0.01 0`
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


    baseSheetEntryO(options={}) {
        let p = {
            xfunc : undefined,
            y : undefined,
            ox : 0,
            oy : 0,
            proplabel : undefined,
            prop : '',
            font_size : 0,
            direct_prop : '',
            direct_value : '',
            offsetx : 0,
            offsetx2 : 5,
            with_dots : false,
            condition : "",
            max: 0
        }
        for (const key of Object.keys(options)) {
            const val = options[key]
            p[key] = val
        }


        let me = this
        if (p.condition.length > 0){
            let words = p.condition.split(",")
            let param = words[0]
            let value = words[1]
            let test = words[2]
            let stop = true
            me.daddy.append("g")
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
        if (p.font_size == 0) {
            p.font_size = me.tiny_font_size;
        }
        console.log(p.font_size);
        me.daddy.append('text')
            .attr('x', function (d) {
                return p.xfunc(d['idx']) + p.offsetx * me.stepx;
            })
            .attr('y', function (d) {
                return (p.oy + p.y) * me.stepy;
            })
            .style('fill', me.draw_fill)
            .style('stroke', me.draw_stroke)
            .style('stroke-width', "0.25pt")
            .style('font-family', me.base_font)
            .style('font-size', p.font_size+'pt')
            .text(function (d) {
                return p.proplabel;
            })
        ;
        me.daddy.append('line')
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
            .style('stroke', me.shadow_stroke)
            .style('stroke-width', "0.5pt")
            .style('stroke-dasharray', "2 6")


        if (p.with_dots){
            me.daddy.append('path')
                .attr("transform", (d)=> {
                    let a = p.xfunc(d['idx']) + (p.offsetx2-3) * me.stepx;
                    let b = (p.oy + p.y-0.1 ) * me.stepy;
                    return "translate("+a+","+b+")"
                })

                .style('fill', me.user_stroke)
                .style('stroke', me.user_fill)

                .attr("d",function (d) {
                    let result = d[p.prop]
                    if (p.direct_value != '') {
                        _.forEach(d[p.prop], function (e) {
                            if (e[p.direct_prop] == p.direct_value) {
                                result = e['value'];
                                return false;
                            }
                        })
                    }
                    let path = ""
                    let diam = 6
                    let offsetd = 3
                    let max = 10
                    if (p.hasOwnProperty("max")){
                        if (p.max == 0){
                            max = 20
                        }else{
                            max = p.max
                        }
                    }
                    let hh = 5
                    for(let s=0; s<max; s++){
                        let l = s%10
                        let k = Math.round(l / 10.0)
                        path += `M ${l*(diam*2+offsetd)} -${diam+(hh*k)} m ${diam},0 a ${diam}   ${diam} 0 1 0 0.01 0`
//                         path += `M ${l*(diam*2+offsetd)} -${diam+(hh*k)} m ${diam},${diam*2} a ${diam-1} ${diam} 1 1 1 0.01 0`
//                         if (result>s){
//                             path += `M ${l*(diam*2+offsetd)} -${diam-3+(hh*k)} m ${diam},0 a ${diam-3}   ${diam-3} 0 1 0 0.01 0`
//                         }
                    }
                    return path
                })

        }
        me.daddy.append('text')
            .attr('x', function (d) {
                return p.xfunc(d['idx']) + p.offsetx2 * me.stepx;
            })
            .attr('y', function (d) {
                return (p.oy + p.y) * me.stepy;
            })
            .style('fill', me.user_fill)
            .style('stroke', me.user_stroke)
            .style('stroke-width', "0.25pt")
            .style('text-anchor', 'end')
            .style('font-family', me.user_font)
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
                }else{
                    if (p.direct_prop == "direct"){
                        return p.prop
                    }
                }
                return result
            })




    }



    sheetStackedEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', condition = "") {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 5.5,condition)
    }



    sheetEntryLeft(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', condition = "") {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 2.25)
    }

    sheetEntryRight(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', condition = "") {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, 2.75 - 0.125, 5.5, condition)
    }

    sheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', condition = "") {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 5.5, condition)
    }

    dottedSheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', condition = "") {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, -0.125, 5.5,true, condition)
    }

    dottedSheetEntryO(options={}) {
        let p = {
            xfunc : undefined,
            y : undefined,
            ox : 0,
            oy : 0,
            proplabel : undefined,
            prop : '',
            font_size : 0,
            direct_prop : '',
            direct_value : '',
            offsetx : -.125,
            offsetx2 : 5.5,
            with_dots : true,
            condition : ""
        }
        for (const key of Object.keys(options)) {
            const val = options[key]
            p[key] = val
        }
        this.baseSheetEntryO(p)
    }

    shortSheetEntry(xfunc, y, ox = 0, oy = 0, proplabel, prop = '', font_size = 0, direct_prop = '', direct_value = '', condition = "") {
        let me = this
        me.baseSheetEntry(xfunc, y, ox, oy, proplabel, prop, font_size, direct_prop, direct_value, 0, 1.0, condition)
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


