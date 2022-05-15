from collector.utils.data_collection import MUNICH_DISTRICTS
from storytelling.models.cities import City
from storytelling.models.districts import District


def populate_munich():
    cities = City.objects.filter(name="Munich")
    if len(cities) == 1:
        city = cities.first()
        districts = District.objects.filter(city=city)
        for d in districts:
            d.delete()
        for k in MUNICH_DISTRICTS:
            for i in range(MUNICH_DISTRICTS[k]['sectors']):
                d = District()
                d.name = MUNICH_DISTRICTS[k]['name']
                d.code = f'{k} s{i + 1:02}'
                d.city = city
                d.color = MUNICH_DISTRICTS[k]['clan']
                d.save()



def re_title():
    cities = City.objects.filter(name="Munich")
    if len(cities) == 1:
        city = cities.first()
        districts = District.objects.filter(city=city)
        for d in districts:
            words = d.code.split(' ')
            d.d_num = int(words[0][1:])
            d.s_num = int(words[1][1:])
            d.title = f'{d.sector_name}&#13&#10({d.name.upper()})&#13&#10&#13&#10{d.code}&#13&#10Clan: {d.proeminent.title()}'
            d.save()

re_title()