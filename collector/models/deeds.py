from django.db import models
from django.contrib import admin


class Deed(models.Model):
    description = models.TextField(max_length=256, blank=True, default='')
    category = models.CharField(max_length=64, blank=True, default='')
    notes = models.TextField(max_length=256, blank=True, default='')
    glory = models.IntegerField(blank=True, default=0)
    honor = models.IntegerField(blank=True, default=0)
    wisdom = models.IntegerField(blank=True, default=0)
    code = models.CharField(max_length=64, blank=True, default='')

    def fix(self):
        if self.code == "":
            if self.category and self.description:
                import hashlib
                h = hashlib.blake2b(digest_size=3)
                h.update(bytes(self.description+self.notes,'utf-8'))
                self.code = (self.category[:3]+"_"+h.hexdigest()).upper()
        pass

    @classmethod
    def extract_all(cls):
        deeds = cls.objects.all().order_by('category', 'notes', 'description')
        cat = ''
        for deed in deeds:
            if deed.category != cat:
                cat = deed.category
                print(cat)
                print(f'{"Description":>50} {"Notes":<40} {"G":5} {"H":5} {"W":5}')
            print(f'{deed.description:>50} {deed.notes:<40} {deed.glory:5} {deed.honor:5} {deed.wisdom:5}')

    @classmethod
    def all_to_html(cls):
        deeds = cls.objects.all().order_by('category', 'notes', 'description')
        cat = ''
        html = []
        html.append("<div class='html_block'>")
        html.append("<table class='renown'>")
        col1 = "#e0e0e0"
        col2 = "#f0e0e0"
        x = col1
        for deed in deeds:
            if deed.category != cat:
                cat = deed.category
                html.append(f"<tr><th colspan='5'>{cat}</th></tr>")
                html.append(
                    f'<tr><th>{"Description"}</th><th>{"Glory"}</th><th>{"Honor"}</th><th>{"Wisdom"}</th></tr>')
            html.append(f'<tr><td class="text"  style="background:{x};"><tt>[{deed.code}]</tt> {deed.description}</td><td rowspan=2  style="background:{x};">{deed.glory}</td><td rowspan=2  style="background:{x};">{deed.honor}</td><td rowspan=2  style="background:{x};">{deed.wisdom}</td></tr><tr  style="background:{x};"><td class="notes"  style="background:{x};">{deed.notes}</td></tr>')
            if x == col1:
                x = col2
            else:
                x = col1
        html.append("</table>")
        html.append("</div>")
        return "".join(html)

    @classmethod
    def adventure_to_html(cls,adventure=None):
        adventure_deeds = adventure.deeds_map_str
        deeds = cls.objects.all().order_by('category', 'notes', 'description')
        cat = ''
        html = []
        html.append("<div class='html_block'>")
        html.append("<table class='renown'>")
        html.append(f"<tr><th colspan='5'>Adventure: {adventure.name}</th></tr>")
        col1 = "#e0e0e0"
        col2 = "#f0e0e0"
        x = col1
        for deed in deeds:
            if deed.category != cat:
                cat = deed.category
                html.append(f"<tr><th colspan='5'>{cat}</th></tr>")
                html.append(
                    f'<tr><th>{"Description"}</th><th>{"Glory"}</th><th>{"Honor"}</th><th>{"Wisdom"}</th></tr>')
            if deed.code in adventure_deeds:
                selector = f'<span class="deed_select yes" id="{adventure.acronym}__{deed.code}" params="{adventure.acronym}__{deed.code}"><i class="fas fa-check"></i></span>&nbsp;'
            else:
                selector = f'<span class="deed_select no" id="{adventure.acronym}__{deed.code}" params="{adventure.acronym}__{deed.code}"><i class="fas fa-times"></i></span>&nbsp;'
            html.append(f'<tr><td class="text" style="background:{x};">{selector} <tt>[{deed.code}]</tt> {deed.description}</td><td rowspan=2  style="background:{x};">{deed.glory}</td><td rowspan=2  style="background:{x};">{deed.honor}</td><td rowspan=2  style="background:{x};">{deed.wisdom}</td></tr><tr  style="background:{x};"><td class="notes"  style="background:{x};">{deed.notes}</td></tr>')
            if x == col1:
                x = col2
            else:
                x = col1
        html.append("</table>")
        html.append("</div>")
        return "".join(html)

    @classmethod
    def players_to_html(cls,adventure=None):
        adventure_deeds = adventure.deeds_map_str
        deeds = cls.objects.all().order_by('category', 'notes', 'description')
        cat = ''
        html = []
        html.append("<div class='html_block'>")
        html.append("<table class='renown'>")
        html.append(f"<tr><th colspan='5'>Adventure Records: {adventure.name}</th></tr>")
        col1 = "#e0e0e0"
        col2 = "#f0e0e0"
        x = col1
        html.append(f'<tr><th>{"Description"}</th><th>{"Glory"}</th><th>{"Honor"}</th><th>{"Wisdom"}</th></tr>')
        for deed in deeds:
            if deed.code in adventure_deeds:
                html.append(f'<tr><td class="text" style="background:{x};"><tt>[{deed.code}]</tt> {deed.description}</td><td rowspan=2  style="background:{x};">{deed.glory}</td><td rowspan=2  style="background:{x};">{deed.honor}</td><td rowspan=2  style="background:{x};">{deed.wisdom}</td></tr><tr  style="background:{x};"><td class="notes"  style="background:{x};">{deed.notes}</td></tr>')
            if x == col1:
                x = col2
            else:
                x = col1
        html.append("</table>")
        html.append("</div>")
        return "".join(html)


class DeedAdmin(admin.ModelAdmin):
    list_display = ['category','code', 'description', 'notes', 'glory', 'honor', 'wisdom']
    ordering = ['category', 'description', 'glory', 'honor', 'wisdom']
    list_filter = ['category', 'glory', 'honor', 'wisdom']
    search_fields = ['description', 'notes', 'category']
    list_editable = ['description', 'notes', 'glory', 'honor', 'wisdom']
    from collector.utils.helper import refix
    actions = [refix]