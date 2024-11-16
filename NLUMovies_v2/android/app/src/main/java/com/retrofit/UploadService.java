package com.retrofit;

import com.dto.FileNameRequest;
import com.dto.PresignedUrlResponse;

import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.PUT;
import retrofit2.http.Url;

public interface UploadService {
    // Gửi yêu cầu để lấy presigned URL
    @PUT("/api/v1/video-streaming/videos/upload")
    Call<PresignedUrlResponse> getPresignedUrl(@Body FileNameRequest fileNameRequest);

    // Upload file đến S3 bằng presigned URL
    @PUT
    Call<ResponseBody> uploadFileToS3(@Url String url, @Body RequestBody file);
}
