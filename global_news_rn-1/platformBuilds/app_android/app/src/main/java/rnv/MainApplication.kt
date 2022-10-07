package com.rtkmedia.global_news_rn

import com.rtkmedia.global_news_rn.BuildConfig

import android.app.Application
import android.content.SharedPreferences
import android.preference.PreferenceManager
import android.webkit.WebView
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
import java.util.Arrays

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage
import com.swmansion.reanimated.ReanimatedPackage
import com.oblador.vectoricons.VectorIconsPackage
import org.reactnative.maskedview.RNCMaskedViewPackage
import com.reactnativecommunity.viewpager.RNCViewPagerPackage
import com.th3rdwave.safeareacontext.SafeAreaContextPackage
import com.swmansion.rnscreens.RNScreensPackage
import com.reactnative.googlecast.GoogleCastPackage


/**
 * Created by ReNative (https://renative.org)
 */

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getPackages(): List<ReactPackage> {
            return Arrays.asList<ReactPackage>(
MainReactPackage(),
RNGestureHandlerPackage(),
ReanimatedPackage(),
VectorIconsPackage(),
RNCMaskedViewPackage(),
RNCViewPagerPackage(),
SafeAreaContextPackage(),
RNScreensPackage(),
GoogleCastPackage()
            )
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getJSBundleFile(): String? = "super.getJSBundleFile()"
    }



    override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost

    override fun onCreate() {
        super.onCreate()
    var mPreferences: SharedPreferences = PreferenceManager.getDefaultSharedPreferences(this)
    mPreferences?.edit().putString("debug_http_host", "192.168.0.53:8083").apply()

        SoLoader.init(this, /* native exopackage */ false)
        if (BuildConfig.DEBUG) {
          WebView.setWebContentsDebuggingEnabled(true)
        }

    }
}
