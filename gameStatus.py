class gameStatus():

    def __init__(self):
        self.game_status = {
            # [x, y, vx, vy]
            'hero': [0, 0, 0, 0],
            'monster': [0, 0, 0, 0],
            'arena': 0
        }
        self.role_action = {
            # [fx, fy]
            'hero': [0, 0],
            'monster': [0, 0]
        }

        # mapping sid to role
        self.sid = dict()
