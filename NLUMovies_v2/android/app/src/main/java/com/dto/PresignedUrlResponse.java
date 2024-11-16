package com.dto;

public class PresignedUrlResponse {
    private int code;
    private Result result;

    public int getCode() {
        return code;
    }

    public Result getResult() {
        return result;
    }

    public static class Result {
        private String link;

        public String getLink() {
            return link;
        }
    }
}