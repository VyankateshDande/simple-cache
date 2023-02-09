class cache {
    #store = new Map()
    #sweepQueue = new Array();
    lifetime;

    constructor(lifetime) {
        this.lifetime = lifetime;
        this.#sweep()
    }

    set(key, value) {
        this.#store.set(key, value);
        this.#sweepQueue.push([key, Date.now()]);
        return value;
    }

    get(key) {
        try {
            let value = this.#store.get(key).value;
            this.#sweepQueue = this.#sweepQueue.filter(id => id[0] != key);
            this.#sweepQueue.push([key, Date.now()])
            return value
        } catch {
            return undefined
        }
    }

    #sweep() {
        setInterval(() => {
            try {
                let key = this.#sweepQueue[0][0];
                if (
                    ( Date.now() - this.#sweepQueue[0][1] ) > this.lifetime
                ) {
                    this.#sweepQueue.shift();
                    this.#store.delete(key);
                };
            } catch { }
        }, 100)
    }
}