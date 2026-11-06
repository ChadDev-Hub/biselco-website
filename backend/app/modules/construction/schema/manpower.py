from pydantic import BaseModel



class AttendanceStatus(BaseModel):
    id: int
    status: str


class Manpower(BaseModel):
    id: int
    assined_personnel: str
    reason_of_absence: str
    attendance_status: AttendanceStatus