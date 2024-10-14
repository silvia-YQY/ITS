"use client";
import { Upload, Button, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { User } from "@/interface/use";
import { addCar, updateCar } from "@/api/car";

const UploadCarPlate: React.FC = ({ setCar }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [carPlate, setCarPlate] = useState<string | null>(null);

  // Function to simulate a random car plate generation
  const generateRandomCarPlate = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array(3)
      .fill("")
      .map(() => letters[Math.floor(Math.random() * letters.length)])
      .join("");
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    return `${randomLetters}${randomNumbers}`;
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
      setCar(carPlate);
      handleSubmit();
    }
  }, [carPlate]);

  const handleSubmit = async () => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        await addCar({
          carPlate: carPlate!,
          url: "https://cdn.pixabay.com/photo/2023/02/07/17/49/supercar-7774683_640.jpg",
          userId: user.id,
        });
        message.success("Car added successfully");
      } else {
        message.error("please login first");
      }
    } catch (error) {
      message.error("Failed to save car");
    }
  };

  return (
    <div>
      <Upload {...props}>
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          icon={<UploadOutlined />}
        >
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
