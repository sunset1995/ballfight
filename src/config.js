module.exports = {
    // Network related
    interval: 1000 / 25,

    // Game related
    radiusInit: 350,
    radiusDecreasePerTerm: 0.5,
    ballRadius: 50,
    playerInit: {
        common: {
            vx: 0,
            vy: 0,
            ax: 0,
            ay: 0,
            fx: 0,
            fy: 0,
        },
        specific: [
            {
                x: -200,
                y: -200,
            },
            {
                x: 200,
                y: -200,
            },
            {
                x: 200,
                y: 200,
            },
            {
                x: -200,
                y: 200,
            },
        ],
    },

    // Physical engine related
    unitTime: 0.025,
    maxForce: 1000,
    maxSpeed: 500,
};
