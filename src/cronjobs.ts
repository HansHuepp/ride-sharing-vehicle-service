import cron  from 'node-cron'
import { rideMatchingEngine } from '.';

export class CronJobs {
    startCronJobs() {
        cron.schedule('*/5 * * * * *', async () => {
            try {
                await rideMatchingEngine();
            } catch (error) {
                console.error(error);
            }
        });
    }
}