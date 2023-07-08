class CrossOverSheet extends WawwodSheet {
    constructor(data, parent, collector) {
        super(data, parent, collector);
        this.init();
        this.release = "18.06";
    }

    init() {
        super.init();
        let me = this;
    }

    drawPages() {
        super.drawPages();
        let me = this
        let lines = me.back.append('g');
        if (me.page === 0) {
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);
            // Mid lines
            me.midline(1.5, 5, 19);
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);

            me.midline(6);
            me.midline(9);
            me.midline(16);
            me.midline(23);
            me.midline(30);
            // Title
            let txt = me.sheet_type(me.data['creature']).toUpperCase();
            me.decorationText(12, 2.75, 0, 'middle', me.logo_font, me.fat_font_size * 2, '#FFF', '#FFF', 10, txt, me.back, 1);
            me.decorationText(12, 1.8, 0, 'middle', me.title_font, me.fat_font_size, "#fff", "#fff", 5, me.scenario, me.back, 0.75);

            me.decorationText(12, 1.8, 0, 'middle', me.title_font, me.fat_font_size, me.draw_fill, me.shadow_stroke, 0.5, me.scenario, me.back, 0.5);
            me.decorationText(12, 2.75, 0, 'middle', me.logo_font, me.fat_font_size * 2, me.shadow_fill, me.shadow_stroke, 1, txt, me.back, 0.75);

            me.decorationText(2.5, 1.75, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "What a Wonderful", me.back);
            me.decorationText(2.5, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "World of Darkness", me.back);
        } else if (me.page === 1) {
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);

            me.crossline(9.75, 4, 34);

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
        }
        if (me.page > 0) {
            if (me.blank) {
                me.decorationText(1.5, 2.25, 0, 'start', me.user_font, me.medium_font_size, me.user_fill, me.user_stroke, 0.5, " (p." + (me.page + 1) + ")", me.back);
            } else {
                me.decorationText(1.5, 2.25, 0, 'start', me.user_font, me.medium_font_size, me.user_fill, me.user_stroke, 0.5, me.data["name"] + " (p." + (me.page + 1) + ")", me.back);
            }
        }
        me.decorationText(21.5, 1.75, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.pre_title, me.back);
        me.decorationText(21.5, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.post_title, me.back);
        me.decorationText(1.5, 35.8, -16, 'start', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, me.guideline, me.back);
        me.decorationText(22.5, 35.8, -16, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, "WaWWoD Cross+Over Sheet "+me.release+" ©2023, Pentex Inc.", me.back);
        if (me.blank) {
            me.decorationText(22.5, 34.8, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, 'Challenge: you make us laugh punk!', me.back);
        } else {

            me.decorationText(22.5, 34.8, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, 'Challenge:' + me.data['freebies'], me.back);
        }
    }

    drawButtons() {
        let me = this;
        // me.addButton(0, 'Save SVG');
        // me.addButton(1, 'Save PNG');
        me.addButton(2, 'Save PDF');
        // me.addButton(3, 'Edit');
        me.addButton(4, 'Page 1');
        me.addButton(5, 'Page 2');
        me.addButton(6, 'Page 3');
        me.addButton(7, 'Page 4');
        // me.addButton(8, 'Page 5');
        // me.addButton(9, 'Page 6');
        // me.addButton(10, 'Page 7');
    }

    fillBackgroundNotes(oy) {
        let me = this;
        let box_spacing_y = 3.0;
        let background_note = me.character.append('g')
            .attr('class', 'background_notes')
        ;



        me.title('About Backgrounds', 5.5 * me.stepx, oy - 0.5 * me.stepy, background_note)

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
            .style("fill", "transparent")
        ;
        background_note_in.append('text')
            .attr("x", function (d) {
                return 5.5 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.30) * me.stepy;
            })
            .text(function (d) {
                return d['item']
            })
            .style('font-family', me.title_font)
            .style('font-size', me.medium_font_size + "px")
            .style('text-anchor', "middle")
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
            .style('font-size', me.small_font_size + "px")
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", "0.05pt");
        background_note_in_note.call(wrap, 7 * me.stepx, false,me.small_font_size )
    }


    fillTimeline(oy) {
        let me = this;
        let box_spacing_y = 3.0;
        let box_spacing_x = 11.0;
        let base_x = 10.25;
        let timeline = me.character.append('g')
            .attr('class', 'timeline')
        ;
        me.daddy = me.timeline;
        me.title('Timeline', (base_x + 6) * me.stepx, oy - 0.5 * me.stepy, timeline)

        let timeline_item = timeline.selectAll('timeline_event')
            .data(me.data['timeline'])
        ;
        let timeline_in = timeline_item.enter()
            .append('g')
            .attr('class', 'timeline_event')
        ;
        let timeline_in_rect = timeline_in.append('rect')
            .attr("x", function (d) {
                return (base_x) * me.stepx;
            })
            .attr("y", function (d) {
                return oy + d['idx'] * box_spacing_y * me.stepy;
            })
            .attr("width", function (d) {
                return me.stepx * (base_x + 2);
            })
            .attr("height", function (d) {
                return me.stepy * (box_spacing_y - 0.25);
            })
            .attr("rx", "8pt")
            .attr("ry", "8pt")
            .style("fill", "white")
            .style("stroke", "#808080")
        ;
        timeline_in.append('text')
            .attr("x", function (d) {
                return (base_x + 0.05) * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * box_spacing_y + 0.5) * me.stepy;
            })
            .text(function (d) {
                return d['date'] + ' - ' + d['item']
            })
            .style('font-family', me.user_font)
            .style('font-size', me.medium_font_size)
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
        let timeline_in_note = timeline_in.append('text')
            .attr('x', function (d) {
                return (base_x + 0.4) * me.stepx;
            })
            .attr('y', function (d) {
                return oy + 0.85 * me.stepy + d['idx'] * 3 * me.stepy;
            })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return d['notes'];
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.medium_font_size)
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
        ;
        timeline_in_note.call(wrap, box_spacing_x * me.stepx, true, me.medium_font_size);
    }

    fillDisciplinesNotes(oy, pos = '', pp = 0) {
        let me = this;
        let box_spacing_y = 6.0;
        let box_spacing_x = 10.0;
        let base_x = 12.5;
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
            me.title('About Disciplines', 17 * me.stepx, oy - 0.5 * me.stepy, d_notes)
        }


        if (me.blank) {
            return;
        }

        let d_notes_item = d_notes.selectAll('discipline_event')
            .data(me.data['disciplines_notes'])
        ;
        let d_notes_in = d_notes_item.enter()
            .append('g')
            .attr('class', 'discipline_event')
        ;
        let d_notes_in_rect = d_notes_in.append('rect')
            .attr("x", function (d) {
                return (base_x) * me.stepx;
            })
            .attr("y", function (d) {
                return oy + (d['idx']-pp*10-right_offset) * box_spacing_y * me.stepy;
            })
            .attr("width", function (d) {
                return me.stepx * box_spacing_x;
            })
            .attr("height", function (d) {
                return me.stepy * (box_spacing_y - 0.25);
            })
            .attr("rx", "8pt")
            .attr("ry", "8pt")
            .style("fill", "white")
            .style("stroke", "#808080")
            .attr("opacity", function (d) {
                if (((min ) <= d.idx) && ((max ) >= d.idx)) {
                    return 1;
                }
                return 0;
            })
        ;
        d_notes_in.append('text')
            .attr("x", function (d) {
                return (base_x + 0.05) * me.stepx;
            })
            .attr('y', function (d) {
                return oy + ((d['idx']-pp*10-right_offset) * box_spacing_y + 0.5) * me.stepy;
            })
            .text(function (d) {
                return me.as_dots(d['score']) + ' - ' + d['item'] + ' - ' + d['title']
            })
            .style('font-family', me.user_font)
            .style('font-size', me.small_font_size + "px")
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .attr("opacity", function (d) {
                if (((min ) <= d.idx) && ((max ) >= d.idx)) {
                    return 1;
                }
                return 0;
            })
        let d_notes_in_note = d_notes_in.append('text')
            .attr('x', function (d) {
                return (base_x + 0.4) * me.stepx;
            })
            .attr('y', function (d) {
                return oy + 0.85 * me.stepy + (d['idx']-pp*10-right_offset) * box_spacing_y * me.stepy;
            })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return d['notes'];
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.small_font_size + "px")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
            .attr("opacity", function (d) {
                if (((min ) <= d.idx) && ((max ) >= d.idx)) {
                    return 1;
                }
                return 0;
            })
        ;
        d_notes_in_note.call(wrap, 9 * me.stepx, true, me.small_font_size);
    }

    fillNatureNotes(oy) {
        let me = this;
        let n_notes = me.character.append('g')
            .attr('class', 'not_on_nature')
        ;
        me.daddy = me.n_notes;
        me.title('About Nature & Demeanor', 6 * me.stepx, oy - 0.5 * me.stepy, n_notes)

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


        me.title('About Merits & Flaws', 5.5 * me.stepx, oy - 0.5 * me.stepy, mf_note)

        let mf_note_item = mf_note.selectAll('background_note')
            .data(me.data['meritsflaws_notes'])
        ;
        let mf_note_in = mf_note_item.enter()
            .append('g')
            .attr('class', 'mf_note')
        ;
        mf_note_in.append('rect')
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
            .style("fill", "transparent")
        ;
        mf_note_in.append('text')
            .attr("x", function (d) {
                return 5.5 * me.stepx;
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
            .style('font-size', me.small_font_size)
            .style('text-anchor', "start")
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", "0.05pt");
        mf_note_in_note.call(wrap, 7 * me.stepx)
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
            me.fillAbilities(9.5 * me.stepy);
            me.fillAdvantages(16.5 * me.stepy);
            me.fillOther(23.5 * me.stepy);
            me.fillSpecial(30.5 * me.stepy);
        } else if (me.page === 1) {
            me.fillBackgroundNotes(4 * me.stepy);
            me.fillTimeline(4 * me.stepy);
        } else if (me.page === 2) {
            me.fillNatureNotes(4 * me.stepy);
            me.fillMeritsFlawsNotes(12 * me.stepy);
            me.fillDisciplinesNotes(4 * me.stepy, '', 0);

        } else if (me.page > 2) {
            me.fillDisciplinesNotes(4 * me.stepy, 'left', me.page - 1);
            me.fillDisciplinesNotes(4 * me.stepy, 'right', me.page - 1);

        }
    }

    perform(character_data) {
        let me = this;
        me.data = character_data;
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

