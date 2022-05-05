class CrossOverSheet extends WawwodSheet {
    constructor(data, parent, collector) {
        super(data, parent, collector);
        this.init();
    }

    init() {
        super.init();
        let me = this;
    }

    drawPages() {
        super.drawPages();
        let me = this

        if (me.page === 0) {
            let lines = me.back.append('g');
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
            me.decorationText(12, 2.75, 0, 'middle', me.title_font, me.fat_font_size * 2, '#FFF', '#FFF', 10, txt, me.back, 1);
            me.decorationText(12, 1.8, 0, 'middle', me.logo_font, me.fat_font_size, "#fff", "#fff", 5, me.scenario, me.back, 0.75);

            me.decorationText(12, 1.8, 0, 'middle', me.logo_font, me.fat_font_size, me.shadow_fill, me.shadow_stroke, 0.5, me.scenario, me.back, 0.5);
            me.decorationText(12, 2.75, 0, 'middle', me.title_font, me.fat_font_size * 2, me.draw_fill, me.shadow_stroke, 1, txt, me.back, 0.75);

            //me.decorationText(12,1.8,0,'middle',me.logo_font,me.fat_font_size,"transparent",me.draw_stroke,0.5,me.scenario,me.back,0.5);

            me.decorationText(1.5, 35.8, -16, 'start', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.guideline, me.back);
            me.decorationText(22.5, 35.8, -16, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, "WaWWoD Cross+Over Sheet ©2021, Pentex Inc.", me.back);
            me.decorationText(2.5, 1.75, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "What a Wonderful", me.back);
            me.decorationText(2.5, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "World of Darkness", me.back);
            me.decorationText(21.5, 1.75, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.pre_title, me.back);
            me.decorationText(21.5, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.post_title, me.back);
            me.decorationText(22.5, 34.8, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, 'Challenge:' + me.data['freebies'], me.back);
        } else if (me.page === 1) {
            let lines = me.back.append('g');
            me.crossline(1, 2, 35);
            me.crossline(23, 2, 35);
            // Mid lines
            // me.midline(1.5, 5, 19);
            me.midline(2.5, 1, 23);
            me.midline(35, 1, 23);

            // me.midline(6);
            // me.midline(9);
            // me.midline(16);
            // me.midline(23);
            // me.midline(30);
            // Title
            // let txt = me.sheet_type(me.data['creature']).toUpperCase();
            // me.decorationText(12, 2.75, 0, 'middle', me.title_font, me.fat_font_size * 2, '#FFF', '#FFF', 10, txt, me.back, 1);
            // me.decorationText(12, 1.8, 0, 'middle', me.logo_font, me.fat_font_size, "#fff", "#fff", 5, me.scenario, me.back, 0.75);
            // me.decorationText(12, 1.8, 0, 'middle', me.logo_font, me.fat_font_size, me.shadow_fill, me.shadow_stroke, 0.5, me.scenario, me.back, 0.5);
            // me.decorationText(12, 2.75, 0, 'middle', me.title_font, me.fat_font_size * 2, me.draw_fill, me.shadow_stroke, 1, txt, me.back, 0.75);
            // me.decorationText(12,1.8,0,'middle',me.logo_font,me.fat_font_size,"transparent",me.draw_stroke,0.5,me.scenario,me.back,0.5);

            me.decorationText(1.5, 35.8, -16, 'start', me.base_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.guideline, me.back);
            me.decorationText(22.5, 35.8, -16, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, "WaWWoD Cross+Over Sheet ©2021, Pentex Inc.", me.back);
            me.decorationText(2.5, 1.75, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "What a Wonderful", me.back);
            me.decorationText(2.5, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, "World of Darkness", me.back);
            me.decorationText(21.5, 1.75, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.pre_title, me.back);
            me.decorationText(21.5, 2.25, 0, 'middle', me.title_font, me.medium_font_size, me.draw_fill, me.draw_stroke, 0.5, me.post_title, me.back);
            me.decorationText(22.5, 34.8, 0, 'end', me.base_font, me.small_font_size, me.draw_fill, me.draw_stroke, 0.5, 'Challenge:' + me.data['freebies'], me.back);
        }
    }

    drawButtons() {
        let me = this;
        me.addButton(0, 'Save SVG');
        me.addButton(1, 'Save PNG');
        me.addButton(2, 'Save PDF');
        me.addButton(3, 'Edit');
        me.addButton(4, 'Page 1');
        me.addButton(5, 'Page 2');
    }

    fillBackgroundNotes(oy) {
        let me = this;
        let background_note = me.character.append('g')
            .attr('class', 'background_notes')
        ;
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
                return oy + d['idx'] * 2.5 * me.stepy;
            })
            .attr("rx", "2mm")
            .attr("ry", "2mm")
            .attr("width", function (d) {
                return me.stepx * 7.5;
            })
            .attr("height", function (d) {
                return me.stepy * 2.0;
            })
            .style("stroke", "#E0E0E0")
            .style("fill", "transparent")
        ;
        background_note_in.append('text')
            .attr("x", function (d) {
                return 5.5 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * 2.5 - 0.05) * me.stepy;
            })
            .text(function (d) {
                return d['item']
            })
            .style('font-family', me.title_font)
            .style('font-size', me.medium_font_size)
            .style('text-anchor', "middle")
            .style("fill", me.draw_fill)
            .style("stroke", me.draw_stroke)
            .style("stroke-width", "0.05pt")
        ;
        let background_note_in_note = background_note_in.append('text')
            .attr("x",function(d){
                return 2*me.stepx;
            })
            .attr('y', function (d) {
                return oy+ (d['idx']*2.5+0.5)*me.stepy;
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
        background_note_in_note.call(wrap, 7*me.stepx)
    }


    fillTimeline(oy) {
        let me = this;
        let timeline = me.character.append('g')
            .attr('class', 'timeline')
        ;
        me.daddy = me.timeline;
        me.title('Timeline', 16 * me.stepx, oy - 0.5 * me.stepy, timeline)

        let timeline_item = timeline.selectAll('timeline_event')
            .data(me.data['timeline'])
        ;
        let timeline_in = timeline_item.enter()
            .append('g')
            .attr('class', 'timeline_event')
        ;
        let timeline_in_rect = timeline_in.append('rect')
            .attr("x", function (d) {
                return (10) * me.stepx;
            })
            .attr("y", function (d) {
                return oy + d['idx'] * 3 * me.stepy;
            })
            .attr("width", function (d) {
                return me.stepx * 12;
            })
            .attr("height", function (d) {
                return me.stepy * 2.5;
            })
            .style("fill", "#E0E0E0")
        ;
        timeline_in.append('text')
            .attr("x", function (d) {
                return 10.05 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + (d['idx'] * 3 + 0.5) * me.stepy;
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
                return 10.4 * me.stepx;
            })
            .attr('y', function (d) {
                return oy + 0.85*me.stepy + d['idx'] * 3 * me.stepy;
            })
            .attr('dx', 0)
            .attr('dy', 0)
            .text(function (d) {
                return d['notes'];
            })
            .style("text-anchor", 'start')
            .style("font-family", me.user_font)
            .style("font-size", me.small_font_size)
            .style("fill", me.user_fill)
            .style("stroke", me.user_stroke)
            .style("stroke-width", '0.05pt')
            ;
        timeline_in_note.call(wrap, 11*me.stepx, true);
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

