export default class RenderLoop {
    constructor(callback, fps) {
        this.msLastFrame = null;
        this.callback = callback;
        this.isActive = false;
        this.fps = 0;

        if (typeof fps !== 'undefined' && fps > 0) {
            this.msFpsLimit = 1000 / fps;

            this.run = () => {
                const msCurrent = performance.now(),
                      msDelta   = (msCurrent - this.msLastFrame),
                      deltaTime = msDelta / 1000.0;

                if (msDelta >= this.msFpsLimit) {
                    this.fps = Math.floor(1 / deltaTime);
                    this.msLastFrame = msCurrent;
                    this.callback(deltaTime);
                }

                if (this.isActive)
                    window.requestAnimationFrame(this.run);
            };
        } else {
            this.run = () => {
                const msCurrent = performance.now(),
                      deltaTime = (msCurrent - this.msLastFrame) / 1000.0;

                this.fps = Math.floor(1 / deltaTime);
                this.msLastFrame = msCurrent;

                this.callback(deltaTime);
                if (this.isActive)
                    requestAnimationFrame(this.run);
            };
        }
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
    }
}
