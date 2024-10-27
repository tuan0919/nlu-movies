package com.module

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.natives3uploader.NativeS3UploaderSpec
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MyNativeS3UploadModule(reactContext: ReactApplicationContext?) : NativeS3UploaderSpec(
    reactContext
) {
    override fun sayHello(promise: Promise?) {
        promise?.resolve("Hello from java side")
    }

    override fun uploadFile(fileName: String?, promise: Promise?) {
        if (fileName == null || promise == null) {
            promise?.reject("UPLOAD_ERROR", "Invalid arguments")
            return
        }
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Gọi hàm simulateFileUpload và truyền callback để cập nhật tiến độ
                simulateFileUpload(fileName) { progress ->
                    // Cập nhật tiến độ trên thread chính qua event 'updateProgress'
                    runOnUiThread {
                        sendEvent(progress)
                    }
                }
                // Sau khi upload hoàn tất, resolve promise
                runOnUiThread {
                    promise.resolve("Upload successful for file: $fileName")
                }
            } catch (e: Exception) {
                // Xử lý lỗi và reject promise
                runOnUiThread {
                    promise.reject("UPLOAD_ERROR", e)
                }
            }
        }
    }

    private fun sendEvent(progress: Int) {
        this.reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("updateProgress", progress)
    }

    private suspend fun simulateFileUpload(fileName: String, processCallback: (Int) -> Unit) = coroutineScope {
        for (progress in 0..100 step 10) {
            delay(2000)
            processCallback(progress)
        }
        println("Upload successful for file: $fileName")
    }

}