import * as ImageManipulator from 'expo-image-manipulator'

export const generateID = () => {
  let newDate = new Date();
  const date = newDate
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/[^0-9]/g, "");
  const time = newDate.getTime().toString();
  return date + time;
};

export const convertJPGtoWEBP = async (uri: string) => {
  let resultBlob;

  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [], { format: ImageManipulator.SaveFormat.WEBP, compress: 0.8 })
    const response = await fetch(manipulatedImage.uri);
    resultBlob = await response.blob()
  } catch (error) {
    console.error("Error converting image to webp: ", error)
  }

  return resultBlob;
}