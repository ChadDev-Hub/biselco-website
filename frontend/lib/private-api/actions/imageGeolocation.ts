import Exifr from "exifr";
export const GetImageLocation = async (image: File) => {
  try {
    const file = image;
    const buffer = Buffer.from(await file.arrayBuffer());
    const gpsData = await Exifr.gps(buffer);
    if (!gpsData) {
        return {latitude: null, longitude: null}
    }
    const { latitude, longitude } = gpsData;
    return { latitude:latitude,  longitude: longitude };
  } catch (error) {
    console.log(error)
    return {latitude: null, longitude: null}
  }
};
