package com.module;

import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.natives3uploader.NativeS3UploaderSpec;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MyNativeS3UploadModule extends NativeS3UploaderSpec {

    private ExecutorService executorService;

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

    @Override
    public void uploadFile(String fileName, Promise promise) {
        if (fileName == null || promise == null) {
            promise.reject("UPLOAD_ERROR", "Invalid arguments");
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
