from fastapi import APIRouter, status, HTTPException, Depends
from ..services.get import GetConductorWires, GetNeutralWires
from ..schema.response import Wires
from typing import List
router = APIRouter(prefix="/wire", tags=["Gis", "Wires"])


# CONDUCTOR WIRES 
@router.get("/conductor", status_code=status.HTTP_200_OK, response_model=List[Wires])
async def get_conductors(sevice:GetConductorWires=Depends(GetConductorWires)):
    """ 
    Retrieve the list of available conductor wires.

    Returns:
        List[Wires]: A list containing the available conductor wire information.Each Wires object contains information such as:
        
            - id: The unique identifier of the conductor wire.
            - name: The name of the conductor wire.
    """
    return await sevice.get_conductor_name()



@router.get("/neutral", status_code=status.HTTP_200_OK, response_model=List[Wires])
async def get_neutral(service:GetNeutralWires=Depends(GetNeutralWires)):
    """ 
    Retrieve the list of available neutral wires.

    Returns:
        List[Wires]: A list containing the available neutral wire information.Each Wires object contains information such as:
        
            - id: The unique identifier of the neutral wire.
            - name: The name of the neutral wire.
    """
    return await service.get_neutral_name()
    
    
