package com.rtkmedia.global_news_rn

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView

import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView
import com.google.android.gms.cast.framework.CastContext


/**
 * Created by ReNative (https://renative.org)
 */

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String? = "App"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
        
//CastContext.getSharedInstance(this)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
    }

    override fun onNewIntent(intent:Intent) {
      setIntent(intent)
      super.onNewIntent(intent)
    }

    
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return object : ReactActivityDelegate(this, mainComponentName) {
    override fun createRootView():ReactRootView {
      return RNGestureHandlerEnabledRootView(this@MainActivity)
      } 
 } 
}
}
