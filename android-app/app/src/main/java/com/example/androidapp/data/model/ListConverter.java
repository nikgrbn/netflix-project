package com.example.androidapp.data.model;

import androidx.room.TypeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// Type converters for list fields


import androidx.room.TypeConverter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ListConverter {

    @TypeConverter
    public static String toString(List<Integer> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return list.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

    @TypeConverter
    public static List<Integer> fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            return new ArrayList<>(); // Return an empty list if the string is null or empty
        }
        return Stream.of(value.split(","))
                .map(String::trim) // Trim each value to avoid leading/trailing spaces
                .filter(s -> !s.isEmpty()) // Ensure no empty strings are parsed
                .map(Integer::parseInt) // Parse the integers
                .collect(Collectors.toList());
    }
}
