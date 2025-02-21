import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    keyPrefix: 'employee:'
});

class CacheService {
    constructor() {
        this.redis = redis;
        this.DEFAULT_EXP = 3600;
    }

    async get(key) {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key, value, exp = this.DEFAULT_EXP) {
        await this.redis.set(key, JSON.stringify(value), 'EX', exp);
    }

    async del(key) {
        await this.redis.del(key);
    }

    async flush() {
        await this.redis.flushall();
    }
}

export default new CacheService();