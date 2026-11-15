
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Medication, Dose
from schemas import (
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse,
    DoseCreate,
    DoseStatusUpdate,
    DoseResponse
)

router = APIRouter(prefix="/medications", tags=["Medications"])


@router.post("/", response_model=MedicationResponse)
def create_medication(data: MedicationCreate, db: Session = Depends(get_db)):
    medication = Medication(**data.model_dump())

    db.add(medication)
    db.commit()
    db.refresh(medication)

    return medication


@router.get("/", response_model=list[MedicationResponse])
def get_medications(db: Session = Depends(get_db)):
    return db.query(Medication).order_by(Medication.id.desc()).all()


@router.get("/{medication_id}", response_model=MedicationResponse)
def get_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(
        Medication.id == medication_id
    ).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    return medication


@router.put("/{medication_id}", response_model=MedicationResponse)
def update_medication(
    medication_id: int,
    data: MedicationUpdate,
    db: Session = Depends(get_db)
):
    medication = db.query(Medication).filter(
        Medication.id == medication_id
    ).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    updates = data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(medication, field, value)

    db.commit()
    db.refresh(medication)

    return medication


@router.delete("/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(
        Medication.id == medication_id
    ).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    db.delete(medication)
    db.commit()

    return {"message": "Medication deleted successfully"}


@router.post("/{medication_id}/doses", response_model=DoseResponse)
def create_dose(
    medication_id: int,
    data: DoseCreate,
    db: Session = Depends(get_db)
):
    medication = db.query(Medication).filter(
        Medication.id == medication_id
    ).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    dose = Dose(
        medication_id=medication_id,
        scheduled_at=data.scheduled_at,
        status="Pending"
    )

    db.add(dose)
    db.commit()
    db.refresh(dose)

    return dose


@router.get("/{medication_id}/doses", response_model=list[DoseResponse])
def get_doses(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(
        Medication.id == medication_id
    ).first()

    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    return db.query(Dose).filter(
        Dose.medication_id == medication_id
    ).order_by(Dose.scheduled_at.desc()).all()


@router.patch("/doses/{dose_id}", response_model=DoseResponse)
def update_dose_status(
    dose_id: int,
    data: DoseStatusUpdate,
    db: Session = Depends(get_db)
):
    dose = db.query(Dose).filter(Dose.id == dose_id).first()

    if not dose:
        raise HTTPException(status_code=404, detail="Dose not found")

    dose.status = data.status
    dose.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(dose)

    return dose
