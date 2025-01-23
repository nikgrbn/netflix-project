package com.example.androidapp.data.model;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import java.util.List;

@Entity(tableName = "users")
public class User {
    @PrimaryKey
    public int id;

    public String username;

    public String password;

    public String picture = "uploads/users/default-picture.png";

    public String displayName = "";

    public boolean isAdmin = false;

    @TypeConverters(ListConverter.class)
    public List<Integer> watchedMovies;

    public User() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public List<Integer> getWatchedMovies() {
        return watchedMovies;
    }

    public void setWatchedMovies(List<Integer> watchedMovies) {
        this.watchedMovies = watchedMovies;
    }
}