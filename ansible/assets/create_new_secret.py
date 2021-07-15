import random
pattern_string = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$^&*(-_=+)'
l = len(pattern_string)
new_secret = ''.join([random.choice(pattern_string) for i in range(l-1)])
print(f'\nSECRET_KEY = "{new_secret}"')

