package com.retrofit;

import okhttp3.MediaType;
import okhttp3.RequestBody;
import okio.BufferedSink;
import okio.Okio;
import okio.Source;

import java.io.File;
import java.io.IOException;

public class ProgressRequestBody extends RequestBody {

    public interface UploadProgressListener {
        void onProgressUpdate(long bytesWritten, long contentLength);
    }

    private final File file;
    private final String contentType;
    private final UploadProgressListener listener;

    public ProgressRequestBody(File file, String contentType, UploadProgressListener listener) {
        this.file = file;
        this.contentType = contentType;
        this.listener = listener;
    }

    @Override
    public MediaType contentType() {
        return MediaType.parse(contentType);
    }

    @Override
    public long contentLength() throws IOException {
        return file.length();
    }

    @Override
    public void writeTo(BufferedSink sink) throws IOException {
        long totalBytes = contentLength();
        long bytesWritten = 0;

        try (Source source = Okio.source(file)) {
            long read;
            while ((read = source.read(sink.buffer(), 2048)) != -1) {
                bytesWritten += read;
                sink.flush();

                // Gửi tiến độ cho listener
                if (listener != null) {
                    listener.onProgressUpdate(bytesWritten, totalBytes);
                }
            }
        }
    }
}
