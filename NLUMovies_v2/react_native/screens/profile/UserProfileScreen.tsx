import React, { useEffect, useState } from "react"
import { Button, DeviceEventEmitter, Image, Text, View } from "react-native"
import ImagePicker from 'react-native-image-crop-picker';
import NativeS3Uploader from "../../../specs/NativeS3Uploader";
import { NativeModules } from 'react-native';
const { MyNativeS3UploadModule } = NativeModules;

const UserProfileScreen = () => {    
    const [filePath, setFilePath] = useState<string | undefined>(undefined)
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    useEffect(() => {
        // Đăng ký sự kiện updateProgress
        if (uploading) {
            const progressListener = DeviceEventEmitter.addListener(
                'updateProgress',
                (event) => {
                    console.log('Progress received:', event);
                    setProgress(event);  // Cập nhật tiến độ
                }
                );
        
                // Hủy sự kiện khi component bị unmount
                return () => {
                progressListener.remove();
             }
        };
    }, [uploading]);

    const handleChooseImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
          }).then(image => {
            setFilePath(image.path);
            setUploading(true)
            return NativeS3Uploader.uploadFile(image.path)
          })
          .then(response => {
            setUploading(false)
            console.log(response)
          })
          .catch(e => {
            setUploading(false)
            console.error(e)
        });
    }
    return (
        <View>
            {filePath && !uploading && <Image source={{
                uri: `${filePath}`,
            }}
            style={{
                width: 400,
                height: 400,
            }}
            />}
            <Button onPress={handleChooseImage} title="Click me"/>
            {uploading && <Text>Uploading... {progress}%</Text>}  {/* Hiển thị tiến độ */}
        </View>
    )
}

export default UserProfileScreen;