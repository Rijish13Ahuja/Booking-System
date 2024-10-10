import React, { useState } from 'react';
import { DateTime } from 'luxon';

const ShiftItem = ({ shift, setShifts, shifts, showBookButton }) => {
  const [loading, setLoading] = useState(false);

  const formatShiftTime = (timestamp) => {
    return DateTime.fromMillis(timestamp).toLocaleString(DateTime.TIME_SIMPLE);
  };

  const bookShift = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShifts(
        shifts.map((shift) =>
          shift.id === id ? { ...shift, booked: true } : shift
        )
      );
    }, 2000);
  };

  const cancelShift = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShifts(
        shifts.map((shift) =>
          shift.id === id ? { ...shift, booked: false } : shift
        )
      );
    }, 2000);
  };

  const isShiftAvailable = !shift.booked && shift.startTime >= Date.now();

  return (
    <div className="shift-item">
      <div className="shift-info">
        <div>
          <p><strong>{shift.area}</strong></p>
          <p>{formatShiftTime(shift.startTime)} - {formatShiftTime(shift.endTime)}</p>
        </div>
      </div>

      <div className="shift-actions">
        {loading ? (
          <img 
            src={showBookButton ? "/assets/spinner_green.svg" : "/assets/spinner_red.svg"} 
            alt="loading spinner" 
            style={{ width: '30px', height: '30px' }}
          />
        ) : (
          <>
            {showBookButton && (
              <button 
                className={`book-btn ${!isShiftAvailable ? 'unavailable' : ''}`}
                onClick={() => bookShift(shift.id)}
                disabled={!isShiftAvailable}
              >
                {shift.booked ? 'Booked' : 'Book'}
              </button>
            )}
            
            {!showBookButton && (
              <button 
                className="cancel-btn"
                onClick={() => cancelShift(shift.id)}
              >
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShiftItem;
