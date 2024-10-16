import axios from "axios";

// 定义 obj 的类型
interface Obj {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  fileLength: number | null;
  plate: string;
  plateColor: string;
  lastRecoTime: string | null;
  tempPath: string;
  recoPlate: string;
  recoColor: string | null;
  recoCorrect: string | null;
}

// 定义完整响应的类型
interface PlateRecognitionResponse {
  msg: string;
  code: number;
  obj: Obj;
  success: boolean;
}

// 方法来上传车牌图片
const recognisePlate = async (
  file: File
): Promise<PlateRecognitionResponse | null> => {
  const formData = new FormData();
  formData.append("image", file); // 添加文件到 formData 中

  try {
    const response = await axios.post<PlateRecognitionResponse>(
      "http://localhost:16666/plate/recognise",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 处理返回的结果
    if (response.data.success) {
      console.log("识别成功:", response.data.obj);
      return response.data; // 返回完整的响应
    } else {
      console.error("识别失败:", response.data.msg);
      return null;
    }
  } catch (error) {
    console.error("请求失败:", error);
    return null;
  }
};

export default recognisePlate;
