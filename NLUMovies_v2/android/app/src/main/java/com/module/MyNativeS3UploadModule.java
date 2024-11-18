package com.module;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;

import com.dto.FileNameRequest;
import com.dto.PresignedUrlResponse;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.natives3uploader.NativeS3UploaderSpec;
import com.retrofit.ProgressRequestBody;
import com.retrofit.RetrofitClient;
import com.retrofit.UploadService;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MyNativeS3UploadModule extends NativeS3UploaderSpec {

    private final ExecutorService executorService;
    String token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJucWF0MDkxOSIsInNjb3BlIjoiUk9MRV9VU0VSIiwiaXNzIjoiaWRlbnRpdHktc2VydmljZSIsImlkIjoiZWE1MWIzZjYtM2IzNS00OTcyLTgzZTUtNzNjZjk5Mzg1YTYzIiwiZXhwIjoxNzMxOTI3MTg0LCJpYXQiOjE3MzE5MjM1ODQsImp0aSI6IjI3MTEzYzlkLWI2YzctNGFlNi04MjMzLTIxZTA0ZThjOTAwZiJ9.NNVsli9o708p58lqf_MjFi_xSiCek8Y31tT3JsQJs3VyGapM_p96LndBlnYw00RSkeXLvZryFjFUuVkVWOtluA";

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
        String finalFilePath = filePath;
        executorService.submit(new Runnable() {
            @Override
            public void run() {
                try {
                    uploadFile(finalFilePath, fileName, promise);
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


    public void uploadFile(String filePath, String filename, Promise promise) {
        UploadService uploadService = RetrofitClient.createUploadService();

        // Gửi yêu cầu để lấy presigned URL
        Call<PresignedUrlResponse> presignedUrlCall =
                uploadService.getPresignedUrl(token, new FileNameRequest(filename));
        presignedUrlCall.enqueue(new Callback<PresignedUrlResponse>() {
            @Override
            public void onResponse(Call<PresignedUrlResponse> call, Response<PresignedUrlResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getCode() == 1000) {
                    String presignedUrl = response.body().getResult().getLink();
                    System.out.println("Presigned URL nhận được: " + presignedUrl);

                    // Upload file đến S3
                    File file = new File(filePath);
                    if (!file.exists()) {
                        promise.reject("File không tồn tại");
                        System.out.println("File không tồn tại!");
                        return;
                    }

                    ProgressRequestBody progressRequestBody = new ProgressRequestBody(
                            file,
                            "video/mp4",
                            (bytesWritten, contentLength) -> {
                                int progress = (int) ((bytesWritten * 100) / contentLength);
                                sendEvent(progress);
                            }
                    );
                    Call<ResponseBody> uploadCall = uploadService.uploadFileToS3(presignedUrl, progressRequestBody);

                    uploadCall.enqueue(new Callback<ResponseBody>() {
                        @Override
                        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                            if (response.isSuccessful()) {
                                // Sau khi tải xong, resolve promise trên main thread
                                new Handler(Looper.getMainLooper()).post(new Runnable() {
                                    @Override
                                    public void run() {
                                        promise.resolve("Upload successful for file: " + filePath);
                                    }
                                });
                            } else {
                                new Handler(Looper.getMainLooper()).post(new Runnable() {
                                    @Override
                                    public void run() {
                                        promise.reject("Something went wrong when uploading file:" +filePath);
                                    }
                                });
                            }
                        }

                        @Override
                        public void onFailure(Call<ResponseBody> call, Throwable t) {
                            System.out.println("Lỗi mạng khi upload: " + t.getMessage());
                        }
                    });
                } else {
                    System.out.println("Lỗi khi lấy presigned URL: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<PresignedUrlResponse> call, Throwable t) {
                System.out.println("Lỗi mạng khi lấy presigned URL: " + t.getMessage());
            }
        });
    }
}
