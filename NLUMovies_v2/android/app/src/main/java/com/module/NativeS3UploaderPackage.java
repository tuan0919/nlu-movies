package com.module;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class NativeS3UploaderPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(@NonNull String s, @NonNull ReactApplicationContext reactApplicationContext) {
        if (s.equals(NativeS3UploaderModule.NAME)) {
            return new MyNativeS3UploadModule(reactApplicationContext);
        } else {
            return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return new ReactModuleInfoProvider() {
            @NonNull
            @Override
            public Map<String, ReactModuleInfo> getReactModuleInfos() {
                Map<String, ReactModuleInfo> map = new HashMap<>();
                map.put(MyNativeS3UploadModule.NAME, new ReactModuleInfo(
                        MyNativeS3UploadModule.NAME,       // name
                        MyNativeS3UploadModule.NAME,       // className
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        false, // isCXXModule
                        true   // isTurboModule
                ));
                return map;
            }
        };
    }
}
