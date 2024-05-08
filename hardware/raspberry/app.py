# Importa las librerías necesarias para la aplicación
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler
import paho.mqtt.client as mqtt
import json
import os
import time

# Configuraciones para manejar logs dentro de la aplicación
import logging
from logging.handlers import RotatingFileHandler

# Inicializa la aplicación Flask
app = Flask(__name__)

# Configuración básica de logging
logging.basicConfig(level=logging.DEBUG)

# Configuración avanzada de logging con rotación de archivos
handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)

# Configura la URI de la base de datos y deshabilita el seguimiento de modificaciones para mejorar el rendimiento
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://default:26HGjfsMmSWL@ep-falling-queen-a4mue2jy.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define un modelo de usuario utilizando SQLAlchemy para interactuar con la base de datos
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

    # Método para convertir objetos de usuario a diccionario para su fácil serialización
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

# Configuración del broker MQTT local y tópico
MQTT_BROKER = 'localhost'
MQTT_PORT = 1883
MQTT_TOPIC = 'users/update'

# Creación y configuración del cliente MQTT
mqtt_client = mqtt.Client()

# Función que se ejecuta al conectar con el broker MQTT
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(MQTT_TOPIC)

# Función que se ejecuta al recibir un mensaje MQTT
def on_message(client, userdata, msg):
    data = json.loads(msg.payload.decode())
    print("Received message on topic: {}: {}".format(msg.topic, data))

# Publica información de los usuarios en el tópico MQTT
def publish_users():
    with app.app_context():
        users = User.query.all()
        for user in users:
            user_data = json.dumps(user.to_dict())
            if len(user_data) <= 256:
                mqtt_client.publish(MQTT_TOPIC, user_data)
                time.sleep(0.1)  # Evita saturación del broker
            else:
                app.logger.error(f"Data too large for MQTT packet: {user_data}")

# Funciones para manejar la carga y guardado de datos en un archivo JSON local
def save_data_to_file(data):
    try:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        file_path = os.path.join(base_dir, 'user_data.json')
        with open(file_path, 'w') as f:
            json.dump(data, f)
        app.logger.debug(f"Data successfully saved to {file_path}")
    except Exception as e:
        app.logger.debug(f"Failed to save data: {e}")

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
        app.logger.debug(f"Failed to load data: {e}")
        return []

# Asigna funciones de conexión y mensajes al cliente MQTT, inicia su ciclo de ejecución
mqtt_client.on_connect = on_connect
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

# Inicia el planificador en segundo plano y añade la tarea de publicar usuarios
scheduler = BackgroundScheduler()
scheduler.add_job(func=publish_users, trigger='interval', minutes=1)
scheduler.start()

# Define rutas Flask para manejar solicitudes GET y POST
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

# Inicializa la aplicación y la base de datos al iniciar el script
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

