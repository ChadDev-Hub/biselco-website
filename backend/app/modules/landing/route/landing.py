from fastapi import APIRouter, Depends, status
from ....core.security import get_current_user
from ....common.schema.response import FeatureCollection, Feature, Geometry

router = APIRouter(tags=["Landing Page"])


@router.get("/", status_code=status.HTTP_200_OK)
async def landing_page():
    return {
        "hero": {
            "title": "BISELCO",
            "subtitle": "Busuanga Island Electric Cooperative,Inc.",
            "description": """Providing reliable electricity distribution across
                    the Calamianes Islands, 
                    powering communities and supporting sustainable development.
                    """
        }
    }


@router.get("/biselco-offices", status_code=status.HTTP_200_OK)
async def biselco_offices():
    return FeatureCollection(
        type="FeatureCollection",
        features=[Feature(
            type="Feature",
            geometry=Geometry(
                type="Point",
                coordinates=[ 120.20134142023916, 12.01359545920979],
            ),
            properties=dict(
                label="Biselco Main Office",
                address="Brgy. Poblacion 6, Coron Palawan",
                google_link="https://maps.app.goo.gl/P35HCLFsxEm5gD4GA"
            )),
            Feature(
            type="Feature",
            geometry=Geometry(
                type="Point",
                coordinates=[119.93614564153128,12.131310746444637],
                
            ),
            properties=dict(
                label="Biselco Sub Office Busuanga Palawan",
                address="Brgy. Salvacion Busuanga Palawan",
                google_link="https://maps.app.goo.gl/cwS6Vq1CT8DBeFAQA"
            )),
            Feature(
                    type="Feature",
                    geometry=Geometry(
                        type="Point",
                        coordinates=[ 120.01940196660988, 11.894592619164872]
                    ),
                    properties=dict(
                        label="Biselco Sub Office Culion Palawan",
                        address="Brgy. Balala Culion Palawan",
                        google_link="https://maps.app.goo.gl/QZnXLeDAzzLBp8US6"
                    )
            ),
            Feature(
                    type="Feature",
                    geometry=Geometry(
                        type="Point",
                        coordinates=[119.86625217898758, 11.490785497576127]
                    ),
                    properties=dict(
                        label="Biselco Sub Office Linapacan Palawan",
                        address="Brgy. San Miguel Linapacan Palawan",
                        google_link="https://maps.app.goo.gl/xJhyaLAqDkPYTZK7A"
                    ))
            ]
    )
