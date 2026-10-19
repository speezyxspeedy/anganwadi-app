package com.anganwadi.parentconnect.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

/**
 * Child registration and health monitoring model.
 */
data class ChildRecord(
    @SerializedName("id")
    val id: String,

    @SerializedName("name")
    val name: String,

    @SerializedName("dob")
    val dob: String,

    @SerializedName("guardian")
    val guardian: String,

    @SerializedName("mobile")
    val mobile: String,

    @SerializedName("regCode")
    val regCode: String,

    @SerializedName("weight")
    var weight: Double,

    @SerializedName("height")
    var height: Double,

    @SerializedName("status")
    var status: String = "Normal", // Normal, MAM, SAM

    @SerializedName("attendance")
    var attendance: Boolean = true,

    @SerializedName("gender")
    val gender: String = "Male",

    @SerializedName("lastUpdated")
    var lastUpdated: String = ""
) : Serializable

data class GrowthPoint(
    @SerializedName("month")
    val month: String,

    @SerializedName("weight")
    val weight: Double,

    @SerializedName("height")
    val height: Double = 0.0
)

data class VaccineStatus(
    @SerializedName("name")
    val name: String,

    @SerializedName("dueDate")
    val dueDate: String,

    @SerializedName("status")
    val status: String // completed, pending, overdue
)

data class LoginResponse(
    @SerializedName("token")
    val token: String?,

    @SerializedName("role")
    val role: String?,

    @SerializedName("name")
    val name: String?,

    @SerializedName("centre")
    val centre: String?,

    @SerializedName("error")
    val error: String?
)
