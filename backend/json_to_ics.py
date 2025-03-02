from flask import Flask, request, jsonify, send_from_directory, url_for
from datetime import datetime, timedelta
import uuid
import os
import json

app = Flask(__name__)

# Directory to save generated ICS files
ICS_DIR = "ics_files"
os.makedirs(ICS_DIR, exist_ok=True)

def generate_ics(data):
    ics_content = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//Your Product//EN\n"
    
    for item in data.get("events", []):
        event = item.get("event", {})
        # Parse the event date and time
        dtstart = datetime.fromisoformat(event["event_date_and_time"])
        dtend = dtstart + timedelta(minutes=event["event_duration"])
    
        # Format date and time in iCalendar format
        dt_format = "%Y%m%dT%H%M%S"
        dtstart_str = dtstart.strftime(dt_format)
        dtend_str = dtend.strftime(dt_format)
        dtstamp_str = datetime.utcnow().strftime(dt_format) + "Z"
    
        # Unique ID for the event
        uid = str(uuid.uuid4())
    
        ics_content += "BEGIN:VEVENT\n"
        ics_content += f"UID:{uid}\n"
        ics_content += f"DTSTAMP:{dtstamp_str}\n"
        ics_content += f"DTSTART:{dtstart_str}\n"
        ics_content += f"DTEND:{dtend_str}\n"
        ics_content += f"SUMMARY:{event.get('event_name','')}\n"
        ics_content += f"DESCRIPTION:{event.get('event_description','')}\n"
        ics_content += f"LOCATION:{event.get('event_location','')}\n"
        ics_content += "END:VEVENT\n"
    
    ics_content += "END:VCALENDAR\n"
    return ics_content

@app.route("/generate-ics", methods=["POST"])
def generate_ics_api():
    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({"error": "Invalid JSON input"}), 400

    ics_content = generate_ics(data)
    
    # Create a unique filename for the ICS file
    filename = f"events_{uuid.uuid4().hex}.ics"
    filepath = os.path.join(ICS_DIR, filename)
    
    with open(filepath, "w") as f:
        f.write(ics_content)
    
    # Generate a download link (assumes the server is running on the same host)
    download_url = url_for("download_file", filename=filename, _external=True)
    
    # Print the download link for testing
    print("Download link:", download_url)
    
    return jsonify({"download_url": download_url}), 200

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):
    return send_from_directory(ICS_DIR, filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)