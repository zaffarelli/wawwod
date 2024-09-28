class WawwodCollector {
    constructor() {
        this.d3 = undefined;
        this.init();
    }

    init() {
        let me = this;
        me.prepare_ajax();
    }

    prepare_ajax() {
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                    let csrf_middlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
                    xhr.setRequestHeader('X-CSRFToken', csrf_middlewaretoken);
                }
            }
        });
    }

    loadAjax() {
        let me = this;
    }

    revealUI() {
        let me = this;
        $('.charlist').removeClass('hidden');
        // $('.storyboard_handler').removeClass('hidden');
        $('.bar').removeClass('hidden');
        $('.wrapper').removeClass('hidden');
    }

    hideUI() {
        let me = this;
        $('.charlist').addClass('hidden');
        $('.storyboard_handler').addClass('hidden');
        $('.bar').addClass('hidden');
        $('.wrapper').addClass('hidden');
    }


    registerDisplay() {
        let me = this;
        $('.display').off().on('click', function (event) {
            let action = $(this).attr('action');
            let param = $(this).attr('param');
            let option = $(this).attr('option');
            let key = $('#userinput').val();
            let url = 'ajax/display/' + action + '/';
            if (param != undefined) {
                if (action == 'crossover_sheet') {
                    if (option) {
                        url = 'ajax/display/' + action + '/' + param + '/' + option + '/';
                    }
                    else{
                        url = 'ajax/display/' + action + '/' + param + '/' ;
                    }
                }else {
                    url = 'ajax/display/' + action + '/' + param + '/';
                    console.log(param);
                }
            }
            if (key != '') {
                if (action == 'crossover_sheet') {
                    url = 'ajax/display/' + action + '/' + key + '/';
                }
            }
            $.ajax({
                url: url,
                success: function (answer) {
                    if (action == 'gaia_wheel') {
                        let d = JSON.parse(answer.data);
                        me.d3 = new GaiaWheel(d, "#d3area", me);
                        me.d3.perform();
                    }
                    if (action == 'dashboard') {
                        let d = JSON.parse(answer.data);
                        me.d3 = new Dashboard(d, "#d3area", me);
                        me.d3.perform();
                    }
                    if (action == 'kindred_lineage') {
                        //console.log(answer)
                        let s = JSON.parse(answer.settings);
                        let d = JSON.parse(answer.data);
                        me.d3 = new KindredLineage(s, "#d3area", me);
                        me.d3.perform(d);
                    }
                    if (action == 'septs') {
                        console.log(answer)
                        let s = JSON.parse(answer.settings);
                        let dat = JSON.parse(answer.data);
                        me.d3 = new Sept(s, "#d3area", me);
                        me.d3.perform(dat);
                    }
                    if (action == 'crossover_sheet') {
                        let s = JSON.parse(answer.settings);
                        let d = JSON.parse(answer.data);
                        me.d3 = new CrossOverSheet(s, "#d3area", me);
                        me.d3.perform(d);
                    }
                    if (action == 'adventure_sheet') {
                        console.log("Here we go: adventure sheet!")
                        let s = JSON.parse(answer.settings);
                        let d = JSON.parse(answer.data);
                        me.d3 = new AdventureSheet(s, "#d3area", me);
                        me.d3.perform(d);
                    }
                    if (action == 'storytelling') {
                        let s = JSON.parse(answer.settings);
                        let d = JSON.parse(answer.data);
                        me.d3 = new Storytelling(s, "#d3area", me);
                        me.d3.perform(d);
                    }
                    if (action == 'pdf_story') {
                        console.log(answer);
                    }
                    if (action == 'map') {
                        let d = JSON.parse(answer.data);
                        me.d3 = new GeoCity(param,d, "#d3area", me);
                        me.d3.perform();
                    }
                    me.rebootLinks();
                },
                error: function (answer) {
                    console.error(answer);
                    me.rebootLinks();
                },
            });
        });
    }

    registerAction() {
        let me = this;
        $('.action').off().on('click', function (event) {
            let action = $(this).attr('action');
            let param = $(this).attr('param');
            let url = ""
            let stories = ""

            if (action == "quaestor"){
                param = $("#user_command").val()
                url = 'ajax/action/' + action + '/' + param.replaceAll(":","_xsepx_") +'/';
            }else{
                stories = me.d3.getStories();
                url = 'ajax/action/' + action + '/' + param + "__" + stories + '/';
                }
            $.ajax({
                url: url,
                success: function (answer) {
                    if (action == "quaestor"){
                        //let d = JSON.parse(answer.data)
                        console.log(answer.rationale)
                        $("#text_edit").html(me.makeGiftsList(answer.data))
                        $("#user_command").val("")
                    }else{
                        let d = JSON.parse(answer.changes_on_scenes)
                        me.d3.changeScenes(d);
                        me.rebootLinks();
                    }
                },
                error: function (answer) {
                    console.error(answer);
                    me.rebootLinks();
                },
            });
        });
    }

    makeGiftsList(arr){
        let me = this
        let txt = ""
         console.log(arr)
        _.forEach(arr, (v) => {
            txt += `${v.name} (${v.level}) [${v.references}]\n`
             console.log(txt)
        });
        return txt
    }

    registerJump() {
        let me = this;
        $('li.scene_jump').off().on('click', function (event) {
            let tgt = $(this).attr('jump_to');
            $.ajax({
                url: 'ajax/view/scene/' + tgt + '/',
                success: function (answer) {
                    $('.details').html(answer)
                    $('.details').removeClass('hidden');
                    me.d3.centerToScene(tgt);
                    me.rebootLinks();
                },
                error: function (answer) {
                    console.error('View error...' + answer);
                    me.rebootLinks();
                }
            });

        })
    }

    registerResend() {
        let me = this;
        $('#resend').off().on('click', function (event) {
            let param = $(this).attr('param');
            if (param) {
                let data = param.split('__');
                let url = 'ajax/scene/' + data[0] + '/update/' + data[1] + '/';
                let grabbed_data = $("#text_edit").val();
                let keys_set = {text: grabbed_data}
                // console.log(grabbed_data);
                $.ajax({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    dataType: 'json',
                    data: keys_set,
                    success: function (answer) {
                        let d = JSON.parse(answer["changes_on_scenes"])
                        console.log(answer.changes_on_scenes);
                        console.log(d['field']);
                        console.log(d['value']);

                        $("#" + d['field']).html(d['value']);

                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error(answer);
                        me.rebootLinks();
                    },
                });
            }
        });
    }


    registerTriggers() {
        let me = this;
        $('.edit_trigger').off().on('click', function (event) {
            let id = $(this).attr('id');
            let fields = id.split("__");
            let tgt_id = fields[0].replace('trigger_', '');
            let hr_field = $(this).attr('field');
            let bz_field = fields[1];
            $(".storyboard_handler").removeClass('hidden');
            let field_id = "field_" + tgt_id + "__" + bz_field;
            console.log(field_id)
            let grabbed_data = $("#" + field_id).html();
            // $("#" + field_id).css('border-color','red')
            // console.log(grabbed_data)
            $("#text_edit").val(grabbed_data);
            $("#text_edit").focus();
            $("#resend").html("[" + tgt_id + "&gt;" + hr_field + "] <i class='fa fa-arrow-right'></i>");
            $("#resend").attr('param', tgt_id + '__' + bz_field);
            me.registerResend();
        })
        $('.edit_trigger').on('mouseover', function (e) {
            $(this).css('border-color', '#A22').attr('title', 'Click to edit');
            $("#text_edit").css('border-color', '#A22');
        })
        $('.edit_trigger').on('mouseout', function (e) {
            $(this).css('border-color', '#000').attr('title', '');
            $("#text_edit").css('border-color', '#999');

        })

    }


    registerCollectorAction() {
        let me = this;
        $('.collector_action').off().on('click', function (event) {
            let action = $(this).attr('action');
            let param = $('#userinput').val();
            let newparam = (param.split(" ")).join("_");
            let url = 'ajax/collector_action/' + action + '/'
            if (newparam) {
                url += newparam + '/';
            }
            $.ajax({
                url: url,
                success: function (answer) {
                    me.rebootLinks();
                },
                error: function (answer) {
                    console.error(answer);
                    me.rebootLinks();
                },
            });
        });
    }


    registerSwitch() {
        let me = this;
        $('.switch').off().on('click', function (event) {
            let action = $(this).attr('action');
            let param = $(this).attr('param');
            $.ajax({
                url: 'ajax/switch/' + action + '/' + param + '/',
                success: function (answer) {
                    window.location = '/';
                },
                error: function (answer) {
                    console.error(answer);
                    me.rebootLinks();
                },
            });
        });
    }

    registerList() {
        let me = this;
        $('.list').off().on('click', function (event) {
            let slug = $(this).attr('id');
            $.ajax({
                url: 'ajax/list/creatures/1/' + slug + '/',
                success: function (answer) {
                    $('.charlist').attr('title', slug);
                    $('.charlist').html(answer.list);
                    $('.more').addClass('hidden');
                    $('.charlist').removeClass('hidden');
                    me.rebootLinks();
                },
                error: function (answer) {
                    console.error(answer);
                    me.rebootLinks();
                },
            });
        });
    }

    registerNav() {
        let me = this;
        $('.nav').off().on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            let key = $('#customize').val();
            let slug = $('.charlist').attr('title');
            if (key == '') {
                key = 'none';
            }
            $.ajax({
                url: 'ajax/list/creatures/' + $(this).attr('page') + '/' + slug + '/',
                success: function (answer) {
                    $('.charlist').html(answer.list);
                    me.rebootLinks();
                    $('.more').addClass('hidden');
                },
            });
        });
    }

    registerLineLink() {
        let me = this;
        $('.line_link').off().on('click', function (e){
            e.preventDefault();
            e.stopPropagation();
            console.log("LineLink click");
            let param = $(this).attr('param');
            let action = $(this).attr('action');
            let ln = "api/"+action+"/"+param+"/";
            console.log(action);
            console.log(param);
            console.log(ln);
            $.ajax({
                url: ln,
                success: (answer) => {
                    console.log(answer);
                    $.ajax({
                        url: "ajax/view/creature/" + answer['rid'] + "/",
                        success: (ans) => {
                            $('.details').html(ans)
                            $('.details').removeClass('hidden');
                            me.rebootLinks();
                        }
                    });
                },
                error: function (answer) {
                    console.error('Error... ' + answer);
                },
            })
        })
    }


    registerToggle() {
        let me = this;
        $('.toggle').off().on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            let tgt = $(this).attr('param');
            $('.' + tgt).toggleClass('hidden');
            me.rebootLinks();
        });
    }

    rebootLinks() {
        let me = this;
        _.defer(function () {
            me.registerSwitch();
            me.registerList();
            me.registerNav();
            me.registerDisplay();
            me.registerAction();
            me.registerToggle();
            me.registerCollectorAction();
            me.registerTriggers();
            me.registerJump();
            me.registerLineLink();
            $('#go').off();
            $('#go').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let urlupdate = 'ajax/update/character/' + $('.character_form input[name=id]').val();
                $.ajax({
                    url: urlupdate,
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        cid: $('.character_form input[name=cid]').val(),
                        character: $('.character_form').serialize(),
                    },
                    dataType: 'json',
                    success: function (answer) {
                        $('.details').html(answer.character);
                        $('li#' + answer.rid).html(answer.line);
                        $('li').find('div.avatar_link').removeClass('selected');
                        $('.charlist').addClass('hidden');
                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error('Error... ' + answer);
                    },
                });
            });

            $('.toggle_more').off();
            $('.toggle_more').on('click', function (event) {
                event.preventDefault();
                $('.more').addClass('hidden');
                zid = $(this).attr('id');
                x = zid.split("_");
                $('.more#m_' + x[1]).toggleClass('hidden');
                me.rebootLinks();
            });


            $('.toggle_list').off();
            $('.toggle_list').on('click', function (event) {
                console.log('click');
                $('.charlist').toggleClass('hidden');
                me.rebootLinks();
            });


            $('#toggle_details').off();
            $('#toggle_details').on('click', function (event) {
                $('.details').toggleClass('hidden');
            });

            $('#toggle_details2').off();
            $('#toggle_details2').on('click', function (event) {
                $('.details').toggleClass('hidden');
            });


            $('#build_config_pdf').off();
            $('#build_config_pdf').on('click', function (event) {
                event.preventDefault();
                $.ajax({
                    url: 'ajax/build_config_pdf/',
                }).done(function (answer) {
                    $('.details').html(answer.comment);
                    me.rebootLinks();
                });
            });

            $('.view_creature').off().on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let dad = $(this).parents('li');
                $('li').removeClass('selected');
                $(dad).addClass('selected');
                $.ajax({
                    url: 'ajax/view/creature/' + $(this).attr('id') + '/',
                    success: function (answer) {
                        $('.details').html(answer)
                        $('li').removeClass('selected');
                        $('.details').removeClass('hidden');
                        //$('.charlist').addClass('hidden');
                        me.rebootLinks();
                    },
                    error: function (answer) {
                        console.error('View error...' + answer);
                    }
                });
            });
            $('td.editable.userinput').off();
            $('td.editable.userinput').hover(
                function (event) {
                    $(this).addClass('focus');
                    $('#userinput').focus();
                    me.rebootLinks();
                },
                function (event) {
                    $(this).removeClass('focus');
                    me.rebootLinks();
                });

            $('td.editable.updown').off();
            $('td.editable.updown').hover(
                function (event) {
                    $(this).find('i.blank').addClass('focus')
                    me.rebootLinks();
                },
                function (event) {
                    $(this).find('i.blank').removeClass('focus');
                    me.rebootLinks();
                });
            $('td.editable.updown').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let target = $(this).attr('id')
                let keys = $(this).attr('id').split('__')
                console.log(target);
                let shift = event.altKey
                let block = $(this).parent();
                let os = 1;
                if (shift) {
                    os = -1;
                }
                let keys_set = {id: keys[0], field: keys[1], offset: os}
                $.ajax({
                    url: 'ajax/editable/updown/',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    dataType: 'json',
                    data: keys_set,
                    success: function (answer) {
                        $('td#' + target).html(answer.new_value);
                        $('td#' + keys[0] + '__freebies').html(answer.freebies);
                    },
                    error: function (answer) {
                        $('td#' + target).html(answer.new_value);
                    },
                });
            });

            $('td.editable.userinput').on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let target = $(this).attr('id')
                let keys = $(this).attr('id').split('__')
                let ctrl = event.ctrlKey;
                let alt = event.altKey;
                let val = $('#text_edit').val();
                let param = $(this).attr("param") | undefined
                let block = $(this).parent();
                let myurl = 'ajax/editable/userinput/'
                if (param){
                    myurl += param+"/"
                }
                if (alt) {
                    let keys_set = {id: keys[0], field: keys[1], value: val}
                    $.ajax({
                        url: myurl,
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        dataType: 'json',
                        data: keys_set,
                        success: function (answer) {
                            $('td#' + target).html(answer.new_value);
                            $('td#' + keys[0] + '_freebies').html(answer.freebies);
                        },
                        error: function (answer) {
                            $('td#' + target).html(answer);
                        },
                    });
                }
                if (ctrl) {
                    if (param){
                        let v = $('td#' + target).html()

                    }else{
                        let v = $('td#' + target).html()
//                         $("#userinput").val(v)
                        $("textarea#text_edit").val(v)
                    }
                }
            });


            $('#add_creature').off().on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let val = $('#userinput').val();
                let keys_set = {creature: val}
                $.ajax({
                    url: 'ajax/add/creature/',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    dataType: 'json',
                    data: keys_set,
                    success: function (answer) {
                        $('.details').html(answer)
                        $('#userinput').val("");
                        rebootLinks();
                    },
                    error: function (answer) {
                        $('.details').html('oops, broken')
                        rebootLinks();
                    },

                });
            });

        });
    }

    perform() {
        let me = this;
        me.loadAjax();
        me.rebootLinks();
    }

}


















