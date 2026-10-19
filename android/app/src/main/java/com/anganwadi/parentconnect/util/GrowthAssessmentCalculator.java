package com.anganwadi.parentconnect.util;

/**
 * Java utility class implementing WHO (World Health Organization) growth metrics
 * used across Indian Anganwadi / Poshan Abhiyaan monitoring.
 *
 * Classifies nutrition status into:
 * - Normal (सामान्य)
 * - MAM: Moderate Acute Malnutrition (मध्यम तीव्र कुपोषण)
 * - SAM: Severe Acute Malnutrition (अति तीव्र कुपोषण)
 */
public class GrowthAssessmentCalculator {

    public enum NutritionCategory {
        NORMAL("Normal"),
        MAM("MAM"),
        SAM("SAM");

        private final String label;
        NutritionCategory(String label) { this.label = label; }
        public String getLabel() { return label; }
    }

    /**
     * Calculates BMI based on weight (kg) and height (cm).
     */
    public static double calculateBMI(double weightKg, double heightCm) {
        if (heightCm <= 0 || weightKg <= 0) return 0.0;
        double heightM = heightCm / 100.0;
        return weightKg / (heightM * heightM);
    }

    /**
     * Evaluates child's nutrition category based on age in months, weight (kg), and gender.
     * Uses Poshan Abhiyaan standard weight-for-age thresholds.
     */
    public static NutritionCategory assessNutritionStatus(int ageInMonths, double weightKg, boolean isMale) {
        if (weightKg <= 0 || ageInMonths < 0) return NutritionCategory.NORMAL;

        // Approximate median weights (50th percentile) for children up to 60 months
        double expectedMedian = 3.3 + (ageInMonths * 0.28);
        if (isMale) {
            expectedMedian += 0.3;
        }

        // Standard deviations
        double minusTwoSD = expectedMedian * 0.80; // Below -2SD is MAM
        double minusThreeSD = expectedMedian * 0.70; // Below -3SD is SAM

        if (weightKg < minusThreeSD) {
            return NutritionCategory.SAM;
        } else if (weightKg < minusTwoSD) {
            return NutritionCategory.MAM;
        } else {
            return NutritionCategory.NORMAL;
        }
    }

    /**
     * Returns nutritional guidance according to the calculated status.
     */
    public static String getNutritionalAdvice(NutritionCategory category) {
        switch (category) {
            case SAM:
                return "Immediate referral to NRC (Nutrition Rehabilitation Centre). Daily therapeutic food and pediatric checkup required.";
            case MAM:
                return "Provide fortified Take-Home Ration (THR), double energy dense diet (khichdi with ghee, groundnut powder), and weekly weigh-in.";
            case NORMAL:
            default:
                return "Child growth is on track. Continue balanced diet, seasonal fruits, eggs/milk, and maintain regular vaccination.";
        }
    }
}
