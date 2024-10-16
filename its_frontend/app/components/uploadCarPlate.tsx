"use client";
import { Upload, Button, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import recognisePlate from "@/api/upload";

const UploadCarPlate: React.FC = ({ callback }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [carPlate, setCarPlate] = useState<string | null>(null);

  // Function to simulate a random car plate generation
  const generateRandomCarPlate = () => {
    // const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // const randomLetters = Array(3)
    //   .fill("")
    //   .map(() => letters[Math.floor(Math.random() * letters.length)])
    //   .join("");
    // const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    // return `${randomLetters}${randomNumbers}`;
    return "JSL6722";
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
  // 上传前的处理逻辑
  const beforeUpload = (file: File) => {
    setIsModalVisible(true);

    // 调用recognisePlate来上传文件并获取车牌信息
    recognisePlate(file)
      .then((result) => {
        if (result) {
          message.success(
            `Recognition successful! CarPlate: ${result.obj.plate}`
          );
        } else {
          message.error("Recognition failed");
        }
      })
      .finally(() => {
        setIsModalVisible(false);
      });

    // 阻止默认上传行为，因为我们自己处理了上传
    return false;
  };

  // 配置Upload组件的属性
  const props = {
    beforeUpload, // 处理文件上传前的逻辑
    showUploadList: false, // 是否显示上传文件列表，这里禁用
    customRequest: () => {}, // 阻止Upload组件的默认上传行为
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
