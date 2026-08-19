from fastapi import APIRouter, status, HTTPException, Depends
from ..services.get import GetConductorWires
from ..schema.response import ConductorWires
from typing import List
router = APIRouter(prefix="/wire", tags=["Gis", "Wires"])



@router.get("/conductor", status_code=status.HTTP_200_OK, response_model=List[ConductorWires])
async def get_conductors(sevice:GetConductorWires=Depends(GetConductorWires)):
    return await sevice.get_conductor_name()
    
    
