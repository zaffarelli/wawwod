from django import template
import re
import string

register = template.Library()


@register.filter(name='as_bullets')
def as_bullets(value, options=''):
    """ Change int value to list of bullet (Mark Rein*Hagen like)
    """
    if options == '':
        max = 10
    else:
        tokens = options.split(',')
        max = int(tokens[0])
    one = '<i class="fas fa-circle fa-xs" title="%d"></i>' % (value)
    blank = '<i class="fas fa-circle fa-xs blank" title="%d"></i>' % (value)
    x = 0
    res = ''
    while x < max:
        if x < int(value):
            res += one
        else:
            res += blank
        if (x + 1) % 10 == 0:
            res += '<br/>'
        elif (x + 1) % 5 == 0:
            res += '&nbsp;'
        x += 1
    return res


@register.filter(name='param_stack')
def param_stack(x_trait, x_id=''):
    return x_trait, x_id


@register.filter(name='as_entry')
def as_entry(stack, x_field=''):
    """ Display table lines as editable disciplines """
    x_t, x_id = stack
    x_trait, x_datafield = x_t
    if x_datafield != "xxx":
        res = f'<div class="plank entry"><div class="shard label edit_trigger" id="trigger_{x_id}__{x_field}__{x_datafield}">{x_field}</div><div class="shard data editable userinput edit_field" id="field_{x_id}__{x_field}__{x_datafield}">{x_trait}</div></div>'
    else:
        res = f'<div class="plank entry"><div class="shard label " id="trigger_{x_id}__{x_field}__{x_datafield}">{x_field}</div><div class="shard data editable userinput edit_field" id="field_{x_id}__{x_field}__{x_datafield}">{x_trait}</div></div>'
    return res



@register.filter(name='as_stat_name')
def as_stat_name(stack, x_field=''):
    x_creature, x_id = stack
    value = STATS_NAMES[str(x_creature)][x_field + 's'][int(x_id)]
    return value.title()


@register.filter(name='as_editable_updown')
def as_editable_updown(value, options=''):
    keys = options.split(',')
    aid = int(keys[0])
    afield = keys[1]
    res = "<td class='editable updown' id='%d_%s'>" % (aid, afield)
    return res


@register.filter(name='as_boolean_entry')
def as_boolean_entry(stack, x_field=''):
    """ Display table lines as editable disciplines """
    from django.utils.safestring import SafeString
    x_t, x_id = stack
    x_trait, x_datafield = x_t
    print(x_trait)
    if x_trait !=  False:
        b = SafeString("<i class='fa fa-check-square'></i>")
    else:
        b = SafeString("<i class='fa fa-square'></i>")


    if x_datafield:
        res = f'<div class="plank entry"><div class="shard label edit_trigger" id="trigger_{x_id}__{x_field}__{x_datafield}">{x_field}</div><div class="shard data editable userinput edit_field" id="field_{x_id}__{x_field}__{x_datafield}">{b}</div></div>'
    else:
        res = f'<div class="plank entry"><div class="shard label " id="trigger_{x_id}__{x_field}__{x_datafield}">{x_field}</div><div class="shard data editable userinput edit_field" id="field_{x_id}__{x_field}__{x_datafield}">{b}</div></div>'
    return res

@register.filter(name='as_tags')
def as_tags(value):
    tags = value.split(" ")
    answer = ''
    for tag in tags:
        if tag:
            k = ""
            if tag in ["DREAM", "MYSTIC", "WEIRD"]:
                k = ' class="blue" '
            if tag in ["HEROIC", "EPIC", "BADASS"]:
                k = ' class="red" '
            if tag in ["MAJOR", "KEY_SCENE", "INTRODUCTION", "DEBRIEFING", "DOWNTIME", "EVENT"]:
                k = ' class="purple" '
            answer += "<tt "+k+">&square;&nbsp;"+tag+"</tt>   "
    return answer
