
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class MedicationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    dosage: str
    frequency: str
    schedule_time: str
    instructions: Optional[str] = None


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    schedule_time: Optional[str] = None
    instructions: Optional[str] = None


class MedicationResponse(BaseModel):
    id: int
    name: str
    dosage: str
    frequency: str
    schedule_time: str
    instructions: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DoseCreate(BaseModel):
    scheduled_at: datetime


class DoseStatusUpdate(BaseModel):
    status: Literal["Taken", "Missed", "Pending"]


class DoseResponse(BaseModel):
    id: int
    medication_id: int
    scheduled_at: datetime
    status: str
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
