package com.example.androidapp.data.model.response;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class TokenResponse {
    private int id;
    private String username;
    private String picture;
    @SerializedName("display_name")
    private String displayName;

    @SerializedName("is_admin")

    private boolean isAdmin;
    private List<Integer> watchedMovies;
    @SerializedName("token")
    private String authToken;

    // Getters and Setters
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

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }
}