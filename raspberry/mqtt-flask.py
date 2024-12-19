from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler
import paho.mqtt.client as mqtt
import json
import os
import time
import requests

import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)


logging.basicConfig(level=logging.DEBUG)

handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://default:26HGjfsMmSWL@ep-falling-queen-a4mue2jy.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    dni = db.Column(db.Integer)
    fingerprint = db.Column(db.LargeBinary)
    rfid = db.Column(db.String(100))
    tag_rfid = db.Column(db.String(100))
    role = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'last_name': self.last_name,
            'dni': self.dni,
            'fingerprint': self.fingerprint.hex() if self.fingerprint else None,
            'rfid': self.rfid,
            'tag_rfid': self.tag_rfid,
            'role': self.role
        }

class AccessActivity(db.Model):
    __tablename__ = 'access_activity'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    datetime = db.Column(db.DateTime, default=db.func.now())
    exit_datetime = db.Column(db.DateTime)
    event = db.Column(db.String(100))
    access_type = db.Column(db.String(50))
    lector_id = db.Column(db.Integer, db.ForeignKey('lectors.id'))

class Administrator(db.Model):
    __tablename__ = 'administrators'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.Text)
    name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    role = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=db.func.now())

class Lector(db.Model):
    __tablename__ = 'lectors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    location = db.Column(db.String(255), default=None)
    role_user_required = db.Column(db.Integer)
    status = db.Column(db.String(50))

MQTT_BROKER = 'localhost'
MQTT_PORT = 1883
MQTT_TOPIC = 'users/update'
MQTT_ACTIVITY_TOPIC = 'users/activity'

mqtt_client = mqtt.Client()
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe([(MQTT_TOPIC, 0), (MQTT_ACTIVITY_TOPIC, 0)])

def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    if msg.topic == MQTT_TOPIC:
        print("Received update on topic: {}: {}".format(msg.topic, data))
    elif msg.topic == MQTT_ACTIVITY_TOPIC:
        print("Received activity on topic: {}: {}".format(msg.topic, data))
        response = requests.post('http://localhost:5000/user_activity', json=data)
        print(f"Posted to /user_activity with response {response.status_code}")

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

def publish_users():
    with app.app_context():
        users = User.query.all()
        for user in users:
            user_data = json.dumps(user.to_dict())
            if len(user_data) <= 256:
                mqtt_client.publish(MQTT_TOPIC, user_data)
                time.sleep(0.1)  
            else:
                app.logger.error(f"Data too large for MQTT packet: {user_data}")

def save_data_to_file(data):
    try:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(base_dir, 'user_data.json')
        with open(file_path, 'w') as f:
            json.dump(data, f)
        app.logger.debug(f"Data successfully saved to {file_path}")
    except Exception as e:
        app.logger.error(f"Failed to save data: {e}")

def load_data_from_file():
    try:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(base_dir, 'user_data.json')
        if not os.path.exists(file_path):
            return []
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data
    except Exception as e:
        app.logger.error(f"Failed to load data: {e}")
        return []

scheduler = BackgroundScheduler()
scheduler.add_job(func=publish_users, trigger='interval', minutes=1)
scheduler.start()


@app.route('/users', methods=['GET', 'POST'])
def handle_users():
    if request.method == 'POST':
        data = request.get_json()
        new_user = User(**data)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    else:
        try:
            users = User.query.all()
            users_data = [user.to_dict() for user in users]
        except:
            users_data = load_data_from_file()
        return jsonify(users_data), 200

@app.route('/user_activity', methods=['POST'])
def handle_user_activity():
    data = request.get_json()
    new_activity = AccessActivity(**data)
    db.session.add(new_activity)
    db.session.commit()
    return jsonify(new_activity.to_dict()), 201


@app.route('/administrators', methods=['GET', 'POST'])
def handle_administrators():
    if request.method == 'POST':
        data = request.get_json()
        new_admin = Administrator(**data)
        db.session.add(new_admin)
        db.session.commit()
        return jsonify(new_admin.to_dict()), 201
    else:
        administrators = Administrator.query.all()
        return jsonify([admin.to_dict() for admin in administrators]), 200

@app.route('/lectors', methods=['GET', 'POST'])
def handle_lectors():
    if request.method == 'POST':
        data = request.get_json()
        new_lector = Lector(**data)
        db.session.add(new_lector)
        db.session.commit()
        return jsonify(new_lector.to_dict()), 201
    else:
        lectors = Lector.query.all()
        return jsonify([lector.to_dict() for lector in lectors]), 200
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        try:
            users = User.query.all()
            users_data = [user.to_dict() for user in users]
            save_data_to_file(users_data)
        except Exception as e:
            app.logger.error(f"Error fetching data from database or saving data: {e}")
    app.run(debug=True, host='0.0.0.0', port=5000)