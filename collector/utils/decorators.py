

def player_of_current(func):
    def wrap():
        return func()
    return wrap