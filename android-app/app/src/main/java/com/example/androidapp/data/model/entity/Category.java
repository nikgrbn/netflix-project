package com.example.androidapp.data.model.entity;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

import java.util.List;

@Entity(tableName = "categories")
public class Category {
    @SerializedName("id")
    @PrimaryKey
    public int id;

    @SerializedName("name")
    public String name;

    @SerializedName("promoted")
    public boolean promoted = false;

    @Ignore
    private List<Movie> movies; // Not persisted in the database

    public Category() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public boolean isPromoted() {
        return promoted;
    }
    public void setPromoted(boolean promoted) {
        this.promoted = promoted;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }
}

