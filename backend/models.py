
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    dosage = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    schedule_time = Column(String(50), nullable=False)
    instructions = Column(String(500), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    doses = relationship(
        "Dose",
        back_populates="medication",
        cascade="all, delete-orphan"
    )


class Dose(Base):
    __tablename__ = "doses"

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(
        Integer,
        ForeignKey("medications.id"),
        nullable=False
    )

    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="Pending", nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    medication = relationship("Medication", back_populates="doses")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String(150), nullable=False)
    specialty = Column(String(150), nullable=False)
    appointment_time = Column(DateTime(timezone=True), nullable=False)
    location = Column(String(250), nullable=True)
    status = Column(String(30), default="Scheduled")
