import "../css/Schedule.css";

function Schedule() {
  return (
    <div className="table-container">
      <div className="table-section" id="schedule">
        <div className="table-heading">Schedule</div>
        <div className="schedule-grid">
          <table className="table">
            <caption>Saturday</caption>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10:30</td>
                <td>Check In</td>
              </tr>
              <tr>
                <td>11:30</td>
                <td>Introduction</td>
              </tr>
              <tr>
                <td>12:00</td>
                <td>Start Coding</td>
              </tr>
              <tr>
                <td>18:00</td>
                <td>Pizza</td>
              </tr>
            </tbody>
          </table>

          <table className="table">
            <caption>Sunday</caption>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:00</td>
                <td>Breakfast</td>
              </tr>
              <tr>
                <td>12:00</td>
                <td>Coding Ends</td>
              </tr>
              <tr>
                <td>12:15</td>
                <td>Judging Begins</td>
              </tr>
              <tr>
                <td>15:00</td>
                <td>Closing Presentation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
