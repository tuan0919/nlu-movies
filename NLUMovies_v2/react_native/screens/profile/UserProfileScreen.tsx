import React, { useEffect, useState } from "react"
import { Button, DeviceEventEmitter, Image, Text, View } from "react-native"
import ImagePicker from 'react-native-image-crop-picker';
import NativeS3Uploader from "../../../specs/NativeS3Uploader";
import { NativeModules } from 'react-native';
const { MyNativeS3UploadModule } = NativeModules;

const UserProfileScreen = () => {    
    const [fileSource, setFileSource] = useState<string | undefined>(undefined)
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
            setUploading(true)
            return NativeS3Uploader.uploadFile(image.path)
          })
          .then(response => {
            console.log('file upload: ', response)
            setUploading(false)
            setFileSource(response)
          })
          .catch(e => {
            setUploading(false)
            console.error(e)
        });
    }
    return (
        <View style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 20,
        }}>
            {fileSource && !uploading && <Image source={{
                uri: `${fileSource}`,
            }}
            style={{
                width: 300,
                height: 400,
            }}
            />}
            <Button onPress={handleChooseImage} title="Upload image to S3"/>
            {uploading && (
                <View style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    gap: 10,
                }}>
                    <Text>Uploading</Text>
                    <Text style={{fontSize: 24, fontWeight: 'bold', color: 'green'}}>{progress}%</Text>
                </View>
            )}
        </View>
    )
}

export default UserProfileScreen;