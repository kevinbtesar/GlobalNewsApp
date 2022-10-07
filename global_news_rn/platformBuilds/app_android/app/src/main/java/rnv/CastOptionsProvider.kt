package com.rtkmedia.global_news_rn


import android.content.Context
import com.google.android.gms.cast.framework.CastOptions


import com.reactnative.googlecast.GoogleCastOptionsProvider

class CastOptionsProvider : GoogleCastOptionsProvider() {
    override fun getCastOptions(context: Context): CastOptions {
        return CastOptions.Builder()
                .setReceiverApplicationId("CC1AD845")
                .build()
    }
}