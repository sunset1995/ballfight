import math
import time


# Define self used math function
def __floorEPS(lf):
    return math.floor(lf*100) / 100

def __dot(v1=[0,0], v2=[0,0]):
    return v1[0]*v2[0] + v1[1]*v2[1]

def __vLen(v=[0,0]):
    return math.sqrt(dot(v, v))

def __friction(vx=0, vy=0, k=1):
    return [-v[0]*k, -v[1]*k]


# Define public function and class
def BallCollision(A, B):
    base = [A.x-B.x, A.y-B.y]
    vLen = __vLen(base)
    base[0] /= vLen
    base[1] /= vLen
    pA = __dot([A.vx, A.vy], base)
    pB = __dot([B.vx, B.vy], base)
    var copA = [base[0]*pA, base[1]*pA]
    var copB = [base[0]*pB, base[1]*pB]
    A.vx += -copA[0] + copB[0]
    A.vy += -copA[1] + copB[1]
    B.vx += -copB[0] + copA[0]
    B.vy += -copB[1] + copA[1]

def BallDistance(A, B):
    return __vLen([A.x-B.x, A.y-B.y])

class Ball(object):
    """

    """


    # Define self used shared variable
    __fps = 40
    __duration = 1 / __fps
    __maxspeed = 700
    __maxforce = 10000

    ## Define self used member
    def __init__(self):
        self.__reset()

    def __reset(self, x=0, y=0):
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
        self.playing = False;

    def __next__(self):
        self.x += (self.vx + self.ax*self.__duration/2) * self.__duration
        self.y += (self.vy + self.ay*self.__duration/2) * self.__duration

        self.vx += self.ax*self.__duration
        self.vy += self.ay*self.__duration
        vLen = __vLen([self.vx, self.vy])
        if vLen>self.__maxspeed:
            self.vx *= self.__maxspeed/vLen
            self.vy *= self.__maxspeed/vLen

        fr = __friction(self.vx, self.vy, self.k)
        self.ax = (self.fx + fr[0]) / self.m
        self.ay = (self.fy + fr[1]) / self.m
    

    # Define public method
    def applyForce(f=[0,0]):
        if not self.playing:
            return
        vLen = __vLen(f)
        if vLen > self.__maxforce:
            f[0] *= self.__maxforce / vLen
            f[1] *= self.__maxforce / vLen
        self.fx = f[0]
        self.fy = f[1]

    def start(x=0, y=0):
        if self.playing:
            return
        self.__reset(x, y)
        self.playing = True

    def stop():
        self.playing = False
        self.k = 5
