
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Appointment

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("/")
def create_appointment(data: dict, db: Session = Depends(get_db)):
    required = ["doctor_name", "specialty", "appointment_time"]

    if any(not data.get(field) for field in required):
        raise HTTPException(status_code=400, detail="Required fields missing")

    try:
        appointment_time = datetime.fromisoformat(data["appointment_time"])
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

    appointment = Appointment(
        doctor_name=data["doctor_name"],
        specialty=data["specialty"],
        appointment_time=appointment_time,
        location=data.get("location"),
        status="Scheduled"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment


@router.get("/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(
        Appointment.appointment_time.asc()
    ).all()


@router.delete("/{appointment_id}")
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appointment)
    db.commit()

    return {"message": "Appointment deleted"}
