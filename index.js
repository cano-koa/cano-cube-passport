const Cube = require('cano-cube');
const requireAll = require('require-all');
const map = require('lodash/map');
const path = require('path');
const passport = require('koa-passport');

/**
  * @class PassportCube
  * @classdesc This cube is for configure and load passport to the cano app core
  * @extends Cube
  * @author Antonio Mejias
  */
class PassportCube extends Cube {
    /**
     * @constructs
     * @author Antonio Mejias
     */
    constructor(cano) {
        super(cano);
    }

    /**
     * @override
     * @method prepare
     * @description set the passport middleware into cano core
     * @author Antonio Mejias
     */
    prepare() {
        this.cano.use(passport.initialize());
    }

    /**
     * @override
     * @method up
     * @description This method run the cube Passport main logic, in this case, instance
     * all the strategies in the api folder and bind it to the passport core
     * @author Antonio Mejias
     */
    up() {
        return new Promise((resolve) => {
            const strategies = requireAll(this.strategiesPath);
            map(strategies, (Strategy) => {
                const { options } = Strategy;
                if (options && options().strategyName) {
                    passport.use(options().strategyName, new Strategy());
                } else {
                    passport.use(new Strategy());
                }
            })
            this.cano.passport = passport;
            resolve();
        })
    }

    /**
     * @method strategiesPath
     * @description This method is a getter that return the absolute path where the
     * strategies are located
     * @author Antonio Mejias
     */
    get strategiesPath() {
        return path.join(this.cano.app.paths.api, '/strategies');
    }
}

module.exports = PassportCube;
