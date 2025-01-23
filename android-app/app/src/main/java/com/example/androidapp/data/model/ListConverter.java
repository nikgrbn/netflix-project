package com.example.androidapp.data.model;

import androidx.room.TypeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

// Type converters for list fields
public class ListConverter {
    @TypeConverter
    public static List<Integer> fromString(String value) {
        if (value == null) {
            return new ArrayList<>();
        }
        return Arrays.stream(value.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }

    @TypeConverter
    public static String toString(List<Integer> list) {
        if (list == null || list.isEmpty()) {
            return "";
        }
        return list.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }
}

