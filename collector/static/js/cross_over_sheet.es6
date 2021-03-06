class CrossOverSheet{
    constructor(data,parent,collector) {
        let me = this;
        me.parent = parent;
        me.co = collector;
        me.config = data;
        me.init();
    }

    decorationText(x,y,d=0,a='middle',f,s,b,c,w,t,v,o=1){
        let me = this;
        v.append('text')
            .attr("x",me.stepx*x)
            .attr("y",me.stepy*y)
            .attr("dy",d)
            .style("text-anchor",a)
            .style("font-family",f)
            .style("font-size",s+'px')
            .style("fill",b)
            .style("stroke",c)
            .style("stroke-width",w+'pt')
            .text(t)
            .attr('opacity',o);
    }

    sheet_type(str){
        let res = "";
        switch(str){
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
                break;
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



    init(){
        let me = this;
        me.debug = true;
        me.width = parseInt($(me.parent).css("width"),10) * 0.75;
        me.height = me.width *1.4;
        me.w = 1.25 * me.width;
        me.h = 1.25 * me.height;
        me.stepx = me.width/24;
        me.stepy = me.height/36;
        me.small_font_size = 1.3*me.stepy / 5;
        me.medium_font_size = 2*me.stepy / 5;
        me.big_font_size = 2.5*me.stepy / 5;
        me.fat_font_size = 8*me.stepy / 5;
        me.margin = [0,0,0,0];
        me.dot_radius = me.stepx/8;
        me.stat_length = 150;
        me.stat_max = 5;
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
        //me.logo_font = 'Reggae One';
        me.base_font = 'Philosopher';
        me.x = d3.scaleLinear().domain([0, me.width]).range([0, me.width]);
        me.y = d3.scaleLinear().domain([0, me.height]).range([0, me.height]);
        me.pre_title = me.config['pre_title'];
        me.scenario = me.config['scenario'];
        me.post_title = me.config['post_title'];
        me.health_levels = ['Bruised/X','Hurt/-1','Injured/-1','Wounded/-2','Mauled/-2','Crippled/-5','Incapacitated/X'];
    }

    midline(y,startx=2,stopx=22){
        let me = this;
        me.back.append('line')
            .attr('x1',me.stepx*startx)
            .attr('x2',me.stepx*stopx)
            .attr('y1',me.stepy*y)
            .attr('y2',me.stepy*y)
            .style('fill','transparent')
            .style('stroke',me.draw_stroke)
            .style('stroke-width','3pt')
            .attr('marker-end', "url(#arrowhead)")
            .attr('marker-start', "url(#arrowhead)")
            ;
    }

    crossline(x,starty=2,stopy=35){
        let me = this;
        me.back.append('line')
            .attr('x1',me.stepx*x)
            .attr('x2',me.stepx*x)
            .attr('y1',me.stepy*starty)
            .attr('y2',me.stepy*stopy)
            .style('fill','transparent')
            .style('stroke',me.draw_stroke)
            .style('stroke-width','3pt')
            .attr('marker-end', "url(#arrowhead)")
            .attr('marker-start', "url(#arrowhead)")
            ;
    }


    drawWatermark(){
        let me = this;
        d3.select(me.parent).selectAll("svg").remove();
        me.svg = d3.select(me.parent).append("svg")
            .attr("id", me.data['rid'])
            .attr("viewBox", "0 0 " + me.w + " " + me.h)
            .attr("width", me.width)
            .attr("height", me.height)
            .append("svg:g")
            .attr("transform", "translate(0,0)")
            // .call(d3.behavior.zoom().x(me.x).y(me.y).scaleExtent([2, 8]).on("zoom", function(e){
            //     })
            // )
        ;
        me.back = me.svg
            .append("g")
            .attr("class", "page")
            .attr("transform", "translate("+0*me.stepx+","+0*me.stepy+")")
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
            .attr('x',0)
            .attr('y',0)
            .attr('width',me.width)
            .attr('height',me.height)
            .style('fill','white')
            .style('stroke',me.draw_stroke)
            .style('stroke-width','0')
            .attr('opacity',1.0)
            ;
        // Grid
        if (me.debug){
            let verticals = me.back.append('g')
                .attr('class','verticals')
                .selectAll("g")
                .data(d3.range(0, 24, 1));
            verticals.enter()
                .append('line')
                .attr('x1',function(d){ return d*me.stepx})
                .attr('y1',0)
                .attr('x2',function(d){ return d*me.stepx})
                .attr('y2',36*me.stepy)
                .style('fill','transparent')
                .style('stroke','#CCC')
                .style('stroke-width','0.25pt');
            let horizontals = me.back.append('g')
                .attr('class','horizontals')
                .selectAll("g")
                .data(d3.range(0, 36, 1));
            horizontals.enter()
                .append('line')
                .attr('x1',0)
                .attr('x2',24*me.stepx)
                .attr('y1',function(d){ return d*me.stepy})
                .attr('y2',function(d){ return d*me.stepy})
                .style('fill','transparent')
                .style('stroke','#CCC')
                .style('stroke-width','0.25pt');
        }

        let lines = me.back.append('g');
        me.crossline(1,2,35);
        me.crossline(23,2,35);
        // Mid lines
        me.midline(1.5,5,19);
        me.midline(2.5,1,23);
        me.midline(35,1,23);

        me.midline(6);
        me.midline(9);
        me.midline(16);
        me.midline(23);
        me.midline(30);
        // Title
        let txt = me.sheet_type(me.data['creature']).toUpperCase();
        me.decorationText(12,2.75,0,'middle',me.title_font,me.fat_font_size*2,'#FFF','#FFF',10,txt,me.back,1);
        me.decorationText(12,1.8,0,'middle',me.logo_font,me.fat_font_size,"#fff","#fff",5,me.scenario,me.back,0.75);

        me.decorationText(12,1.8,0,'middle',me.logo_font,me.fat_font_size,me.shadow_fill,me.shadow_stroke,0.5,me.scenario,me.back,0.5);
        me.decorationText(12,2.75,0,'middle',me.title_font,me.fat_font_size*2,me.shadow_fill,me.shadow_stroke,1,txt,me.back,0.75);

        //me.decorationText(12,1.8,0,'middle',me.logo_font,me.fat_font_size,"transparent",me.draw_stroke,0.5,me.scenario,me.back,0.5);

        me.decorationText(1.5,35.8,-16,'start',me.base_font,me.medium_font_size,me.draw_fill,me.draw_stroke,0.5,me.guideline,me.back);
        me.decorationText(22.5,35.8,-16,'end',me.base_font,me.small_font_size,me.draw_fill,me.draw_stroke,0.5,"WaWWoD Cross+Over Sheet ??2021, Pentex Inc.",me.back);
        me.decorationText(2.5,1.75,0,'middle',me.title_font,me.medium_font_size,me.draw_fill,me.draw_stroke,0.5,"What a Wonderful",me.back);
        me.decorationText(2.5,2.25,0,'middle',me.title_font,me.medium_font_size,me.draw_fill,me.draw_stroke,0.5,"World of Darkness",me.back);
        me.decorationText(21.5,1.75,0,'middle',me.title_font,me.medium_font_size,me.draw_fill,me.draw_stroke,0.5,me.pre_title,me.back);
        me.decorationText(21.5,2.25,0,'middle',me.title_font,me.medium_font_size,me.draw_fill,me.draw_stroke,0.5,me.post_title,me.back);
        me.decorationText(22.5,34.8,0,'end',me.base_font,me.small_font_size,me.draw_fill,me.draw_stroke,0.5,'Challenge:'+me.data['freebies'],me.back);



        // Sheet content
        me.character = me.back.append('g')
            .attr('class','xover_sheet');
    }

    reinHagenStat(name,value,ox,oy,type,statcode,source, power=false){
        let me = this;
        let item = source.append('g')
            .attr('class',type);
         item.append('rect')
             .attr('x',ox)
             .attr('y',oy)
             .attr('width',me.stat_length*1.6)
             .attr('height',18)
             .style('fill','#FFF')
             .style('stroke','transparent')
             .style('stroke-width','0.5pt')
             ;

        item.append('line')
            .attr('x1',function(d,i){
                return ox;
            })
            .attr('y1',function(d,i){
                return oy+9;
            })
            .attr('x2',function(d,i){
                return ox+me.stepx*6;
            })
            .attr('y2',function(d,i){
                return oy+9;
            })
            .style("fill",me.draw_fill)
            .style("stroke",me.shadow_stroke)
            .style("stroke-width",'1.5pt')
            .style("stroke-dasharray",'2 7')
            ;


        item.append('text')
            .attr("x",ox)
            .attr("y",oy)
            .attr("dy",10)
            .style("text-anchor",'start')
            .style("font-family",function(){
                return (power ? me.user_font : me.base_font);
                //return (power ? 'NothingYouCouldDo' : 'Titre');
            })
            .style("font-size",me.medium_font_size+'px')
            .style("fill",function(){
                return (power ? me.user_fill : me.draw_fill);
            })
            .style("stroke",function(){
                return (power ? me.user_stroke : me.draw_stroke);
            })
            .style("stroke-width",'0.5pt')
            .text(function(){
                return name.charAt(0).toUpperCase() + name.slice(1);
            })
        let max = me.stat_max;
        if (value>me.stat_max){
            max = me.stat_max*2;
        }

        let dots = item.append('g')
            .attr('class','dots '+type)
            .selectAll("g")
            .data(d3.range(0, max, 1));
        dots.enter()
            .append('circle')
            .attr('cx',function(d){
                let cx = ox+me.stepx*5+(d%me.stat_max)*((me.dot_radius)*2);
//                 if (d>=me.stat_max){
//                     cx = ox+me.stepx*4+(d%me.stat_max)*((me.dot_radius)*2);
//                 }
                return cx;
            })
            .attr('cy',function(d){
                let cy = oy+me.dot_radius/2;
                if (max > me.stat_max){
                    cy -=me.dot_radius;
                }

                if (d>=me.stat_max){
                    cy += +me.dot_radius/2+2;
                }
                return cy;
            })
            .attr('r',function(d){
                return  (d>=me.stat_max ? me.dot_radius-2:me.dot_radius-2);
            })
            .style('fill',function(d){
                return (d < value ? me.user_fill : "white");
            })
            .style('stroke',function(d){
                return me.draw_stroke;
            })
            .style('stroke-width','1.5pt')
           ;
    }

    powerStat(name,ox,oy,type,statcode,source){
        let me = this;
        if (name==''){
            me.reinHagenStat('   ',0,ox,oy,type,statcode,source)
        }else{
            let words = name.split(' (');
            let power = words[0];
            let val = (words[1].split(')'))[0];
            if (type=='flaw'){
                power = power + ' -F-'
            }
            me.reinHagenStat(power,val,ox,oy,type,statcode,source,power=true)
        }
    }



    statText(name,value,ox,oy,type,statcode,source,fat=false,mono=false){
        let me = this;
        let item = source.append('g')
            .attr('class',type);
         item.append('rect')
             .attr('x',ox)
             .attr('y',oy)
             .attr('width',me.stat_length*1.6)
             .attr('height',18)
             .style('fill','transparent')
             .style('stroke','transparent')
             .style('stroke-width','0.5pt')
             ;
        item.append('line')
            .attr('x1',function(d,i){
                return ox;
            })
            .attr('y1',function(d,i){
                return oy+9;
            })
            .attr('x2',function(d,i){
                return ox+me.stepx*6;
            })
            .attr('y2',function(d,i){
                return oy+9;
            })
            .style("fill",me.draw_fill)
            .style("stroke",me.shadow_stroke)
            .style("stroke-width",'1.5pt')
            .style("stroke-dasharray",'2 7')
            ;

        item.append('text')
            .attr("x",ox)
            .attr("y",oy)
            .attr("dy",10)
            .style("text-anchor",'start')
            .style("font-family",me.base_font)
            .style("font-size",me.medium_font_size+'px')
            .style("fill",me.draw_fill)
            .style("stroke",me.draw_stroke)
            .style("stroke-width",'0.5pt')
            .text(function(){
                return name.charAt(0).toUpperCase() + name.slice(1);
            });

        if (fat){
        item.append('text')
            .attr("x",ox+me.stepx*6)
            .attr("y",oy)
            .attr("dy",10)
            .style("text-anchor",'end')
            .style("font-family",function(d){
                return (mono==true ?  me.mono_font :me.user_font);
            })
            .style("font-size",(me.medium_font_size*1.25)+'px')
            .style("fill",me.user_fill)
            .style("stroke",me.user_stroke)
            .style("stroke-width",'0.5pt')
            .text(function(){
                return value;
            });
        }else{
        item.append('text')
            .attr("x",ox+me.stepx*6)
            .attr("y",oy)
            .attr("dy",10)
            .style("text-anchor",'end')
            .style("font-family",function(d){
                return (mono==true ?  me.mono_font :me.user_font);
            })
                .style("font-size",me.medium_font_size+'px')
            .style("fill",me.user_fill)
            .style("stroke",me.user_stroke)
            .style("stroke-width",'0.5pt')
            .text(function(){
                return value;
            });
        }
    }

    title(name,ox,oy,source){
        let me = this;
        let item = source.append('g');
        item.append('text')
            .attr("x",ox)
            .attr("y",oy)
            .attr("dy",10)
            .style("text-anchor",'middle')
            .style("font-family",me.title_font)
            .style("font-size",me.big_font_size+'px')
            .style("fill",'#111')
            .style("stroke",'#888')
            .style("stroke-width",'0.5pt')
            .text(function(){
                return name.charAt(0).toUpperCase() + name.slice(1);
            })

    }

    gaugeStat(name,value,ox,oy,source,withTemp=false,automax=false,max=10){
        let me = this;
        let type=name;
        let item = source.append('g');
        let lines = 1;
        let tempmax = max;

        item.append('text')
            .attr("x",ox)
            .attr("y",oy)
            .attr("dy",10)
            .style("text-anchor",'middle')
            .style("font-family",me.title_font)
            .style("font-size",me.big_font_size+'px')
            .style("fill",'#111')
            .style("stroke",'#888')
            .style("stroke-width",'0.5pt')
            .text(function(){
                return name.charAt(0).toUpperCase() + name.slice(1);
            });
        if (automax){
            tempmax = (Math.round(value/10)+1)*10;
            lines = tempmax/10;
        }

        let dots = item.append('g')
            .attr('class','dots '+type)
            .selectAll("g")
            .data(d3.range(0, tempmax, 1));
        let dot = dots.enter();
        dot.append('circle')
            .attr('cx',function(d){
                let cx =  ox+(((d%10))-4.5)*((me.dot_radius*2+1)*2);
//                 if (d>=10){
//                     cx = ox+((d-10)-4.5)*((me.dot_radius+1)*2);
//                 }
                return cx;
            })
            .attr('cy',function(d){
                let cy = oy+0.3*me.stepx+me.dot_radius;
                if (d>=10){
                    cy += me.dot_radius*2;
                }
                return cy;
            })
            .style('fill',function(d){
                return (d < value ? me.user_fill : "white");
            })
            .attr('r',me.dot_radius)
            .style('stroke',me.draw_stroke)
            .style('stroke-width','1pt')
            ;
        dot.append('rect')
            .attr('x',function(d){
                let cx =  ox+((d%10)-4.5)*((me.dot_radius*2+1)*2) - me.dot_radius;
                return cx;
            })
            .attr('y',function(d){
                let cy = oy+0.3*me.stepx+me.dot_radius - me.dot_radius + (me.dot_radius*2+2)*lines +2;
                if (d>=10){
                    cy += me.dot_radius*2+5 ;
                }
                return cy;
            })
            .attr('width',me.dot_radius*2)
            .attr('height',me.dot_radius*2)
            .style('fill',function(d){return (withTemp?'white':'transparent');})
            .style('stroke',function(d){return (withTemp?me.draw_stroke:'transparent');})
            .style('stroke-width','0.5pt')
           ;

    }


    fillAttributes(basey){
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = 'attribute';

        oy -= 0.5*me.stepy;

        me.statText('Name',me.data['name'],ox+me.stepx*2,oy,'name','name',me.character,true);
        me.statText('Nature',me.data['nature'],ox+me.stepx*9,oy,'nature','nature',me.character);
        if (me.data["creature"]=='kindred'){
            me.statText('Age/R(E)',me.data['age']+"/"+me.data['trueage']+" ("+me.data['embrace']+"A.D)",ox+me.stepx*16,oy,'age','age',me.character);
        }else{
            me.statText('Age',me.data['age'],ox+me.stepx*16,oy,'age','age',me.character);
        }
        oy += 0.5*me.stepy;
        if (me.data['player']==''){
            me.statText('Player',"Storyteller Character",ox+me.stepx*2,oy,'player','player',me.character);
        }else{
            me.statText('Player',me.data['player'],ox+me.stepx*2,oy,'player','player',me.character);
        }
        me.statText('Demeanor',me.data['demeanor'],ox+me.stepx*9,oy,'demeanor','demeanor',me.character);
        me.statText('Sex',(me.data['sex']?'male':'female'),ox+me.stepx*16,oy,'sex','sex',me.character);

        oy += 0.5*me.stepy;
        me.statText('Chronicle',me.data['chronicle'],ox+me.stepx*2,oy,'chronicle','chronicle',me.character);
        if (me.data["creature"]=='kindred'){
            me.statText('Position',me.data['position'],ox+me.stepx*9,oy,'group','group',me.character);
        }else{
            me.statText('Residence',me.data['group'],ox+me.stepx*9,oy,'group','group',me.character);
        }
        me.statText('Concept',me.data['concept'],ox+me.stepx*16,oy,'concept','concept',me.character);

        oy += 0.5*me.stepy;
        me.statText('Creature',me.data['creature'].charAt(0).toUpperCase() + me.data['creature'].slice(1),ox+me.stepx*2,oy,'chronicle','chronicle',me.character);

        if (me.data["creature"]=='kindred'){
            if (me.data["faction"]=='Sabbat'){
                me.statText('Pack',me.data['groupspec'],ox+me.stepx*9,oy,'group','group',me.character);
            }else{
                me.statText('Coterie',me.data['groupspec'],ox+me.stepx*9,oy,'group','group',me.character);
            }
            me.statText('Clan',me.data['family'],ox+me.stepx*16,oy,'concept','concept',me.character);
        }else if (me.data["creature"]=='garou'){
            me.statText('Pack',me.data['groupspec'],ox+me.stepx*9,oy,'group','group',me.character);
            me.statText('Totem',me.data['sire'],ox+me.stepx*16,oy,'concept','concept',me.character);
        }

        if (me.data["creature"]=='kindred'){
            oy += 0.5*me.stepy;
            me.statText('Faction',me.data['faction'],ox+me.stepx*2,oy,'faction','faction',me.character);
            me.statText('Territory',me.data['territory'],ox+me.stepx*9,oy,'Terri','territor',me.character);
            me.statText('Weakness',me.data['weakness'],ox+me.stepx*16,oy,'weakness','weakness',me.character);

            oy += 1.0*me.stepy;
        }

        else{
            oy += 1.5*me.stepy;
        }
        me.title('Physical ('+me.data['total_physical']+')',ox+me.stepx*5,oy,me.character);
        me.title('Social ('+me.data['total_social']+')',ox+me.stepx*12,oy,me.character);
        me.title('Mental ('+me.data['total_mental']+')',ox+me.stepx*19,oy,me.character);

        oy += 0.5*me.stepy;
        ox = 2*me.stepx;
        [0,1,2,3,4,5,6,7,8].forEach(function(d) {
              let x = ox + me.stepx*7*((Math.round((d+2)/3))-1) ;
              let y = oy + 0.5*me.stepy*((d+3)%3);
              me.reinHagenStat(me.config['labels'][stat+'s'][d],me.data[stat+d],x,y,stat,stat+d,me.character);
        });

    }
    fillAbilities(basey){
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';

        me.title('Talents ('+me.data['total_talents']+')',ox+me.stepx*5,oy,me.character);
        me.title('Skills ('+me.data['total_skills']+')',ox+me.stepx*12,oy,me.character);
        me.title('Knowledges ('+me.data['total_knowledges']+')',ox+me.stepx*19,oy,me.character);

        oy += 0.5*me.stepy;

        stat = 'talent';
        [0,1,2,3,4,5,6,7,8,9].forEach(function(d) {
              let x = ox + me.stepx*2;
              let y = oy + 0.5*me.stepy*(d);
              me.reinHagenStat(me.config['labels'][stat+'s'][d],me.data[stat+d],x,y,stat,stat+d,me.character);
        });
        stat = 'skill';
        [0,1,2,3,4,5,6,7,8,9].forEach(function(d) {
              let x = ox + me.stepx*9;
              let y = oy + 0.5*me.stepy*(d);
              me.reinHagenStat(me.config['labels'][stat+'s'][d],me.data[stat+d],x,y,stat,stat+d,me.character);
        });
        stat = 'knowledge';
        [0,1,2,3,4,5,6,7,8,9].forEach(function(d) {
              let x = ox + me.stepx*16;
              let y = oy + 0.5*me.stepy*(d);
              me.reinHagenStat(me.config['labels'][stat+'s'][d],me.data[stat+d],x,y,stat,stat+d,me.character);
        });
    }

    fillAdvantages(basey){
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';

        me.title('Backgrounds ('+me.data['total_backgrounds']+')',ox+me.stepx*5,oy,me.character);
        if (me.data['creature']=='garou'){
            me.title('Gifts ('+me.data['total_traits']+')',ox+me.stepx*12,oy,me.character);

        }else if (me.data['creature']=='kindred') {
            me.title('Disciplines ('+me.data['total_traits']+')',ox+me.stepx*12,oy,me.character);
            me.title('Virtues',ox+me.stepx*19,oy,me.character);

        }else{
            me.title('Other Traits',ox+me.stepx*12,oy,me.character);
            me.title('Other Traits',ox+me.stepx*19,oy,me.character);

        }
        oy += 0.5*me.stepy;


        stat = 'background';
        [0,1,2,3,4,5,6,7,8,9].forEach(function(d) {
              let x = ox+me.stepx*2;
              let y = oy + 0.5*me.stepy*(d);
              me.reinHagenStat(me.config['labels'][stat+'s'][d],me.data[stat+d],x,y,stat,stat+d,me.character);
        });

        stat = 'trait';
        [0,1,2,3,4,5,6,7,8,9].forEach(function(d) {
              let x = ox+me.stepx*9;
              let y = oy + 0.5*me.stepy*(d);
              me.powerStat(me.data[stat+d],x,y,stat,stat+d,me.character);
        });

        stat = 'virtue';
        let levels = [];
        if (me.data['creature']=='garou') {
            oy -= me.stepy*0.5;
            levels = ['Glory','Honor','Wisdom'];
            [0,1,2].forEach(function(d) {
              let x = ox+me.stepx*19;
              let y = oy + 1.20*me.stepy*(d);
              me.gaugeStat(levels[d],me.data[levels[d].toLowerCase()],x,y,me.character,true,true);
            });
        }else{
            levels = ['Conscience','Self-Control','Courage'];
            [0,1,2].forEach(function(d) {
              let x = ox+me.stepx*16;
              let y = oy + 0.5*me.stepy*(d);
              me.reinHagenStat(levels[d],me.data[stat+d],x,y,stat,stat+d,me.character);
            });

        }


        if (me.data['creature']=='garou'){

            let breeds = ['Homid','Metis','Lupus'];
            let auspices = ['Ragabash','Theurge','Philodox','Galliard','Ahroun'];
            oy += 3.75*me.stepy;
            me.statText('Breed',breeds[me.data['breed']],ox+me.stepx*16,oy,'breed','breed',me.character);
            oy += 0.5*me.stepy;
            me.statText('Auspice',auspices[me.data['auspice']],ox+me.stepx*16,oy,'auspice','auspice',me.character);
            oy += 0.5*me.stepy;
            me.statText('Tribe',me.data['family'],ox+me.stepx*16,oy,'tribe','tribe',me.character);
            oy += 0.5*me.stepy;
            me.reinHagenStat('Rank',me.data['rank'],ox+me.stepx*16,oy,'rank','rank',me.character);

        }else if (me.data['creature']=='kindred'){
            oy += 2*me.stepy;
            me.statText('Generation',13-me.data['background3']+'th',ox+me.stepx*16,oy,'gener','gener',me.character);
            oy += 0.5*me.stepy;
            me.statText('Sire',me.data['sire_name'],ox+me.stepx*16,oy,'sire','sire',me.character);
        }
    }


    drawHealth(basey){
        let me = this;
        let ox = 0;
        let oy = basey;
        me.title('Health',ox+me.stepx*19,oy,me.character);
        oy += me.stepy*0.8;
        let h = me.character.append('g')
            .selectAll('g')
            .data(me.health_levels)
        ;
        let x= h.enter();
        x.append('line')
            .attr('x1',function(d,i){
                return ox+me.stepx*16;
            })
            .attr('y1',function(d,i){
                return oy+i*me.stepy*0.6;
            })
            .attr('x2',function(d,i){
                return ox+me.stepx*22;
            })
            .attr('y2',function(d,i){
                return oy+i*me.stepy*0.6;
            })
            .style("fill",me.draw_fill)
            .style("stroke",me.shadow_stroke)
            .style("stroke-width",'0.5pt')
            .style("stroke-dasharray",'2 7')
            ;
        x.append('text')
            .attr('x',function(d,i){
                return ox+me.stepx*16;
            })
            .attr('y',function(d,i){
                return oy+i*me.stepy*0.6;
            })
            .style("text-anchor",'start')
            .style("font-family",me.base_font)
            .style("font-size",me.medium_font_size+'px')
            .style("fill",me.draw_fill)
            .style("stroke",me.draw_stroke)
            .style("stroke-width",'0.5pt')
            .text(function(d){
                let words = d.split('/');
                return words[0];
            });
            x.append('text')
            .attr('x',function(d,i){
                return ox+me.stepx*19;
            })
            .attr('y',function(d,i){
                return oy+i*me.stepy*0.6;
            })
            .style("text-anchor",'middle')
            .style("font-family",'Titre')
            .style("font-size",me.medium_font_size+'px')
            .style("fill",me.draw_fill)
            .style("stroke",me.draw_stroke)
            .style("stroke-width",'0.5pt')
            .text(function(d){
                let words = d.split('/');
                if (words[1]=='X'){
                    return '';
                }
                return words[1];
            });
        x.append('rect')
            .attr('x',function(d,i){
                return ox+me.stepx*22-me.dot_radius*2;
            })
            .attr('y',function(d,i){
                return oy+i*me.stepy*0.6-me.dot_radius*2;
            })
            .attr('width',me.dot_radius*2)
            .attr('height',me.dot_radius*2)
            .style("fill","white")
            .style("stroke",me.draw_stroke)
            .style("stroke-width",'0.5pt')
            ;

    }


    fillOther(basey){
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';
        me.title('Merits/Flaws',ox+me.stepx*5,oy,me.character);
        oy += 0.5*me.stepy;

        let merits_flaws = [];
        stat = 'merit';
        let idx = 0;
        [0,1,2,3,4].forEach(function(d) {
            if (me.data[stat+d] != ''){
                merits_flaws.push({'idx':idx,'class':'merit','id':'merit'+d});
                idx++;
            }
        });
        stat = 'flaw';
        [0,1,2,3,4].forEach(function(d) {
            if (me.data[stat+d] != ''){
                merits_flaws.push({'idx':idx,'class':'flaw','id':'flaw'+d});
                idx++;
            }
        });
        // Merits/Flaws
        _.forEach(merits_flaws,function(d,idx) {
              let x = ox + me.stepx*2;
              let y = oy + 0.5*me.stepy*(idx);
              me.powerStat(me.data[d['id']],x,y,d['class'],d['id'],me.character);
        });


        oy = basey;
        me.gaugeStat('Willpower',me.data['willpower'],ox+me.stepx*12,oy,me.character,true);
        if (me.data['creature']=='garou'){
            oy += 1.7*me.stepy;
            me.gaugeStat('Rage',me.data['rage'],ox+me.stepx*12,oy,me.character,true);
            oy += 1.5*me.stepy;
            me.gaugeStat('Gnosis',me.data['gnosis'],ox+me.stepx*12,oy,me.character,true);
        }
        if (me.data['creature']=='kindred'){
            oy += 1.7*me.stepy;
            me.gaugeStat('Humanity',me.data['humanity'],ox+me.stepx*12,oy,me.character);
            oy += 1.5*me.stepy;
            me.gaugeStat('Blood Pool',me.data['bloodpool'],ox+me.stepx*12,oy,me.character,true,true,20);

        }
        oy = basey;
        me.drawHealth(oy);
    }

    fillSpecial(basey){
        let me = this;
        let ox = 0;
        let oy = basey;
        let stat = '';
        me.title('Specialities',ox+me.stepx*5,oy,me.character);
        me.title('Action Shortcuts',ox+me.stepx*12,oy,me.character);
        me.title('Many Forms',ox+me.stepx*19,oy,me.character);
        oy += 0.5*me.stepy;
        stat = 'speciality';
        me.config['specialities'].forEach(function(d,idx) {
              let x = ox + me.stepx*2;
              let y = oy + 0.5*me.stepy*(idx);
              me.statText(d,'',x,y,stat,stat+idx,me.character);
        });
       stat = 'shortcuts';
        me.config['shortcuts'].forEach(function(d,idx) {
              let x = ox + me.stepx*9;
              let y = oy + 0.5*me.stepy*(idx);
              let w = d.split('=');
              me.statText(w[0],w[1],x,y,stat,stat+idx,me.character);
        });

        if (me.data['creature'] == 'garou'){
            me.config["many_forms"] = [
                {'form':'homid','motherform':true,'size':1.00,'weight':1.00,'changes':{
                        'attribute0':0,'attribute1':0,'attribute2':0,
                        'attribute3':0,'attribute4':0,'attribute5':0,
                    }
                },
                {'form':'glabro','motherform':false,'size':1.25,'weight':1.50,'changes':{
                        'attribute0':2,'attribute1':0,'attribute2':2,
                        'attribute3':0,'attribute4':-1,'attribute5':-1
                    }
                },
                {'form':'crinos','motherform':false,'size':1.50,'weight':2.00,'changes':{
                        'attribute0':4,'attribute1':1,'attribute2':3,
                        'attribute3':0,'attribute4':-3,'attribute5':-10
                    }
                },
                {'form':'hispo','motherform':false,'size':1.25,'weight':2.00,'changes':{
                        'attribute0':3,'attribute1':2,'attribute2':3,
                        'attribute3':0,'attribute4':-3,'attribute5':0
                    }
                },

                {'form':'lupus','motherform':false,'size':0.5,'weight':0.5,'changes':{
                        'attribute0':1,'attribute1':2,'attribute2':2,
                        'attribute3':0,'attribute4':-3,'attribute5':0
                    }
                },
            ]
            let bonuses  = "";
            let ax = ox + me.stepx*16;
            let ay = oy + 0.5*me.stepy*(0);
            me.statText("Attributes"," St De St Ch Ma Ap",ax,ay,'fl','fl',me.character,false,true);
            me.config['many_forms'].forEach(function(d,idx) {
                ax = ox + me.stepx*16;
                ay = oy + 0.5*me.stepy*(idx+1);
                bonuses  = "";
                let list = d['changes'];

                _.forEach(list,function(v,k){
                    let da = parseInt(me.data[k] + v);
                    if (da < 0){
                        da = 0;
                    }
                    bonuses += " "+da+".";
                });
                me.statText(d['form'],bonuses,ax,ay,d['form'],d['form'],me.character,false,true);
                //console.log(bonuses);
            });
        }


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


    addButton(num,txt){
        let me = this;
        let ox=28*me.stepy;
        let oy=2*me.stepy;
        let button = me.back.append('g')
            .attr('class','do_not_print')
        button.append('rect')
            .attr('id',"button"+num)
            .attr('x', ox+me.stepx*(-0.8))
            .attr('y', oy+me.stepy*(num-0.4))
            .attr('width',me.stepx*1.6)
            .attr('height',me.stepy*0.8)
            .style('fill','#CCC')
            .style('stroke','#111')
            .style('stroke-width','1pt')
            .attr('opacity',1.0)
            .style('cursor','pointer')
            .on('mouseover',function(d){
                me.svg.select('#button'+num).style("stroke","#A22");
            })
            .on('mouseout',function(d){
                me.svg.select('#button'+num).style("stroke","#111");
            })
            .on('click',function(d){
                if (num==0){
                    me.saveSVG();
                }else if (num==1){
                    me.savePNG();
                }else if (num==2){
                    me.savePDF();
                }else if (num==3){
                    me.editCreature();
                }
            })
            ;
        button.append('text')
            .attr('x', ox)
            .attr('y', oy+me.stepy*num)
            .attr('dy', 5)
            .style('font-family',me.title_font)
            .style('text-anchor','middle')
            .style("font-size",me.medium_font_size+'px')
            .style('fill','#000')
            .style('cursor','pointer')
            .style('stroke','#333')
            .style('stroke-width','0.5pt')
            .attr('opacity',1.0)
            .text(txt)
            .on('mouseover',function(d){
                me.svg.select('#button'+num).style("stroke","#A22");
            })
            .on('mouseout',function(d){
                me.svg.select('#button'+num).style("stroke","#111");
            })
            .on('click',function(d){
                if (num==0){
                    me.saveSVG();
                }else if (num==1){
                    me.savePNG();
                }else if (num==2){
                    me.savePDF();
                }else if (num==3){
                    me.editCreature();
                }
            })
            ;
    }

    drawButtons(){
        let me = this;
        me.addButton(0,'Save SVG');
    }

    saveSVG(){
        let me = this;
        me.svg.selectAll('.do_not_print').attr('opacity',0);
        let base_svg = d3.select("svg").html();
        let flist = '<style>';
        //console.log(me.config['fontset']);
        for (let f of me.config['fontset']){
            flist += '@import url("https://fonts.googleapis.com/css2?family='+f+'");';
        }
        flist += '</style>';

        let exportable_svg = '<?xml version="1.0" encoding="ISO-8859-1" ?> \
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> \
<svg class="crossover_sheet" \
xmlns="http://www.w3.org/2000/svg" version="1.1" \
xmlns:xlink="http://www.w3.org/1999/xlink"> \
' + flist + base_svg + '</svg>';
        let fname = me.data['rid']+ ".svg"
        let nuke = document.createElement("a");
        nuke.href = 'data:application/octet-stream;base64,' + btoa(me.formatXml(exportable_svg));
        nuke.setAttribute("download", fname);
        nuke.click();
        me.svg.selectAll('.do_not_print').attr('opacity',1);
    }

    perform(character_data){
        let me = this;
        me.data = character_data;
        me.guideline = me.data['guideline']
        me.drawWatermark();
        if (me.data['condition'] == "DEAD"){

            me.decorationText(12,16,0,'middle',me.logo_font,me.fat_font_size*3,me.shadow_fill,me.shadow_stroke,0.5,"DEAD",me.back,0.25);
        }

        me.fillCharacter();
        me.drawButtons();
    }


    fillCharacter(){
        let me = this;
        me.fillAttributes(4*me.stepy);
        me.fillAbilities(9.5*me.stepy);
        me.fillAdvantages(16.5*me.stepy);
        me.fillOther(23.5*me.stepy);
        me.fillSpecial(30.5*me.stepy);
    }


}

