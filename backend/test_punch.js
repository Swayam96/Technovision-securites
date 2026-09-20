const { punchCheckIn, punchCheckOut } = require('./src/models/attendance');
const dayjs = require('dayjs');

async function test() {
    const now = dayjs();
    const date = now.format('YYYY-MM-DD');
    const time = now.toDate(); 
    try {
        await punchCheckIn(1, 1, date, time);
        console.log("Punched in successfully");
    } catch (e) {
        console.error("Punch in error:", e);
    }
}
test().then(() => process.exit(0));
