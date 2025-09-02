import png
import yaml


class PaletteMaker:
    def __init__(self):
        self.config = None
        self.data = {}
        self.step = 9
        self.stroke = 1

    def loadConfig(self):
        with open('./scripts/palettemaker.yml', 'r') as file:
            self.config = yaml.safe_load(file)

    def perform(self):
        self.loadConfig()
        cnt = len(self.config['categories'])
        width = (self.step + self.stroke) * cnt
        height = (self.step + self.stroke) * self.config['variants']
        img = []
        for y in range(height):
            row = ()
            for x in range(width):
                row = row + (x, max(0, 255 - x - y), y)
            img.append(row)
        with open('gradient.png', 'wb') as f:
            w = png.Writer(width, height, greyscale=False)
            w.write(f, img)


for y in range(height):
    row = ()
    for x in range(width):
        row = row + (x, max(0, 255 - x - y), y)
    img.append(row)
with open('gradient.png', 'wb') as f:
    w = png.Writer(width, height, greyscale=False)
    w.write(f, img)


PaletteMaker().perform()
