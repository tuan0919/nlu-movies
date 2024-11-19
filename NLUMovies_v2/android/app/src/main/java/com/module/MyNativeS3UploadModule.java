package com.module;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;

import com.dto.FileNameRequest;
import com.dto.FileURLResponse;
import com.dto.PresignedUrlResponse;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.natives3uploader.NativeS3UploaderSpec;
import com.retrofit.ProgressRequestBody;
import com.retrofit.RetrofitClient;
import com.retrofit.UploadService;

import java.io.File;
import java.net.URLConnection;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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


    private void sendEvent(int progress) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("updateProgress", progress);
    }

    @Override
    public void uploadFile(String fileName, Promise promise) {
        if (fileName == null || fileName.isEmpty()) {
            promise.reject("UPLOAD_ERROR", "Invalid file path");
            return;
        }

        Uri fileUri = Uri.parse(fileName);
        String filePath = resolveFilePath(fileUri, promise);
        if (filePath == null) return;

        File file = new File(filePath);
        if (!file.exists()) {
            promise.reject("UPLOAD_ERROR", "File does not exist at path: " + filePath);
            return;
        }

        String ext = getFileExtension(file.getName());

        String key = String.format("temp/nlu-movies/%s%s", UUID.randomUUID().toString(), ext);

        executorService.submit(() -> {
            try {
                // Bắt đầu quá trình tải file
                String presignedUrl = fetchPresignedUrl(key);
                if (presignedUrl == null) {
                    promise.reject("UPLOAD_ERROR", "Failed to fetch presigned URL");
                    return;
                }

                uploadFileToS3(file, presignedUrl, new UploadCallback() {
                    @Override
                    public void onUploadSuccess() {
                        // Sau khi upload thành công, lấy link file
                        fetchFileURL(key, new FetchFileURLCallback() {
                            @Override
                            public void onSuccess(String fileUrl) {
                                promise.resolve(fileUrl);
                            }
                            @Override
                            public void onError(String errorMessage) {
                                promise.reject("FILE_URL_ERROR", "Failed to fetch file URL");
                            }
                        });
                    }

                    @Override
                    public void onUploadFailure(String error) {
                        promise.reject("UPLOAD_ERROR", error);
                    }
                });
            } catch (Exception e) {
                new Handler(Looper.getMainLooper()).post(() -> promise.reject("UPLOAD_ERROR", e.getMessage()));
            }
        });
    }

    private String resolveFilePath(Uri fileUri, Promise promise) {
        String filePath = null;

        if ("file".equals(fileUri.getScheme())) {
            filePath = fileUri.getPath();
        } else {
            try {
                filePath = getRealPathFromURI(getReactApplicationContext(), fileUri);
            } catch (Exception e) {
                new Handler(Looper.getMainLooper()).post(() -> promise.reject("UPLOAD_ERROR", "Failed to resolve file path", e));
            }
        }

        if (filePath == null || filePath.isEmpty()) {
            new Handler(Looper.getMainLooper()).post(() -> promise.reject("UPLOAD_ERROR", "File path is null or empty"));
            return null;
        }

        return filePath;
    }

    private String fetchPresignedUrl(String key) throws Exception {
        UploadService uploadService = RetrofitClient.createUploadService();
        Call<PresignedUrlResponse> call = uploadService.getPresignedUrl(new FileNameRequest(key));
        Response<PresignedUrlResponse> response = call.execute();

        if (response.isSuccessful() && response.body() != null && response.body().getCode() == 1000) {
            return response.body().getResult().getLink();
        } else {
            System.err.println("Failed to fetch presigned URL: " + response.code());
            return null;
        }
    }

    private void fetchFileURL(String key, final FetchFileURLCallback callback) {
        UploadService uploadService = RetrofitClient.createUploadService();
        Call<FileURLResponse> call = uploadService.getFileURL(key);
        System.out.println("Key uploaded: " + key);

        call.enqueue(new Callback<FileURLResponse>() {
            @Override
            public void onResponse(Call<FileURLResponse> call, Response<FileURLResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Lấy file URL từ response và gọi callback với kết quả
                    String fileUrl = response.body().getResult().getLink();
                    callback.onSuccess(fileUrl);
                } else {
                    // Thất bại khi lấy file URL
                    System.err.println("Failed to fetch file URL: " + response.code());
                    callback.onError("Failed to fetch file URL: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<FileURLResponse> call, Throwable t) {
                // Lỗi mạng khi gọi API
                System.err.println("Error fetching file URL: " + t.getMessage());
                callback.onError("Error fetching file URL: " + t.getMessage());
            }
        });
    }

    // Callback interface để nhận kết quả
    public interface FetchFileURLCallback {
        void onSuccess(String fileUrl);
        void onError(String errorMessage);
    }

    private void uploadFileToS3(File file, String presignedUrl, UploadCallback callback) {
        String contentType = URLConnection.guessContentTypeFromName(file.getName());
        ProgressRequestBody requestBody = new ProgressRequestBody(
                file,
                contentType,
                (bytesWritten, contentLength) -> {
                    int progress = (int) ((bytesWritten * 100) / contentLength);
                    sendEvent(progress);
                }
        );

        UploadService uploadService = RetrofitClient.createUploadService();
        Call<ResponseBody> call = uploadService.uploadFileToS3(presignedUrl, requestBody);

        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    callback.onUploadSuccess();
                } else {
                    callback.onUploadFailure("Upload failed with code: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                callback.onUploadFailure("Upload failed: " + t.getMessage());
            }
        });
    }

    interface UploadCallback {
        void onUploadSuccess();
        void onUploadFailure(String error);
    }

    public String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return ""; // Trả về chuỗi rỗng nếu fileName không hợp lệ
        }

        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex); // Bao gồm dấu chấm (e.g., ".jpeg")
        }
        return ""; // Không có đuôi mở rộng
    }
}
