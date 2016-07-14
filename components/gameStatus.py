class GameStatus():
    
    # (hero)lose/win/playing/first
    game_status = {
        # [x, y, vx, vy]
        'hero': [0, -250, 0, 0],
        'monster': [0, 250, 0, 0],
        'arena': 700,
        'result': 'first'
    }
    role_action = {
        # [fx, fy]
        'hero': [0, 0],
        'monster': [0, 0]
    }

    # mapping sid to role
    sid = dict()

    def __init__(self):
        pass

    def reset(self):
        self.game_status = {
            # [x, y, vx, vy]
            'hero': [0, -250, 0, 0],
            'monster': [0, 250, 0, 0],
            'arena': 700,
            'result': 'first'
        }
        self.role_action = {
            # [fx, fy]
            'hero': [0, 0],
            'monster': [0, 0]
        }
