package com.dto;

public class FileNameRequest {
    private String fileKey;

    public FileNameRequest(String fileKey) {
        this.fileKey = fileKey;
    }

    public String getFileKey() {
        return fileKey;
    }
}