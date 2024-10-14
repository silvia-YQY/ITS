import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Simulate file upload processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a random car plate number
    const randomPlate = `ABC${Math.floor(Math.random() * 1000)}XYZ`;

    // Return a mock response similar to the third-party API
    res.status(200).json({
      msg: "Success!",
      code: 200,
      obj: {
        id: Math.floor(Math.random() * 100),
        fileName: req.body.fileName || "mock_file.jpg",
        filePath: "/uploads/mock_file.jpg",
        fileType: "jpg",
        plate: randomPlate,
        plateColor: "Blue",
        tempPath: "/temp/mock_file.jpg",
        recoPlate: `[${randomPlate}, Blue]`,
      },
      success: true,
    });
  } else {
    res.status(405).json({ msg: "Method Not Allowed" });
  }
}
