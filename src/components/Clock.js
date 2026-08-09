import { useEffect, useState } from "react";
import { ClockHistory } from "react-bootstrap-icons";

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    // fills with 0s to look good
    const hours = String(time.getUTCHours()).padStart(2, '0');
    const minutes = String(time.getUTCMinutes()).padStart(2, '0');
    const seconds = String(time.getUTCSeconds()).padStart(2, '0');

    const utcTime = `${hours}:${minutes}:${seconds}`;

    return (
        <h2 className='text-center' suppressHydrationWarning><ClockHistory /> Server Time: {utcTime}</h2>
    );
}