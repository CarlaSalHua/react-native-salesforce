package com.realplazago.app.nativeModules

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat.requestPermissions
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.salesforce.marketingcloud.MarketingCloudSdk
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk

class SalesforceModule (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "SalesforceModule"

    private lateinit var marketingCloudSdk: MarketingCloudSdk
    private lateinit var  SFMCSdkCloud : SFMCSdk

    override fun initialize() {
        super.initialize()
        SFMCSdk.requestSdk { sdk ->
            SFMCSdkCloud = sdk
            sdk.mp {
                initializeMarketingCloudSdk(it as MarketingCloudSdk)
            }
        }
    }

    private fun initializeMarketingCloudSdk(sdk: MarketingCloudSdk) {
        marketingCloudSdk = sdk
    }

    companion object {
        private const val REQUEST_GEOFENCE = 1
        private const val REQUEST_PROXIMITY = 2

        private val REQUIRED_PERMISSIONS = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_BACKGROUND_LOCATION
            )
        } else {
            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }


    @ReactMethod(isBlockingSynchronousMethod = true)
    fun setProfileId(id: String){
        setProfileId(SFMCSdkCloud, id)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun enableGeofence() {
        toggleGeofenceMessaging(marketingCloudSdk, true)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun disabledGeofence() {
        toggleGeofenceMessaging(marketingCloudSdk, false)
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getStatusGeofence() : Boolean{
        return marketingCloudSdk.regionMessageManager.isGeofenceMessagingEnabled()
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getContactKey(): String? {
        return marketingCloudSdk.moduleIdentity.profileId
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getSDKState(): String{

        return     SFMCSdkCloud.getSdkState().getJSONObject("PUSH").toString()
    }


    private fun hasRequiredPermissions(): Boolean {
        return REQUIRED_PERMISSIONS
                .map { ContextCompat.checkSelfPermission(reactApplicationContext, it) }
                .all { it == PackageManager.PERMISSION_GRANTED }
    }

    @SuppressLint("MissingPermission")
    private fun toggleGeofenceMessaging(sdk: MarketingCloudSdk, enable: Boolean) {
        if (enable) {
            if (hasRequiredPermissions()) {
                Log.i("Salesforce","enableGeofenceMessaging")
                sdk.regionMessageManager.enableGeofenceMessaging()
            } else {
                val activity: Activity? = currentActivity
                if (activity != null) {
                    Log.i("Salesforce","Solicitar permisos")
                    requestPermissions(activity, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_BACKGROUND_LOCATION), 1)
                }
            }
        } else {
            // Disable Geofence messaging in the SDK.
            Log.i("Salesforce","disableGeofenceMessaging")
            sdk.regionMessageManager.disableGeofenceMessaging()
        }
    }

    private fun setProfileId(SFMCSdkCloud: SFMCSdk, idProfile: String){
        SFMCSdkCloud.identity.setProfileId(idProfile)
    }

}