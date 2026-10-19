package com.anganwadi.parentconnect.util;

import com.anganwadi.parentconnect.model.ChildRecord;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

/**
 * Java helper for exporting Anganwadi centre records to CSV format.
 * Compatible with Government Poshan Tracker data upload standards.
 */
public class DataExportHelper {

    private static final String CSV_HEADER = "id,name,dob,guardian,mobile,regCode,weight,height,status,attendance\n";

    /**
     * Converts a list of child records into a CSV string.
     */
    public static String recordsToCsv(List<ChildRecord> records) {
        StringBuilder sb = new StringBuilder();
        sb.append(CSV_HEADER);

        if (records != null) {
            for (ChildRecord child : records) {
                sb.append(sanitize(child.getId())).append(",")
                  .append(sanitize(child.getName())).append(",")
                  .append(sanitize(child.getDob())).append(",")
                  .append(sanitize(child.getGuardian())).append(",")
                  .append(sanitize(child.getMobile())).append(",")
                  .append(sanitize(child.getRegCode())).append(",")
                  .append(child.getWeight()).append(",")
                  .append(child.getHeight()).append(",")
                  .append(sanitize(child.getStatus())).append(",")
                  .append(child.getAttendance())
                  .append("\n");
            }
        }
        return sb.toString();
    }

    /**
     * Saves CSV data to an output file.
     */
    public static boolean writeCsvToFile(File destination, List<ChildRecord> records) {
        String csv = recordsToCsv(records);
        try (FileWriter writer = new FileWriter(destination)) {
            writer.write(csv);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    private static String sanitize(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value.trim();
    }
}
