package com.module;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.natives3uploader.NativeS3UploaderSpec;

import java.util.concurrent.TimeUnit;

public class NativeS3UploaderModule extends NativeS3UploaderSpec {
    public NativeS3UploaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void sayHello(Promise promise) {
        promise.resolve("Say hello from java");
    }

    @Override
    public void uploadFile(String fileName, Callback progressCallback, Promise promise) {

    }

}
