import ShiftItem from './ShiftItem';
import { DateTime } from 'luxon';

const Shifts = ({ activeTab, selectedCity, shifts, setShifts }) => {
  const filteredShifts = shifts.filter(shift => shift.area === selectedCity);
  const availableShifts = filteredShifts.filter(shift => !shift.booked);
  const myShifts = filteredShifts.filter(shift => shift.booked);

  const formatDateLabel = (startTime) => {
    const now = DateTime.now();
    const shiftDate = DateTime.fromMillis(startTime);

    if (shiftDate.hasSame(now, 'day')) {
      return 'Today';
    } else {
      return shiftDate.toLocaleString(DateTime.DATE_MED);
    }
  };

  const groupShiftsByDate = (shifts) => {
    return shifts.reduce((acc, shift) => {
      const date = DateTime.fromMillis(shift.startTime).toISODate();
      if (!acc[date]) {
        acc[date] = { totalHours: 0, count: 0 };
      }
      acc[date].totalHours += (shift.endTime - shift.startTime) / 3600000; // Convert milliseconds to hours
      acc[date].count += 1;
      return acc;
    }, {});
  };

  const myShiftsGrouped = groupShiftsByDate(myShifts);
  const today = DateTime.now().toISODate();

  return (
    <div className="shifts-list">
      {activeTab === 'Available shifts' ? (
        availableShifts.length > 0 ? (
          availableShifts.map((shift, index) => (
            <div key={index}>
              {index === 0 || formatDateLabel(availableShifts[index - 1].startTime) !== formatDateLabel(shift.startTime) ? (
                <h3>{formatDateLabel(shift.startTime)}</h3>
              ) : null}
              <ShiftItem
                shift={shift}
                setShifts={setShifts}
                shifts={shifts}
                showBookButton={true}
              />
            </div>
          ))
        ) : (
          <p>No available shifts in {selectedCity}</p>
        )
      ) : (
        myShifts.length > 0 ? (
          <>
            {Object.entries(myShiftsGrouped).map(([date, { totalHours, count }]) => (
              <div key={date}>
                <h3>
                  {date === today ? 'Today' : DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED)} 
                  <span style={{ fontWeight: 'lighter', marginLeft: '8px' }}>
                    {count} shifts, {totalHours.toFixed(1)} hours
                  </span>
                </h3>
                {myShifts
                  .filter(shift => DateTime.fromMillis(shift.startTime).toISODate() === date)
                  .map((shift, index) => (
                    <ShiftItem
                      key={index}
                      shift={shift}
                      setShifts={setShifts}
                      shifts={shifts}
                      showBookButton={false}
                    />
                  ))}
              </div>
            ))}
          </>
        ) : (
          <p>You have no booked shifts in {selectedCity}</p>
        )
      )}
    </div>
  );
};

export default Shifts;
