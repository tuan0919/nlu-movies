package com.module;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.natives3uploader.NativeS3UploaderSpec;

public class NativeS3UploaderModule extends NativeS3UploaderSpec {
    public NativeS3UploaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void sayHello(Promise promise) {
        promise.resolve("Say hello from java");
    }
}
