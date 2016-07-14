import math


# Define self used math function
def floorEPS(lf):
    return int(lf*100) / 100

def friction(vx=0, vy=0, k=1):
    vx = floorEPS(-vx*k)
    vy = floorEPS(-vy*k)
    return [vx, vy]


# Define public function and class
def BallCollision(A, B):
    base = [A.x-B.x, A.y-B.y]
    vLen = math.sqrt(base[0]**2 + base[1]**2)
    base[0] /= vLen
    base[1] /= vLen
    pA = A.vx*base[0] + A.vy*base[1]
    pB = B.vx*base[0] + B.vy*base[1]
    copA = [base[0]*pA, base[1]*pA]
    copB = [base[0]*pB, base[1]*pB]
    A.vx += -copA[0] + copB[0]
    A.vy += -copA[1] + copB[1]
    B.vx += -copB[0] + copA[0]
    B.vy += -copB[1] + copA[1]


def BallDistance(A, B):
    v = [A.x-B.x, A.y-B.y]
    return math.sqrt(v[0]**2 + v[1]**2)


class Ball(object):


    # Define self used shared variable
    __maxspeed = 700
    __maxforce = 10000


    ## Define self used member
    def __init__(self):
        self.reset()

    def __norm__(self):
        self.x = floorEPS(self.x)
        self.y = floorEPS(self.y)
        self.vx = floorEPS(self.vx)
        self.vy = floorEPS(self.vy)
        self.ax = floorEPS(self.ax)
        self.ay = floorEPS(self.ay)
        self.fx = floorEPS(self.fx)
        self.fy = floorEPS(self.fy)

    # Define public method
    def reset(self, x=0, y=0):
        self.m = 1;
        self.x = x;
        self.y = y;
        self.vx = 0;
        self.vy = 0;
        self.ax = 0;
        self.ay = 0;
        self.fx = 0;
        self.fy = 0;
        self.k = 1;

    def applyForce(self, f=[0,0]):
        vLen = math.sqrt(f[0]**2 + f[1]**2)
        if vLen > self.__maxforce:
            f[0] *= self.__maxforce / vLen
            f[1] *= self.__maxforce / vLen
        self.fx = f[0]
        self.fy = f[1]

    def next(self, duration):
        self.x += (self.vx + self.ax*duration/2) * duration
        self.y += (self.vy + self.ay*duration/2) * duration

        self.vx += self.ax*duration
        self.vy += self.ay*duration
        vLen = math.sqrt(self.vx**2 + self.vy**2)
        if vLen>self.__maxspeed:
            self.vx *= self.__maxspeed/vLen
            self.vy *= self.__maxspeed/vLen

        fr = friction(self.vx, self.vy, self.k)
        self.ax = (self.fx + fr[0]) / self.m
        self.ay = (self.fy + fr[1]) / self.m

        self.__norm__()
