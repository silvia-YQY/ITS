"use client";
import { Upload, Button, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

const UploadCarPlate: React.FC = ({ callback }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [carPlate, setCarPlate] = useState<string | null>(null);

  // Function to simulate a random car plate generation
  const generateRandomCarPlate = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // const randomLetters = Array(3)
    //   .fill("")
    //   .map(() => letters[Math.floor(Math.random() * letters.length)])
    //   .join("");
    // const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    // return `${randomLetters}${randomNumbers}`;
    return "POI56";
  };

  // Simulated upload handler
  const handleUpload = (file: any) => {
    // Show the modal as a mock action
    setIsModalVisible(true);

    // Simulate a delay before generating the car plate
    setTimeout(() => {
      const plate = generateRandomCarPlate();
      setCarPlate(plate);
      message.success(`Car Plate Recognized: ${plate}`, 5);
      setIsModalVisible(false);
    }, 1000);

    return false; // Prevent the default upload behavior
  };

  const props = {
    beforeUpload: (file: any) => {
      handleUpload(file);
      return false; // Prevent automatic upload
    },
    showUploadList: false,
  };

  useEffect(() => {
    if (carPlate) {
      callback(carPlate);
    }
  }, [carPlate]);

  return (
    <div>
      <Upload {...props}>
        <Button type="primary" style={{ margin: 16 }} icon={<UploadOutlined />}>
          Upload Car Photo
        </Button>
      </Upload>

      {/* Modal to simulate loading */}
      <Modal
        title="Processing"
        open={isModalVisible}
        footer={null}
        closable={false}
      >
        <p>Recognizing car plate...</p>
      </Modal>
    </div>
  );
};

export default UploadCarPlate;

// try {
//   const response = await axios.post("/api/upload", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   if (response.data && response.data.success) {
//     setCarPlate(response.data.obj.plate);
//     message.success(`Car Plate Recognized: ${response.data.obj.plate}`);
//   } else {
//     message.error("Failed to recognize car plate");
//   }
// } catch (error) {
//   message.error("Error uploading file");
// }
