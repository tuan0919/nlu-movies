package com.module;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.natives3uploader.NativeS3UploaderSpec;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MyNativeS3UploadModule extends NativeS3UploaderSpec {

    private final ExecutorService executorService;

    public MyNativeS3UploadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        // Tạo một pool của các thread
        executorService = Executors.newSingleThreadExecutor();
    }

    @Override
    public void sayHello(Promise promise) {
        if (promise != null) {
            promise.resolve("Hello from Java side");
        }
    }

    public String getRealPathFromURI(Context context, Uri uri) {
        String path = null;
        String[] proj = {MediaStore.Images.Media.DATA};

        // ContentResolver truy xuất tệp từ URI
        Cursor cursor = context.getContentResolver().query(uri, proj, null, null, null);
        if (cursor != null) {
            int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            if (cursor.moveToFirst()) {
                path = cursor.getString(columnIndex);
            }
            cursor.close();
        }
        return path;
    }


    @Override
    public void uploadFile(String fileName, Promise promise) {
        if (fileName == null || fileName.isEmpty()) {
            promise.reject("UPLOAD_ERROR", "Invalid file path");
            return;
        }

        Uri fileUri = Uri.parse(fileName);  // URI từ file path
        String filePath = null;

        // Kiểm tra URI kiểu file://
        if ("file".equals(fileUri.getScheme())) {
            filePath = fileUri.getPath();  // Trả về đường dẫn tệp khi là URI kiểu file://
        } else {
            // Nếu URI là content://, sử dụng ContentResolver để lấy đường dẫn
            try {
                filePath = getRealPathFromURI(getReactApplicationContext(), fileUri);
            } catch (Exception e) {
                promise.reject("UPLOAD_ERROR", "Failed to get real path from URI", e);
                return;
            }
        }

        if (filePath == null || filePath.isEmpty()) {
            promise.reject("UPLOAD_ERROR", "File path is null or empty");
            return;
        }

        File file = new File(filePath);
        if (!file.exists()) {
            promise.reject("UPLOAD_ERROR", "File does not exist at path: " + filePath);
            return;
        }

        // Thực thi tác vụ bất đồng bộ với ExecutorService
        executorService.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    // Mô phỏng tải tệp lên
                    simulateFileUpload(fileName, new ProgressCallback() {
                        @Override
                        public void onProgress(int progress) {
                            // Gửi sự kiện về UI thread
                            sendEvent(progress);
                        }
                    });

                    // Sau khi tải xong, resolve promise trên main thread
                    new Handler(Looper.getMainLooper()).post(new Runnable() {
                        @Override
                        public void run() {
                            promise.resolve("Upload successful for file: " + fileName);
                        }
                    });

                } catch (Exception e) {
                    // Xử lý lỗi và reject promise trên main thread
                    final Exception finalE = e;
                    new Handler(Looper.getMainLooper()).post(new Runnable() {
                        @Override
                        public void run() {
                            promise.reject("UPLOAD_ERROR", finalE);
                        }
                    });
                }
            }
        });
    }

    private void sendEvent(int progress) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("updateProgress", progress);
    }

    private void simulateFileUpload(String fileName, ProgressCallback callback) throws InterruptedException {
        for (int progress = 0; progress <= 100; progress += 10) {
        // Giả lập độ trễ trong quá trình tải
        Thread.sleep(2000);
        callback.onProgress(progress);
    }
        System.out.println("Upload successful for file: " + fileName);
    }

    // Callback interface để nhận tiến độ tải lên
    interface ProgressCallback {
        void onProgress(int progress);
    }
}
