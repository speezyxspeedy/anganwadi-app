package com.anganwadi.parentconnect.network

import com.anganwadi.parentconnect.model.ChildRecord
import com.anganwadi.parentconnect.model.LoginResponse
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

/**
 * Kotlin Retrofit API service interface matching the Next.js API endpoints.
 */
interface AnganwadiApiService {

    @POST("/api/auth/login")
    suspend fun login(
        @Body request: Map<String, String>
    ): Response<LoginResponse>

    @POST("/api/auth/parent-activate")
    suspend fun parentActivate(
        @Body request: Map<String, String>
    ): Response<Map<String, Any>>

    @GET("/api/children/{id}")
    suspend fun getChildDetails(
        @Path("id") id: String
    ): Response<Map<String, Any>>

    @POST("/api/attendance")
    suspend fun markAttendance(
        @Body request: Map<String, Any>
    ): Response<Map<String, Any>>

    @Multipart
    @POST("/api/admin/bulk-upload")
    suspend fun uploadRecords(
        @Part file: MultipartBody.Part
    ): Response<Map<String, Any>>

    companion object {
        // Default URL for Android Emulator pointing to local machine Next.js dev server
        private const val BASE_URL = "http://10.0.2.2:3000"

        fun create(baseUrl: String = BASE_URL): AnganwadiApiService {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val client = OkHttpClient.Builder()
                .connectTimeout(15, TimeUnit.SECONDS)
                .readTimeout(20, TimeUnit.SECONDS)
                .addInterceptor(logging)
                .build()

            return Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build()
                .create(AnganwadiApiService::class.java)
        }
    }
}
