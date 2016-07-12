class gameStatus():
    """docstring for GameStatus"""
    def __init__(self):
        self.game_status = {
            'hero': {
                'x': 0,
                'y': 0,
                'vx': 0,
                'vy': 0
            },
            'monster': {
                'x': 0,
                'y': 0,
                'vx': 0,
                'vy': 0
            },
            'arena': 0
        }
        self.role_action = {
            'hero': [0, 0],
            'monster': [0, 0]
        }

        # mapping sid to role
        self.sid = dict()
