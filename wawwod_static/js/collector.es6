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
        $('.charlist').addClass('hidden');
        $('.storyboard_handler').addClass('hidden');
    }

    registerDisplay() {
        let me = this;
        $('.display').off().on('click', function (event) {
            let action = $(this).attr('action');
            let param = $(this).attr('param');
            let key = $('#userinput').val();
            let url = 'ajax/display/' + action + '/';
            if (param != undefined) {
                if (action == 'crossover_sheet') {
                    url = 'ajax/display/' + action + '/' + param + '/';
                }
                if (action == 'kindred_lineage') {
                    url = 'ajax/display/' + action + '/' + param + '/';
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
                    if (action == 'kindred_lineage') {
                        let d = JSON.parse(answer.data);
                        me.d3 = new KindredLineage(d, "#d3area", me);
                        me.d3.perform();
                    }
                    if (action == 'crossover_sheet') {
                        let s = JSON.parse(answer.settings);
                        let d = JSON.parse(answer.data);
                        me.d3 = new CrossOverSheet(s, "#d3area", me);
                        me.d3.perform(d);
                    }
                    if (action == 'storytelling') {
                        let s = JSON.parse(answer.settings);
                        let d = JSON.parse(answer.data);
                        me.d3 = new Storytelling(s, "#d3area", me);
                        me.d3.perform(d);
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
            let stories = me.d3.getStories();
            let url = 'ajax/action/' + action + '/' + param + "__" + stories + '/';
            $.ajax({
                url: url,
                success: function (answer) {
                    let d = JSON.parse(answer["changes_on_scenes"])
                    me.d3.changeScenes(d);
                    me.rebootLinks();
                },
                error: function (answer) {
                    console.error(answer);
                    me.rebootLinks();
                },
            });
        });
    }

    registerCollectorAction() {
        let me = this;
        $('.collector_action').off().on('click', function (event) {
            let action = $(this).attr('action');
            let param = $('#userinput').val();
            let newparam = (param.split(" ")).join("_");
            let url = 'ajax/collector_action/' + action + '/' + newparam +'/';
            $.ajax({
                url: url,
                success: function (answer) {
                    console.log("ok")
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

    registerToggle() {
        let me = this;
        $('.toggle').off().on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Toggle click!')
            let tgt = $(this).attr('param');
            $('.'+tgt).toggleClass('hidden');
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
                $('.charlist').addClass('hidden');
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

            $('.view_creature').off();
            $('.view_creature').on('click', function (event) {
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
                        $('.charlist').addClass('hidden');
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
                let shift = event.shiftKey
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
                let shift = event.shiftKey;
                let val = $('#userinput').val();
                let block = $(this).parent();
                if (shift) {
                    let keys_set = {id: keys[0], field: keys[1], value: val}
                    $.ajax({
                        url: 'ajax/editable/userinput/',
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


















