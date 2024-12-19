from fastapi import FastAPI
from database import engine, Base
import users
import lectors
import access_activity

# Crear todas las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Incluir routers de los módulos
app.include_router(users.router)
app.include_router(lectors.router)
app.include_router(access_activity.router)

# Raíz para verificar el estado de la API
@app.get("/")
async def root():
    return {"message": "API is running successfully!"}
