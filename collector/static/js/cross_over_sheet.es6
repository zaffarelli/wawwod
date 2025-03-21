class CrossOverSheet extends WawwodSheet {
    constructor(settings, parent) {
        super(settings, parent);
        this.init();
        this.release = "WW20-2025.03.06";
    }

    init() {
        super.init();
        let me = this;
        me.mark_overhead = false
        me.setButtonsOrigin(28, 0)
    }

    drawPages() {
        super.drawPages();
        let me = this
        let lines = me.back.append('g');
        if (me.page === 0) {
            // Vertical lines, left and right
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);

            // Horizontal lines, top and bottom
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);

            // Other lines, from top to bottom (shorter lines)
            me.midline(6);
            me.midline(8.5);
            me.midline(14.5);
            me.midline(21.5);
            me.midline(27);

            // Title
            let txt = me.sheet_type(me.data['creature']).toUpperCase();
            me.scenario = me.data['chronicle_name']
            // Creature
            me.decorationText(12, 2.75, 0, 'middle', me.logo_font, me.fat_font_size, "#FFFFFF", "#FFFFFF", 10, me.scenario, me.back, 0.75);
            me.decorationText(12, 2.75, 0, 'middle', me.logo_font, me.fat_font_size, "#9090907f", "#3030301f",1, me.scenario, me.back,1);
            // Chronicle
            me.decorationText(12, 1.8, 0, 'middle', me.creature_font, me.fat_font_size*1, "#FFFFFF", "#FFFFFF", 10, txt, me.back, 0.75);
            me.decorationText(12, 1.8, 0, 'middle', me.creature_font, me.fat_font_size*1, "#606060", "#C0C0C01f", 1, txt, me.back, 1);

            me.decorationText(3.25, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "What a Wonderful World of Darkness", me.back);
            //me.decorationText(2.5, 2.25, 0, 'middle', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "World of Darkness", me.back);
        } else if (me.page === 1) {
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);

            me.crossline(9.75, 4, 27);

            me.midline(28.5, 1, 23);

        } else if (me.page === 2) {
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);
            me.crossline(12, 4, 34);
        } else {
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);
            me.crossline(12, 4, 34);
            me.midline(23.5, 12.5, 22.5);
        }
        if (me.page > 0) {
            if (me.blank) {
                me.decorationText(1.5, 2.25, 0, 'start', me.user_font, me.medium_font_size, me.user_fill, me.user_stroke, 0.5, " (p." + (me.page + 1) + ")", me.back);
            } else {
                me.decorationText(1.5, 2.25, 0, 'start', me.user_font, me.medium_font_size, me.user_fill, me.user_stroke, 0.5, me.data["name"] + " (p." + (me.page + 1) + ")", me.back);
            }
        }
        //me.decorationText(22.5, 1.75, 0, 'end', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.pre_title, me.back);
        me.decorationText(22.5, 2.25, 0, 'end', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.post_title+" ("+me.pre_title+")", me.back);
        me.decorationText(1.5, 35.8, -16, 'start', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, me.guideline, me.back);
        me.decorationText(22.5, 35.7, -16, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, "WaWWoD Cross+Over Sheet "+me.release+" ©2025, Red Fox Studios.", me.back);
        me.decorationText(22.5, 35.9, -16, 'end', me.base_font, me.small_font_size*.5, me.draw_fill, me.draw_stroke, 0.5, "Red Fox Studios are a subsidiary of Pentex Inc.", me.back);
        if (me.blank) {
            me.decorationText(22.5, 34.8, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, 'Challenge: you make us laugh punk!', me.back);
        } else {
            me.decorationText(22.5, 34.8, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, 'Challenge:' + me.data['freebies'], me.back);
        }
    }

    drawButtons() {
        let me = this;
        me.addButton(1, 'NPCs');
        me.addButton(2, 'Save PDF');
        let page_button = 0
        while(page_button < me.config.labels.sheet.pages){
            me.addButton(3+page_button, `Page ${1+page_button}`);
            page_button += 1
        }
    }

    fillBackgroundNotes(oy) {
        let me = this;
        let box_spacing_y = 3.0;
        let background_note = me.character.append('g')
            .attr('class', 'background_notes')
        ;



        me.title('About Backgrounds', 5.5 * me.stepx, oy, background_note)
        oy += 0.5*me.stepy
        if (me.blank) {
            return;
        }

        let background_note_item = background_note.selectAll('background_note')
            .data(me.data['background_notes'])
        ;
        let background_note_in = background_note_item.enter()
            .append('g')
            .attr('class', 'background_note')
        ;
        background_note_in.append('rect')
            .attr("x", function (d) {
                return (1.75) * me.stepx;
            })
            .attr("y", function (d) {
                return oy + d['idx'] * box_spacing_y * me.stepy;
            })
            .attr("rx", "8pt")
            .attr("ry", "8pt")
            .attr("width", function (d) {
                return me.stepx * 7.5;
            })
            .attr("height", function (d) {
                return me.stepy * (box_spacing_y - 0.35);
            })
            .style("stroke", "#080808")
            .style("fill", "none")
        ;
        background_note_in.append('text')
            .attr("x", function (d) {
                return 2 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.30) * me.stepy;
            })
            .text(function (d) {
                let parts= d['item'].split("[")
                let title = parts[0]
                let value = me.as_dots(parseInt(parts[1].replaceAll("]","")))

                return value+" - "+title
            })
            .style('font-family', me.title_font)
            .style('font-size', me.medium_font_size + "px")
            .style('text-anchor', "start")
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", "0.05pt")
        ;
        let background_note_in_note = background_note_in.append('text')
            .attr("x", function (d) {
                return 2 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.75) * me.stepy;
            })
            .text(function (d) {
                return d['notes']
            })
            .style('font-family', me.user_font)
            .style('font-size', me.medium_font_size + "px")
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", "0.05pt");
        background_note_in_note.call(wrap, 7 * me.stepx, false,me.medium_font_size )
    }



    fillRiteNotes(oy) {
        let me = this;
        let box_spacing_y = 10.25;
        let rite_note = me.character.append('g')
            .attr('class', 'rite_notes')
        ;

        let ox = 1.0;

        me.title('About Rites', (ox+5.5) * me.stepx  , oy, rite_note)
        oy += 0.5*me.stepy
        if (me.blank) {
            return;
        }

        let rite_note_item = rite_note.selectAll('rite_note')
            .data(me.data['rite_notes'])
        ;
        let rite_note_in = rite_note_item.enter()
            .append('g')
            .attr('class', 'rite_note')
        ;
//         rite_note_in.append('rect')
//             .attr("x", function (d) {
//                 return (1.75) * me.stepx;
//             })
//             .attr("y", function (d) {
//                 return oy + d['idx'] * box_spacing_y * me.stepy;
//             })
//             .attr("rx", "8pt")
//             .attr("ry", "8pt")
//             .attr("width", function (d) {
//                 return me.stepx * 9.5;
//             })
//             .attr("height", function (d) {
//                 return me.stepy * (box_spacing_y - 0.35);
//             })
//             .style("stroke", "#080808")
//             .style("fill", "transparent")
//         ;
//         rite_note_in.append('text')
//             .attr("x", function (d) {
//                 return ox * me.stepx;
//             })
//             .attr('y', function (d) {
//                 return oy + (d['idx'] * box_spacing_y + 0.30) * me.stepy;
//             })
//             .text(function (d) {
//                 return d['item']
//             })
//             .style('font-family', me.title_font)
//             .style('font-size', me.medium_font_size + "px")
//             .style('text-anchor', "middle")
//             .style("fill", me.draw_fill)
//             .style("stroke", me.draw_stroke)
//             .style("stroke-width", "0.05pt")
//         ;
//         let rite_note_in_note = rite_note_in.append('text')
//             .attr("x", function (d) {
//                 return 1.5 * me.stepx;
//             })
//             .attr('y', function (d) {
//                 return oy + (d['idx'] * box_spacing_y + 0.75) * me.stepy;
//             })
//             .text(function (d) {
//                 return d['notes']
//             })
//
//             .style('font-family', me.user_font)
//             .style('font-size', me.medium_font_size + "px")
//             .style('text-anchor', "start")
//             .style("fill", me.user_fill)
//             .style("stroke", me.user_stroke)
//             .style("stroke-width", "0.05pt");

        //rite_note_in_note.call(wrap, 10 * me.stepx, false,me.medium_font_size )

        rite_note_in.append("g")
            .attr('id',(d) => 'rite_note_'+d['idx'] )
            .attr('fake',function (d) {
                console.log(d)
                let atx = (ox + 0.4) * me.stepx
                let spacing_y = 1
                if (d['idx']>0){
                    spacing_y = parseInt(d3.select('#rite_note_'+(d['idx']-1)).attr("fake"))+1
                }
                oy += (spacing_y) * me.medium_font_size*1.25
                let aty = oy
                me.daddy = rite_note_in
                console.log(d)
                let txt = d['notes'].split("µ")
                let details = ""//txt.shift().replace("--","")
                let atitle = me.as_dots(d['lvl'])+" "+d['item'].toUpperCase()
                let lines = me.appendText(atitle,txt,atx,aty,10 * me.stepx)
                return lines+1

            })



    }


    badfillTimeline(oy) {
        let me = this;
        let box_spacing_y = 4.0;
        let box_spacing_x = 12.0;
        let base_x = 10.25;
        let timeline = me.character.append('g')
            .attr('class', 'timeline')
        ;
        let current_font_size = me.medium_font_size;
        me.daddy = me.timeline;
        me.title('Timeline', (base_x + 6) * me.stepx, oy, timeline)
        oy += 0.5*me.stepy

        console.log(me.data['timeline'])

        let timeline_item = timeline.selectAll('timeline_event')
            .data(me.data['timeline'])
        ;

        let timeline_in = timeline_item.enter()
            .append('g')
            .attr('class', 'timeline_event')
            .attr('id', function(d) { return 'timeline_event_'+d['idx'] })

        ;
//         timeline_in.append('text')
//             .attr("x", function (d) {
//                 return (base_x + 0.05) * me.stepx;
//             })
//             .attr('y', function (d) {
//                 return oy + (d['idx'] * box_spacing_y + 0.5) * me.stepy;
//             })
//             .style('font-family', me.user_font)
//             .style('font-size', current_font_size+"px")
//             .style('text-anchor', "start")
//             .style("fill", me.user_fill)
//             .style("stroke", me.user_stroke)
//             .style("stroke-width", '0.05pt')
//             .text(function (d) {
//                 return d['date'] + ' - ' + d['item']
//             })


        let timeline_in_note = timeline_in.append('text')
            .attr('class', 'timeline_in_notes')
            .attr('id', function(d) { return 'timeline_in_notes_'+d['idx'] })
//             .attr('idx', function(d) {return d['idx']})
//             .attr('prev', function(d) {return 'timeline_in_notes_'+(d['idx']-1)})
//             .attr('y', function (d) {
// //                 if (d['idx']>0){
// //                     d3.select('timeline_in_notes_'+(d['idx']-1)).attr("y",oy + 0.85 * me.stepy + prev.attr("lines") * me.stepy)
// //                 }
//                 return oy + 0.85 * me.stepy ;//+ d['idx'] *box_spacing_y * me.stepy;
//             })
            .attr('x', function (d) {
                return (base_x + 0.2 )*me.stepx  ;
            })
//             .attr('y', function (d) {
//                 return oy + 0.85 * me.stepy + d['idx'] *me.stepy;
//             })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return (d['idx']+1) + ") "+d['date'] + ' - ' + d['item'] +" "+ d['notes'];
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", current_font_size)
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        me.superwrap(timeline_in_note, box_spacing_x * me.stepx, true, current_font_size);
//         let all_lines = 0;
//         d3.selectAll(".timeline_in_notes")
//              .attr('y', function (d) {
//                  let result = oy;
//                  if (d['idx']>0){
//                     let pl = d3.select('#timeline_in_notes_'+(d['idx']))
//                     if (pl){
//
//                         all_lines += parseInt(pl.attr("lines"));
//
//                         result = oy + all_lines * me.stepy *  .5
//                         console.log("previous lines",all_lines, result)
//                     }else{
//                         all_lines = 0;
//                         console.log("Not found", result)
//                     }
//                  }else{
//                      console.log("Bad ",result)
//                  }
//
//                  return result
//              })
    }



    fillTimeline(oy) {
        let me = this;
        let box_spacing_y = 4.0;
        let box_spacing_x = 12.75;
        let base_x = 9.75;
        let timeline = me.character.append('g')
            .attr('class', 'timeline')
        ;
        let current_font_size = me.medium_font_size;
        me.daddy = timeline;
        me.title('Timeline', (base_x + 6) * me.stepx, oy, timeline)
        oy += 0.5*me.stepy
        let timeline_item = timeline.selectAll('timeline_event')
            .data(me.data['timeline'])
        ;

        let timeline_in = timeline_item.enter()
            .append('g')
            .attr('class', 'timeline_event')
        ;
//         timeline_in.append('text')
//             .style('font-family', me.user_font)
//             .style('font-size', current_font_size+"px")
//             .style('text-anchor', "start")
//             .style("fill", me.user_fill)
//             .style("stroke", me.user_stroke)
//             .style("stroke-width", '0.05pt')
//             .text(function (d) {
//                 return d['date'] + ' - ' + d['item']
//             })
        let timeline_in_note = timeline_in.append('text')
            .attr('class', 'timeline_in_notes')
            .attr('id', function(d) { return 'timeline_in_notes_'+d['idx'] })
//             .attr('x', 0)
//             .attr('y', 0)
//             .attr('dx', 0)
//             .attr('dy', 0)
            .text(function (d) {
                return d.date + ' - ' + d.item + " µ " +d.notes
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", current_font_size)
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        //timeline_in_note.call(wrap, box_spacing_x * me.stepx, true, current_font_size);

        me.superwrap(timeline_in_note, box_spacing_x * me.stepx, true, current_font_size);
        let all_lines = 0;
        d3.selectAll(".timeline_event")
             .attr('transform', function (d) {
                 let result = oy;
                 if (d['idx']>0){
                    let previous_block = d3.select('#timeline_in_notes_'+(d['idx']-1))
                    if (previous_block){
                        let lines = parseInt(previous_block.attr("lines"))
                        all_lines += lines
                        result =  oy + all_lines*current_font_size*1.1;
                        console.log("previous lines",all_lines, result)
                    }else{
                        all_lines = 0;
                        console.log("Not found", result)
                    }
                 }else{
                     console.log("Bad ",result)
                 }

                 return "translate("+(base_x + 0.4) * me.stepx+","+result+")"
             })
    }

    fillOthers(oy) {
        let me = this;
        let box_spacing_y = 4.0;
        let box_spacing_x = 10;
        let base_x = 12;
        let others = me.character.append('g')
            .attr('class', 'others')
        ;
        let current_font_size = me.medium_font_size;
        me.daddy = others;
        me.title('Others', (base_x + 6) * me.stepx, oy, others)

        let others_item = others.selectAll('others_event')
            .data(me.data['others'])
        ;

        let others_in = others_item.enter()
            .append('g')
            .attr('class', 'others_event')
        ;
        others_in.append('text')
            .style('font-family', me.user_font)
            .style('font-size', current_font_size+"px")
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
            .text(function (d) {
                return d['date'] + ' - ' + d['item']
            })
        let others_in_note = others_in.append('text')
//             .attr('x', function (d) {
//                 return (base_x + 0.4) * me.stepx;
//             })
//             .attr('y', function (d) {
//                 return oy + 0.85 * me.stepy + d['idx'] *box_spacing_y * me.stepy;
//             })
            .attr('class', 'others_in_notes')
            .attr('id', function(d) { return 'others_in_notes_'+d['idx'] })
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return d.date + ' - ' + d.item + " µ " +d.notes
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", current_font_size)
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        //timeline_in_note.call(wrap, box_spacing_x * me.stepx, true, current_font_size);

        me.superwrap(others_in_note, box_spacing_x * me.stepx, true, current_font_size);
        let all_lines = 0;
        d3.selectAll(".others_event")
             .attr('transform', function (d) {
                 let result = oy;
                 if (d['idx']>0){
                    let previous_block = d3.select('#others_in_notes_'+(d['idx']-1))
                    if (previous_block){
                        let lines = parseInt(previous_block.attr("lines"))
                        all_lines += lines
                        result =  oy + all_lines*current_font_size*1.1;
                        console.log("previous lines",all_lines, result)
                    }else{
                        all_lines = 0;
                        console.log("Not found", result)
                    }
                 }else{
                     console.log("Bad ",result)
                 }

                 return "translate("+(base_x + 0.4) * me.stepx+","+result+")"
             })
    }



    legacy_fillTimeline(oy) {
        let me = this;
        let box_spacing_y = 4.0;
        let box_spacing_x = 12.0;
        let base_x = 10.25;
        let timeline = me.character.append('g')
            .attr('class', 'timeline')
        ;
        let current_font_size = me.medium_font_size;
        me.daddy = me.timeline;
        me.title('Timeline', (base_x + 6) * me.stepx, oy - 0.5 * me.stepy, timeline)

        let timeline_item = timeline.selectAll('timeline_event')
            .data(me.data['timeline'])
        ;

        let timeline_in = timeline_item.enter()
            .append('g')
            .attr('class', 'timeline_event')
        ;
        timeline_in.append('text')
            .attr("x", function (d) {
                return (base_x + 0.05) * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.5) * me.stepy;
            })
            .style('font-family', me.user_font)
            .style('font-size', current_font_size+"px")
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
            .text(function (d) {
                return d['date'] + ' - ' + d['item']
            })
        let timeline_in_note = timeline_in.append('text')
            .attr('x', function (d) {
                return (base_x + 0.4) * me.stepx;
            })
            .attr('y', function (d) {
                return oy + 0.85 * me.stepy + d['idx'] *box_spacing_y * me.stepy;
            })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return d['notes'];
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", current_font_size)
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        //timeline_in_note.call(wrap, box_spacing_x * me.stepx, true, current_font_size);
        me.superwrap(timeline_in_note, box_spacing_x * me.stepx, true, current_font_size);
        //console.log("Timelines line number=",global_last_lines)
    }


    fillDisciplinesNotes(oy, pos = '', pp = 0) {
        let me = this;
        let box_spacing_y = 8.0;
        let box_spacing_x = 10.0;
        let base_x = 12.25;
        let min = 0 + pp*10;
        let max = 4 + pp*10;
        let right_offset = 0;
        if (pos == 'left') {
            base_x = 1.5;

        }
        if (pos == 'right'){
            min += 5;
            max += 5;
            right_offset = 5;
        }
        let d_notes = me.character.append('g')
            .attr('class', 'notes_on_disciplines')
        ;
        me.daddy = me.d_notes;
        if (pos == '') {
            if (me.data['creature'] == "kindred"){
                me.title('About Disciplines', 17 * me.stepx, oy , d_notes)
            }else{
                me.title('Gifts of Gaia', 17.5 * me.stepx, oy , d_notes)
            }
        }
        oy += 0.5*me.stepy

        if (me.blank) {
            return;
        }

        let d_notes_item = d_notes.selectAll('discipline_event')
            .data(me.data['traits_notes'])
        let d_notes_in = d_notes_item.enter()
            .append('g')
            .attr('class', 'trait_notes')
//         d_notes_in.append('text')
//             .attr("x", function (d) {
//                 return (base_x + 0.05) * me.stepx;
//             })
//             .attr('y', function (d) {
//                 return oy + ((d['idx']-pp*10-right_offset) * box_spacing_y + 0.5) * me.stepy;
//             })
//             .text(function (d) {
//                 return me.as_dots(d['score']) + ' - ' + d['item'] + ' - ' + d['title']
//             })
//             .style('font-family', me.user_font)
//             .style('font-size', me.medium_font_size + "px")
//             .style('text-anchor', "start")
//             .style("fill", me.user_fill)
//             .style("stroke", me.user_stroke)
//             .attr("opacity", function (d) {
//                 if (((min ) <= d.idx) && ((max ) >= d.idx)) {
//                     return 1;
//                 }
//                 return 0;
//             })


        let d_notes_in_note = d_notes_in.append('g')
            .attr('id',(d) => 'gift_note_'+d['idx'] )
            .attr('fake',function (d) {
                console.log(d)
                let atx = (base_x + 0.4) * me.stepx
                let spacing_y = 1
                if (d['idx']>0){
                    spacing_y = parseInt(d3.select('#gift_note_'+(d['idx']-1)).attr("fake"))+1
                }
                oy += (spacing_y) * me.medium_font_size*1.25
                let aty = oy
                me.daddy = d_notes_in
                let txt = d['notes'].split("µ")
                let details = txt.shift().replace("--","")
                let atitle = me.as_dots(d['score']) + ' - ' + d['item'] + ' - ' + d['title'] + details
                let lines = me.appendText(atitle,txt,atx,aty,10 * me.stepx)
                return lines

            })
        ;


    }

    fillNatureNotes(oy) {
        let me = this;
        let n_notes = me.character.append('g')
            .attr('class', 'note_on_nature')
        ;
        me.daddy = me.n_notes;
        me.title('About Nature & Demeanor', 6.5 * me.stepx, oy, n_notes)

        oy += 0.5*me.stepy
        if (me.blank) {
            return;
        }

        let n_notes_item = n_notes.selectAll('nature_event')
            .data(me.data['nature_notes'])
        ;
        let n_notes_in = n_notes_item.enter()
            .append('g')
            .attr('class', 'nature_event')
        ;
        let n_notes_in_rect = n_notes_in.append('rect')
            .attr("x", function (d) {
                return (1.5) * me.stepx;
            })
            .attr("y", function (d) {
                return oy + d['idx'] * 3.5 * me.stepy;
            })
            .attr("rx", "8pt")
            .attr("ry", "8pt")
            .attr("width", function (d) {
                return me.stepx * 9;
            })
            .attr("height", function (d) {
                return me.stepy * 3.25;
            })
            .style("fill", "white")
            .style("stroke", "#808080")
        ;
        n_notes_in.append('text')
            .attr("x", function (d) {
                return 1.75 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * 3.5 + 0.5) * me.stepy;
            })
            .text(function (d) {
                return d['item']
            })
            .style('font-family', me.user_font)
            .style('font-size', me.small_font_size + "px")
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
        let n_notes_in_desc = n_notes_in.append('text')
            .attr('x', function (d) {
                return 1.9 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + 0.85 * me.stepy + d['idx'] * 3.5 * me.stepy;
            })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return "Description --- "+d['description'];
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.small_font_size + "px")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        n_notes_in_desc.call(wrap, 8.5 * me.stepx, true, me.small_font_size);
        let zy = oy+ 2.0 * me.stepy;
        let n_notes_in_note = n_notes_in.append('text')
            .attr('x', function (d) {
                return 1.9 * me.stepx;
            })
            .attr('y', function (d) {
                return zy + 0.85 * me.stepy + d['idx'] * 3.5 * me.stepy;
            })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                if (d['notes']) {
                    return "System --- " + d['notes'];
                }
                return "";
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.small_font_size + "px")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        n_notes_in_note.call(wrap, 8.5 * me.stepx, true, me.small_font_size);

    }

    fillMeritsFlawsNotes(oy) {
        let me = this;
        let box_spacing_y = 3.0;
        let mf_note = me.character.append('g')
            .attr('class', 'mf_notes')
        ;


        me.title('About Merits & Flaws', 6.5 * me.stepx, oy - 0.5 * me.stepy, mf_note)

        let mf_note_item = mf_note.selectAll('background_note')
            .data(me.data['meritsflaws_notes'])
        ;
        let mf_note_in = mf_note_item.enter()
            .append('g')
            .attr('class', 'mf_note')
        ;
//         mf_note_in.append('rect')
//             .attr("x", function (d) {
//                 return (1.75) * me.stepx;
//             })
//             .attr("y", function (d) {
//                 return oy + d['idx'] * box_spacing_y * me.stepy;
//             })
//             .attr("rx", "8pt")
//             .attr("ry", "8pt")
//             .attr("width", function (d) {
//                 return me.stepx * 9.5;
//             })
//             .attr("height", function (d) {
//                 return me.stepy * (box_spacing_y - 0.35);
//             })
//             .style("stroke", "#080808")
//             .style("fill", "transparent")
//         ;
        mf_note_in.append('text')
            .attr("x", function (d) {
                return 6.5 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.30) * me.stepy;
            })
            .text(function (d) {
                return d['item'] + " (" + d['type'] + ": " + me.as_dots(d['value']) + ")"
            })
            .style('font-family', me.title_font)
            .style('font-size', me.medium_font_size)
            .style('text-anchor', "middle")
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", "0.05pt")
        ;
        let mf_note_in_note = mf_note_in.append('text')
            .attr("x", function (d) {
                return 2 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.75) * me.stepy;
            })
            .text(function (d) {
                return d['notes']
            })
            .style('font-family', me.user_font)
            .style('font-size', me.medium_font_size)
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", "0.05pt");
        mf_note_in_note.call(wrap, 8.5 * me.stepx, true, me.medium_font_size);
    }

    as_dots(value) {
        let str = ""
        for (let i = 0; i < value; i++) {
            str += "●"
        }
        for (let i = value; i < 5; i++) {
            str += "○"
        }
        return str
    }

    fillCharacter() {
        let me = this;
        if (me.page === 0) {
            me.fillAttributes(4 * me.stepy);
            me.fillAbilities(9.0 * me.stepy);
            me.fillAdvantages(15.0 * me.stepy);
            me.fillOther(22 * me.stepy);
            me.fillSpecial(27.5 * me.stepy);

        } else if (me.page === 1) {
            me.fillBackgroundNotes(3 * me.stepy);
            me.fillTimeline(3 * me.stepy);
            me.fillNewManyForms(28 * me.stepy)
        } else if (me.page === 2) {
            me.fillNatureNotes(3 * me.stepy);
            me.fillMeritsFlawsNotes(12 * me.stepy);
            me.fillDisciplinesNotes(3 * me.stepy, '', 0);
        } else if (me.page === 3) {
            me.fillRiteNotes(3 * me.stepy)
            me.fillOthers(3 * me.stepy)
            me.fillExperience(24.0 * me.stepy)
        } else if (me.page > 3) {
//             me.fillDisciplinesNotes(4 * me.stepy, 'left', me.page - 1);
//             me.fillDisciplinesNotes(4 * me.stepy, 'right', me.page - 1);

        }
    }

    perform(character_data) {
        let me = this;
        me.data = character_data
        me.guideline = me.data['guideline']
        me.drawWatermark();
        if (me.data['condition'] == "DEAD") {
            me.decorationText(12, 16, 0, 'middle', me.logo_font, me.fat_font_size * 3, me.shadow_fill, me.shadow_stroke, 0.5, "DEAD", me.back, 0.25);
        }
        me.fillCharacter();
        me.drawButtons();
        me.zoomActivate();
    }

}

