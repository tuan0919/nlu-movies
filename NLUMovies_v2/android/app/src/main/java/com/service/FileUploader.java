package com.service;

import com.dto.FileNameRequest;
import com.dto.PresignedUrlResponse;
import com.retrofit.RetrofitClient;
import com.retrofit.UploadService;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.io.File;

public class FileUploader {

    public static void uploadFile(String filePath, String filename) {
        UploadService uploadService = RetrofitClient.createUploadService();

        // Gửi yêu cầu để lấy presigned URL
        Call<PresignedUrlResponse> presignedUrlCall = uploadService.getPresignedUrl(new FileNameRequest(filename));
        presignedUrlCall.enqueue(new Callback<PresignedUrlResponse>() {
            @Override
            public void onResponse(Call<PresignedUrlResponse> call, Response<PresignedUrlResponse> response) {
                if (response.isSuccessful() && response.body() != null && response.body().getCode() == 1000) {
                    String presignedUrl = response.body().getResult().getLink();
                    System.out.println("Presigned URL nhận được: " + presignedUrl);

                    // Upload file đến S3
                    File file = new File(filePath);
                    if (!file.exists()) {
                        System.out.println("File không tồn tại!");
                        return;
                    }

                    RequestBody requestBody = RequestBody.create(file, MediaType.parse("video/mp4"));
                    Call<ResponseBody> uploadCall = uploadService.uploadFileToS3(presignedUrl, requestBody);

                    uploadCall.enqueue(new Callback<ResponseBody>() {
                        @Override
                        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                            if (response.isSuccessful()) {
                                System.out.println("Upload thành công!");
                            } else {
                                System.out.println("Lỗi khi upload: " + response.code());
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
