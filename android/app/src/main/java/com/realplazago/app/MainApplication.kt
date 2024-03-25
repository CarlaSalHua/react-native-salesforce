package com.realplazago.app

import android.R
import android.app.Application
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader
import com.realplazago.app.nativeModules.SalesforcePackage
import com.salesforce.marketingcloud.MCLogListener
import com.salesforce.marketingcloud.MarketingCloudConfig
import com.salesforce.marketingcloud.MarketingCloudSdk
import com.salesforce.marketingcloud.notifications.NotificationCustomizationOptions
import com.salesforce.marketingcloud.notifications.NotificationMessage
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdkModuleConfig
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogLevel
import com.salesforce.marketingcloud.sfmcsdk.components.logging.LogListener
import org.json.JSONException
import java.util.Random


class MainApplication : Application(), ReactApplication
{

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              add(SalesforcePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)


  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }

    if(BuildConfig.DEBUG) {
        SFMCSdk.setLogging(LogLevel.DEBUG, LogListener.AndroidLogger())
        MarketingCloudSdk.setLogLevel(MCLogListener.VERBOSE)
        MarketingCloudSdk.setLogListener(MCLogListener.AndroidLogListener())
    }

    SFMCSdk.configure(applicationContext as Application, SFMCSdkModuleConfig.build {
        pushModuleConfig = MarketingCloudConfig.builder().apply {
            setApplicationId("2a8f4d4f-478b-4968-9766-a902da748b59")
            setAccessToken("JpiVMScso6QQ7QI3lK29FbJf")
            setSenderId("678097619965")
            setMarketingCloudServerUrl("https://mcb254c7pm7hg1bp-7bzx93p91ty.device.marketingcloudapis.com/")
            setNotificationCustomizationOptions(
                    NotificationCustomizationOptions.create(R.drawable.ic_notification_clear_all, { context: Context?, (_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, payload): NotificationMessage ->
                        val r = Random()
                        val requestCode: Int = r.nextInt()
                        val url = payload!!["deep_link"]
                        if (url == null || url.isEmpty()) {
                            return@create PendingIntent.getActivity(
                                    context,
                                    requestCode,
                                    Intent(context, MainActivity::class.java),
                                    PendingIntent.FLAG_UPDATE_CURRENT or
                                            PendingIntent.FLAG_IMMUTABLE)
                        } else return@create PendingIntent.getActivity(
                                context,
                                requestCode,
                                Intent(Intent.ACTION_VIEW, Uri.parse(url)),
                                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        )
                    }, null)
            )
            setAnalyticsEnabled(true)
            setGeofencingEnabled(true)
            setPiAnalyticsEnabled(true)
            setUseLegacyPiIdentifier(false)
            // Other configuration options
        }.build(applicationContext)
    }) { initStatus ->

        // TODO handle initialization status
    }

      SFMCSdk.requestSdk { sdk ->
          sdk.mp {
              Log.d("sfmcSdk getSdkState", sdk.getSdkState().getJSONObject("PUSH").toString())
              it.pushMessageManager.pushToken?.let {
                  token -> Log.d("TOKEN", token)
              }
          }
      }

//      try {
//          FirebaseMessaging.getInstance().getToken().addOnCompleteListener { task: Task<String?> ->
//              if (task.isSuccessful) {
//                  SFMCSdk.requestSdk { sfmcSdk: SFMCSdk -> sfmcSdk.mp { pushModuleInterface: PushModuleInterface -> pushModuleInterface.pushMessageManager.setPushToken(task.result!!) } }
//              }
//          }
//      } catch (ex: Exception) {
//          Log.e("FirebaseMessaging", "Failed to retrieve InstanceId from Firebase. " + ex.message)
//      }


    ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }
}
