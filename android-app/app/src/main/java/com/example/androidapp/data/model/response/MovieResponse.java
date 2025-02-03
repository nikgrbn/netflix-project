package com.example.androidapp.data.model.response;

import com.google.gson.annotations.SerializedName;
import com.example.androidapp.data.model.entity.Category;

import java.util.List;

public class MovieResponse {

    @SerializedName("id")
    private int id;

    @SerializedName("name")
    private String name;

    @SerializedName("image")
    private String image;

    @SerializedName("video")
    private String video;

    @SerializedName("description")
    private String description;

    @SerializedName("age_limit")
    private int ageLimit;

    @SerializedName("duration")
    private int duration;

    @SerializedName("categories")
    private List<Category> categories;

    public MovieResponse() {
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAgeLimit() {
        return ageLimit;
    }

    public void setAgeLimit(int ageLimit) {
        this.ageLimit = ageLimit;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "MovieResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", video='" + video + '\'' +
                ", description='" + description + '\'' +
                ", ageLimit=" + ageLimit +
                ", duration=" + duration +
                ", categories=" + categories +
                '}';
    }
}
