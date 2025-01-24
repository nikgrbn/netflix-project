package com.example.androidapp.data.model;

import androidx.room.TypeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// Type converters for list fields
public class ListConverter {

    @TypeConverter
    public static List<Integer> fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            // Return an empty list if the string is null or empty
            return new ArrayList<>();
        }
        try {
            return Stream.of(value.split(","))
                    .filter(s -> !s.trim().isEmpty()) // Ignore empty strings
                    .map(Integer::parseInt) // Parse to integers
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            e.printStackTrace();
            // Return an empty list if parsing fails
            return new ArrayList<>();
        }
    }

    @TypeConverter
    public static String toString(List<Integer> list) {
        if (list == null || list.isEmpty()) {
            return ""; // Return an empty string for null or empty lists
        }
        return list.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }
}

